import {
  Schema,
  Types,
  model
} from 'mongoose';

export type LinkType =
  | 'spotify'
  | 'youtube'
  | 'instagram'
  | 'tiktok'
  | 'presskit'
  | 'landing'
  | 'merch'
  | 'other';

export type LinkStatus =
  | 'active'
  | 'paused'
  | 'archived';

export interface Link {
  artistId: Types.ObjectId;
  campaignId?: Types.ObjectId;
  title: string;
  type: LinkType;
  status: LinkStatus;
  url: string;
  description: string;
  clicks: number;
}

const linkSchema = new Schema<Link>(
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
        'spotify',
        'youtube',
        'instagram',
        'tiktok',
        'presskit',
        'landing',
        'merch',
        'other'
      ],
      required: true
    },
    status: {
      type: String,
      enum: [
        'active',
        'paused',
        'archived'
      ],
      default: 'active'
    },
    url: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    clicks: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

export const LinkModel = model<Link>(
  'Link',
  linkSchema
);
