import bcrypt from 'bcrypt';
import { Role } from '../../models/enums/role.enum';
import { AuthIdentity } from '../interfaces/authIdentity.interface';
import { IdentityProvider } from '../interfaces/identityProvider.interface';
import { UserService } from '../services/user.service';

export class UserIdentityProvider implements IdentityProvider {
  constructor(private userService: UserService) {}

  async findByEmail(email: string): Promise<AuthIdentity | null> {
    const user = await this.userService.findByEmail(email);
    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      role: Role.USER,
      idpId: user.idpId,
      idpType: user.idpType,
      facilityIds: user.facilityIds,
    };
  }

  async findById(id: string): Promise<AuthIdentity | null> {
    const user = await this.userService.findById(id);
    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      role: Role.USER,
      idpId: user.idpId,
      idpType: user.idpType,
      facilityIds: user.facilityIds,
    };
  }

  async validatePassword(email: string, password: string): Promise<boolean> {
    const user = await this.userService.findByEmail(email);
    if (!user) return false;

    return bcrypt.compare(password, user.password);
  }
}
