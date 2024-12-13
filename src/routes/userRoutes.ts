import express from 'express';
import { UserController } from '../controllers/UserController';
import { authGuard } from '../middleware/authGuard';
import { RoleTypes } from '../types/common.types';
import { createUserValidators, updateUserStatusValidators, updateUserValidators } from './validators/userValidator';
import { validateMongoId } from './validators/sharedValidator';


const router = express.Router();
const controller = UserController.getInstance();

// Admin-only routes
router.post('/', 
    authGuard([RoleTypes.ADMIN]), 
    createUserValidators, 
    controller.createUser
);

router.put('/:id', 
    authGuard([RoleTypes.ADMIN]), 
    validateMongoId,
    updateUserValidators, 
    controller.updateUser
);

router.delete('/:id', 
    authGuard([RoleTypes.ADMIN]), 
    validateMongoId,
    controller.deleteUser
);

router.get('/:id', 
    authGuard([RoleTypes.ADMIN]), 
    validateMongoId,
    controller.getUser
);

router.get('/', 
    authGuard([RoleTypes.ADMIN]), 
    controller.getAllUsers
);

router.get('/role/:role', 
    authGuard([RoleTypes.ADMIN]), 
    controller.getUsersByRole
);

router.put('/user/update-status/', 
    authGuard([RoleTypes.ADMIN]), 
    updateUserStatusValidators,
    controller.updateUserStatus
);



export default router;