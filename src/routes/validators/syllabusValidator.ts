import { body } from 'express-validator';

export const createSyllabusValidators = [
    body('courseId').notEmpty().withMessage('Course ID is required'),
    body('weeks').isArray().withMessage('Weeks must be an array'),
    body('weeks.*.weekNumber').isNumeric().withMessage('Week number must be numeric'),
    body('weeks.*.title').notEmpty().withMessage('Week title is required'),
    body('weeks.*.learningObjectives').isArray().withMessage('Learning objectives must be an array')
];