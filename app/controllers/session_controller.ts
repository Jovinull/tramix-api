import User from '#models/user'
import { createSessionValidator } from '#validators/create_session'
import type { HttpContext } from '@adonisjs/core/http'

export default class SessionController {
  /**
   * Realiza login do usuário e gera token de acesso
   */
  async store({ request, response }: HttpContext) {
    try {
      const { email, password } = await request.validateUsing(createSessionValidator)

      const user = await User.verifyCredentials(email, password)
      const token = await User.accessTokens.create(user)

      return response.ok({ token, user })
    } catch (error) {
      if (error.name === 'E_INVALID_AUTH_UID' || error.name === 'E_INVALID_AUTH_PASSWORD') {
        return response.unauthorized({ message: 'Credenciais inválidas' })
      }

      if (error.messages) {
        return response.badRequest({ message: 'Erro de validação', errors: error.messages })
      }

      console.error('Erro ao autenticar usuário:', error)
      return response.internalServerError({ message: 'Erro interno no login' })
    }
  }

  /**
   * Encerra a sessão do usuário autenticado
   */
  async destroy({ auth, response }: HttpContext) {
    try {
      const user = auth.user!
      const tokenId = user.currentAccessToken?.identifier

      if (!tokenId) {
        return response.badRequest({ message: 'Token de acesso não encontrado' })
      }

      await User.accessTokens.delete(user, tokenId)
      return response.noContent()
    } catch (error) {
      console.error('Erro ao encerrar sessão:', error)
      return response.internalServerError({ message: 'Erro interno ao encerrar sessão' })
    }
  }
}
