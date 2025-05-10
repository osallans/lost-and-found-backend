import { IDPType } from "../../models/enums/idpType.enum";
import { Role } from "../../models/enums/role.enum";

export interface BaseAccessTokenPayload {
  tokenId: string;
  email: string;
  idpType: IDPType;
  userId: string;
  idpId: string;
  role: Role; // Make optional here, required in extended interfaces
  facilityIds?: string[]; // Optional base field
  tokenType: 'access';
}

export interface UserAccessTokenPayload extends BaseAccessTokenPayload {
  role: Role.USER;

}

export interface AdminAccessTokenPayload extends BaseAccessTokenPayload {
  role: Role.ADMIN;
}

export interface ManagerAccessTokenPayload extends BaseAccessTokenPayload {
  role: Role.MANAGER;
}

export type AccessTokenPayload =
  | UserAccessTokenPayload
  | AdminAccessTokenPayload
  | ManagerAccessTokenPayload;