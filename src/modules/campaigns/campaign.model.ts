import {
  Schema,
  Types,
  model
} from 'mongoose';

export type CampaignStatus =
  | 'draft'
  | 'active'
  | 'completed'
  | 'cancelled';

export type CampaignType =
  | 'single'
  | 'video'
  | 'album'
  | 'ep'
  | 'social';

export interface Campaign {
  artistId: Types.ObjectId;
  title: string;
  type: CampaignType;
  status: CampaignStatus;
  description: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  mainGoal: string;
}

const campaignSchema = new Schema<Campaign>(
  {
    artistId: {
      type: Schema.Types.ObjectId,
      ref: 'Artist',
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: [
        'single',
        'video',
        'album',
        'ep',
        'social'
      ],
      required: true
    },
    status: {
      type: String,
      enum: [
        'draft',
        'active',
        'completed',
        'cancelled'
      ],
      default: 'draft'
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    budget: {
      type: Number,
      required: true,
      min: 0
    },
    mainGoal: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

export const CampaignModel = model<Campaign>(
  'Campaign',
  campaignSchema
);
