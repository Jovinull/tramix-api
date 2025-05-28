import type { HttpContext } from '@adonisjs/core/http';
import { ControllerInterface } from '../interfaces/controller_interface.js';
import { UserService } from '#services/users_service';
import { createUserValidator } from '#validators/create_user';
import { updateUserValidator } from '#validators/update_user';
import { paginationValidator } from '#validators/pagination';
import { idParamValidator } from '#validators/id_param';

export default class UsersController implements ControllerInterface {
  constructor(private service = new UserService()) {}

  async index({ request, response }: HttpContext) {
    try {
      const params = await request.validateUsing(paginationValidator);
      const users = await this.service.getAll(params);
      return response.ok(users);
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      return response.internalServerError({ message: 'Erro interno ao listar usuários' });
    }
  }

  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(createUserValidator);
      const user = await this.service.create(data);
      return response.created(user);
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      if (typeof error === 'object' && error !== null && 'messages' in error) {
        return response.badRequest({
          message: 'Erro de validação',
          errors: (error as any).messages,
        });
      }
      return response.internalServerError({ message: 'Erro interno ao criar usuário' });
    }
  }

  async show({ params, request, response }: HttpContext) {
    try {
      await request.validateUsing(idParamValidator, { data: params });
      const user = await this.service.getById(params.id);
      if (!user) return response.notFound({ message: 'Usuário não encontrado' });
      return response.ok(user);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return response.internalServerError({ message: 'Erro interno ao buscar usuário' });
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      await request.validateUsing(idParamValidator, { data: params });
      const data = await request.validateUsing(updateUserValidator, { meta: { id: params.id } });
      const user = await this.service.update(params.id, data);
      if (!user) return response.notFound({ message: 'Usuário não encontrado para atualização' });
      return response.ok(user);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      if (typeof error === 'object' && error !== null && 'messages' in error) {
        return response.badRequest({
          message: 'Erro de validação',
          errors: (error as any).messages,
        });
      }
      return response.internalServerError({ message: 'Erro interno ao atualizar usuário' });
    }
  }

  async destroy({ params, request, response }: HttpContext) {
    try {
      await request.validateUsing(idParamValidator, { data: params });
      const success = await this.service.delete(params.id);
      if (!success) return response.notFound({ message: 'Usuário não encontrado para exclusão' });
      return response.noContent();
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      return response.internalServerError({ message: 'Erro interno ao excluir usuário' });
    }
  }
}
