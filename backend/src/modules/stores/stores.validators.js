import { body, query } from 'express-validator'
import pool from '../../config/db.js';

export const createStoreRules = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage('Name must be between 2 and 60 characters'),

  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email address'),

  body('address')
    .trim()
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters'),

  body('owner_id')
    .exists().withMessage('Owner ID is required')
    .notEmpty().withMessage('Owner ID cannot be empty')
    .custom(async (value) => {
      const res = await pool.query("SELECT id FROM users WHERE id = $1 AND role = 'admin';", [value]);
      
      if (res.rows.length === 0) {
        const error = new Error('Owner does not exist or is not an owner');
        error.status = 400;
        throw error;
      }
      return true;
    })
]