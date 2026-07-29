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

export interface UpdateCampaignInput {
  title?: string;
  type?: CampaignType;
  status?: CampaignStatus;
  description?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  mainGoal?: string;
}

export interface ListCampaignsInput {
  artistId?: string;
  status?: CampaignStatus;
  type?: CampaignType;
  search?: string;
  page?: number;
  limit?: number;
}

interface TextSearchFilter {
  $regex: string;
  $options: 'i';
}

interface CampaignListFilter {
  artistId?: Types.ObjectId;
  status?: CampaignStatus;
  type?: CampaignType;
  $or?: Array<{
    title?: TextSearchFilter;
    description?: TextSearchFilter;
    mainGoal?: TextSearchFilter;
  }>;
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

function normalizePagination(
  page?: number,
  limit?: number
) {
  const safePage =
    page && page > 0
      ? page
      : 1;

  const safeLimit =
    limit && limit > 0 && limit <= 50
      ? limit
      : 10;

  return {
    page: safePage,
    limit: safeLimit,
    skip: (safePage - 1) * safeLimit
  };
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

export async function listCampaigns(
  input: ListCampaignsInput = {}
) {
  const {
    page,
    limit,
    skip
  } = normalizePagination(
    input.page,
    input.limit
  );

  const filter: CampaignListFilter = {};

  if (input.artistId) {
    if (!Types.ObjectId.isValid(input.artistId)) {
      throw new AppError(
        'artistId must be a valid MongoDB ObjectId',
        400
      );
    }

    filter.artistId = new Types.ObjectId(
      input.artistId
    );
  }

  if (input.status) {
    filter.status = input.status;
  }

  if (input.type) {
    filter.type = input.type;
  }

  if (input.search) {
    filter.$or = [
      {
        title: {
          $regex: input.search,
          $options: 'i'
        }
      },
      {
        description: {
          $regex: input.search,
          $options: 'i'
        }
      },
      {
        mainGoal: {
          $regex: input.search,
          $options: 'i'
        }
      }
    ];
  }

  const [campaigns, total] = await Promise.all([
    CampaignModel
      .find(filter)
      .populate(
        'artistId',
        'name genre country status imageUrl'
      )
      .sort({
        createdAt: -1
      })
      .skip(skip)
      .limit(limit),
    CampaignModel.countDocuments(filter)
  ]);

  return {
    campaigns,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
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

export async function updateCampaign(
  campaignId: string,
  input: UpdateCampaignInput
) {
  validateCampaignId(campaignId);

  const updatePayload = {
    ...input,
    ...(input.startDate
      ? { startDate: new Date(input.startDate) }
      : {}),
    ...(input.endDate
      ? { endDate: new Date(input.endDate) }
      : {})
  };

  const campaign = await CampaignModel
    .findByIdAndUpdate(
      campaignId,
      updatePayload,
      {
        new: true,
        runValidators: true
      }
    )
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

export async function cancelCampaign(
  campaignId: string
) {
  validateCampaignId(campaignId);

  const campaign = await CampaignModel
    .findByIdAndUpdate(
      campaignId,
      {
        status: 'cancelled'
      },
      {
        new: true,
        runValidators: true
      }
    )
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
