import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { TokenPayload } from '@lidiayon/sharedlibs';
import { getEnvVariable } from './getEnvVariable';
import { UnauthorizedError } from './errors';
import crypto from 'crypto';

export const authUtils = {
    comparePasswords: async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
      return await bcrypt.compare(plainPassword, hashedPassword);
    },
  
    hashPassword: async (password: string): Promise<string> => {
      const salt = await bcrypt.genSalt(10);
      return await bcrypt.hash(password, salt);
    },  
    generateToken: (payload: TokenPayload): string => {
      const { exp, iat, ...rest } = payload; // Remove `exp` and `iat`
      return jwt.sign(
        rest,
        getEnvVariable("JWT_SECRET"),
        { expiresIn: getEnvVariable("TOKEN_EXPIRES_IN_HOUR") || "24h" }
      );
    },
  
    verifyToken: (token: string): TokenPayload => {
      try {
        return jwt.verify(token, getEnvVariable("JWT_SECRET")) as TokenPayload;
      } catch (error) {
        throw new Error('Invalid token');
      }
    },

    generateResetToken: (email: string): string => {
        return jwt.sign(
          { email },
          getEnvVariable("JWT_SECRET"),
          { expiresIn: getEnvVariable("FORGOT_PWD_TOKEN_EXPIRES_IN_HOUR") || "24h"  }
        );
  },

  verifyResetToken: (token: string): { email: string } => {
    try {
      return jwt.verify(token, getEnvVariable("JWT_SECRET")) as { email: string };
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired reset token');
    }
  },

  generateRandomPassword : (length: number = 10): string => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, charset.length);
        password += charset[randomIndex];
    }
    return password;
}
}