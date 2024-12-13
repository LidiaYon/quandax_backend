import { Types } from "mongoose";
import { IEnrollment } from "@lidiayon/sharedlibs";

export interface IEnrollmentMongo extends Omit<IEnrollment, "course"  | "user"> {
    course: string | Types.ObjectId;
    user: string | Types.ObjectId;
}