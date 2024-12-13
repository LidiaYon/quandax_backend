import { body } from 'express-validator';

export const tutorProfileValidators = [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('specialization').isArray().withMessage('Specialization must be an array'),
    body('rating').optional().isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5'),
    body('availability').optional().isArray().withMessage('Availability must be an array'),
    body('availability.*.day').optional()
        .isIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])
        .withMessage('Invalid day'),
    body('availability.*.startTime').optional()
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Start time must be in HH:MM format'),
    body('availability.*.endTime').optional()
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('End time must be in HH:MM format')
];
