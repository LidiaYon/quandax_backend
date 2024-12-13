import { Types } from "mongoose";
import { IMaterialCompletion } from "@lidiayon/sharedlibs";

export interface IMaterialCompletionMongo extends Omit<IMaterialCompletion, "course"  | "user" | "material"> {
    course: string | Types.ObjectId;
    user: string | Types.ObjectId;
    material: string | Types.ObjectId;
}