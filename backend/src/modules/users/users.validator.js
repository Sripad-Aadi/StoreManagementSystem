import { body, query } from 'express-validator'

export const createUserRules = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage('Name must be between 2 and 60 characters'),

  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email address'),

  body('password')
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/)
    .withMessage('Password must be 8-16 characters with one uppercase and one special character'),

  body('address')
    .trim()
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters'),

  body('role')
    .exists().withMessage('Role is required')
    .isString().withMessage('Role must be a string')
    .trim()
    .toLowerCase()
    .isIn(['user', 'admin', 'owner'])
    .withMessage('Invalid role. Allowed values are: user, admin, owner')
]

export const getUsersRules = [
  query('role')
    .optional()
    .isIn(['user', 'owner', 'admin'])
    .withMessage('Invalid role filter specified'),

  query('search')
    .optional()
    .trim()
    .escape(),

  query('sortBy')
    .optional()
    .isIn(['name', 'email', 'role'])
    .withMessage('Can only sort by name, email, or role'),

  query('sortOrder')
    .optional()
    .toLowerCase()
    .isIn(['asc', 'desc'])
    .withMessage('sortOrder must be either asc or desc'),

];
