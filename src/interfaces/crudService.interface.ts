import { BaseDTO } from "./baseDto.interface";

export interface ICrudService<T> {
  create(data: BaseDTO): Promise<T>;
  getAllPaginated(page: number, limit: number): Promise<{ data: T[]; total: number }>;
  getById(id: string): Promise<T | null>;
  update(id: string, data: BaseDTO): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}
