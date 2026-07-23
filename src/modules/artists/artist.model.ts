import {
  Schema,
  model
} from 'mongoose';

export type ArtistStatus =
  | 'active'
  | 'paused'
  | 'archived';

export interface Artist {
  name: string;
  genre: string;
  country: string;
  bio: string;
  imageUrl: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  spotifyUrl?: string;
  status: ArtistStatus;
}

const artistSchema = new Schema<Artist>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    genre: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      required: true,
      trim: true
    },
    bio: {
      type: String,
      required: true,
      trim: true
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true
    },
    instagramUrl: {
      type: String,
      trim: true
    },
    youtubeUrl: {
      type: String,
      trim: true
    },
    spotifyUrl: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: [
        'active',
        'paused',
        'archived'
      ],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

export const ArtistModel = model<Artist>(
  'Artist',
  artistSchema
);
