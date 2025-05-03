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