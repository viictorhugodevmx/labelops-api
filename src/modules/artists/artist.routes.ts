import { Router } from 'express';

import { sendSuccessResponse } from '../../common/utils/send-success-response';
import {
  archiveArtist,
  createArtist,
  getArtistById,
  listArtists,
  updateArtist
} from './artist.service';
import {
  validateCreateArtistInput,
  validateUpdateArtistInput
} from './artist.validators';

import type {
  RequestWithId
} from '../../common/middlewares/request-id.middleware';

import type {
  Artist
} from './artist.model';

export const artistsRouter = Router();

function parsePositiveNumber(
  value: unknown
): number | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const parsedValue = Number(value);

  if (
    Number.isNaN(parsedValue)
    || parsedValue <= 0
  ) {
    return undefined;
  }

  return parsedValue;
}

function parseArtistStatus(
  value: unknown
): Artist['status'] | undefined {
  if (
    value === 'active'
    || value === 'paused'
    || value === 'archived'
  ) {
    return value;
  }

  return undefined;
}

function parseStringQuery(
  value: unknown
): string | undefined {
  if (
    typeof value === 'string'
    && value.trim()
  ) {
    return value.trim();
  }

  return undefined;
}

artistsRouter.get('/', async (request, response, next) => {
  try {
    const result = await listArtists({
      status: parseArtistStatus(request.query.status),
      genre: parseStringQuery(request.query.genre),
      search: parseStringQuery(request.query.search),
      page: parsePositiveNumber(request.query.page),
      limit: parsePositiveNumber(request.query.limit)
    });

    sendSuccessResponse({
      request: request as RequestWithId,
      response,
      data: result.artists,
      meta: result.meta
    });
  } catch (error) {
    next(error);
  }
});

artistsRouter.get('/:id', async (request, response, next) => {
  try {
    const artist = await getArtistById(
      request.params.id
    );

    sendSuccessResponse({
      request: request as RequestWithId,
      response,
      data: artist
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

artistsRouter.patch('/:id', async (request, response, next) => {
  try {
    validateUpdateArtistInput(
      request.body as Record<string, unknown>
    );

    const artist = await updateArtist(
      request.params.id,
      request.body
    );

    sendSuccessResponse({
      request: request as RequestWithId,
      response,
      data: artist
    });
  } catch (error) {
    next(error);
  }
});

artistsRouter.patch('/:id/archive', async (request, response, next) => {
  try {
    const artist = await archiveArtist(
      request.params.id
    );

    sendSuccessResponse({
      request: request as RequestWithId,
      response,
      data: artist
    });
  } catch (error) {
    next(error);
  }
});
