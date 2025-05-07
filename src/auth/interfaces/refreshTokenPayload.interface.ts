export interface UserRefreshTokenPayload {
  id: string;
  sessionId: string; // unique per login
  tokenType: 'refresh';
}