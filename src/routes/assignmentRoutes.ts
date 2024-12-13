import express from 'express';
import { authGuard } from '../middleware/authGuard';
import { RoleTypes } from '../types/common.types';

import { AssignmentController } from '../controllers/AssignmentController';
import { submitNewAssignmentValidator } from './validators/assignmentValidator';

const router = express.Router();
const controller = AssignmentController.getInstance();

// Routes
router.post(
    '/submit',
    authGuard([RoleTypes.STUDENT]),
    submitNewAssignmentValidator,
    controller.submitAnswer
);

export default router;

