import { Request, Response, NextFunction } from 'express';

export interface IdpAuthControllerInterface {
  
    discovery(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
   * Initiates the OAuth2 flow by redirecting to the provider's authorization URL.
   */
  initiateAuth(req: Request, res: Response, next: NextFunction): Promise<void>;

  /**
   * Handles the callback from the provider after the user authorizes.
   */
  handleCallback(req: Request, res: Response, next: NextFunction): Promise<void>;

  /**
   * Verifies an ID token provided by the client.
   */
  verifyToken(req: Request, res: Response, next: NextFunction): Promise<void>;

  /**
   * Exchanges an authorization code for tokens.
   */    

  exchangeAuthorizationCode(req: Request, res: Response, next: NextFunction): Promise<void>;

}
