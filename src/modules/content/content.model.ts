import {
  Schema,
  Types,
  model
} from 'mongoose';

export type ContentType =
  | 'video'
  | 'reel'
  | 'post'
  | 'artwork'
  | 'press';

export type ContentStatus =
  | 'draft'
  | 'scheduled'
  | 'published'
  | 'archived';

export type ContentPlatform =
  | 'instagram'
  | 'youtube'
  | 'tiktok'
  | 'spotify'
  | 'website';

export interface Content {
  artistId: Types.ObjectId;
  campaignId?: Types.ObjectId;
  title: string;
  type: ContentType;
  status: ContentStatus;
  platform: ContentPlatform;
  url: string;
  thumbnailUrl: string;
  description: string;
  publishDate?: Date;
}

const contentSchema = new Schema<Content>(
  {
    artistId: {
      type: Schema.Types.ObjectId,
      ref: 'Artist',
      required: true
    },
    campaignId: {
      type: Schema.Types.ObjectId,
      ref: 'Campaign'
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: [
        'video',
        'reel',
        'post',
        'artwork',
        'press'
      ],
      required: true
    },
    status: {
      type: String,
      enum: [
        'draft',
        'scheduled',
        'published',
        'archived'
      ],
      default: 'draft'
    },
    platform: {
      type: String,
      enum: [
        'instagram',
        'youtube',
        'tiktok',
        'spotify',
        'website'
      ],
      required: true
    },
    url: {
      type: String,
      required: true,
      trim: true
    },
    thumbnailUrl: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    publishDate: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

export const ContentModel = model<Content>(
  'Content',
  contentSchema
);
