import { body } from 'express-validator';
import { User } from '../../models/User';
import { RoleTypes } from '../../types/common.types';


export const createUserValidators = [
    body('email')
        .isEmail()
        .withMessage('Invalid email format')
        .custom(async (email) => {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new Error('Email already exists');
            }
            return true;
        }),
    body('firstName')
        .trim()
        .notEmpty()
        .withMessage('First name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters'),
    body('lastName')
        .trim()
        .notEmpty()
        .withMessage('Last name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters'),
    body('role')
        .isIn(Object.values(RoleTypes))
        .withMessage('Invalid role'),
    body('phoneNumber')
        .optional()
        .matches(/^\+?[\d\s-]{10,}$/)
        .withMessage('Invalid phone number format'),
    body('active')
        .optional()
        .isBoolean()
        .withMessage('Active must be a boolean')
];

export const updateUserValidators = [
    body('email')
        .optional()
        .isEmail()
        .withMessage('Invalid email format')
        .custom(async (email, { req }) => {
            const existingUser = await User.findOne({ email });
            if (existingUser && existingUser._id.toString() !== req.params!!.id) {
                throw new Error('Email already exists');
            }
            return true;
        }),
    body('firstName')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters'),
    body('lastName')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters'),
    body('role')
        .optional()
        .isIn(Object.values(RoleTypes))
        .withMessage('Invalid role'),
    body('phoneNumber')
        .optional()
        .matches(/^\+?[\d\s-]{10,}$/)
        .withMessage('Invalid phone number format'),
    body('active')
        .optional()
        .isBoolean()
        .withMessage('Active must be a boolean')
];

export const updateUserStatusValidators = [
    body('userId')
        .isMongoId()
        .withMessage('Invalid user format')
        ,
    body('newStatus')
        .trim()
        .notEmpty()
        .withMessage('New status required')
];
