import { Router } from 'express';
import mongoose from 'mongoose';

import { env } from '../../config/env';

import type {
  RequestWithId
} from '../../common/middlewares/request-id.middleware';

export const healthRouter = Router();

healthRouter.get('/', (request, response) => {
  const requestWithId =
    request as RequestWithId;

  response.json({
    status: 'ok',
    app: env.appName,
    domain: 'Music label media manager',
    database: {
      name: mongoose.connection.name,
      readyState: mongoose.connection.readyState
    },
    requestId: requestWithId.requestId,
    timestamp: new Date().toISOString()
  });
});
