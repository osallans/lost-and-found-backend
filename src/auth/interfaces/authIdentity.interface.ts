import { IDPType } from "../../models/enums/idpType.enum";
import { Role } from "../../models/enums/role.enum";

/**
 * Represents the minimal data required for authentication and token generation.
 * This should map to User, Admin, Manager, etc. when resolving identity.
 */
export interface AuthIdentity {
  id: string; // Unique internal system identifier
  email: string;
  role: Role; // Expandable for future roles
  idpId: string;  // Identity Provider user ID
  idpType: IDPType;  // Identity Provider type
  facilityIds?: string[]; // Optional, applicable to user/manager types
}
