import { AuthIdentity } from './authIdentity.interface';

export interface IdentityProvider {
  /**
   * Find identity by email.
   */
  findByEmail(email: string): Promise<AuthIdentity | null>;
  findById(id: string): Promise<AuthIdentity | null>;

  /**
   * Validate the provided password.
   */
  validatePassword(email: string, password: string): Promise<boolean>;

  /**
   * Optional registration function for providers that support user registration.
   */
  register?(userData: { email: string; password: string; idpType?: string }): Promise<AuthIdentity>;
}
