import { Types } from 'mongoose';

import { AppError } from '../../common/errors/app-error';

const allowedTypes = [
  'video',
  'reel',
  'post',
  'artwork',
  'press'
];

const allowedStatuses = [
  'draft',
  'scheduled',
  'published',
  'archived'
];

const allowedPlatforms = [
  'instagram',
  'youtube',
  'tiktok',
  'spotify',
  'website'
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

function validateRequiredString(
  body: Record<string, unknown>,
  field: string
): void {
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

function validateRequiredUrl(
  body: Record<string, unknown>,
  field: string
): void {
  validateRequiredString(body, field);

  const value = body[field];

  if (
    typeof value === 'string'
    && !isValidUrl(value)
  ) {
    throw new AppError(
      `${field} must be a valid URL`,
      400
    );
  }
}

function validateOptionalUrl(
  body: Record<string, unknown>,
  field: string
): void {
  const value = body[field];

  if (value === undefined) {
    return;
  }

  if (
    typeof value !== 'string'
    || !isValidUrl(value)
  ) {
    throw new AppError(
      `${field} must be a valid URL`,
      400
    );
  }
}

function validateOptionalDate(
  body: Record<string, unknown>,
  field: string
): void {
  const value = body[field];

  if (value === undefined) {
    return;
  }

  if (
    typeof value !== 'string'
    || !value.trim()
  ) {
    throw new AppError(
      `${field} must be a valid date`,
      400
    );
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new AppError(
      `${field} must be a valid date`,
      400
    );
  }
}

export function validateCreateContentInput(
  body: Record<string, unknown>
): void {
  validateRequiredString(body, 'artistId');
  validateRequiredString(body, 'title');
  validateRequiredString(body, 'description');
  validateRequiredUrl(body, 'url');
  validateRequiredUrl(body, 'thumbnailUrl');

  if (
    typeof body.artistId !== 'string'
    || !Types.ObjectId.isValid(body.artistId)
  ) {
    throw new AppError(
      'artistId must be a valid MongoDB ObjectId',
      400
    );
  }

  if (
    body.campaignId !== undefined
    && (
      typeof body.campaignId !== 'string'
      || !Types.ObjectId.isValid(body.campaignId)
    )
  ) {
    throw new AppError(
      'campaignId must be a valid MongoDB ObjectId',
      400
    );
  }

  if (
    typeof body.type !== 'string'
    || !allowedTypes.includes(body.type)
  ) {
    throw new AppError(
      'type must be video, reel, post, artwork or press',
      400
    );
  }

  if (
    body.status !== undefined
    && (
      typeof body.status !== 'string'
      || !allowedStatuses.includes(body.status)
    )
  ) {
    throw new AppError(
      'status must be draft, scheduled, published or archived',
      400
    );
  }

  if (
    typeof body.platform !== 'string'
    || !allowedPlatforms.includes(body.platform)
  ) {
    throw new AppError(
      'platform must be instagram, youtube, tiktok, spotify or website',
      400
    );
  }

  validateOptionalDate(body, 'publishDate');
}

export function validateUpdateContentInput(
  body: Record<string, unknown>
): void {
  const allowedFields = [
    'campaignId',
    'title',
    'type',
    'status',
    'platform',
    'url',
    'thumbnailUrl',
    'description',
    'publishDate'
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

  validateOptionalString(body, 'title');
  validateOptionalString(body, 'description');
  validateOptionalUrl(body, 'url');
  validateOptionalUrl(body, 'thumbnailUrl');
  validateOptionalDate(body, 'publishDate');

  if (
    body.campaignId !== undefined
    && (
      typeof body.campaignId !== 'string'
      || !Types.ObjectId.isValid(body.campaignId)
    )
  ) {
    throw new AppError(
      'campaignId must be a valid MongoDB ObjectId',
      400
    );
  }

  if (
    body.type !== undefined
    && (
      typeof body.type !== 'string'
      || !allowedTypes.includes(body.type)
    )
  ) {
    throw new AppError(
      'type must be video, reel, post, artwork or press',
      400
    );
  }

  if (
    body.status !== undefined
    && (
      typeof body.status !== 'string'
      || !allowedStatuses.includes(body.status)
    )
  ) {
    throw new AppError(
      'status must be draft, scheduled, published or archived',
      400
    );
  }

  if (
    body.platform !== undefined
    && (
      typeof body.platform !== 'string'
      || !allowedPlatforms.includes(body.platform)
    )
  ) {
    throw new AppError(
      'platform must be instagram, youtube, tiktok, spotify or website',
      400
    );
  }
}
