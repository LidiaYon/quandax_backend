import { EnrollmentStatus, IAssignment, IEnrollment } from "@lidiayon/sharedlibs";
import { Enrollment } from "../models/Enrollment";
import { CourseService } from "./CourseService";
import { BadRequestError, CustomError, handleCustomErrors, NotFoundError } from "../utils/errors";
import { Document } from 'mongoose';

import { IEnrollmentMongo } from "../interfaces/IEnrollment";
import { IFilterMongoFields, IFilterStudentCourseEnrollment } from "../interfaces/IFilters";
import { stringToMongoId } from "../utils/dbUtils";
import { ICourseMongo } from "../interfaces/ICourse";
import { IAssignmentMongo } from "../interfaces/IAssignment";
import { AssignmentService } from "./AssignmentService";
import { MaterialCompletion } from "../models/MaterialCompletion";
import { IMaterialCompletionMongo } from "../interfaces/IMaterialCompletion";

export class EnrollmentService {
    private courseService: CourseService;
    private assignmentService: AssignmentService

    constructor() {
        this.courseService = CourseService.getInstance();
        this.assignmentService = AssignmentService.getInstance();
    }
    /**
     * Enroll a user in a course
     * @param userId - ID of the user enrolling
     * @param courseId - ID of the course to enroll in
     * @returns The created enrollment
     */
    async enrollInCourse(userId: string, courseId: string) {
        try {

            // get the course
            const course = await this.courseService.fetchCourse(courseId);
            if (!course) throw new BadRequestError("Course not found")

            if (!course.isPublished) {
                throw new BadRequestError('You cannot enroll to inactive course');
            }

            // Check enrollment limit
            if (course.enrollmentLimit) {
                const currentEnrollments = await Enrollment.countDocuments({
                    courseId,
                    status: { $ne: EnrollmentStatus.DROPPED }
                });

                if (currentEnrollments >= course.enrollmentLimit) {
                    throw new BadRequestError('Course enrollment limit reached');
                }
            }
            // Check if user is already enrolled
            const existingEnrollment = await this.fetchUserEnrollmentToCourseDocument({
                courseId,
                userId
            })



            if (existingEnrollment && existingEnrollment.status !== EnrollmentStatus.DROPPED) {
                throw new BadRequestError('User is already enrolled in this course');
            }

            // we update or creating a new one
            if (!existingEnrollment) {
                // Create new enrollment
                const enrollment = new Enrollment({
                    user: userId,
                    course: courseId,
                    status: EnrollmentStatus.ACTIVE
                });

                return await enrollment.save();
            } else {
                existingEnrollment.status = EnrollmentStatus.ACTIVE
                return await existingEnrollment.save()
            }


        } catch (error) {
            handleCustomErrors(error);

        }
    }

    async getUserEnrollments(userId: string): Promise<IEnrollmentMongo[]> {
        return await Enrollment.find({ user: userId })
            .populate({
                path: 'course',
                select: 'title _id duration' // Specify the fields you want
            })
            .lean()
            .exec();
    }

    async getCompletedCourseContents(userId: string, courseId: string): Promise<IMaterialCompletionMongo[]> {
        return await MaterialCompletion.find({ user: userId, course: courseId })
            .lean()
            .exec();
    }

    async markMaterialComplete(userId: string, courseId: string, materialId: string): Promise<IEnrollmentMongo> {
        // Check if the material belongs to the course
        try {
            const course = await this.courseService.getCourseByStudyMaterialId(courseId, materialId)
            if (!course) throw new NotFoundError("Material does not belong to the course.");
            const enrollment = await this.fetchUserEnrollmentToCourseDocument({
                courseId,
                userId
            })

            if (!enrollment) throw new BadRequestError("User is not enrolled in this course.");

            const alreadyCompleted = await MaterialCompletion.findOne({
                user: userId,
                course: courseId,
                material: materialId
            }).lean().exec()

            if (alreadyCompleted) throw new BadRequestError("Course study is aleady complete")

            // Mark the material as complete
            await MaterialCompletion.create({
                user: userId,
                course: courseId,
                material: materialId,
                completedAt: new Date(),
            });
            // Update progress
            const totalMaterials = course.content.length;
            const completedMaterials = await MaterialCompletion.countDocuments({ user: userId, course: courseId });
            const progress = (completedMaterials / totalMaterials) * 100;

            // Update enrollment progress and status
            enrollment.progress = progress;
            if (progress === 100) enrollment.status = EnrollmentStatus.COMPLETED;
            await enrollment.save();
            return enrollment;

        } catch (error) {
            handleCustomErrors(error, "An unexpected error occurred while marking the material as complete.");

        }


    }



    async updateCourseProgress(
        userId: string,
        courseId: string,
        progress: number
    ): Promise<boolean> {
        try {
            if (progress < 0 || progress > 100) {
                throw new BadRequestError('Progress must be between 0 and 100');
            }
            const enrollment = await this.fetchUserEnrollmentToCourseDocument({
                userId,
                courseId
            })

            if (!enrollment) {
                throw new NotFoundError('Enrollment not found');
            }
            enrollment.progress = progress;

            // Automatically mark as completed if progress reaches 100%
            if (progress === 100) {
                enrollment.status = EnrollmentStatus.COMPLETED;
                enrollment.completedAt = new Date();
            }

            await enrollment.save();
            return true

        } catch (error) {
            handleCustomErrors(error, "Error updating progress");

        }
    }

    /**
     * Drop a course enrollment
     * @param userId - ID of the user
     * @param courseId - ID of the course
     */
    async dropCourse(userId: string, courseId: string): Promise<EnrollmentStatus> {
        try {
            const enrollment = await this.fetchUserEnrollmentToCourseDocument({
                userId,
                courseId
            })
            if (!enrollment) throw new NotFoundError("Enrollment not found")
            enrollment.status = EnrollmentStatus.DROPPED;
            await enrollment.save();
            return EnrollmentStatus.DROPPED
        } catch (error) {

            handleCustomErrors(error, "Error dropping course");


        }
    }

    async getCourseContents(userId: string, courseId: string): Promise<ICourseMongo> {
        try {
            const enrollment = await this.fetchUserEnrollmentToCourse({
                userId,
                courseId
            })
            if (!enrollment) throw new NotFoundError("Enrollment not found")
            return this.courseService.getCourse(courseId)

        } catch (error) {
            handleCustomErrors(error, "Error gettting course content");
        }
    }

    async getCourseAssignments(userId: string, courseId: string): Promise<IAssignmentMongo[]> {
        try {
            const enrollment = await this.fetchUserEnrollmentToCourse({
                userId,
                courseId
            })
            if (!enrollment) throw new NotFoundError("Enrollment not found")
            return this.courseService.courseAssignements(courseId, null)

        } catch (error) {
            handleCustomErrors(error, "Error gettting course content");

        }
    }

    async getCourseAssignment(userId: string, courseId: string, assignemntId: string): Promise<IAssignmentMongo> {
        try {
            const enrollment = await this.fetchUserEnrollmentToCourse({
                userId,
                courseId
            })
            if (!enrollment) throw new NotFoundError("Enrollment not found")
            return this.assignmentService.getAssignment(assignemntId)

        } catch (error) {
    
            handleCustomErrors(error, "Error gettting course content");

        }
    }

    fetchUserEnrollmentToCourse = async (userCourseFilter: IFilterStudentCourseEnrollment): Promise<IEnrollmentMongo | null> => {
        try {
            const filters: IFilterMongoFields = {
                course: stringToMongoId(userCourseFilter.courseId),
                user: stringToMongoId(userCourseFilter.userId)
            }


            return await Enrollment.findOne(filters).lean().exec();

        } catch (error) {
            throw new NotFoundError("couldnt find enrollment")
        }
    }

    private fetchUserEnrollmentToCourseDocument = async (userCourseFilter: IFilterStudentCourseEnrollment): Promise<Document & IEnrollmentMongo | null> => {
        try {
            const filters: IFilterMongoFields = {
                course: userCourseFilter.courseId,
                user: userCourseFilter.userId
            }

            const enrollment = await Enrollment.findOne(filters).exec();

            return enrollment
        } catch (error) {

            throw new NotFoundError("couldnt find enrollment")
        }
    }
}