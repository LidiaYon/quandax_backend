import { Types } from "mongoose";
import { ICourse } from "@lidiayon/sharedlibs";

export interface ICourseMongo extends Omit<ICourse, "tutorId"> {
  tutorId: string | Types.ObjectId;
}