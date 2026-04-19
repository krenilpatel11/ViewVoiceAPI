import axios from 'axios';
import https from 'https';
import { config } from '../../config';

const httpsAgent = new https.Agent({
  keepAlive: true,
  maxSockets: 5
});

const MAX_POLL_ATTEMPTS = 30;    // 30 × 2 s = 60 s max wait
const POLL_INTERVAL_MS  = 2000;

export async function analyzeDocument(fileBuffer: Buffer): Promise<any> {
  const analyzeUrl =
    `${config.azure.endpoint}` +
    `/formrecognizer/documentModels/${config.azure.modelId}:analyze` +
    `?api-version=2023-07-31`;

  // 1️⃣ Start analysis
  const startResponse = await axios.post(analyzeUrl, fileBuffer, {
    headers: {
      'Ocp-Apim-Subscription-Key': config.azure.key,
      'Content-Type': 'application/octet-stream',
    },
    timeout: 60_000,
    httpsAgent,
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
    validateStatus: () => true,
  });

  if (startResponse.status !== 202) {
    console.error('Azure start error:', startResponse.status, startResponse.data);
    throw new Error(`Azure analyze start failed (HTTP ${startResponse.status})`);
  }

  const operationUrl = startResponse.headers['operation-location'];
  if (!operationUrl) {
    throw new Error('Missing operation-location header from Azure');
  }

  // 2️⃣ Poll until succeeded (with timeout guard)
  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
    await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL_MS));

    const pollResponse = await axios.get(operationUrl, {
      headers: { 'Ocp-Apim-Subscription-Key': config.azure.key },
      timeout: 60_000,
      httpsAgent,
    });

    const status = pollResponse.data?.status;

    if (status === 'succeeded') {
      return pollResponse.data.analyzeResult;
    }

    if (status === 'failed') {
      console.error('Azure analysis failed:', pollResponse.data);
      throw new Error('Azure analysis failed');
    }

    // status is still 'running' — continue polling
  }

  throw new Error(`Azure analysis timed out after ${MAX_POLL_ATTEMPTS * POLL_INTERVAL_MS / 1000}s`);
}
