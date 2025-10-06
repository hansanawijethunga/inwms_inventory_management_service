import type { Request, Response, NextFunction } from 'express';

export function roleAuth(requiredRoles: string[] = []) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const userRoles = req.user.roles || [];
    const hasRole = requiredRoles.some(role => userRoles.includes(role));
    if (!hasRole) {
      return res.status(403).json({ error: 'Insufficient role' });
    }
    next();
  };
}
