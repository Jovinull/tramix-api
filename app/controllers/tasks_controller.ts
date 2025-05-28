import Task from '#models/task';
import { createTaskValidator } from '#validators/create_task';
import { updateTaskValidator } from '#validators/update_task';
import { idParamValidator } from '#validators/id_param';
import type { HttpContext } from '@adonisjs/core/http';

export default class TasksController {
  /**
   * Lista todas as tarefas do usuário autenticado
   */
  async index({ auth, response }: HttpContext) {
    try {
      const user = auth.user!;
      await user.preload('tasks');
      return response.ok(user.tasks);
    } catch (error) {
      console.error('Erro ao listar tarefas:', error);
      return response.internalServerError({ message: 'Erro interno ao listar tarefas' });
    }
  }

  /**
   * Cria uma nova tarefa vinculada ao usuário autenticado
   */
  async store({ request, response, auth }: HttpContext) {
    try {
      const { title, description } = await request.validateUsing(createTaskValidator);
      const user = auth.user!;
      const task = await user.related('tasks').create({ title, description });
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

  /**
   * Exibe uma tarefa específica por ID
   */
  async show({ params, request, response }: HttpContext) {
    try {
      await request.validateUsing(idParamValidator, { data: params });
      const task = await Task.findOrFail(params.id);
      return response.ok(task);
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as any).code === 'E_ROW_NOT_FOUND'
      ) {
        return response.notFound({ message: 'Tarefa não encontrada' });
      }

      console.error('Erro ao buscar tarefa:', error);
      return response.internalServerError({ message: 'Erro interno ao buscar tarefa' });
    }
  }

  /**
   * Atualiza uma tarefa existente
   */
  async update({ params, request, response }: HttpContext) {
    try {
      await request.validateUsing(idParamValidator, { data: params });
      const task = await Task.findOrFail(params.id);
      const payload = await request.validateUsing(updateTaskValidator);

      task.merge(payload);
      await task.save();

      return response.ok(task);
    } catch (error) {
      if (typeof error === 'object' && error !== null) {
        if ('code' in error && (error as any).code === 'E_ROW_NOT_FOUND') {
          return response.notFound({ message: 'Tarefa não encontrada para atualização' });
        }

        if ('messages' in error) {
          return response.badRequest({
            message: 'Erro de validação',
            errors: (error as any).messages,
          });
        }
      }

      console.error('Erro ao atualizar tarefa:', error);
      return response.internalServerError({ message: 'Erro interno ao atualizar tarefa' });
    }
  }

  /**
   * Exclui uma tarefa existente
   */
  async destroy({ params, request, response }: HttpContext) {
    try {
      await request.validateUsing(idParamValidator, { data: params });
      const task = await Task.findOrFail(params.id);
      await task.delete();

      return response.noContent();
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as any).code === 'E_ROW_NOT_FOUND'
      ) {
        return response.notFound({ message: 'Tarefa não encontrada para exclusão' });
      }

      console.error('Erro ao excluir tarefa:', error);
      return response.internalServerError({ message: 'Erro interno ao excluir tarefa' });
    }
  }
}
