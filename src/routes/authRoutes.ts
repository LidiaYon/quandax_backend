import express from 'express';
import { AuthController } from '../controllers/AuthController';
import { validateLogin } from './validators/loginValidator';
import { validateForgotPassword, validateResetPassword } from './validators/forgotPasswordValidator';
import { registerValidators } from './validators/authRegister';


const router = express.Router();
const authController = AuthController.getInstance();

router.post('/login', validateLogin, authController.login);
router.post('/register', registerValidators, authController.register);

router.post('/forgot-password', validateForgotPassword, authController.forgotPassword);
router.post('/reset-password', validateResetPassword, authController.resetPassword);

export default router;