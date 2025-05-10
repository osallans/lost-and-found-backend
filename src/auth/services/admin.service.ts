import { v4 as uuidv4 } from 'uuid';
import { IDPType } from '../../models/enums/idpType.enum';
import { Role } from '../../models/enums/role.enum';

export class AdminService {
  async findByEmail(email: string) {
    return {
      id: uuidv4(),
      email,
      password: '$2b$10$hashedAdminPassword',  // Simulated bcrypt hash
      role: Role.ADMIN,
      idpId: 'mock-admin-idp-id',
      idpType: IDPType.LOCAL,
    };
  }

  async findById(id: string) {
    return {
      id,
      email: 'admin@example.com',
      password: '$2b$10$hashedAdminPassword',  // Simulated bcrypt hash
      role: Role.ADMIN,
      idpId: 'mock-admin-idp-id',
      idpType: IDPType.LOCAL,
    };
  }
}
