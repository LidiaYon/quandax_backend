// src/utils/errors/custom.error.ts
export class CustomError extends Error {
    public status: number;
  
    constructor(message: string, status: number) {
      super(message);
      this.status = status;
      this.name = this.constructor.name;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  
  export class UnauthorizedError extends CustomError {
    constructor(message: string = 'Unauthorized') {
      super(message, 401);
    }
  }
  

  export class BadRequestError extends CustomError {
    constructor(message: string = 'Bad Request') {
      super(message, 400);
    }
  }
  
  
  export class NotFoundError extends CustomError {
    constructor(message: string = 'Not Found') {
      super(message, 404);
    }
  }
  

  export class ForbiddenError extends CustomError {
    constructor(message: string = 'Forbidden') {
      super(message, 403);
    }
  }

  export class DataExistsError extends CustomError {
    constructor(message: string = 'Forbidden') {
      super(message, 409);
    }
  }


export function handleCustomErrors(error: unknown, defaultMessage : string = "Unexpected error occurred"): never {
  if (error instanceof CustomError) {
      throw error;
  }

  if (error instanceof Error) {
      throw new BadRequestError(error.message);
  }

  // For completely unexpected errors
  throw new BadRequestError(defaultMessage === "" ? "unexpected error happend" : defaultMessage);
}


  