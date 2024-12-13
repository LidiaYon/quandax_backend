import { body, param } from 'express-validator';

export const enrollInCourseValidators = [
    body('courseId').isMongoId().withMessage('Invalid course ID')
];

export const updateCourseProgressValidators = [
    body('courseId').isMongoId().withMessage('Invalid course ID'),
    body('progress')
        .isNumeric()
        .withMessage('Progress must be a number')
        .isFloat({ min: 0, max: 100 })
        .withMessage('Progress must be between 0 and 100')
];

export const dropCourseValidators = [
    param('courseId').isMongoId().withMessage('Invalid course ID')
];

export const viewCourseContentValidators = [
    param('courseId').isMongoId().withMessage('Invalid course ID')
];

export const viewCourseAssignmentsValidators = [
    param('courseId').isMongoId().withMessage('Invalid course ID')
];

export const viewCourseAssignmentValidators = [
    param('courseId').isMongoId().withMessage('Invalid course ID'),
    param('assignmentId').isMongoId().withMessage('Invalid assignment ID')

];

export const markCourseMaterialCompleteValidators = [
    body('courseId').isMongoId().withMessage('Invalid course ID'),
    body('materialId').isMongoId().withMessage('Invalid assignment ID')
];

