import { Types } from 'mongoose';

import { AppError } from '../../common/errors/app-error';

const allowedTypes = [
  'spotify',
  'youtube',
  'instagram',
  'tiktok',
  'presskit',
  'landing',
  'merch',
  'other'
];

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

function validateOptionalClicks(
  body: Record<string, unknown>
): void {
  if (
    body.clicks !== undefined
    && (
      typeof body.clicks !== 'number'
      || body.clicks < 0
    )
  ) {
    throw new AppError(
      'clicks must be a number greater than or equal to 0',
      400
    );
  }
}

export function validateCreateLinkInput(
  body: Record<string, unknown>
): void {
  validateRequiredString(body, 'artistId');
  validateRequiredString(body, 'title');
  validateRequiredString(body, 'description');
  validateRequiredUrl(body, 'url');

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
      'type must be spotify, youtube, instagram, tiktok, presskit, landing, merch or other',
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
      'status must be active, paused or archived',
      400
    );
  }

  validateOptionalClicks(body);
}

export function validateUpdateLinkInput(
  body: Record<string, unknown>
): void {
  const allowedFields = [
    'campaignId',
    'title',
    'type',
    'status',
    'url',
    'description',
    'clicks'
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
  validateOptionalClicks(body);

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
      'type must be spotify, youtube, instagram, tiktok, presskit, landing, merch or other',
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
      'status must be active, paused or archived',
      400
    );
  }
}
