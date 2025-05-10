import { Request, Response, NextFunction } from 'express';
import { IDPVerifierFactory } from '../strategies/idpVerifier.factory';
import { IDPType } from '../../models/enums/idpType.enum';
import { IdpAuthControllerInterface } from '../interfaces/idpAuth.interface';

export const IdpAuthController:IdpAuthControllerInterface = {
  
   /**
   * Discovery endpoint listing supported IDPs and their routes.
   */
   async discovery(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.json({
        providers: [
          {
            name: 'google',
            displayName: 'Google',
            supportsPKCE: true,
            authUrl: '/auth/idp/google',
            verifyTokenUrl: '/auth/idp/google/verify-token',
            exchangeCodeUrl: '/auth/idp/google/exchange-code'
          },
          {
            name: 'facebook',
            displayName: 'Facebook',
            supportsPKCE: true,
            authUrl: '/auth/idp/facebook',
            verifyTokenUrl: '/auth/idp/facebook/verify-token',
            exchangeCodeUrl: '/auth/idp/facebook/exchange-code'
          },
          {
            name: 'cognito',
            displayName: 'Cognito',
            supportsPKCE: true,
            authUrl: '/auth/idp/cognito',
            verifyTokenUrl: '/auth/idp/cognito/verify-token',
            exchangeCodeUrl: '/auth/idp/cognito/exchange-code'
          }
        ]
      });
    } catch (error: any) {
      next(error);
    }
  },

  // Existing methods...

    /**
   * Initiates OAuth2 Authorization Flow
   */
  async initiateAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { provider } = req.params;
      const codeChallenge = req.query.code_challenge as string | undefined;
  
      const verifier = IDPVerifierFactory.getVerifier(provider.toUpperCase() as IDPType);
  
      if (!verifier.getAuthUrl) {
        res.status(400).json({ error: 'Unsupported provider for redirect' });
        return;
      }
  
      const redirectUrl = await verifier.getAuthUrl(codeChallenge);
      res.redirect(redirectUrl);
    } catch (error: any) {
      next(error);
    }
  },

  /**
   * Handles OAuth2 Callback
   */
  async handleCallback(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { provider } = req.params;
      const verifier = IDPVerifierFactory.getVerifier(provider.toUpperCase() as IDPType);
      if (!verifier.verifyCallback) {
        res.status(400).json({ error: 'Callback not supported for this provider' });
        return;
      }

      const user = await verifier.verifyCallback(req);
      console.log('king')
      console.log(user)
     
      res.json(user);
    } catch (error: any) {
      next(error);
    }
  },

  /**
   * Verifies an ID Token
   */
  async verifyToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { provider } = req.params;
      const { idToken } = req.body;

      if (!idToken) {
        res.status(400).json({ error: 'Missing idToken' });
        return;
      }

      const verifier = IDPVerifierFactory.getVerifier(provider.toUpperCase() as IDPType);
      const user = await verifier.verifyToken(idToken);
      res.json(user);
    } catch (error: any) {
      next(error);
    }
  },

  /**
   * Exchanges Authorization Code for Tokens
   */
  async exchangeAuthorizationCode(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { provider } = req.params;
      const { code, codeVerifier } = req.body;
  
      if (!code) {
        res.status(400).json({ error: 'Missing code' });
        return;
      }
  
      const verifier = IDPVerifierFactory.getVerifier(provider.toUpperCase() as IDPType);
  
      if (!verifier.exchangeAuthorizationCode) {
        res.status(400).json({ error: 'Code exchange not supported for this provider' });
        return;
      }
  
      // Pass codeVerifier to the verifier implementation
      const user = await verifier.exchangeAuthorizationCode(code, codeVerifier);
      res.json(user);
    } catch (error: any) {
      next(error);
    }
  }
};
