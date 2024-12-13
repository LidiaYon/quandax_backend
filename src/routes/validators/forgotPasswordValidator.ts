import { body } from 'express-validator';

export const validateForgotPassword = [
  body('email')
    .isEmail()
    .withMessage('Invalid email format')
    .exists({ checkFalsy: true })
    .withMessage('Email is required'),
];

export const validateResetPassword = [
  body('token')
    .exists({ checkFalsy: true })
    .withMessage('Token is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .exists({ checkFalsy: true })
    .withMessage('New password is required'),
];