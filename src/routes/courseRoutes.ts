import express from 'express';
import { CourseController } from '../controllers/CourseController';
import { authGuard } from '../middleware/authGuard';
import { RoleTypes } from '../types/common.types';
import { validateMongoId } from './validators/sharedValidator';
import { courseAssignmentsValidator, courseContentValidators, createCourseValidators, updateCourseStatusValidators } from './validators/courseValidator';
import { fileUploader } from '../utils/fileupload';


const router = express.Router();
const controller = CourseController.getInstance();

router.post('/', authGuard([RoleTypes.TUTOR]), createCourseValidators, controller.createCourse);
router.put('/:id', authGuard([RoleTypes.TUTOR]), validateMongoId,createCourseValidators, controller.updateCourse);
router.delete('/:id', authGuard([RoleTypes.ADMIN]),validateMongoId, controller.deleteCourse);
router.put('/update-stauts/:id', authGuard([RoleTypes.ADMIN]), validateMongoId,updateCourseStatusValidators, controller.updateCourse);

router.put('/update-status/:id', 
    authGuard([RoleTypes.ADMIN]), 
    validateMongoId,
    updateCourseStatusValidators,
    controller.updateCourseStatus
);


router.get('/:id',validateMongoId, controller.getCourse);
router.get('/',authGuard([RoleTypes.TUTOR, RoleTypes.ADMIN, RoleTypes.STUDENT]), controller.getAllCourses);
router.post('/add-content/:courseId', authGuard([RoleTypes.TUTOR]), fileUploader.single('file'),courseContentValidators.addContent, controller.addCourseContent);
router.put('/edit-content/:courseId/:contentId', authGuard([RoleTypes.TUTOR]), courseContentValidators.updateContent, controller.updateCourseContent);
router.delete('/delete-content/:courseId/:contentId', authGuard([RoleTypes.TUTOR]), courseContentValidators.deleteContent, controller.deleteCourseContent);

router.post('/assignments/new', authGuard([RoleTypes.TUTOR]), courseAssignmentsValidator.createNew, controller.createCourseAssignment);
router.get('/assignments/:courseId', authGuard([RoleTypes.TUTOR]), courseAssignmentsValidator.viewCourseAssignments, controller.getAssignments);
router.delete('/assignments/:courseId/:assignmentId', authGuard([RoleTypes.TUTOR]), courseAssignmentsValidator.deleteAssignment, controller.deleteCourseAssignment);



export default router;