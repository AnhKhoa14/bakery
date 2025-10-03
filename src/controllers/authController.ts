import type { Request, Response } from "express";
import User from "../models/User.js";
import Role from "../models/Role.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendConfirmationEmail, sendForgotPasswordEmail } from "../utils/mailer.js";
import { randomBytes, randomInt } from "crypto";
import Cart from "../models/Cart.js";

//register
export async function register(req: Request, res: Response) {
  try {
    const { username, fullName, email, password } = req.body as {
      username: string;
      fullName: string;
      email: string;
      password: string;
    };
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const customerRole = await Role.findOne({ name: "CUSTOMER" });
    if (!customerRole) {
      return res.status(500).json({ message: "Default role not found" });
    }
    const user = await User.create({
      username,
      fullName,
      email,
      password: passwordHash,
      role: customerRole._id,
      isVerified: false,
    });
    const verifyCode = randomInt(100000, 999999).toString();
    user.verifyCode = verifyCode;
    user.expiredCode = new Date(Date.now() + 10 * 60 * 1000); // 10 phút
    await user.save();
    //send email
    await sendConfirmationEmail(user.email, user.fullName || user.username, verifyCode);
    //tạo cart cho user
    const cart = new Cart({ user: user._id });
    await cart.save();
    return res.status(201).json({
      message: "Registration successfully. Please check your email for verification code",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Registration failed" });
  }
}

//login
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ email }).populate("role");
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Ensure role is populated and has a name property
    const roleName =
      typeof user.role === "object" && "name" in user.role
        ? (user.role as { name: string }).name
        : undefined;

    const token = jwt.sign(
      { userId: String(user._id), role: roleName },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      token,
      user: {
        id: String(user._id),
        fullName: user.fullName,
        email: user.email,
        role: roleName,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Login failed" });
  }
}
//refresh token
export async function refreshToken(req: Request, res: Response) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const newToken = jwt.sign(
      { userId: String(user._id) },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d",
      }
    );
    return res.status(200).json({ token: newToken });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to refresh token" });
  }
}
//logout
export async function logout(req: Request, res: Response) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  // Invalidate token logic can be implemented here if using a token blacklist
  return res.status(200).json({ message: "Logged out successfully" });
}
//forgot password
export async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body as { email: string };
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const forgotPasswordToken = randomBytes(16).toString("hex").toUpperCase(); //6 ký tự
    const forgotPasswordTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 phút
    user.forgotPasswordToken = forgotPasswordToken;
    user.forgotPasswordTokenExpiry = forgotPasswordTokenExpiry;
    await user.save();
    // Send email with forgotPasswordToken
    await sendForgotPasswordEmail(
      user.email,
      user.fullName || user.username,
      forgotPasswordToken
    );
    return res.status(200).json({ message: "Forgot password email sent" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Forgot password failed" });
  }
}
//reset password
export async function resetPassword(req: Request, res: Response) {
  try {
    const { email, token, newPassword } = req.body as {
      email: string;
      token: string;
      newPassword: string;
    };
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user.forgotPasswordToken !== token.toUpperCase()) {
      return res.status(400).json({ message: "Invalid token" });
    }
    if (
      !user.forgotPasswordTokenExpiry ||
      user.forgotPasswordTokenExpiry < new Date()
    ) {
      return res.status(400).json({ message: "Token expired" });
    }
    // if(newPassword.length < 8){
    //   return res.status(400).json({ message: "Password must be at least 8 characters" });
    // }
    user.password = await bcrypt.hash(newPassword, 10);
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;
    await user.save();
    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Password reset failed" });
  }
}
//login with google

//me
export async function me(req: Request, res: Response) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to retrieve user" });
  }
}

//verify code
export async function verifyCode(req: Request, res: Response) {
  try {
    const { email, code } = req.body as { email: string; code: string };
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user.verifyCode !== code) {
      return res.status(400).json({ message: "Invalid code" });
    }
    if (!user.expiredCode || user.expiredCode < new Date()) {
      return res.status(400).json({ message: "Code expired" });
    }
    user.isVerified = true;
    user.verifyCode = undefined;
    user.expiredCode = undefined;
    await user.save();
    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export default {
  register,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  me,
  verifyCode
};
