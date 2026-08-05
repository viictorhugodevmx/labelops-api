import { Types } from 'mongoose';

import { AppError } from '../../common/errors/app-error';
import { ArtistModel } from '../artists/artist.model';
import { CampaignModel } from '../campaigns/campaign.model';
import { LinkModel } from './link.model';

import type {
  LinkStatus,
  LinkType
} from './link.model';

export interface CreateLinkInput {
  artistId: string;
  campaignId?: string;
  title: string;
  type: LinkType;
  status?: LinkStatus;
  url: string;
  description: string;
  clicks?: number;
}

export interface UpdateLinkInput {
  campaignId?: string;
  title?: string;
  type?: LinkType;
  status?: LinkStatus;
  url?: string;
  description?: string;
  clicks?: number;
}

function validateLinkId(
  linkId: string
): void {
  if (!Types.ObjectId.isValid(linkId)) {
    throw new AppError(
      'Invalid link id',
      400
    );
  }
}

async function validateCampaignExists(
  campaignId: string
): Promise<void> {
  const campaign = await CampaignModel.findById(
    campaignId
  );

  if (!campaign) {
    throw new AppError(
      `Campaign with id ${campaignId} was not found`,
      404
    );
  }
}

export async function createLink(
  input: CreateLinkInput
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

  if (input.campaignId) {
    await validateCampaignExists(
      input.campaignId
    );
  }

  const link = await LinkModel.create({
    artistId: new Types.ObjectId(input.artistId),
    ...(input.campaignId
      ? { campaignId: new Types.ObjectId(input.campaignId) }
      : {}),
    title: input.title,
    type: input.type,
    status: input.status ?? 'active',
    url: input.url,
    description: input.description,
    clicks: input.clicks ?? 0
  });

  return link;
}

export async function listLinks() {
  return LinkModel
    .find()
    .populate(
      'artistId',
      'name genre country status imageUrl'
    )
    .populate(
      'campaignId',
      'title type status startDate endDate'
    )
    .sort({
      createdAt: -1
    });
}

export async function getLinkById(
  linkId: string
) {
  validateLinkId(linkId);

  const link = await LinkModel
    .findById(linkId)
    .populate(
      'artistId',
      'name genre country status imageUrl'
    )
    .populate(
      'campaignId',
      'title type status startDate endDate'
    );

  if (!link) {
    throw new AppError(
      `Link with id ${linkId} was not found`,
      404
    );
  }

  return link;
}

export async function updateLink(
  linkId: string,
  input: UpdateLinkInput
) {
  validateLinkId(linkId);

  if (input.campaignId) {
    await validateCampaignExists(
      input.campaignId
    );
  }

  const updatePayload = {
    ...input,
    ...(input.campaignId
      ? { campaignId: new Types.ObjectId(input.campaignId) }
      : {})
  };

  const link = await LinkModel
    .findByIdAndUpdate(
      linkId,
      updatePayload,
      {
        new: true,
        runValidators: true
      }
    )
    .populate(
      'artistId',
      'name genre country status imageUrl'
    )
    .populate(
      'campaignId',
      'title type status startDate endDate'
    );

  if (!link) {
    throw new AppError(
      `Link with id ${linkId} was not found`,
      404
    );
  }

  return link;
}

export async function archiveLink(
  linkId: string
) {
  validateLinkId(linkId);

  const link = await LinkModel
    .findByIdAndUpdate(
      linkId,
      {
        status: 'archived'
      },
      {
        new: true,
        runValidators: true
      }
    )
    .populate(
      'artistId',
      'name genre country status imageUrl'
    )
    .populate(
      'campaignId',
      'title type status startDate endDate'
    );

  if (!link) {
    throw new AppError(
      `Link with id ${linkId} was not found`,
      404
    );
  }

  return link;
}
