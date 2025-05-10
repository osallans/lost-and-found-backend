import { IDPType } from "../../models/enums/idpType.enum";
import { Role } from "../../models/enums/role.enum";

export interface BaseRefreshTokenPayload {
  tokenId: string;
  idpType: IDPType;
  userId: string;
  idpId: string;
  role: Role; // Optional here, required in extensions
  facilityIds?: string[]; // Optional for flexibility
  tokenType: 'refresh';
}

export interface UserRefreshTokenPayload extends BaseRefreshTokenPayload {
  role: Role.USER;
}
export interface AdminRefreshTokenPayload extends BaseRefreshTokenPayload {
  role: Role.ADMIN;
}
export interface ManagerRefreshTokenPayload extends BaseRefreshTokenPayload {
  role:Role.MANAGER
}

export type RefreshTokenPayload =
  | UserRefreshTokenPayload
  | AdminRefreshTokenPayload
  | ManagerRefreshTokenPayload;
