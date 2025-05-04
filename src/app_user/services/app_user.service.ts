import { AppUserDTO } from "../dtos/app_user.dto";

class AppUserService {
  async createUser(userData: AppUserDTO): Promise<AppUserDTO> {
    return userData;
  }

  async getUserById(id: string): Promise<AppUserDTO | null> {
    return { id, name: 'John Doe', name_ar: 'جون دو', email: 'john.doe@example.com', role: 'user', created_at: new Date(), updated_at: new Date(), is_deleted: false };
  }

  async updateUser(id: string, userData: Partial<AppUserDTO>): Promise<AppUserDTO | null> {
    return { id, ...userData, created_at: new Date(), updated_at: new Date(), is_deleted: false };
  }

  async deleteUser(id: string): Promise<boolean> {
    return true;
  }
}

export default new AppUserService();
