import Task from '#models/task';
import { RepositoryInterface } from '#interfaces/repository_interface';

export class TaskRepository implements RepositoryInterface<Task> {
  async all(params: any): Promise<any> {
    const { page = 1, perPage = 10 } = params || {};
    return await Task.query().paginate(page, perPage);
  }

  async findById(id: number): Promise<Task | null> {
    return await Task.find(id);
  }

  async create(data: Partial<Task>): Promise<Task> {
    return await Task.create(data);
  }

  async update(id: number, data: Partial<Task>): Promise<Task | null> {
    const task = await Task.find(id);
    if (!task) return null;
    task.merge(data);
    await task.save();
    return task;
  }

  async delete(id: number): Promise<boolean> {
    const task = await Task.find(id);
    if (!task) return false;
    await task.delete();
    return true;
  }
}
