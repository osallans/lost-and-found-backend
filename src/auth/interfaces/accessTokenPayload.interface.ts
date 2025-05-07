// src/auth/interfaces/tokenPayload.interface.ts


export interface UserAccessTokenPayload {
  id: string;
  role: 'user' | 'admin' | 'manager';
  email: string;
  facilityIds: string[];
  tokenType: 'access'; // optional if you want to validate the intent
}


  