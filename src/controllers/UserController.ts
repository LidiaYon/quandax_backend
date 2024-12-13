import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';
import { validationResult } from 'express-validator';
import { IUser } from '../interfaces/IUser';
import { AuthenticatedRequest } from '../types/request';

export class UserController {
    private static instance: UserController;
    private userService: UserService;

    private constructor() {
        this.userService = UserService.getInstance();
    }

    public static getInstance(): UserController {
        if (!UserController.instance) {
            UserController.instance = new UserController();
        }
        return UserController.instance;
    }

    createUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const { user, password } = await this.userService.createUser(req.body);
            res.status(201).json({ 
                user,
                initialPassword: password, // In production, this should be sent via email
                message: 'User created successfully. Initial password should be changed upon first login.'
            });
        } catch (error) {
            next(error);
        }
    }

    updateUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const user = await this.userService.updateUser(req.params.id, req.body);
            res.json(user);
        } catch (error) {
            next(error);
        }
    }

    updateUserStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const {userId, newStatus } = req.body;

            const updatedUserInfo : Partial<IUser> = {
                active: newStatus
            }


            const user = await this.userService.updateUser(userId, updatedUserInfo);
            res.json({ok: true});
        } catch (error) {
            next(error);
        }
    }

    deleteUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            await this.userService.deleteUser(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    getUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const user = await this.userService.getUser(req.params.id);
            res.json(user);
        } catch (error) {
            next(error);
        }
    }

    getAllUsers = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const users = await this.userService.getAllUsers();
            res.json(users);
        } catch (error) {
            next(error);
        }
    }

    getUsersByRole = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const users = await this.userService.getUsersByRole(req.params.role);
            res.json(users);
        } catch (error) {
            next(error);
        }
    }
}