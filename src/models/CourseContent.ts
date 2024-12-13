import { model, Schema } from "mongoose";
import { ICourseContent } from "@lidiayon/sharedlibs";
import { MaterialTypes } from "@lidiayon/sharedlibs";

const courseContentSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: Object.values(MaterialTypes), required: true },
    url: { type: String, required: true },
    durationInMinutes: { type: Number },
    order: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });

  export const CourseContent = model<ICourseContent>('CourseContent', courseContentSchema);
