import { Types } from 'mongoose';

import { AppError } from '../../common/errors/app-error';

const allowedTypes = [
  'single',
  'video',
  'album',
  'ep',
  'social'
];

const allowedStatuses = [
  'draft',
  'active',
  'completed',
  'cancelled'
];

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

function validateDateField(
  body: Record<string, unknown>,
  field: string
): Date {
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

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new AppError(
      `${field} must be a valid date`,
      400
    );
  }

  return date;
}

function validateOptionalDateField(
  body: Record<string, unknown>,
  field: string
): Date | undefined {
  const value = body[field];

  if (value === undefined) {
    return undefined;
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

  return date;
}

function validateOptionalBudget(
  body: Record<string, unknown>
): void {
  if (
    body.budget !== undefined
    && (
      typeof body.budget !== 'number'
      || body.budget < 0
    )
  ) {
    throw new AppError(
      'budget must be a number greater than or equal to 0',
      400
    );
  }
}

export function validateCreateCampaignInput(
  body: Record<string, unknown>
): void {
  validateRequiredString(body, 'artistId');
  validateRequiredString(body, 'title');
  validateRequiredString(body, 'description');
  validateRequiredString(body, 'mainGoal');

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
    typeof body.type !== 'string'
    || !allowedTypes.includes(body.type)
  ) {
    throw new AppError(
      'type must be single, video, album, ep or social',
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
      'status must be draft, active, completed or cancelled',
      400
    );
  }

  const startDate = validateDateField(
    body,
    'startDate'
  );

  const endDate = validateDateField(
    body,
    'endDate'
  );

  if (endDate <= startDate) {
    throw new AppError(
      'endDate must be after startDate',
      400
    );
  }

  if (
    typeof body.budget !== 'number'
    || body.budget < 0
  ) {
    throw new AppError(
      'budget must be a number greater than or equal to 0',
      400
    );
  }
}

export function validateUpdateCampaignInput(
  body: Record<string, unknown>
): void {
  const allowedFields = [
    'title',
    'type',
    'status',
    'description',
    'startDate',
    'endDate',
    'budget',
    'mainGoal'
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
  validateOptionalString(body, 'mainGoal');
  validateOptionalBudget(body);

  if (
    body.type !== undefined
    && (
      typeof body.type !== 'string'
      || !allowedTypes.includes(body.type)
    )
  ) {
    throw new AppError(
      'type must be single, video, album, ep or social',
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
      'status must be draft, active, completed or cancelled',
      400
    );
  }

  const startDate = validateOptionalDateField(
    body,
    'startDate'
  );

  const endDate = validateOptionalDateField(
    body,
    'endDate'
  );

  if (
    startDate
    && endDate
    && endDate <= startDate
  ) {
    throw new AppError(
      'endDate must be after startDate',
      400
    );
  }
}
