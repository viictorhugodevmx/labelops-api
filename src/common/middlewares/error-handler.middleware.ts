import { AppError } from '../errors/app-error';

import type {
  ErrorRequestHandler
} from 'express';

import type {
  RequestWithId
} from './request-id.middleware';

export const errorHandler: ErrorRequestHandler = (
  error,
  request,
  response,
  _next
) => {
  const requestWithId =
    request as RequestWithId;

  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      statusCode: error.statusCode,
      message: error.message,
      path: request.originalUrl,
      requestId: requestWithId.requestId,
      timestamp: new Date().toISOString()
    });

    return;
  }

  response.status(500).json({
    statusCode: 500,
    message: 'Internal server error',
    path: request.originalUrl,
    requestId: requestWithId.requestId,
    timestamp: new Date().toISOString()
  });
};
