import { Types } from "mongoose";
import { IAssignmentSubmission } from "@lidiayon/sharedlibs";

export interface IAssignmentSubmissionMongo extends Omit<IAssignmentSubmission, "assignment" | "user"> {
    assignment: string | Types.ObjectId;
    user: string | Types.ObjectId;

}
