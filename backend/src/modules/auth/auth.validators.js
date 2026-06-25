import { body } from 'express-validator'

export const registerRules = [
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
]

export const passwordRules = [
  body('password')
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/)
    .withMessage('Password must be 8-16 characters with one uppercase and one special character'),
]