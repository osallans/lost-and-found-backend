export interface AppUserDTO {
  id: string;
  name: string;
  name_ar: string | null;
  email: string;
  password?: string;
  role: 'user' | 'admin' | 'manager';
  idp_type?: 'local' | 'google' | 'facebook' | 'cognito';
  idp_id?: string;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
  created_by?: string;
  updated_by?: string;
}
