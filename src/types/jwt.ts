import { JwtPayload } from "jsonwebtoken";

export interface JwtPayloadWithRole extends JwtPayload {
  id: string;
  role: string;
}
