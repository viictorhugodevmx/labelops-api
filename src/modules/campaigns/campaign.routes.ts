import { Router } from 'express';

import { sendSuccessResponse } from '../../common/utils/send-success-response';
import {
  createCampaign,
  getCampaignById,
  listCampaigns
} from './campaign.service';
import {
  validateCreateCampaignInput
} from './campaign.validators';

import type {
  RequestWithId
} from '../../common/middlewares/request-id.middleware';

export const campaignsRouter = Router();

campaignsRouter.get('/', async (request, response, next) => {
  try {
    const campaigns = await listCampaigns();

    sendSuccessResponse({
      request: request as RequestWithId,
      response,
      data: campaigns
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
