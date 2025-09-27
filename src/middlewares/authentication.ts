import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Tạo interface để mở rộng Request (thêm user)
export interface AuthRequest extends Request {
  user?: string | JwtPayload;
}

// Middleware xác thực token
export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Authorization header missing or malformed" });
    return;
  }

  const idToken = authHeader.split("Bearer ")[1];
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    res.status(500).json({ error: "JWT secret not configured" });
    return;
  }

  try {
    const decoded = jwt.verify(idToken, jwtSecret);
    req.user = decoded; // gán payload vào req.user
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid token" });
  }
};

// Middleware phân quyền theo role
export const allowRoles = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const userRole = (req.user as any)?.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      res.status(403).json({ error: "Access denied: insufficient permissions" });
      return;
    }
    next();
  };
};
