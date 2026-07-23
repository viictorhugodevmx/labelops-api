import { randomUUID } from 'node:crypto';

import type {
  Request,
  RequestHandler
} from 'express';

export interface RequestWithId extends Request {
  requestId?: string;
}

export const requestIdMiddleware: RequestHandler = (
  request: RequestWithId,
  response,
  next
) => {
  const incomingRequestId = request.header(
    'X-Request-Id'
  );

  const requestId =
    incomingRequestId?.trim()
    || randomUUID();

  request.requestId = requestId;

  response.setHeader(
    'X-Request-Id',
    requestId
  );

  next();
};
