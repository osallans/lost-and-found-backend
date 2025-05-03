import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

const userService = new UserService();

export class UserController {
  // GET /users
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users', error });
    }
  }

  // GET /users/:id
  async getUserById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const user = await userService.getUserById(id);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
      } else {
        res.status(200).json(user);
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user', error });
    }
  }

  // POST /users
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const newUser = await userService.createUser(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ message: 'Error creating user', error });
    }
  }

  // PUT /users/:id
  async updateUser(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const updatedUser = await userService.updateUser(id, req.body);
      if (!updatedUser) {
        res.status(404).json({ message: 'User not found' });
      } else {
        res.status(200).json(updatedUser);
      }
    } catch (error) {
      res.status(400).json({ message: 'Error updating user', error });
    }
  }

  // DELETE /users/:id
  async deleteUser(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const deleted = await userService.deleteUser(id);
      if (!deleted) {
        res.status(404).json({ message: 'User not found' });
      } else {
        res.status(204).send();
      }
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user', error });
    }
  }
}
