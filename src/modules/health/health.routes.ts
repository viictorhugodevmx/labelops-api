import { Router } from 'express';
import mongoose from 'mongoose';

import { env } from '../../config/env';
import { sendSuccessResponse } from '../../common/utils/send-success-response';

import type {
  RequestWithId
} from '../../common/middlewares/request-id.middleware';

export const healthRouter = Router();

healthRouter.get('/', (request, response) => {
  const requestWithId =
    request as RequestWithId;

  sendSuccessResponse({
    request: requestWithId,
    response,
    data: {
      status: 'ok',
      app: env.appName,
      domain: 'Music label media manager',
      database: {
        name: mongoose.connection.name,
        readyState: mongoose.connection.readyState
      }
    }
  });
});
