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

function validateOptionalString(
  body: Record<string, unknown>,
  field: string
): void {
  const value = body[field];

  if (
    value !== undefined
    && (
      typeof value !== 'string'
      || !value.trim()
    )
  ) {
    throw new AppError(
      `${field} must be a non-empty string`,
      400
    );
  }
}

function validateOptionalUrl(
  body: Record<string, unknown>,
  field: string
): void {
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
    validateOptionalUrl(body, field);
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

export function validateUpdateArtistInput(
  body: Record<string, unknown>
): void {
  const allowedFields = [
    'name',
    'genre',
    'country',
    'bio',
    'imageUrl',
    'instagramUrl',
    'youtubeUrl',
    'spotifyUrl',
    'status'
  ];

  const receivedFields = Object.keys(body);

  if (receivedFields.length === 0) {
    throw new AppError(
      'At least one field is required',
      400
    );
  }

  for (const field of receivedFields) {
    if (!allowedFields.includes(field)) {
      throw new AppError(
        `${field} is not allowed`,
        400
      );
    }
  }

  const optionalStringFields = [
    'name',
    'genre',
    'country',
    'bio'
  ];

  for (const field of optionalStringFields) {
    validateOptionalString(body, field);
  }

  const optionalUrlFields = [
    'imageUrl',
    'instagramUrl',
    'youtubeUrl',
    'spotifyUrl'
  ];

  for (const field of optionalUrlFields) {
    validateOptionalUrl(body, field);
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
