import { TaskRepository } from '#repositories/tasks_repository';
import { ServiceInterface } from '#interfaces/service_interface';
import Task from '#models/task';

export class TaskService implements ServiceInterface<Task> {
  constructor(private repository = new TaskRepository()) {}

  async getAll(params?: any) {
    return this.repository.all(params);
  }

  async getById(id: number) {
    return this.repository.findById(id);
  }

  async create(data: Partial<Task>) {
    return this.repository.create(data);
  }

  async update(id: number, data: Partial<Task>) {
    return this.repository.update(id, data);
  }

  async delete(id: number) {
    return this.repository.delete(id);
  }

  async getByUserId(userId: number) {
    return this.repository.findByUserId(userId);
  }
}
