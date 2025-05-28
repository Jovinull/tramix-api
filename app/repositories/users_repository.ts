import User from '#models/user';
import { RepositoryInterface } from '../interfaces/repository_interface.js';

export class UserRepository implements RepositoryInterface<User> {
  async all(params: any) {
    const { page = 1, perPage = 10 } = params || {};
    return await User.query().preload('tasks').paginate(page, perPage);
  }

  async findById(id: number) {
    return await User.query().where('id', id).preload('tasks').first();
  }

  async create(data: Partial<User>) {
    return await User.create(data);
  }

  async update(id: number, data: Partial<User>) {
    const user = await User.find(id);
    if (!user) return null;

    user.merge(data);
    await user.save();
    return user;
  }

  async delete(id: number) {
    const user = await User.find(id);
    if (!user) return false;

    await user.delete();
    return true;
  }
}
