import axios from 'axios';
import { IDPVerifier } from './idpVerifier.interface';
import { loadOpenIdConfiguration } from '../../utils/oidcDiscover.util';
const jwtDecode = require('jwt-decode');

const COGNITO_ISSUER = process.env.COGNITO_DOMAIN!;
export class CognitoVerifier implements IDPVerifier {
  /**
   * Generate Cognito OAuth2 Authorization URL for redirecting users.
   * Optionally accepts PKCE code_challenge.
   */
  async getAuthUrl(codeChallenge?: string): Promise<string> {
    const metadata = await loadOpenIdConfiguration(COGNITO_ISSUER);
    const baseUrl = metadata.authorization_endpoint;
    const params = new URLSearchParams({
      client_id: process.env.COGNITO_CLIENT_ID!,
      redirect_uri: process.env.COGNITO_REDIRECT_URI!,
      response_type: 'code',
      scope: 'openid email profile',
    });

    if (codeChallenge) {
      params.append('code_challenge', codeChallenge);
      params.append('code_challenge_method', 'S256');
    }

    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Handle the callback by extracting the authorization code and exchanging it.
   */
  async verifyCallback(req: any) {
    const code = req.query.code;
    if (!code) {
      throw new Error('Missing authorization code in callback');
    }
    return this.exchangeAuthorizationCode(code);
  }

  /**
   * Verifies an ID Token.
   */
  async verifyToken(idToken: string) {
    const decoded: any = jwtDecode(idToken);
    if (!decoded.email) {
      throw new Error('Cognito token missing email');
    }

    return {
      idpId: decoded.sub,
      email: decoded.email,
      name: decoded.name,
    };
  }

  /**
   * Exchanges Authorization Code for Tokens and verifies the returned ID Token.
   * Supports PKCE by accepting a codeVerifier.
   */
  async exchangeAuthorizationCode(code: string, codeVerifier?: string) {
    const metadata = await loadOpenIdConfiguration(COGNITO_ISSUER);
    const tokenUrl = metadata.token_endpoint;
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.COGNITO_CLIENT_ID!,
      redirect_uri: process.env.COGNITO_REDIRECT_URI!,
      code,
    });

    // Include client_secret only if PKCE is not used
    if (!codeVerifier) {
      params.append('client_secret', process.env.COGNITO_CLIENT_SECRET!);
    } else {
      params.append('code_verifier', codeVerifier);
    }

    const response = await axios.post(tokenUrl, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const { id_token } = response.data;
    if (!id_token) {
      throw new Error('Cognito exchange failed: No ID Token');
    }

    return this.verifyToken(id_token);
  }
}
