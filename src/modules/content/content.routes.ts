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

import type {
  ContentPlatform,
  ContentStatus,
  ContentType
} from './content.model';

export const contentRouter = Router();

function parsePositiveNumber(
  value: unknown
): number | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const parsedValue = Number(value);

  if (
    Number.isNaN(parsedValue)
    || parsedValue <= 0
  ) {
    return undefined;
  }

  return parsedValue;
}

function parseStringQuery(
  value: unknown
): string | undefined {
  if (
    typeof value === 'string'
    && value.trim()
  ) {
    return value.trim();
  }

  return undefined;
}

function parseContentType(
  value: unknown
): ContentType | undefined {
  if (
    value === 'video'
    || value === 'reel'
    || value === 'post'
    || value === 'artwork'
    || value === 'press'
  ) {
    return value;
  }

  return undefined;
}

function parseContentStatus(
  value: unknown
): ContentStatus | undefined {
  if (
    value === 'draft'
    || value === 'scheduled'
    || value === 'published'
    || value === 'archived'
  ) {
    return value;
  }

  return undefined;
}

function parseContentPlatform(
  value: unknown
): ContentPlatform | undefined {
  if (
    value === 'instagram'
    || value === 'youtube'
    || value === 'tiktok'
    || value === 'spotify'
    || value === 'website'
  ) {
    return value;
  }

  return undefined;
}

contentRouter.get('/', async (request, response, next) => {
  try {
    const result = await listContent({
      artistId: parseStringQuery(request.query.artistId),
      campaignId: parseStringQuery(request.query.campaignId),
      status: parseContentStatus(request.query.status),
      type: parseContentType(request.query.type),
      platform: parseContentPlatform(request.query.platform),
      search: parseStringQuery(request.query.search),
      page: parsePositiveNumber(request.query.page),
      limit: parsePositiveNumber(request.query.limit)
    });

    sendSuccessResponse({
      request: request as RequestWithId,
      response,
      data: result.content,
      meta: result.meta
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
