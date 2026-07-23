import { Router } from 'express';

import { sendSuccessResponse } from '../../common/utils/send-success-response';
import {
  createArtist,
  listArtists
} from './artist.service';
import {
  validateCreateArtistInput
} from './artist.validators';

import type {
  RequestWithId
} from '../../common/middlewares/request-id.middleware';

export const artistsRouter = Router();

artistsRouter.get('/', async (request, response, next) => {
  try {
    const artists = await listArtists();

    sendSuccessResponse({
      request: request as RequestWithId,
      response,
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

    sendSuccessResponse({
      request: request as RequestWithId,
      response,
      statusCode: 201,
      data: artist
    });
  } catch (error) {
    next(error);
  }
});
