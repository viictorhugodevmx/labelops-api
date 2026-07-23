import type {
  Response
} from 'express';

import type {
  RequestWithId
} from '../middlewares/request-id.middleware';

interface SuccessResponseOptions {
  request: RequestWithId;
  response: Response;
  statusCode?: number;
  data: unknown;
  meta?: unknown;
}

export function sendSuccessResponse(
  options: SuccessResponseOptions
): void {
  const {
    request,
    response,
    statusCode = 200,
    data,
    meta
  } = options;

  response.status(statusCode).json({
    success: true,
    data,
    ...(meta ? { meta } : {}),
    requestId: request.requestId,
    timestamp: new Date().toISOString()
  });
}
