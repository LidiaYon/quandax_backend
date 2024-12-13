import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { EnrollmentService } from "../services/EnrollmentService";
import { AuthenticatedRequest } from "../types/request";
import { RoleTypes } from "@lidiayon/sharedlibs";

export class EnrollmentController {
    private static instance: EnrollmentController;
    private enrollmentService: EnrollmentService;

    private constructor() {
        this.enrollmentService = new EnrollmentService();
    }

    public static getInstance(): EnrollmentController {
        if (!EnrollmentController.instance) {
            EnrollmentController.instance = new EnrollmentController();
        }
        return EnrollmentController.instance;
    }

    enrollInCourse = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const userId = req.user_id!!;
            const { courseId } = req.body;
    

            const enrollment = await this.enrollmentService.enrollInCourse(userId, courseId);
            res.status(201).json(enrollment);
        } catch (error) {
            next(error);
        }
    };

    getUserEnrollments = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (req.role !== RoleTypes.STUDENT) {
                res.status(400).json({"message": "Sorry wrong route!"})
            } else {
                const userId = req.user_id!!;

                const enrollments = await this.enrollmentService.getUserEnrollments(userId);
                res.json(enrollments);
            }
   
        } catch (error) {
            next(error);
        }
    };

    updateCourseProgress = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const userId = req.user_id!!; // Logged-in user ID
            const { courseId, progress } = req.body;

            const result = await this.enrollmentService.updateCourseProgress(userId, courseId, progress);
            res.json({ success: result });
        } catch (error) {
            next(error);
        }
    };

    

    dropCourse = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const userId = req.user_id!!;
            const { courseId } = req.params;

            const status = await this.enrollmentService.dropCourse(userId, courseId);
            res.json({ status });
        } catch (error) {
            next(error);
        }
    };

    getCourseContents = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const userId = req.user_id!!;
            const { courseId } = req.params;

            const enrolledCourse = await this.enrollmentService.getCourseContents(userId, courseId);
            const completedStudyMaterials = await this.enrollmentService.getCompletedCourseContents(userId, courseId)
            res.json({enrolledCourse, completedStudyMaterials });
        } catch (error) {
            next(error);
        }
    };

    getCourseAssignments = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const userId = req.user_id!!;
            const { courseId } = req.params;

            const content = await this.enrollmentService.getCourseAssignments(userId, courseId);
            res.json(content);
        } catch (error) {
            next(error);
        }
    };

    getCourseAssignment = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const userId = req.user_id!!;
            const { courseId, assignmentId } = req.params;

            const content = await this.enrollmentService.getCourseAssignment(userId, courseId, assignmentId);
            res.json(content);
        } catch (error) {
            next(error);
        }
    };

    completeStudyMaterial = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const userId = req.user_id!!;
            const { courseId, materialId } = req.body;

            const enrollmentUpdate = await this.enrollmentService.markMaterialComplete(userId, courseId, materialId);
            res.json(enrollmentUpdate);
        } catch (error) {
            next(error);
        }
    };
}
