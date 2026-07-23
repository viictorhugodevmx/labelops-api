import { AppError } from '../errors/app-error';

import type {
  ErrorRequestHandler
} from 'express';

export const errorHandler: ErrorRequestHandler = (
  error,
  request,
  response,
  _next
) => {
  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      statusCode: error.statusCode,
      message: error.message,
      path: request.originalUrl,
      timestamp: new Date().toISOString()
    });

    return;
  }

  response.status(500).json({
    statusCode: 500,
    message: 'Internal server error',
    path: request.originalUrl,
    timestamp: new Date().toISOString()
  });
};
