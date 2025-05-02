// src/auth/interfaces/tokenPayload.interface.ts


export interface AdminAccessTokenPayload {
  adminId: string;
  email: string;
  role: 'ADMIN';
  isSuperAdmin: boolean;
  facilityIds: string[]; // for Admins
}

  