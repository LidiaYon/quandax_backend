import { model, Schema } from "mongoose";
import { QuestionType } from "@lidiayon/sharedlibs";
import { IAssignmentMongo } from "../interfaces/IAssignment";

const assignmentSchema = new Schema<IAssignmentMongo>({
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date, required: true },
    totalPoints: { type: Number, required: true },
    questions: [{
      questionId: { type: String, unique: true},
      questionText: { type: String },
      questionType: { type: String, enum: Object.keys(QuestionType)},
      options: [
        {
          value: { type: String, required: true },
          label: { type: String, required: true },
        },
      ],
      correctAnswer: { type: String },
      points: { type: Number }
    }]
  }, { timestamps: true });

  export const Assignment = model<IAssignmentMongo>('Assignment', assignmentSchema);
