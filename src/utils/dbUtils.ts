import { Types } from "mongoose";


export function stringToMongoId(input: string): Types.ObjectId {
  
 return new Types.ObjectId(input);
}