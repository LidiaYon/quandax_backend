import { model, Schema } from "mongoose";
import { IAssignmentSubmissionMongo } from "../interfaces/IAssignmentSubmission";


const assignmentSubmissionSchema = new Schema<IAssignmentSubmissionMongo>({
    assignment: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    answers: [{
      questionId: { type: String, unique: true},
      userAnswer: { type: String },
    }]
  }, { timestamps: true });

  assignmentSubmissionSchema.index({ user: 1, assignment: 1 }, { unique: true });


  export const AssignmentSubmission = model<IAssignmentSubmissionMongo>('AssignmentSubmission', assignmentSubmissionSchema);
