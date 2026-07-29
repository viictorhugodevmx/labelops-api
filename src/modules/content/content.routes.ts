import { Router } from 'express';

import { sendSuccessResponse } from '../../common/utils/send-success-response';
import {
  archiveContent,
  createContent,
  getContentById,
  listContent,
  updateContent
} from './content.service';
import {
  validateCreateContentInput,
  validateUpdateContentInput
} from './content.validators';

import type {
  RequestWithId
} from '../../common/middlewares/request-id.middleware';

export const contentRouter = Router();

contentRouter.get('/', async (request, response, next) => {
  try {
    const content = await listContent();

    sendSuccessResponse({
      request: request as RequestWithId,
      response,
      data: content
    });
  } catch (error) {
    next(error);
  }
});

contentRouter.get('/:id', async (request, response, next) => {
  try {
    const content = await getContentById(
      request.params.id
    );

    sendSuccessResponse({
      request: request as RequestWithId,
      response,
      data: content
    });
  } catch (error) {
    next(error);
  }
});

contentRouter.post('/', async (request, response, next) => {
  try {
    validateCreateContentInput(
      request.body as Record<string, unknown>
    );

    const content = await createContent({
      artistId: request.body.artistId,
      campaignId: request.body.campaignId,
      title: request.body.title,
      type: request.body.type,
      status: request.body.status,
      platform: request.body.platform,
      url: request.body.url,
      thumbnailUrl: request.body.thumbnailUrl,
      description: request.body.description,
      publishDate: request.body.publishDate
    });

    sendSuccessResponse({
      request: request as RequestWithId,
      response,
      statusCode: 201,
      data: content
    });
  } catch (error) {
    next(error);
  }
});

contentRouter.patch('/:id', async (request, response, next) => {
  try {
    validateUpdateContentInput(
      request.body as Record<string, unknown>
    );

    const content = await updateContent(
      request.params.id,
      request.body
    );

    sendSuccessResponse({
      request: request as RequestWithId,
      response,
      data: content
    });
  } catch (error) {
    next(error);
  }
});

contentRouter.patch('/:id/archive', async (request, response, next) => {
  try {
    const content = await archiveContent(
      request.params.id
    );

    sendSuccessResponse({
      request: request as RequestWithId,
      response,
      data: content
    });
  } catch (error) {
    next(error);
  }
});
