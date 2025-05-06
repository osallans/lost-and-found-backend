// src/auth/strategies/cognito.strategy.ts

import axios from 'axios';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { IDPVerifier } from './idpVerifier.interface';

export class CognitoVerifier implements IDPVerifier {
  async verifyToken(idToken: string) {
    const decoded = jwt.decode(idToken) as JwtPayload | null;
    if (!decoded) throw new Error('Invalid Cognito token');
    if (!decoded.email || !decoded.sub) throw new Error('Cognito token missing required fields');

    return {
      idpId: decoded.sub,
      email: decoded.email,
      name: decoded.name ?? undefined,
    };
  }

  async exchangeAuthorizationCode(code: string) {
    const tokenUrl = `https://${process.env.COGNITO_DOMAIN}/oauth2/token`;

    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('client_id', process.env.COGNITO_CLIENT_ID!);
    params.append('client_secret', process.env.COGNITO_CLIENT_SECRET!);
    params.append('redirect_uri', process.env.COGNITO_REDIRECT_URI!);
    params.append('code', code);

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    const response = await axios.post(tokenUrl, params, { headers });

    const { id_token } = response.data;
    if (!id_token) {
      throw new Error('Cognito exchange failed: No ID token');
    }

    return this.verifyToken(id_token);
  }
}
