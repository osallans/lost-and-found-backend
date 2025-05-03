export interface UserDTO {
  id?: string;
  name: string;
  nameAr?: string;
  email: string;
  password?: string;
  role?: 'user' | 'admin' | 'manager';
  idpType?: 'local' | 'google' | 'facebook' | 'cognito';
  idpId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted?: boolean;
  createdBy?: string;
  updatedBy?: string;
}

export interface AdminDTO {
  id?: string;
  name: string;
  nameAr?: string;
  email: string;
  password?: string;
  role?: 'user' | 'admin' | 'manager';
  idpType?: 'local' | 'google' | 'facebook' | 'cognito';
  idpId?: string;
  isSuperAdmin?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted?: boolean;
  createdBy?: string;
  updatedBy?: string;
}

export interface CountryDTO {
  code: string;
  name: string;
  nameAr?: string;
}

export interface CityDTO {
  id?: string;
  name: string;
  nameAr?: string;
  countryCode: string;
}

export interface FacilityDTO {
  id?: string;
  parentFacilityId?: string;
  name: string;
  nameAr?: string;
  description?: string;
  cityId?: string;
  countryCode?: string;
  isPublic?: boolean;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  type?: string;
  createdAt?: Date;
  isDeleted?: boolean;
  createdBy?: string;
  updatedBy?: string;
}

export interface ItemDTO {
  id?: string;
  facilityId: string;
  reportedBy: string;
  title: string;
  description?: string;
  status: 'lost' | 'found' | 'matched' | 'claimed' | 'returned';
  category?: string;
  reportedAt: Date;
  resolvedAt?: Date;
  matchedItemId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted?: boolean;
  createdBy?: string;
  updatedBy?: string;
}

export interface ItemImageDTO {
  id?: string;
  itemId: string;
  imageUrl: string;
  uploadedAt?: Date;
}

export interface ItemLogDTO {
  id?: string;
  itemId: string;
  action: string;
  actorId: string;
  actorRole: 'admin' | 'user';
  logType?: string;
  notes?: string;
  createdAt?: Date;
}

export interface ClaimDTO {
  id?: string;
  itemId: string;
  claimantId: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  reviewedByAdminId?: string;
  claimToken?: string;
  attachmentUrl?: string;
  claimedAt?: Date;
  reviewedAt?: Date;
  expiresAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

