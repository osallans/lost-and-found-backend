// src/utils/auth-actor.ts
import { Request } from 'express';
import { UserAccessTokenPayload } from '../auth/interfaces/userAccessTokenPayload.interface';
import { AdminAccessTokenPayload } from '../auth/interfaces/accessTokenPayload.interface';

export type AuthActor = {
  id: string;
  role: string;
  facilityIds: string[];
  type: 'user' | 'admin';
};

export const getCurrentActor = (req: Request): AuthActor => {
  if (req.admin) {
    const { id, role, facilityIds } = req.admin as AdminAccessTokenPayload;
    return { id, role, facilityIds, type: 'admin' };
  }

  if (req.user) {
    const { id, role, facilityIds } = req.user as UserAccessTokenPayload;
    return { id, role, facilityIds, type: 'user' };
  }

  throw new Error('No authenticated user or admin');
};
