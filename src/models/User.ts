import mongoose, { Document, Schema, Types } from "mongoose";

// Định nghĩa interface cho User document
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  phone?: string;
  fullName?: string;
  address?: string;
  role: Types.ObjectId;
  verifyCode?: string;
  isVerified: boolean;
  resetCode?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  expiredCode?: Date;
  forgotPasswordToken?: string;
  forgotPasswordTokenExpiry?: Date;
}

const userSchema: Schema<IUser> = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    fullName: { type: String },
    address: { type: String },
    role: { type: Schema.Types.ObjectId, ref: "Role", required: true },
    verifyCode: { type: String },
    isVerified: { type: Boolean, default: false },
    resetCode: { type: String },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false },
    expiredCode: { type: Date },
    forgotPasswordToken: { type: String },
    forgotPasswordTokenExpiry: { type: Date },
  },
  {
    timestamps: false,
  }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
