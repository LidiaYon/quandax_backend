import { param } from 'express-validator';
import mongoose from 'mongoose';

export const validateMongoId = [
    param('id')
        .notEmpty()
        .withMessage('ID parameter is required')
        .custom((value) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error('Invalid id format');
            }
            return true;
        })
];

export const validateMongoUserId = [
    param('userId')
        .notEmpty()
        .withMessage('ID parameter is required')
        .custom((value) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error('Invalid user id format');
            }
            return true;
        })
];