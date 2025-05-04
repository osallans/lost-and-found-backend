import { Request, Response } from 'express';
import AppUserService from '../services/app_user.service';
import { AppUserDTO } from '../dtos/app_user.dto';

class AppUserController {
  async create(req: Request, res: Response) {
    try {
      const userData: AppUserDTO = req.body;
      const newUser = await AppUserService.createUser(userData);
      return res.status(201).json(newUser);
    } catch (error) {
      return res.status(500).json({ message: 'Error creating user', error });
    }
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const user = await AppUserService.getUserById(id);
      if (user) {
        return res.status(200).json(user);
      }
      return res.status(404).json({ message: 'User not found' });
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching user', error });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const userData: Partial<AppUserDTO> = req.body;
    try {
      const updatedUser = await AppUserService.updateUser(id, userData);
      if (updatedUser) {
        return res.status(200).json(updatedUser);
      }
      return res.status(404).json({ message: 'User not found' });
    } catch (error) {
      return res.status(500).json({ message: 'Error updating user', error });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const isDeleted = await AppUserService.deleteUser(id);
      if (isDeleted) {
        return res.status(200).json({ message: 'User deleted' });
      }
      return res.status(404).json({ message: 'User not found' });
    } catch (error) {
      return res.status(500).json({ message: 'Error deleting user', error });
    }
  }
}

export default new AppUserController();
