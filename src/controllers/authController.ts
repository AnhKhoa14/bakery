import type { Request, Response } from "express";
import User from "../models/User.js";
import Role from "../models/Role.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
      passwordHash,
      role: customerRole._id,
    });
    const token = jwt.sign(
      { userId: String(user._id) },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d",
      }
    );
    return res.status(201).json({
      token,
      user: {
        id: String(user._id),
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: customerRole.name,
      },
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
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: String(user._id) },
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

//reset password

//login with google

//me

export default { register, login, refreshToken, logout };
