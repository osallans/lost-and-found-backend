import axios from 'axios';
import { OAuth2Client } from 'google-auth-library';
import { IDPVerifier } from './idpVerifier.interface';
import { loadOpenIdConfiguration } from '../../utils/oidcDiscover.util';

// Instantiate Google OAuth2 Client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const GOOGLE_ISSUER = 'https://accounts.google.com';
export class GoogleVerifier implements IDPVerifier {
  /**
   * Generate Google OAuth2 Authorization URL for redirecting users.
   */
  async getAuthUrl(): Promise<string> {
    const metadata = await loadOpenIdConfiguration(GOOGLE_ISSUER);
    const baseUrl = metadata.authorization_endpoint;
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
    });
    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Handle the callback by extracting the authorization code and exchanging it for tokens.
   */
  async verifyCallback(req: any) {
    const code = req.query.code;
    if (!code) {
      throw new Error('Missing authorization code in callback');
    }
    return this.exchangeAuthorizationCode(code);
  }

  /**
   * Verify an ID Token received from the client.
   */
  async verifyToken(idToken: string) {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) throw new Error('Invalid Google token');
    if (!payload.email) throw new Error('Google token missing email');

    return {
      idpId: payload.sub,
      email: payload.email,
      name: payload.name,
    };
  }

  /**
   * Exchange Authorization Code for Tokens (Supports PKCE if codeVerifier is provided).
   */
  async exchangeAuthorizationCode(code: string, codeVerifier?: string) {
    const metadata = await loadOpenIdConfiguration(GOOGLE_ISSUER);
    const tokenUrl = metadata.token_endpoint;
    const params = new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      grant_type: 'authorization_code',
    });

    // Add PKCE code_verifier if provided
    if (codeVerifier) {
      params.append('code_verifier', codeVerifier);
    }

    const response = await axios.post(tokenUrl, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const { id_token } = response.data;
    if (!id_token) {
      throw new Error('Google exchange failed: No ID Token');
    }

    return this.verifyToken(id_token);
  }
}
