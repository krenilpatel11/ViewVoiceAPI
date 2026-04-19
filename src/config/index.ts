import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: Number(process.env.PORT || 3000),
  azure: {
    endpoint: process.env.AZURE_ENDPOINT!,
    key: process.env.AZURE_KEY!,
    modelId: process.env.AZURE_MODEL_ID!
  }
};
