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

export interface ListArtistsInput {
  status?: Artist['status'];
  genre?: string;
  search?: string;
  page?: number;
  limit?: number;
}

interface TextSearchFilter {
  $regex: string;
  $options: 'i';
}

interface ArtistListFilter {
  status?: Artist['status'];
  genre?: TextSearchFilter;
  $or?: Array<{
    name?: TextSearchFilter;
    genre?: TextSearchFilter;
    country?: TextSearchFilter;
  }>;
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

export async function listArtists(
  input: ListArtistsInput = {}
) {
  const {
    page,
    limit,
    skip
  } = normalizePagination(
    input.page,
    input.limit
  );

  const filter: ArtistListFilter = {};

  if (input.status) {
    filter.status = input.status;
  }

  if (input.genre) {
    filter.genre = {
      $regex: input.genre,
      $options: 'i'
    };
  }

  if (input.search) {
    filter.$or = [
      {
        name: {
          $regex: input.search,
          $options: 'i'
        }
      },
      {
        genre: {
          $regex: input.search,
          $options: 'i'
        }
      },
      {
        country: {
          $regex: input.search,
          $options: 'i'
        }
      }
    ];
  }

  const [artists, total] = await Promise.all([
    ArtistModel
      .find(filter)
      .sort({
        createdAt: -1
      })
      .skip(skip)
      .limit(limit),
    ArtistModel.countDocuments(filter)
  ]);

  return {
    artists,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
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
