import { model, Schema } from "mongoose";
import { IMaterialCompletionMongo } from "../interfaces/IMaterialCompletion";

const materialCompletionSchema = new Schema<IMaterialCompletionMongo>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    material: { type: Schema.Types.ObjectId, ref: 'CourseContent', required: true },
    completedAt: { type: Date, default: Date.now, },
  }, { timestamps: true });

  materialCompletionSchema.index({ user: 1, course: 1, material:1 }, { unique: true });

export const MaterialCompletion = model<IMaterialCompletionMongo>('MaterialCompletion', materialCompletionSchema);
