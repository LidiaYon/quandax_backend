import { body } from "express-validator";
import { User } from "../../models/User";
import { RoleTypes } from "@lidiayon/sharedlibs";

export const registerValidators = [
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
        .custom((role) => {
            if (!Object.values(RoleTypes).includes(role)) {
                throw new Error('Invalid role');
            }
            if (role === RoleTypes.ADMIN) {
                throw new Error('Role cannot be ADMIN');
            }
            return true;
        }),
    body('phoneNumber')
        .matches(/^\+?[\d\s-]{10,}$/)
        .withMessage('Invalid phone number format'),
    body('active') //if we need admin to register people.
        .optional()
        .isBoolean()
        .withMessage('Active must be a boolean'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/)
        .withMessage('Password must contain at least one lowercase letter')
        .matches(/\d/)
        .withMessage('Password must contain at least one number'),
    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        })
];
