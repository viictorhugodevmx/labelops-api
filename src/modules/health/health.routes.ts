import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/', (_request, response) => {
  response.json({
    status: 'ok',
    app: process.env.APP_NAME ?? 'labelops-api',
    domain: 'Music label media manager',
    timestamp: new Date().toISOString()
  });
});
