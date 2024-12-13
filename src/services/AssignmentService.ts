import { BadRequestError, CustomError, handleCustomErrors, NotFoundError } from '../utils/errors';
import {  IAssignmentSubmission, IAssignmentSubmissionResult, ICourseContent, RoleTypes } from '@lidiayon/sharedlibs';
import { Document } from 'mongoose';
import { Assignment } from '../models/Assignment';
import { IAssignmentMongo } from '../interfaces/IAssignment';
import { calculateAssignmentGrade } from '../utils/assignment.utils';


export class AssignmentService {
    private static instance: AssignmentService;

    private constructor() { }

    public static getInstance(): AssignmentService {
        if (!AssignmentService.instance) {
            AssignmentService.instance = new AssignmentService();
        }
        return AssignmentService.instance;
    }

    getAssignment = async (assignmentId: string) : Promise<IAssignmentMongo> => {
        try {
            const assignment = await this.fetchAssignment(assignmentId)
            if (!assignment) throw new NotFoundError("Assignment not found")
            return assignment
        } catch (error) {
           handleCustomErrors(error);
        }

    }

    /*
    TODO: as we extend, use to permanently save answers if needed.
    */
    submitAssignment = async (submission: IAssignmentSubmission, userId: string) : Promise<IAssignmentSubmissionResult> => {
        if (submission.user !== userId) throw new BadRequestError("Fraud possibly.")
         try {
            const assigment = await this.getAssignment(submission.assignment)
            /*
            const result = new AssignmentSubmission(submission)
            await result.save()
            */
            //calculate.
            return calculateAssignmentGrade(submission, assigment)
         } catch (error) {
            handleCustomErrors(error, "There was an error submitting your answers")
         }
    }

    private fetchAssignment = async (id: string): Promise<IAssignmentMongo | null> => {
        try {
          
            const assignment = await Assignment.findById(id).lean().exec()

            return assignment
        } catch (error) {

            throw new NotFoundError("couldnt find assignment")
        }
    }
}
