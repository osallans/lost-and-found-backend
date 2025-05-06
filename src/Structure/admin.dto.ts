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