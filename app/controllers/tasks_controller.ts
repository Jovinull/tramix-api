import type { HttpContext } from '@adonisjs/core/http';
import { ControllerInterface } from '#interfaces/controller_interface';
import { TaskService } from '#services/tasks_service';
import { createTaskValidator } from '#validators/create_task';
import { updateTaskValidator } from '#validators/update_task';
import { paginationValidator } from '#validators/pagination';
import { idParamValidator } from '#validators/id_param';

export default class TasksController implements ControllerInterface {
  constructor(private service = new TaskService()) {}

  async index({ request, response }: HttpContext) {
    try {
      const params = await request.validateUsing(paginationValidator);
      const tasks = await this.service.getAll(params);
      return response.ok(tasks);
    } catch (error) {
      console.error('Erro ao listar tarefas:', error);
      return response.internalServerError({ message: 'Erro interno ao listar tarefas' });
    }
  }

  async store({ request, response, auth }: HttpContext) {
    try {
      const data = await request.validateUsing(createTaskValidator);
      const user = auth.user!;
      const task = await user.related('tasks').create(data);
      return response.created(task);
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'messages' in error) {
        return response.badRequest({
          message: 'Erro de validação',
          errors: (error as any).messages,
        });
      }
      console.error('Erro ao criar tarefa:', error);
      return response.internalServerError({ message: 'Erro interno ao criar tarefa' });
    }
  }

  async show({ params, request, response }: HttpContext) {
    try {
      await request.validateUsing(idParamValidator, { data: params });
      const task = await this.service.getById(params.id);
      if (!task) return response.notFound({ message: 'Tarefa não encontrada' });
      return response.ok(task);
    } catch (error) {
      console.error('Erro ao buscar tarefa:', error);
      return response.internalServerError({ message: 'Erro interno ao buscar tarefa' });
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      await request.validateUsing(idParamValidator, { data: params });
      const data = await request.validateUsing(updateTaskValidator);
      const task = await this.service.update(params.id, data);
      if (!task) return response.notFound({ message: 'Tarefa não encontrada para atualização' });
      return response.ok(task);
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'messages' in error) {
        return response.badRequest({
          message: 'Erro de validação',
          errors: (error as any).messages,
        });
      }
      console.error('Erro ao atualizar tarefa:', error);
      return response.internalServerError({ message: 'Erro interno ao atualizar tarefa' });
    }
  }

  async destroy({ params, request, response }: HttpContext) {
    try {
      await request.validateUsing(idParamValidator, { data: params });
      const success = await this.service.delete(params.id);
      if (!success) return response.notFound({ message: 'Tarefa não encontrada para exclusão' });
      return response.noContent();
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
      return response.internalServerError({ message: 'Erro interno ao excluir tarefa' });
    }
  }
}
