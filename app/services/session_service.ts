import type { HttpContext } from '@adonisjs/core/http';
import User from '#models/user';
import { SessionServiceInterface } from '#interfaces/auth/session_service_interface';

/**
 * Service responsável pela lógica de autenticação com AccessToken.
 */
export default class SessionService implements SessionServiceInterface {
  constructor(private ctx: HttpContext) {}

  /**
   * Autentica o usuário e gera um AccessToken.
   */
  async login(email: string, password: string) {
    const user = await User.verifyCredentials(email, password);
    const token = await this.ctx.auth.use('api').createToken(user);

    return {
      type: 'bearer',
      token: token.value!.release(),
      expiresAt: token.expiresAt,
      user,
    };
  }

  /**
   * Revoga o AccessToken atual do usuário autenticado.
   */
  async logout(): Promise<void> {
    await this.ctx.auth.use('api').invalidateToken();
  }
}
