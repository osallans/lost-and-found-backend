import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { createIdentityProviderRegistry } from '../factories/identityProviderRegistry.factory';

import { Role } from '../../models/enums/role.enum';
import { AdminService } from '../services/admin.service';
import { UserService } from '../services/user.service';
import { AuthControllerInterface } from '../interfaces/auth.controller.interface';

// Bootstrap services (normally handled by DI)
const userService = new UserService();
const adminService = new AdminService();
const identityProviders = createIdentityProviderRegistry(userService, adminService);
const authService = new AuthService(identityProviders);

export const AuthController:AuthControllerInterface = {
  /**
   * Login Handler
   */
  async loginBasic(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, role } = req.body;

      if (!email || !password || !role) {
        res.status(400).json({ error: 'Missing email, password, or role' });
        return;
      }

      if (!Object.values(Role).includes(role)) {
        res.status(400).json({ error: 'Invalid role' });
        return;
      }

      const tokens = await authService.loginBasic(email, password, role as Role);
      res.json(tokens);
    } catch (error: any) {
      next(error);
    }
  },

  /**
   * Refresh Access Token Handler
   */
  async refreshAccessToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({ error: 'Missing refresh token' });
        return;
      }

      const result = await authService.refreshAccessToken(refreshToken);
      res.json(result);
    } catch (error: any) {
      next(error);
    }
  },

  /**
   * Revoke Session Handler
   */
  async revokeSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sessionId } = req.body;

      if (!sessionId) {
        res.status(400).json({ error: 'Missing session ID' });
        return;
      }

      const result = await authService.revokeSession(sessionId);
      res.json(result);
    } catch (error: any) {
      next(error);
    }
  },
};
