import { Router } from 'express';

import { sendSuccessResponse } from '../../common/utils/send-success-response';
import {
  cancelCampaign,
  createCampaign,
  getCampaignById,
  listCampaigns,
  updateCampaign
} from './campaign.service';
import {
  validateCreateCampaignInput,
  validateUpdateCampaignInput
} from './campaign.validators';

import type {
  RequestWithId
} from '../../common/middlewares/request-id.middleware';

import type {
  CampaignStatus,
  CampaignType
} from './campaign.model';

export const campaignsRouter = Router();

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

function parseCampaignStatus(
  value: unknown
): CampaignStatus | undefined {
  if (
    value === 'draft'
    || value === 'active'
    || value === 'completed'
    || value === 'cancelled'
  ) {
    return value;
  }

  return undefined;
}

function parseCampaignType(
  value: unknown
): CampaignType | undefined {
  if (
    value === 'single'
    || value === 'video'
    || value === 'album'
    || value === 'ep'
    || value === 'social'
  ) {
    return value;
  }

  return undefined;
}

campaignsRouter.get('/', async (request, response, next) => {
  try {
    const result = await listCampaigns({
      artistId: parseStringQuery(request.query.artistId),
      status: parseCampaignStatus(request.query.status),
      type: parseCampaignType(request.query.type),
      search: parseStringQuery(request.query.search),
      page: parsePositiveNumber(request.query.page),
      limit: parsePositiveNumber(request.query.limit)
    });

    sendSuccessResponse({
      request: request as RequestWithId,
      response,
      data: result.campaigns,
      meta: result.meta
    });
  } catch (error) {
    next(error);
  }
});

campaignsRouter.get('/:id', async (request, response, next) => {
  try {
    const campaign = await getCampaignById(
      request.params.id
    );

    sendSuccessResponse({
      request: request as RequestWithId,
      response,
      data: campaign
    });
  } catch (error) {
    next(error);
  }
});

campaignsRouter.post('/', async (request, response, next) => {
  try {
    validateCreateCampaignInput(
      request.body as Record<string, unknown>
    );

    const campaign = await createCampaign({
      artistId: request.body.artistId,
      title: request.body.title,
      type: request.body.type,
      status: request.body.status,
      description: request.body.description,
      startDate: request.body.startDate,
      endDate: request.body.endDate,
      budget: request.body.budget,
      mainGoal: request.body.mainGoal
    });

    sendSuccessResponse({
      request: request as RequestWithId,
      response,
      statusCode: 201,
      data: campaign
    });
  } catch (error) {
    next(error);
  }
});

campaignsRouter.patch('/:id', async (request, response, next) => {
  try {
    validateUpdateCampaignInput(
      request.body as Record<string, unknown>
    );

    const campaign = await updateCampaign(
      request.params.id,
      request.body
    );

    sendSuccessResponse({
      request: request as RequestWithId,
      response,
      data: campaign
    });
  } catch (error) {
    next(error);
  }
});

campaignsRouter.patch('/:id/cancel', async (request, response, next) => {
  try {
    const campaign = await cancelCampaign(
      request.params.id
    );

    sendSuccessResponse({
      request: request as RequestWithId,
      response,
      data: campaign
    });
  } catch (error) {
    next(error);
  }
});
