// src/auth/interfaces/tokenPayload.interface.ts


export interface UserAccessTokenPayload {
  userId: string;
  email: string;
  role: 'USER';
  facilityIds: string[]; // for Admins
}

  
  