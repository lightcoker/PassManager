import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
  email: string;
}

// Create types "UserPayload" to Request
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const setCurrentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // "!req.session?.jwt" 即 !req.session || !req.session.jwt
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;
    req.currentUser = payload;
  } catch (error) {
    console.error(error);
  }

  next();
};
