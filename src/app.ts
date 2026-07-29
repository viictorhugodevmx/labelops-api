import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { errorHandler } from './common/middlewares/error-handler.middleware';
import { notFoundHandler } from './common/middlewares/not-found.middleware';
import { requestIdMiddleware } from './common/middlewares/request-id.middleware';
import { artistsRouter } from './modules/artists/artist.routes';
import { campaignsRouter } from './modules/campaigns/campaign.routes';
import { healthRouter } from './modules/health/health.routes';

export function createApp() {
  const app = express();

  app.use(requestIdMiddleware);
  app.use(helmet());
  app.use(cors());
  app.use(compression());
  app.use(express.json());
  app.use(morgan('dev'));

  app.use('/api/health', healthRouter);
  app.use('/api/artists', artistsRouter);
  app.use('/api/campaigns', campaignsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
