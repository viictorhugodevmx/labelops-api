import { Types } from 'mongoose';

import { AppError } from '../../common/errors/app-error';
import { ArtistModel } from '../artists/artist.model';
import { CampaignModel } from '../campaigns/campaign.model';
import { ContentModel } from './content.model';

import type {
  ContentPlatform,
  ContentStatus,
  ContentType
} from './content.model';

export interface CreateContentInput {
  artistId: string;
  campaignId?: string;
  title: string;
  type: ContentType;
  status?: ContentStatus;
  platform: ContentPlatform;
  url: string;
  thumbnailUrl: string;
  description: string;
  publishDate?: string;
}

export interface UpdateContentInput {
  campaignId?: string;
  title?: string;
  type?: ContentType;
  status?: ContentStatus;
  platform?: ContentPlatform;
  url?: string;
  thumbnailUrl?: string;
  description?: string;
  publishDate?: string;
}

function validateContentId(
  contentId: string
): void {
  if (!Types.ObjectId.isValid(contentId)) {
    throw new AppError(
      'Invalid content id',
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

export async function createContent(
  input: CreateContentInput
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

  const content = await ContentModel.create({
    artistId: new Types.ObjectId(input.artistId),
    ...(input.campaignId
      ? { campaignId: new Types.ObjectId(input.campaignId) }
      : {}),
    title: input.title,
    type: input.type,
    status: input.status ?? 'draft',
    platform: input.platform,
    url: input.url,
    thumbnailUrl: input.thumbnailUrl,
    description: input.description,
    ...(input.publishDate
      ? { publishDate: new Date(input.publishDate) }
      : {})
  });

  return content;
}

export async function listContent() {
  return ContentModel
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

export async function getContentById(
  contentId: string
) {
  validateContentId(contentId);

  const content = await ContentModel
    .findById(contentId)
    .populate(
      'artistId',
      'name genre country status imageUrl'
    )
    .populate(
      'campaignId',
      'title type status startDate endDate'
    );

  if (!content) {
    throw new AppError(
      `Content with id ${contentId} was not found`,
      404
    );
  }

  return content;
}

export async function updateContent(
  contentId: string,
  input: UpdateContentInput
) {
  validateContentId(contentId);

  if (input.campaignId) {
    await validateCampaignExists(
      input.campaignId
    );
  }

  const updatePayload = {
    ...input,
    ...(input.campaignId
      ? { campaignId: new Types.ObjectId(input.campaignId) }
      : {}),
    ...(input.publishDate
      ? { publishDate: new Date(input.publishDate) }
      : {})
  };

  const content = await ContentModel
    .findByIdAndUpdate(
      contentId,
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

  if (!content) {
    throw new AppError(
      `Content with id ${contentId} was not found`,
      404
    );
  }

  return content;
}

export async function archiveContent(
  contentId: string
) {
  validateContentId(contentId);

  const content = await ContentModel
    .findByIdAndUpdate(
      contentId,
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

  if (!content) {
    throw new AppError(
      `Content with id ${contentId} was not found`,
      404
    );
  }

  return content;
}
