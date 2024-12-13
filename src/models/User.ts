import mongoose, { Schema, model } from 'mongoose';
import { IUser } from '../interfaces/IUser';
import { RoleTypes } from '../types/common.types';


export const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, enum: Object.keys(RoleTypes), required: true },
  avatar: { type: String },
  phoneNumber: { type: String },
  active: { type: Boolean, default: true },
  lastLogin: { type: Date },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
}, { timestamps: true });

export const User = model<IUser>('User', userSchema);