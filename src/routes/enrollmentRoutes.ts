import express from 'express';
import { EnrollmentController } from '../controllers/EnrollmentController';
import { authGuard } from '../middleware/authGuard';
import { RoleTypes } from '../types/common.types';
import {
    enrollInCourseValidators,
    updateCourseProgressValidators,
    dropCourseValidators,
    viewCourseContentValidators,
    viewCourseAssignmentValidators,
    viewCourseAssignmentsValidators,
    markCourseMaterialCompleteValidators
} from './validators/enrollmentValidator';

const router = express.Router();
const controller = EnrollmentController.getInstance();

// Routes
router.post(
    '/',
    authGuard([RoleTypes.STUDENT]),
    enrollInCourseValidators,
    controller.enrollInCourse
);

router.get(
    '/',
    authGuard([RoleTypes.STUDENT]),
    controller.getUserEnrollments
);

router.put(
    '/update-progress',
    authGuard([RoleTypes.STUDENT]),
    updateCourseProgressValidators,
    controller.updateCourseProgress
);

router.delete(
    '/drop/:courseId',
    authGuard([RoleTypes.STUDENT]),
    dropCourseValidators,
    controller.dropCourse
);

router.get(
    '/view-course-content/:courseId',
    authGuard([RoleTypes.STUDENT]),
    viewCourseContentValidators,
    controller.getCourseContents
);



router.get(
    '/view-course-assignments/:courseId',
    authGuard([RoleTypes.STUDENT]),
    viewCourseAssignmentsValidators,
    controller.getCourseAssignments
);

router.get(
    '/view-course-assignment/:courseId/:assignmentId',
    authGuard([RoleTypes.STUDENT]),
    viewCourseAssignmentValidators,
    controller.getCourseAssignment
);

router.post(
    '/complete-study-material',
    authGuard([RoleTypes.STUDENT]),
    markCourseMaterialCompleteValidators,
    controller.completeStudyMaterial
);


export default router;
