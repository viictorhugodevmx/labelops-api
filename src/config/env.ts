import dotenv from 'dotenv';

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',

  port: Number(
    process.env.PORT ?? 3006
  ),

  appName:
    process.env.APP_NAME ?? 'labelops-api',

  mongodbUri:
    process.env.MONGODB_URI
    ?? 'mongodb://127.0.0.1:27017/labelops_dashboard'
};
