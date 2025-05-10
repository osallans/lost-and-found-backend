import { IdentityProvider } from '../interfaces/identityProvider.interface';

import { AuthIdentity } from '../interfaces/authIdentity.interface';
import { Role } from '../../models/enums/role.enum';
import bcrypt from 'bcrypt';
import { AdminService } from '../services/admin.service';

export class AdminIdentityProvider implements IdentityProvider {
  constructor(private adminService: AdminService) {}

  async findByEmail(email: string): Promise<AuthIdentity | null> {
    const admin = await this.adminService.findByEmail(email);
    if (!admin) return null;

    return {
      id: admin.id,
      email: admin.email,
      role: Role.ADMIN,
      idpId: admin.idpId,
      idpType: admin.idpType,
    };
  }

  async findById(id: string): Promise<AuthIdentity | null> {
    const admin = await this.adminService.findById(id);
    if (!admin) return null;

    return {
      id: admin.id,
      email: admin.email,
      role: Role.ADMIN,
      idpId: admin.idpId,
      idpType: admin.idpType,
    };
  }

  async validatePassword(email: string, password: string): Promise<boolean> {
    const admin = await this.adminService.findByEmail(email);
    if (!admin) return false;

    return bcrypt.compare(password, admin.password);
  }
}
