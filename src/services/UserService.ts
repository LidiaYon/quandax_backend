import { User } from '../models/User';
import { IUser } from '../interfaces/IUser';
import { authUtils } from '../utils/auth.utils';
import { BadRequestError, CustomError, NotFoundError } from '../utils/errors';
import { RoleTypes } from '../types/common.types';

export class UserService {
    private static instance: UserService;

    private constructor() {}

    public static getInstance(): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }

    createUser = async (userData: Partial<IUser>): Promise<{ user: string; password: string }> => {
        const generatedPassword = authUtils.generateRandomPassword();
        const hashedPassword = await authUtils.hashPassword(generatedPassword)
        
        const user = new User({
            ...userData,
            password: hashedPassword,
            active: true
        });

        await user.save();


        return {
            user: user.id,
            password: generatedPassword // This should be sent via email in a real application
        };
    }

    updateUser = async (id: string, userData: Partial<IUser>): Promise<IUser> => {
        const user = await User.findById(id);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        if (userData.password) {
            userData.password = await authUtils.hashPassword(userData.password);
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { ...userData },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            throw new BadRequestError('Failed to update user',);
        }

        return updatedUser;
    }

    deleteUser = async (id: string): Promise<void> => {
        const user = await User.findById(id);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        if (user.role === RoleTypes.ADMIN) {
            // Check if this is the last admin
            const adminCount = await User.countDocuments({ role: RoleTypes.ADMIN });
            if (adminCount <= 1) {
                throw new BadRequestError('Cannot delete the last admin user');
            }
        }

        await User.findByIdAndDelete(id);
    }

    getUser = async (id: string): Promise<IUser> => {
        const user = await User.findById(id).select('-password');
        if (!user) {
            throw new NotFoundError('User not found');
        }
        return user;
    }

    getAllUsers = async (): Promise<IUser[]> => {
        return await User.find().select('-password');
    }

    getUsersByRole = async (role: string): Promise<IUser[]> => {
        return await User.find({ role }).select('-password');
    }
}