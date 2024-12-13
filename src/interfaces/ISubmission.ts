import { Types } from "mongoose";
import { SubmissionStatusType } from "../types/common.types";

export interface ISubmission {
    assignmentId: Types.ObjectId;
    studentId: Types.ObjectId;
    answers: {
      questionId: string;
      answer: string;
    }[];
    attachments?: string[];
    submittedAt: Date;
    grade?: number;
    feedback?: string;
    status: SubmissionStatusType;
    gradedBy?: Types.ObjectId;
    gradedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
  }