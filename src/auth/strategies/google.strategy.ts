// src/auth/strategies/google.strategy.ts

import axios from 'axios';
import { OAuth2Client } from 'google-auth-library';
import { IDPVerifier } from './idpVerifier.interface';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class GoogleVerifier implements IDPVerifier {
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

  async exchangeAuthorizationCode(code: string) {
    const tokenUrl = 'https://oauth2.googleapis.com/token';

    const params = new URLSearchParams();
    params.append('code', code);
    params.append('client_id', process.env.GOOGLE_CLIENT_ID!);
    params.append('client_secret', process.env.GOOGLE_CLIENT_SECRET!);
    params.append('redirect_uri', process.env.GOOGLE_REDIRECT_URI!);
    params.append('grant_type', 'authorization_code');

    const response = await axios.post(tokenUrl, params);

    const { id_token } = response.data;
    if (!id_token) {
      throw new Error('Google exchange failed: No ID Token');
    }

    return this.verifyToken(id_token);
  }
}
