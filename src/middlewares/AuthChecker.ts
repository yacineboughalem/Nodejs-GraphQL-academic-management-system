import { AuthChecker } from "type-graphql";
import { verifyToken } from "../utils/auth";

export const customAuthChecker: AuthChecker<any> = ({ context }, roles) => {
  
  const authHeader = context.req.headers.authorization;
  if (!authHeader) return false;

  const token = authHeader.split(" ")[1];
  try {
    const payload = verifyToken(token);
    context.user = payload;

    if (roles.length === 0) return true;

    return roles.includes(payload.role);
  } catch {
    return false;
  }
};
