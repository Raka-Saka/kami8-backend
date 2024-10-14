import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: number;
  };
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error('JWT_SECRET is not defined in environment variables');
    res.status(500).json({ message: 'Internal server error' });
    return;
  }

  jwt.verify(token, jwtSecret, (err: jwt.VerifyErrors | null, decoded: any) => {
    if (err) {
      res.status(403).json({ message: 'Invalid or expired token' });
      return;
    }
    
    if (typeof decoded === 'object' && decoded !== null && 'id' in decoded) {
      (req as AuthRequest).user = { id: decoded.id as number };
      next();
    } else {
      res.status(403).json({ message: 'Invalid token payload' });
    }
  });
};
