export interface IDPVerifier {
  /**
   * Generate an authorization URL.
   * Accepts optional codeChallenge for PKCE support.
   */
  getAuthUrl?(codeChallenge?: string):  Promise<string>;

  /**
   * Handle the OAuth callback.
   */
  verifyCallback?(req: any): Promise<any>;

  /**
   * Verifies an ID Token.
   */
  verifyToken(idToken: string): Promise<{ idpId: string; email: string; name?: string }>;

  /**
   * Exchanges an authorization code for tokens.
   * Accepts optional codeVerifier for PKCE support.
   */
  exchangeAuthorizationCode?(code: string, codeVerifier?: string): Promise<{ idpId: string; email: string; name?: string }>;
}
