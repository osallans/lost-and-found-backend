import { v4 as uuidv4 } from 'uuid';
import { IDPType } from '../../models/enums/idpType.enum';
import { Role } from '../../models/enums/role.enum';

export class UserService {
  async findByEmail(email: string) {
    // Mock user record (normally this would query a database)
    return {
      id: uuidv4(),
      email,
      password: '$2b$10$hashedPassword',  // Simulated bcrypt hash
      role: Role.USER,
      idpId: 'mock-idp-id',
      idpType: IDPType.LOCAL,
      facilityIds: ['facility-1', 'facility-2'],
    };
  }

  async findById(id: string) {
    // Mock user record by ID
    return {
      id,
      email: 'user@example.com',
      password: '$2b$10$hashedPassword',  // Simulated bcrypt hash
      role: Role.USER,
      idpId: 'mock-idp-id',
      idpType: IDPType.LOCAL,
      facilityIds: ['facility-1', 'facility-2'],
    };
  }
}
