import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './middleware/auth';

type AsyncRequestHandler = (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;

export const asyncHandler = (fn: AsyncRequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req as AuthRequest, res, next)).catch(next);
  };
};
