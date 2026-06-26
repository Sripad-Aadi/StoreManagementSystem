import { body, param } from 'express-validator';

export const createRatingRules = [
  body('store_id')
    .isInt({ gt: 0 })
    .withMessage('store_id must be a positive integer'),
  body('value')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating value must be between 1 and 5'),
];

export const updateRatingRules = [
  body('rating_id')
    .isInt({ gt: 0 })
    .withMessage('rating_id must be a positive integer'),
  body('value')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating value must be between 1 and 5'),
];

export const getRatingsRules = [];
