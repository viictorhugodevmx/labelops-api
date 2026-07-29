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
