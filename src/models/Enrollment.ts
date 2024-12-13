import { EnrollmentStatus } from "@lidiayon/sharedlibs";
import { model, Schema } from "mongoose";
import { IEnrollmentMongo } from "../interfaces/IEnrollment";

const enrollmentSchema = new Schema<IEnrollmentMongo>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    status: { 
      type: String, 
      enum: Object.values(EnrollmentStatus), 
      default: EnrollmentStatus.PENDING 
    },
    enrolledAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    progress: { type: Number, default: 0, min: 0, max: 100 }
  }, { timestamps: true });

   enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

export const Enrollment = model<IEnrollmentMongo>('Enrollment', enrollmentSchema);
