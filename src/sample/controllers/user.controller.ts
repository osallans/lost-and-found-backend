import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

const userService = new UserService();

export class UserController {
  async getAllUsers(req: Request, res: Response) {
    const users = await userService.findAll();
    res.json(users);
  }

  async getUserById(req: Request, res: Response) {
    const user = await userService.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  }

  async createUser(req: Request, res: Response) {
    const newUser = await userService.create(req.body);
    res.status(201).json(newUser);
  }

  async updateUser(req: Request, res: Response) {
    const updated = await userService.update(req.params.id, req.body);
    res.json(updated);
  }

  async deleteUser(req: Request, res: Response) {
    await userService.delete(req.params.id);
    res.status(204).send();
  }
}