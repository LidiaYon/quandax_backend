export interface IFilterMongoFields {
    [fieldname: string]: any
}

export interface IFilterStudentCourseEnrollment {
    courseId: string;
    userId: string
}

export interface IFilterGetCourses {
    _id?: string,
    tutorId?: string
    isPublished?: boolean
}