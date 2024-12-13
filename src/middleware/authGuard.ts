import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../utils/errors';

import { User } from '../models/User';
import { authUtils } from '../utils/auth.utils';
import { UserService } from '../services/UserService';
import { AuthenticatedRequest } from '../types/request';

/*
return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.sendStatus(401); // Unauthorized
    }

    try {
   

        // not a super admin. So what can they do for the company?
        const companyId = (req.query.company_id as string) ?? "";
      
        const companyData = await CompanyService.getCompanyInfo(companyId);
     
        if (companyData.status !== EStatus.active) {
          return res.sendStatus(401)
        }
        const companyUser = companyData.users.find(
            (u) => u.user.toString() === user.id
          );
    
          if (!companyUser) {
            return res.sendStatus(401);
          }
          req.company_id = companyId;

           // Check if the user is a company admin
        if (companyUser.is_company_admin) {
        return next(); // Proceed if user is a company admin
        }
    
       // Check if the user has any of the allowed permissions
       const userPermissions = companyUser.permissions;
       const hasRequiredPermission = permissionsToCheck.some(permission => userPermissions.includes(permission));
 
       if (!hasRequiredPermission) {
         return res.sendStatus(401); // Forbidden
       }
 
      req.user_id = user.id;
      next();
    } catch (err) {
      res.sendStatus(401); 
    }
  };
  */




const userSerivce = UserService.getInstance()

export const authGuard = (roles: string[]) => {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            throw new UnauthorizedError('Authentication required');
        }


        try {
            const tokenPayLoad = authUtils.verifyToken(token);
            const user = await userSerivce.getUser(tokenPayLoad.userId.toString());
            if (!user.active) {
                throw new UnauthorizedError('Account is inactive or not found');
            }

            const userRole = user.role;
            if (!userRole || !roles.includes(userRole)) {
                throw new UnauthorizedError('Insufficient permissions');
            }
            req.user_id = user._id.toString();
            req.role = user.role
            next();
        } catch (error) {
            next(error);
        }
    };
};