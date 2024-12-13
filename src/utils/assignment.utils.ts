import { IAssignment, IAssignmentSubmission, IAssignmentSubmissionResult } from "@lidiayon/sharedlibs";
import { IAssignmentMongo } from "../interfaces/IAssignment";

export function calculateAssignmentGrade(
  submission: IAssignmentSubmission,
  assignment: IAssignmentMongo
): IAssignmentSubmissionResult {
  // Initialize the total score
  const result: IAssignmentSubmissionResult = {
    inCorrectlyAnsweredQuestions: [],
    finalScore: 0,
    totalFlawedQuestions: 0,
    outOf: assignment.totalPoints
  }


  for (const answer of submission.answers) {
    // Find the corresponding question in the assignment
    const question = assignment.questions.find(
      (q) => q.questionId === answer.questionId
    );

    if (question) {
      // Check if the user's answer matches the correct answer
      if (question.correctAnswer && answer.userAnswer === question.correctAnswer) {
        // Add the question's points to the total score
        result.finalScore += question.points;
      } else {
        result.inCorrectlyAnsweredQuestions.push(question)
      }
    } else {
      // Log a warning or handle the case where the question is not found
      result.totalFlawedQuestions +=  1
    }
  }

  return result;
}
