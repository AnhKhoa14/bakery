import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JwtPayloadWithRole } from "../types/jwt";
import { AuthRequest } from "../types/auth";

// Middleware xác thực token
export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res
      .status(401)
      .json({ error: "Authorization header missing or malformed" });
    return;
  }

  const idToken = authHeader.split(" ")[1];
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    res.status(500).json({ error: "JWT secret not configured" });
    return;
  }

  try {
    const decoded = jwt.verify(idToken, jwtSecret) as JwtPayloadWithRole;
    req.user = { id: decoded.userId, role: decoded.role };
    next();
  } catch {
    res.status(403).json({ error: "Invalid token" });
  }
};

// Middleware phân quyền theo role
export const allowRoles = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const userRole = req.user?.role;
    if (!userRole || !allowedRoles.map(r => r.toUpperCase()).includes(userRole.toUpperCase())) {
      res
        .status(403)
        .json({ error: "Access denied: insufficient permissions" });
      return;
    }
    next();
  };
};
