import { body, param } from 'express-validator';
import { MaterialTypes } from '../../types/common.types';

// think we can use this for both edit and addning course
export const createCourseValidators = [
    body('title').notEmpty().withMessage('Title is required'),
    body('code').notEmpty().withMessage('Course code is required'),
    body('duration').optional().isNumeric(),
    body('startDate').optional().isISO8601(),
    body('endDate').optional().isISO8601(),
    body('enrollmentLimit').optional().isNumeric(),
    body('description').notEmpty().withMessage('Description is required is required'),
];

export const updateCourseStatusValidators = [
    body('newStatus').notEmpty().withMessage('New Status is required'),
];


export const courseContentValidators = {
    addContent: [
        param('courseId').isMongoId().withMessage('Invalid course ID'),
        body('title').trim().notEmpty().withMessage('Title is required'),
        body('order').optional().isNumeric().withMessage('Order must be a number'),
        body('durationInMinutes')
            .optional()
            .isNumeric()
            .withMessage('Duration must be a number'),
        body('description')
            .optional()
            .trim()
            .isLength({ max: 1000 })
            .withMessage('Description cannot exceed 1000 characters')
    ],

    updateContent: [
        param('courseId').isMongoId().withMessage('Invalid course ID'),
        param('contentId').isMongoId().withMessage('Invalid content ID'),
        body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
        body('type')
            .optional()
            .isIn(Object.values(MaterialTypes))
            .withMessage('Invalid material type'),
        body('url').optional().trim().notEmpty().withMessage('URL cannot be empty'),
        body('order').optional().isNumeric().withMessage('Order must be a number'),
        body('durationInMinutes')
            .optional()
            .isNumeric()
            .withMessage('Duration must be a number'),
        body('description')
            .optional()
            .trim()
            .isLength({ max: 1000 })
            .withMessage('Description cannot exceed 1000 characters')
    ],

    deleteContent: [
        param('courseId').isMongoId().withMessage('Invalid course ID'),
        param('contentId').isMongoId().withMessage('Invalid content ID')
    ]
};

export const courseAssignmentsValidator = {

    createNew: [
        body("course")
            .isMongoId()
            .withMessage("Invalid course ID."),

        body("title")
            .isString()
            .notEmpty()
            .withMessage("Title is required.")
            .isLength({ max: 255 })
            .withMessage("Title must not exceed 255 characters."),

        // Validate description
        body("description")
            .optional()
            .isString()
            .withMessage("Description must be a string."),

        // Validate dueDate
        body("dueDate")
            .isISO8601()
            .withMessage("Invalid date format for dueDate.")
            .isAfter(new Date().toISOString())
            .withMessage("Due date must be in the future."),

        // Validate totalPoints
        body("totalPoints")
            .isInt({ min: 1 })
            .withMessage("Total points must be an integer greater than 0."),

        // Validate questions
        body("questions")
            .isArray({ min: 1 })
            .withMessage("Questions must be a non-empty array."),

        // Validate individual questions
        body("questions.*.questionText")
            .isString()
            .notEmpty()
            .withMessage("Each question must have a questionText."),
        body("questions.*.questionType")
            .isIn(["SINGLE_CHOICE", "ESSAY"]) // Adjust based on `QuestionType` enum
            .withMessage("Invalid questionType."),
        body("questions.*.points")
            .isInt({ min: 1 })
            .withMessage("Each question must have points greater than 0."),
        body("questions.*.options")
            .optional()
            .isArray()
            .withMessage("Options must be an array."),
        body("questions.*.options.*.value")
            .optional()
            .isString()
            .notEmpty()
            .withMessage("Each option must have a value."),
        body("questions.*.options.*.label")
            .optional()
            .isString()
            .notEmpty()
            .withMessage("Each option must have a label."),
        body("questions.*.correctAnswer")
            .optional()
            .isString()
            .withMessage("CorrectAnswer must be a string.")
    ],
    viewCourseAssignments: [
        param('courseId').isMongoId().withMessage('Invalid course ID'),
    ],
    deleteAssignment: [
        param('courseId').isMongoId().withMessage('Invalid course ID'),
        param('assignmentId').isMongoId().withMessage('Invalid assignemnt ID')
    ]

};


