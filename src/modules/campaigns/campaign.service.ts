import { Types } from 'mongoose';

import { AppError } from '../../common/errors/app-error';
import { ArtistModel } from '../artists/artist.model';
import { CampaignModel } from './campaign.model';

import type {
  CampaignStatus,
  CampaignType
} from './campaign.model';

export interface CreateCampaignInput {
  artistId: string;
  title: string;
  type: CampaignType;
  status?: CampaignStatus;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  mainGoal: string;
}

function validateCampaignId(
  campaignId: string
): void {
  if (!Types.ObjectId.isValid(campaignId)) {
    throw new AppError(
      'Invalid campaign id',
      400
    );
  }
}

export async function createCampaign(
  input: CreateCampaignInput
) {
  const artist = await ArtistModel.findById(
    input.artistId
  );

  if (!artist) {
    throw new AppError(
      `Artist with id ${input.artistId} was not found`,
      404
    );
  }

  const campaign = await CampaignModel.create({
    artistId: new Types.ObjectId(input.artistId),
    title: input.title,
    type: input.type,
    status: input.status ?? 'draft',
    description: input.description,
    startDate: new Date(input.startDate),
    endDate: new Date(input.endDate),
    budget: input.budget,
    mainGoal: input.mainGoal
  });

  return campaign;
}

export async function listCampaigns() {
  return CampaignModel
    .find()
    .populate(
      'artistId',
      'name genre country status imageUrl'
    )
    .sort({
      createdAt: -1
    });
}

export async function getCampaignById(
  campaignId: string
) {
  validateCampaignId(campaignId);

  const campaign = await CampaignModel
    .findById(campaignId)
    .populate(
      'artistId',
      'name genre country status imageUrl'
    );

  if (!campaign) {
    throw new AppError(
      `Campaign with id ${campaignId} was not found`,
      404
    );
  }

  return campaign;
}
