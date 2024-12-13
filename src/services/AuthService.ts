import { IUser, TokenPayload } from "@lidiayon/sharedlibs";
import { IForgotPasswordRequest, IForgotPasswordResponse, ILoginRequest, ILoginResponse, IResetPasswordRequest } from "@lidiayon/sharedlibs"
import { User } from "../models/User";
import { authUtils } from '../utils/auth.utils';
import { UnauthorizedError } from "../utils/errors";

export class AuthService {
  private static instance: AuthService;

  private constructor() { } //we dnt need new instanes

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }


  login = async (credentials: ILoginRequest): Promise<ILoginResponse> => {
    const user = await User.findOne({ email: credentials.email });
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    if (!user.active) {
      throw new UnauthorizedError('Invalid credentials');

    }

    const isValidPassword = await authUtils.comparePasswords(credentials.password, user.password)
    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid credentials');
    }

 

    const token = authUtils.generateToken({
      userId: user.id,
      role: user.role,
      exp: 0, // just place holder
      iat: 0
    })

    return {
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    };
  }

  forgotPassword = async (request: IForgotPasswordRequest): Promise<IForgotPasswordResponse> => {
    const user = await User.findOne({ email: request.email });
    if (!user) {
      return { message: 'If your email is registered, you will receive a password reset link' };
    }

    const resetToken = authUtils.generateResetToken(user.email);


    await User.updateOne(
      { email: user.email },
      {
        resetPasswordToken: await authUtils.hashPassword(resetToken),
        resetPasswordExpires: new Date(Date.now() + 3600000)
      }
    );

    // TODO: Send email with reset link


    return { message: 'If your email is registered, you will receive a password reset link' };
  };

  createUser = async (userData: Partial<IUser>): Promise<{ user: string; }> => {
    const hashedPassword = await authUtils.hashPassword(userData.password!!)

    const user = new User({
      ...userData,
      password: hashedPassword,
      active: false
    });

    await user.save();


    return {
      user: user.id,
    };
  }

  resetPassword = async (request: IResetPasswordRequest): Promise<IForgotPasswordResponse> => {
    const { email } = authUtils.verifyResetToken(request.token);

    const user = await User.findOne({
      email,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      throw new UnauthorizedError('Invalid or expired reset token');
    }


    const hashedPassword = await authUtils.hashPassword(request.newPassword);

 
    await User.updateOne(
      { email },
      {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null
      }
    );

    return { message: 'Password has been reset successfully' };
  }
}