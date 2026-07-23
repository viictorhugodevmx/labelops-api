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
