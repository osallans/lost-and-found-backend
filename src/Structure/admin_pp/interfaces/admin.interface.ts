export interface Admin {
    id: string;
    name: string;
    email: string;
    password: string;
    role?: string;
    isSuperAdmin?: boolean;
    facilityIds?: string[]; // for Admins
    createdAt?: Date;
    updatedAt?: Date;
  }