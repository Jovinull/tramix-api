import { UserRepository } from '../repositories/users_repository.js';
import { ServiceInterface } from '../interfaces/service_interface.js';
import User from '#models/user';

export class UserService implements ServiceInterface<User> {
  constructor(private repository = new UserRepository()) {}

  async getAll(params?: any) {
    return this.repository.all(params);
  }

  async getById(id: number) {
    return this.repository.findById(id);
  }

  async create(data: Partial<User>) {
    return this.repository.create(data);
  }

  async update(id: number, data: Partial<User>) {
    return this.repository.update(id, data);
  }

  async delete(id: number) {
    return this.repository.delete(id);
  }
}
