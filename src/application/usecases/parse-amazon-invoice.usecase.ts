import { analyzeDocument } from '../../infrastructure/azure/document-intelligence.service';
import { mapAmazonInvoice } from '../mappers/amazon-invoice.mapper';

export async function parseAmazonInvoice(
  fileBuffer: Buffer
) {
const analysis = await analyzeDocument(fileBuffer);

if (typeof analysis !== 'object') {
  console.error('Invalid analyzeResult:', analysis);
  throw new Error('Invalid Azure analyzeResult');
}

console.log(
  'AnalyzeResult keys:',
  Object.keys(analysis)
);

return mapAmazonInvoice(analysis);
}