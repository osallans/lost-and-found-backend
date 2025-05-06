// src/auth/strategies/facebook.strategy.ts

import axios from 'axios';
import { IDPVerifier } from './idpVerifier.interface';

export class FacebookVerifier implements IDPVerifier {
  async verifyToken(accessToken: string) {
    const debugUrl = `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`;
    const debugResponse = await axios.get(debugUrl);
    const data = debugResponse.data.data;

    if (!data.is_valid) {
      throw new Error('Invalid Facebook token');
    }

    const profileUrl = `https://graph.facebook.com/me?fields=id,email,name&access_token=${accessToken}`;
    const profileResponse = await axios.get(profileUrl);

    const profile = profileResponse.data;

    if (!profile.email) {
      throw new Error('Facebook token missing email');
    }

    return {
      idpId: profile.id,
      email: profile.email,
      name: profile.name,
    };
  }

  async exchangeAuthorizationCode(code: string) {
    const tokenUrl = `https://graph.facebook.com/v12.0/oauth/access_token`;
    const params = new URLSearchParams();
    params.append('client_id', process.env.FACEBOOK_APP_ID!);
    params.append('client_secret', process.env.FACEBOOK_APP_SECRET!);
    params.append('redirect_uri', process.env.FACEBOOK_REDIRECT_URI!);
    params.append('code', code);

    const response = await axios.get(tokenUrl + '?' + params.toString());

    const { access_token } = response.data;
    if (!access_token) {
      throw new Error('Facebook exchange failed: No access token');
    }

    return this.verifyToken(access_token);
  }
}
