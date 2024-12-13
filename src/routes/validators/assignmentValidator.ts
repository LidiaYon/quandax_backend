import { body } from "express-validator";

export const submitNewAssignmentValidator = [
  // Validate that "assignment" is a valid MongoDB ObjectID
  body("assignment")
    .exists({ checkFalsy: true })
    .withMessage("Assignment ID is required.")
    .isMongoId()
    .withMessage("Assignment ID must be a valid MongoDB ObjectID."),

  // Validate that "user" is a valid MongoDB ObjectID
  body("user")
    .exists({ checkFalsy: true })
    .withMessage("User ID is required.")
    .isMongoId()
    .withMessage("User ID must be a valid MongoDB ObjectID."),

  // Validate that "answers" is an array
  body("answers")
    .exists({ checkFalsy: true })
    .withMessage("Answers are required.")
    .isArray()
    .withMessage("Answers must be an array."),

  // Validate each answer object in the "answers" array
  body("answers.*.questionId")
    .exists({ checkFalsy: true })
    .withMessage("Each answer must have a questionId.")
    .isUUID(4) // Check that the questionId is a valid UUID v4
    .withMessage("Question ID must be a valid UUID v4."),

  body("answers.*.userAnswer")
    .exists({ checkFalsy: true })
    .withMessage("Each answer must have a userAnswer.")
    .isString()
    .withMessage("User answer must be a string."),
];
