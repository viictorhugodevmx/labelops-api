import { AppError } from '../errors/app-error';

import type {
  RequestHandler
} from 'express';

export const notFoundHandler: RequestHandler = (
  request,
  _response,
  next
) => {
  next(
    new AppError(
      `Route ${request.originalUrl} was not found`,
      404
    )
  );
};
