import { Router } from 'express';
import mongoose from 'mongoose';

import { env } from '../../config/env';

export const healthRouter = Router();

healthRouter.get('/', (_request, response) => {
  response.json({
    status: 'ok',
    app: env.appName,
    domain: 'Music label media manager',
    database: {
      name: mongoose.connection.name,
      readyState: mongoose.connection.readyState
    },
    timestamp: new Date().toISOString()
  });
});
