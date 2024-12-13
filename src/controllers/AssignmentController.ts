import { Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { AuthenticatedRequest } from "../types/request";

import { AssignmentService } from "../services/AssignmentService";

export class AssignmentController {
    private static instance: AssignmentController;
    private assignmentService: AssignmentService;

    private constructor() {
        this.assignmentService = AssignmentService.getInstance();
    }

    public static getInstance(): AssignmentController {
        if (!AssignmentController.instance) {
            AssignmentController.instance = new AssignmentController();
        }
        return AssignmentController.instance;
    }

    submitAnswer = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const userId = req.user_id!!;
         
            const result = await this.assignmentService.submitAssignment(req.body, userId);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    };

   


}
