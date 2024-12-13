import { body } from 'express-validator';

export const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Invalid email format')
    .exists({ checkFalsy: true })
    .withMessage('Email is required'),
  
  body('password')
    .exists({ checkFalsy: true })
    .withMessage('Password is required')
];
