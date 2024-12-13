import { Types } from "mongoose";
import { IAssignment } from "@lidiayon/sharedlibs";

export interface IAssignmentMongo extends Omit<IAssignment, "course"> {
  course: string | Types.ObjectId;
}
