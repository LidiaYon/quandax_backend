
import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthService } from '../services/AuthService';
import { ILoginRequest } from '@lidiayon/sharedlibs'

export class AuthController {
  private static instance: AuthController;
  private authService: AuthService;

  private constructor() {
    this.authService = AuthService.getInstance();
  }

  public static getInstance(): AuthController {
    if (!AuthController.instance) {
      AuthController.instance = new AuthController();
    }
    return AuthController.instance;
  }

  
    login = async (req: Request, res: Response, next: NextFunction)=> {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(400).json({ errors: errors.array() });
        } else {
          const { email, password } = req.body;
          const credentails: ILoginRequest = {
            email,
            password
          }
          const result = await this.authService.login(credentails);
          res.status(200).json(result);
        }
      } catch (error) {
        next(error);
      }
    };

    forgotPassword = async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(400).json({ errors: errors.array() });
        } else {
          const result = await this.authService.forgotPassword(req.body);
          res.status(200).json(result);
        }
      } catch (error) {
        next(error);
      }
    };
  
    resetPassword = async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(400).json({ errors: errors.array() });
        } else {
          const result = await this.authService.resetPassword(req.body);
          res.status(200).json(result);
        }
      } catch (error) {
        next(error);
      }
    };

    register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
              res.status(400).json({ errors: errors.array() });
              return;
          }

          const { user } = await this.authService.createUser(req.body);
          res.status(201).json({ 
              user,
              message: 'Registeration done.'
          });
      } catch (error) {
          next(error);
      }
  }
  }
  