import { UserDTO } from '../dto/user.dto';
import { v4 as uuidv4 } from 'uuid';

export class UserService {
  private users: UserDTO[] = [];

  async findAll(): Promise<UserDTO[]> {
    return this.users;
  }

  async findById(id: string): Promise<UserDTO | undefined> {
    return this.users.find(user => user.id === id);
  }

  async create(user: UserDTO): Promise<UserDTO> {
    const newUser = { ...user, id: uuidv4(), createdAt: new Date(), updatedAt: new Date() };
    this.users.push(newUser);
    return newUser;
  }

  async update(id: string, user: Partial<UserDTO>): Promise<UserDTO | undefined> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return undefined;
    this.users[index] = { ...this.users[index], ...user, updatedAt: new Date() };
    return this.users[index];
  }

  async delete(id: string): Promise<void> {
    this.users = this.users.filter(u => u.id !== id);
  }
}