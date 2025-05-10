import axios from 'axios';
import { IDPVerifier } from './idpVerifier.interface';

export class FacebookVerifier implements IDPVerifier {
  /**
   * Generate Facebook OAuth2 Authorization URL for redirecting users.
   * Accepts optional PKCE code_challenge if the client provides it.
   */
  async getAuthUrl(codeChallenge?: string): Promise<string> {
    const baseUrl = 'https://www.facebook.com/v12.0/dialog/oauth';
    const params = new URLSearchParams({
      client_id: process.env.FACEBOOK_CLIENT_ID!,
      redirect_uri: process.env.FACEBOOK_REDIRECT_URI!,
      response_type: 'code',
      scope: 'email public_profile',
    });

    if (codeChallenge) {
      params.append('code_challenge', codeChallenge);
      params.append('code_challenge_method', 'S256');
    }

    return Promise.resolve(`${baseUrl}?${params.toString()}`);
  }

  /**
   * Handle the callback by extracting the authorization code and exchanging it for access token.
   */
  async verifyCallback(req: any) {
    const code = req.query.code;
    if (!code) {
      throw new Error('Missing authorization code in callback');
    }
    return this.exchangeAuthorizationCode(code);
  }

  /**
   * Verifies a Facebook access token by calling the Graph API for user information.
   */
  async verifyToken(accessToken: string) {
    const userInfoUrl = `https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`;
    const { data } = await axios.get(userInfoUrl);

    if (!data.email) {
      throw new Error('Facebook token missing email');
    }

    return {
      idpId: data.id,
      email: data.email,
      name: data.name,
    };
  }

  /**
   * Exchanges the authorization code for an access token and verifies the token.
   * Supports optional PKCE by accepting a codeVerifier.
   */
  async exchangeAuthorizationCode(code: string, codeVerifier?: string) {
    const tokenUrl = 'https://graph.facebook.com/v12.0/oauth/access_token';
    const params = new URLSearchParams({
      client_id: process.env.FACEBOOK_CLIENT_ID!,
      redirect_uri: process.env.FACEBOOK_REDIRECT_URI!,
      code,
    });

    // Include client_secret only if no PKCE is used
    if (!codeVerifier) {
      params.append('client_secret', process.env.FACEBOOK_CLIENT_SECRET!);
    } else {
      params.append('code_verifier', codeVerifier);
    }

    const { data } = await axios.get(`${tokenUrl}?${params.toString()}`);
    const accessToken = data.access_token;

    if (!accessToken) {
      throw new Error('Facebook exchange failed: No access token returned');
    }

    return this.verifyToken(accessToken);
  }
}
