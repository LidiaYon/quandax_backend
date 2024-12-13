import { Request, Response, NextFunction } from 'express';
import { CourseService } from '../services/CourseService';
import { validationResult } from 'express-validator';
import { ICourseContent, RoleTypes } from '@lidiayon/sharedlibs';
import { MaterialTypes } from '../types/common.types';
import { IFilterGetCourses } from '../interfaces/IFilters';
import { AuthenticatedRequest } from '../types/request';

export class CourseController {
    private static instance: CourseController;
    private courseService: CourseService;

    private constructor() {
        this.courseService = CourseService.getInstance();
    }

    public static getInstance(): CourseController {
        if (!CourseController.instance) {
            CourseController.instance = new CourseController();
        }
        return CourseController.instance;
    }

    createCourse = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }
            const course = await this.courseService.createCourse(req.body, req.user_id!!);
            res.status(201).json(course);
        } catch (error) {
            next(error);
        }
    }

    updateCourse = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }
            const course = await this.courseService.updateCourse(req.params.id, req.body);
            res.json(course);
        } catch (error) {
            next(error);
        }
    }

    updateCourseStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }
            const { newStatus } = req.body;

            const course = await this.courseService.updateCourseStatus(req.params.id, req.user_id!!, newStatus, req.role!!);
            res.status(201).json(course);
        } catch (error) {
            next(error);
        }
    }

    deleteCourse = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }
            await this.courseService.deleteCourse(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    getCourse = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }
            const course = await this.courseService.getCourse(req.params.id);
            res.json(course);
        } catch (error) {
            next(error);
        }
    }

    getAllCourses = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const filter : IFilterGetCourses = {
            }
            if (req.role === RoleTypes.TUTOR) {
                filter["tutorId"] = req.user_id
            } else if (req.role === RoleTypes.STUDENT) {
                filter["isPublished"] = true
            }
            const courses = await this.courseService.getAllCourses(filter);
            res.json(courses);
        } catch (error) {
            next(error);
        }
    }

    addCourseContent = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
    
            const errors = validationResult(req);
        
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }
            const courseId = req.params.courseId;
            const file = req.file;
            if (!file) {
                res.status(400).json("no file uploaded")
            } else {
                const contentData: Partial<ICourseContent> = {
                    title: req.body.title,
                    description: req.body.description,
                    type: file.mimetype.startsWith('video/') ? MaterialTypes.VIDEO : MaterialTypes.PDF,
                    url: file.path,
                    order: parseInt(req.body.order),
                    durationInMinutes: req.body.durationInMinutes ? parseInt(req.body.durationInMinutes) : undefined
                };

                const content = await this.courseService.addCourseContent(courseId,req.user_id!!, contentData);
                res.status(201).json(content);
            }
           
        } catch (error) {
            next(error);
        }
    }
    
    updateCourseContent = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }
            const { courseId, contentId } = req.params;
            const content = await this.courseService.updateCourseContent(courseId,req.user_id!!, contentId, req.body);
            res.json(content);
        } catch (error) {
            next(error);
        }
    }
    
    deleteCourseContent = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }
            const { courseId, contentId } = req.params;
            await this.courseService.deleteCourseContent(courseId,req.user_id!!, contentId);
            res.status(204).json({ok: true});
        } catch (error) {
            next(error);
        }
    }

    createCourseAssignment = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }
            const b = await this.courseService.createAssignement(req.body,req.user_id!!);
            res.status(200).json({ok: true});
        } catch (error) {
            next(error);
        }
    }

    getAssignments = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }
        
            const tutorId = req.user_id!!
            const { courseId } = req.params
            const courses = await this.courseService.courseAssignements(courseId, tutorId);
            res.json(courses);
        } catch (error) {
            next(error);
        }
    }

    deleteCourseAssignment = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }
            const { courseId, assignmentId } = req.params;
            const result = await this.courseService.deleteCourseAssignemnt(courseId,req.user_id!!, assignmentId);
            if (result) {
                res.status(204).json({ok: true});
            } else {
                res.status(400).json({ok: false})
            }
           
        } catch (error) {
            next(error);
        }
    }
    
}