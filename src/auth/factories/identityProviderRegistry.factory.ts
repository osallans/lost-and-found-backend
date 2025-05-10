import { AuthService } from "../services/auth.service";





import { Role } from '../../models/enums/role.enum';
import { UserIdentityProvider } from "../providers/userIdentity.provider";
import { AdminIdentityProvider } from "../providers/authIdentity.provider";
import { IdentityProvider } from "../interfaces/identityProvider.interface";
import { UserService } from "../services/user.service";
import { AdminService } from "../services/admin.service";


// Initialize domain services
const userService = new UserService();
const adminService = new AdminService();
export function createIdentityProviderRegistry(
  userService: UserService,
  adminService: AdminService,
): Record<Role, IdentityProvider> {
  return {
    [Role.USER]: new UserIdentityProvider(userService),
    [Role.ADMIN]: new AdminIdentityProvider(adminService),
    [Role.MANAGER]: new AdminIdentityProvider(adminService),
  };
}
// Build provider registry
const identityProviders = createIdentityProviderRegistry(userService, adminService);

// Create AuthService with all providers
const authService = new AuthService(identityProviders);


