import { Request } from "express";
import { JwtPayloadWithRole } from "./jwt";

export interface AuthRequest extends Request {
  user?: JwtPayloadWithRole;
}
