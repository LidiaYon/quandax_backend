

export const RoleTypes = {
    ADMIN: 'ADMIN',
    TUTOR: 'TUTOR',
    STUDENT: 'STUDENT'
  } as const;
  
  export const MaterialTypes = {
    VIDEO: 'VIDEO',
    PDF: 'PDF',
  } as const;
  
  export const QuizType = {
    QUIZ: 'QUIZ',
    ESSAY: 'ESSAY',
    CODING: 'CODING',
    FILE: 'FILE'
  } as const;
  
  export const QuestionType = {
    MULTIPLE: 'MULTIPLE',
    ESSAY: 'ESSAY',
    CODE: 'CODE'
  } as const;
  
  export const SubmissionStatusType = {
    SUBMITTED: 'SUBMITTED',
    GRADED: 'GRADED',
    LATE: 'LATE'
  } as const;
  
  export const NotificationType = {
    ASSIGNMENT: 'ASSIGNMENT',
    MESSAGE: 'MESSAGE',
    ANNOUNCEMENT: 'ANNOUNCEMENT'
  } as const;
  
  export const AdminLevels = {
    SUPER: 'SUPER',
    REGULAR: 'REGULAR'
  } as const;
  
  export const Environments = {
    PRODUCTION : "PRODUCTION",
    STAGING : "STAGING",
    DEVELOPMENT : "DEVELOPMENT"
} as const;

  export type RoleTypes = typeof RoleTypes[keyof typeof RoleTypes];
  export type MaterialTypes = typeof MaterialTypes[keyof typeof MaterialTypes];
  export type QuizType = typeof QuizType[keyof typeof QuizType];
  export type QuestionType = typeof QuestionType[keyof typeof QuestionType];
  export type SubmissionStatusType = typeof SubmissionStatusType[keyof typeof SubmissionStatusType];
  export type NotificationType = typeof NotificationType[keyof typeof NotificationType];
  export type AdminLevels = typeof AdminLevels[keyof typeof AdminLevels];
