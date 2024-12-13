import { Course } from '../models/Course';
import { ICourseMongo } from '../interfaces/ICourse';
import { BadRequestError, DataExistsError, handleCustomErrors, NotFoundError } from '../utils/errors';
import { CourseContent } from '../models/CourseContent';
import { IAssignment, ICourseContent, RoleTypes } from '@lidiayon/sharedlibs';
import { Document } from 'mongoose';
import { IFilterGetCourses } from '../interfaces/IFilters';
import { Assignment } from '../models/Assignment';
import { IAssignmentMongo } from '../interfaces/IAssignment';


export class CourseService {
    private static instance: CourseService;

    private constructor() { }

    public static getInstance(): CourseService {
        if (!CourseService.instance) {
            CourseService.instance = new CourseService();
        }
        return CourseService.instance;
    }

    createCourse = async (courseData: Partial<ICourseMongo>, tutorId: string): Promise<ICourseMongo> => {
        const existingCourse = await Course.findOne({ code: courseData.code, tutorId });
        if (existingCourse) {
            throw new DataExistsError('Course code already exists');
        }
        const course = new Course({ ...courseData, tutorId });
        return await course.save();
    }

    updateCourse = async (id: string, courseData: Partial<ICourseMongo>): Promise<ICourseMongo | null> => {
        const course = await Course.findByIdAndUpdate(id, courseData, { new: true });
        if (!course) {
            throw new NotFoundError('Course not found');
        }
        return course;
    }

    updateCourseStatus = async (id: string, tutorId: string, newStatus: boolean, userRole: string): Promise<boolean> => {
        const filter: IFilterGetCourses = {
            _id: id
        }
        if (userRole === RoleTypes.TUTOR) {
            filter["tutorId"] = tutorId
        }
    
        const course = await Course.findOne(filter);
   
        if (!course) {
            throw new NotFoundError('Course not found');
        }
        try {
            course.isPublished = newStatus
            await course.save()
            return newStatus
        } catch (error) {
            handleCustomErrors(error, "Error updating course status");
        }
    }

    deleteCourse = async (id: string): Promise<void> => {
        const result = await Course.findByIdAndDelete(id);
        if (!result) {
            throw new NotFoundError('Course not found',);
        }
    }

    getCourse = async (id: string): Promise<ICourseMongo> => {
        const course = await Course.findById(id)
            .populate({
                path: 'content',
                select: 'title description type url durationInMinutes order createdAt updatedAt',
                options: { sort: { order: 1 } } // Sort by order ascending
            });

        if (!course) {
            throw new NotFoundError('Course not found');
        }

        return course;
    }

    getAllCourses = async (filter: IFilterGetCourses): Promise<ICourseMongo[]> => {
        return await Course.find(filter).select("-content");
    }

    addCourseContent = async (courseId: string, tutorId: string, contentData: Partial<ICourseContent>): Promise<ICourseMongo> => {

        const course = await this.fetchCourseDocument(courseId, tutorId);
        if (!course) {
            throw new NotFoundError('Course not found',);
        }

        const content = new CourseContent(contentData);
        await content.save();

        course.content.push(content);
        await course.save();

        return course.populate('content');
    }

    updateCourseContent = async (courseId: string, tutorId: string, contentId: string, contentData: Partial<ICourseContent>): Promise<ICourseContent> => {
        const course = await this.fetchCourseDocument(courseId, tutorId);
        if (!course) {
            throw new NotFoundError('Course not found',);
        }

        if (!course.content.some(id => id.toString() === contentId)) {
            throw new NotFoundError('Content not found in this course');
        }

        const content = await CourseContent.findByIdAndUpdate(
            contentId,
            contentData,
            { new: true }
        );

        if (!content) {
            throw new NotFoundError('Content not found');
        }

        return content;
    }

    deleteCourseContent = async (courseId: string, tutorId: string, contentId: string): Promise<boolean> => {
        try {
            const course = await this.fetchCourseDocument(courseId, tutorId);
            if (!course) {
                throw new NotFoundError('Course not found',);
            }

            if (!course.content.some(id => id.toString() === contentId)) {
                throw new NotFoundError('Content not found in this course');
            }

            await CourseContent.findByIdAndDelete(contentId);

            course.content = course.content.filter(id => id.toString() !== contentId);
            await course.save();
            return true
        } catch (error) {
            handleCustomErrors(error, 'Error deleting content');
        }

    }

    fetchCourse = async (courseId: string, tutorId: string | null = null): Promise<ICourseMongo | null> => {
        try {
            const filters: { [fieldname: string]: any } = {
                _id: courseId
            }
            if (tutorId) {
                filters['tutorId'] = tutorId
            }
            const course = await Course.findOne(filters).lean().exec()
            return course
        } catch (error) {

            throw new NotFoundError("couldnt find course")
        }
    }

    createAssignement = async (detail: IAssignment, tutorId: string): Promise<IAssignmentMongo> => {
        try {
          
            const existingCourse = await this.fetchCourse(detail.course, tutorId)
            if (!existingCourse) {
                throw new NotFoundError('Course Not found',);
            }       
             const assigment = new Assignment({
                title: detail.title,
                description: detail.description,
                dueDate: detail.dueDate,
                questions: detail.questions,
                totalPoints: detail.totalPoints,
                course: detail.course
            })
            return await assigment.save();
        } catch (error) {
            handleCustomErrors(error, "Error creating new assignement");
        }
      

    }

    courseAssignements = async (courseId: string, tutorId: string | null = null): Promise<IAssignmentMongo[]> => {
        try {
          
            const existingCourse = await this.fetchCourse(courseId, tutorId)
            if (!existingCourse) {
                throw new BadRequestError('Course Not found',);
            }       
            return await Assignment.find({course: courseId});
    
        } catch (error) {
            handleCustomErrors(error, "Error getting course assignments");
        }
      

    }

    deleteCourseAssignemnt = async (courseId: string, tutorId: string, assignmentId: string): Promise<boolean> => {
        try {
            const course = await this.fetchCourseDocument(courseId, tutorId);
            if (!course) {
                throw new NotFoundError('Course not found');
            }

            const result = await Assignment.deleteOne({
                course: courseId,
                _id: assignmentId
            })

            return result.deletedCount > 0
         
        } catch (error) {
            handleCustomErrors(error, 'Error deleting assignment');
        }

    }


    getCourseByStudyMaterialId = async ( courseId: string, materialId: string): Promise<ICourseMongo | null> => {
        try {
            const course = await Course.findOne({ _id: courseId, "content": materialId }).populate("content").lean().exec();
            return course
        } catch (error) {
            throw new BadRequestError("Error fetching course by material ID")
        }
    }

    private fetchCourseDocument = async (courseId: string, tutorId: string | null = null): Promise<Document & ICourseMongo> => {
        try {
            const filters: { [fieldname: string]: any } = {
                _id: courseId
            }
            if (tutorId) {
                filters['tutorId'] = tutorId
            }
            const course = await Course.findOne(filters).exec()

            if (!course) throw new NotFoundError("couldnt find course")
            return course
        } catch (error) {
            handleCustomErrors(error, "couldnt find course");
        }
    }
}