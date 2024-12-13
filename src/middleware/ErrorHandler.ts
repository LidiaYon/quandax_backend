import { Request, Response, NextFunction } from 'express';
import { BadRequestError, CustomError, UnauthorizedError } from '../utils/errors';
import { validationResult } from 'express-validator';

export const ErrorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {

   if (err instanceof CustomError) {
      res.status(err.status).json({
        error: {
          message: err.message,
          status: err.status
        }
      });
    } else if (Array.isArray(err) && err[0] instanceof validationResult) {
      res.status(400).json({
        error: {
          message: 'Validation Error',
          status: 400,
          details: err.map(e => ({
            field: e.param,
            message: e.msg
          }))
        }
      });
    } else {
      res.status(500).json({
        error: {
          message: 'Internal Server Error',
          status: 500
        }
      });
    }
  };

  
