import { Request, Response, NextFunction } from 'express';
import { readApiKeys } from '../utils/dataSource';

const apiKeys = readApiKeys();

interface UserRole {
    apiKey: string;
    role: "user" | "vendor";
  }
  
  const authenticateUser = (req: Request): UserRole | null => {
    const apiKey = req.headers['api-key'] as string;
    if (apiKey && apiKeys[apiKey as string]) {
      return { apiKey, role: apiKeys[apiKey as string] as any};
    }
    return null;
  };
  
  export const authorize = (role: 'user' | 'vendor') => {
    return (req: Request & { user?: UserRole }, res: Response, next: NextFunction): void => {
      const user = authenticateUser(req);
  
      if (user && user.role === role) {
        req.user = user; // Attach user information to the request if needed in subsequent handlers
        next();
      } else {
        // If not, send a 403 Forbidden response
        res.status(403).json({ success: false, message: `Unauthorized ${role} access` });
      }
    };
  };
