import User from '#models/user'
import { createUserValidator } from '#validators/create_user'
import { updateUserValidator } from '#validators/update_user'
import { paginationValidator } from '#validators/pagination'
import { idParamValidator } from '#validators/id_param'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  /**
   * Lista usuários com paginação segura
   */
  async index({ request, response }: HttpContext) {
    try {
      const { page = 1, perPage = 10 } = await request.validateUsing(paginationValidator)

      const users = await User.query().preload('tasks').paginate(page, perPage)
      return response.ok(users)
    } catch (error) {
      console.error('Erro ao listar usuários:', error)
      return response.internalServerError({ message: 'Erro interno ao listar usuários' })
    }
  }

  /**
   * Cria um novo usuário com validação completa
   */
  async store({ request, response }: HttpContext) {
    try {
      const { name, email, password } = await request.validateUsing(createUserValidator)

      const user = await User.create({ name, email, password })
      return response.created(user)
    } catch (error) {
      console.error('Erro ao criar usuário:', error)

      if (error.messages) {
        return response.badRequest({ message: 'Erro de validação', errors: error.messages })
      }

      return response.internalServerError({ message: 'Erro interno ao criar usuário' })
    }
  }

  /**
   * Exibe um usuário pelo ID com preload de tasks
   */
  async show({ params, request, response }: HttpContext) {
    try {
      await request.validateUsing(idParamValidator, { data: params }) // valida ID
      
      const user = await User.query()
        .where('id', params.id)
        .preload('tasks')
        .firstOrFail()

      return response.ok(user)
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({ message: 'Usuário não encontrado' })
      }

      console.error('Erro ao buscar usuário:', error)
      return response.internalServerError({ message: 'Erro interno ao buscar usuário' })
    }
  }

  /**
   * Atualiza um usuário com validação assíncrona do e-mail (caso alterado)
   */
  async update({ params, request, response }: HttpContext) {
    try {
      await request.validateUsing(idParamValidator, {
        data: params,
      })

      const user = await User.findOrFail(params.id)

      const payload = await request.validateUsing(updateUserValidator, {
        meta: { id: params.id },
      })

      // Verifica se o email está sendo alterado para outro já existente
      if (payload.email && payload.email !== user.email) {
        const emailExists = await User.query()
          .where('email', payload.email)
          .whereNot('id', user.id)
          .first()

        if (emailExists) {
          return response.badRequest({ message: 'E-mail já está em uso por outro usuário' })
        }
      }

      user.merge(payload)
      await user.save()

      return response.ok(user)
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({ message: 'Usuário não encontrado para atualização' })
      }

      if (error.messages) {
        return response.badRequest({ message: 'Erro de validação', errors: error.messages })
      }

      console.error('Erro ao atualizar usuário:', error)
      return response.internalServerError({ message: 'Erro interno ao atualizar usuário' })
    }
  }

  /**
   * Remove um usuário pelo ID com segurança
   */
  async destroy({ params, request, response }: HttpContext) {
    try {
      await request.validateUsing(idParamValidator, { data: params }) // valida ID

      const user = await User.findOrFail(params.id)
      await user.delete()

      return response.noContent()
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({ message: 'Usuário não encontrado para exclusão' })
      }

      console.error('Erro ao excluir usuário:', error)
      return response.internalServerError({ message: 'Erro interno ao excluir usuário' })
    }
  }
}
