// src/auth/strategies/idpVerifier.interface.ts

export interface IDPVerifier {
  verifyToken(idToken: string): Promise<{ idpId: string, email: string, name?: string }>;
  exchangeAuthorizationCode?(code: string): Promise<{ idpId: string, email: string, name?: string }>;
}
  