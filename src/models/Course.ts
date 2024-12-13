import { model, Schema } from "mongoose";
import { ICourseMongo } from "../interfaces/ICourse";

const courseSchema = new Schema<ICourseMongo>({
    title: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    description: { type: String },
    tutorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    thumbnail: { type: String },
    duration: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },
    enrollmentLimit: { type: Number },
    isPublished: { type: Boolean, default: false },
    tags: [{ type: String }],
    content: [{ type: Schema.Types.ObjectId, ref: 'CourseContent' }]
  }, { timestamps: true });

  export const Course = model<ICourseMongo>('Course', courseSchema);
