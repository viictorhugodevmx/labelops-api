import { Types } from 'mongoose';

import { AppError } from '../../common/errors/app-error';
import { ArtistModel } from './artist.model';

import type {
  Artist
} from './artist.model';

export interface CreateArtistInput {
  name: string;
  genre: string;
  country: string;
  bio: string;
  imageUrl: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  spotifyUrl?: string;
  status?: Artist['status'];
}

export interface UpdateArtistInput {
  name?: string;
  genre?: string;
  country?: string;
  bio?: string;
  imageUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  spotifyUrl?: string;
  status?: Artist['status'];
}

function validateArtistId(
  artistId: string
): void {
  if (!Types.ObjectId.isValid(artistId)) {
    throw new AppError(
      'Invalid artist id',
      400
    );
  }
}

export async function createArtist(
  input: CreateArtistInput
) {
  const artist = await ArtistModel.create({
    name: input.name,
    genre: input.genre,
    country: input.country,
    bio: input.bio,
    imageUrl: input.imageUrl,
    instagramUrl: input.instagramUrl,
    youtubeUrl: input.youtubeUrl,
    spotifyUrl: input.spotifyUrl,
    status: input.status ?? 'active'
  });

  return artist;
}

export async function listArtists() {
  return ArtistModel
    .find()
    .sort({
      createdAt: -1
    });
}

export async function getArtistById(
  artistId: string
) {
  validateArtistId(artistId);

  const artist = await ArtistModel.findById(
    artistId
  );

  if (!artist) {
    throw new AppError(
      `Artist with id ${artistId} was not found`,
      404
    );
  }

  return artist;
}

export async function updateArtist(
  artistId: string,
  input: UpdateArtistInput
) {
  validateArtistId(artistId);

  const artist = await ArtistModel
    .findByIdAndUpdate(
      artistId,
      input,
      {
        new: true,
        runValidators: true
      }
    );

  if (!artist) {
    throw new AppError(
      `Artist with id ${artistId} was not found`,
      404
    );
  }

  return artist;
}

export async function archiveArtist(
  artistId: string
) {
  validateArtistId(artistId);

  const artist = await ArtistModel
    .findByIdAndUpdate(
      artistId,
      {
        status: 'archived'
      },
      {
        new: true,
        runValidators: true
      }
    );

  if (!artist) {
    throw new AppError(
      `Artist with id ${artistId} was not found`,
      404
    );
  }

  return artist;
}
