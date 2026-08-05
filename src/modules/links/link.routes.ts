import { Router } from 'express';

import { sendSuccessResponse } from '../../common/utils/send-success-response';
import {
  archiveLink,
  createLink,
  getLinkById,
  listLinks,
  updateLink
} from './link.service';
import {
  validateCreateLinkInput,
  validateUpdateLinkInput
} from './link.validators';

import type {
  RequestWithId
} from '../../common/middlewares/request-id.middleware';

export const linksRouter = Router();

linksRouter.get('/', async (request, response, next) => {
  try {
    const links = await listLinks();

    sendSuccessResponse({
      request: request as RequestWithId,
      response,
      data: links
    });
  } catch (error) {
    next(error);
  }
});

linksRouter.get('/:id', async (request, response, next) => {
  try {
    const link = await getLinkById(
      request.params.id
    );

    sendSuccessResponse({
      request: request as RequestWithId,
      response,
      data: link
    });
  } catch (error) {
    next(error);
  }
});

linksRouter.post('/', async (request, response, next) => {
  try {
    validateCreateLinkInput(
      request.body as Record<string, unknown>
    );

    const link = await createLink({
      artistId: request.body.artistId,
      campaignId: request.body.campaignId,
      title: request.body.title,
      type: request.body.type,
      status: request.body.status,
      url: request.body.url,
      description: request.body.description,
      clicks: request.body.clicks
    });

    sendSuccessResponse({
      request: request as RequestWithId,
      response,
      statusCode: 201,
      data: link
    });
  } catch (error) {
    next(error);
  }
});

linksRouter.patch('/:id', async (request, response, next) => {
  try {
    validateUpdateLinkInput(
      request.body as Record<string, unknown>
    );

    const link = await updateLink(
      request.params.id,
      request.body
    );

    sendSuccessResponse({
      request: request as RequestWithId,
      response,
      data: link
    });
  } catch (error) {
    next(error);
  }
});

linksRouter.patch('/:id/archive', async (request, response, next) => {
  try {
    const link = await archiveLink(
      request.params.id
    );

    sendSuccessResponse({
      request: request as RequestWithId,
      response,
      data: link
    });
  } catch (error) {
    next(error);
  }
});
