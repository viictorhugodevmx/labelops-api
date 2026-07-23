import { AppError } from '../../common/errors/app-error';

const allowedStatuses = [
  'active',
  'paused',
  'archived'
];

function isValidUrl(
  value: string
): boolean {
  try {
    const url = new URL(value);

    return [
      'http:',
      'https:'
    ].includes(url.protocol);
  } catch {
    return false;
  }
}

export function validateCreateArtistInput(
  body: Record<string, unknown>
): void {
  const requiredStringFields = [
    'name',
    'genre',
    'country',
    'bio',
    'imageUrl'
  ];

  for (const field of requiredStringFields) {
    const value = body[field];

    if (
      typeof value !== 'string'
      || !value.trim()
    ) {
      throw new AppError(
        `${field} is required`,
        400
      );
    }
  }

  if (
    typeof body.imageUrl === 'string'
    && !isValidUrl(body.imageUrl)
  ) {
    throw new AppError(
      'imageUrl must be a valid URL',
      400
    );
  }

  const optionalUrlFields = [
    'instagramUrl',
    'youtubeUrl',
    'spotifyUrl'
  ];

  for (const field of optionalUrlFields) {
    const value = body[field];

    if (
      value !== undefined
      && (
        typeof value !== 'string'
        || !isValidUrl(value)
      )
    ) {
      throw new AppError(
        `${field} must be a valid URL`,
        400
      );
    }
  }

  if (
    body.status !== undefined
    && (
      typeof body.status !== 'string'
      || !allowedStatuses.includes(body.status)
    )
  ) {
    throw new AppError(
      'status must be active, paused or archived',
      400
    );
  }
}
