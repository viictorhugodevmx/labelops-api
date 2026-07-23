import { Router } from 'express';

import {
  createArtist,
  listArtists
} from './artist.service';
import {
  validateCreateArtistInput
} from './artist.validators';

export const artistsRouter = Router();

artistsRouter.get('/', async (_request, response, next) => {
  try {
    const artists = await listArtists();

    response.json({
      data: artists
    });
  } catch (error) {
    next(error);
  }
});

artistsRouter.post('/', async (request, response, next) => {
  try {
    validateCreateArtistInput(
      request.body as Record<string, unknown>
    );

    const artist = await createArtist({
      name: request.body.name,
      genre: request.body.genre,
      country: request.body.country,
      bio: request.body.bio,
      imageUrl: request.body.imageUrl,
      instagramUrl: request.body.instagramUrl,
      youtubeUrl: request.body.youtubeUrl,
      spotifyUrl: request.body.spotifyUrl,
      status: request.body.status
    });

    response.status(201).json({
      data: artist
    });
  } catch (error) {
    next(error);
  }
});
