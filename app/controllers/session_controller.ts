import type { HttpContext } from '@adonisjs/core/http';
import { SessionControllerInterface } from '#interfaces/auth/session_controller_interface';
import SessionService from '#services/session_service';
import { createSessionValidator } from '#validators/create_session';

/**
 * Controller responsável por login e logout via token.
 */
export default class SessionController implements SessionControllerInterface {
  /**
   * Realiza o login do usuário e gera um token de acesso.
   *
   * Este método autentica o usuário a partir do email e senha informados,
   * utilizando o serviço de sessão (SessionService), e retorna um token JWT (opaque access token).
   * Também lida com diferentes tipos de erro, garantindo tratamento seguro e tipado.
   */
  async store(ctx: HttpContext) {
    // Instancia o service responsável pela lógica de autenticação
    const service = new SessionService(ctx);

    /**
     * Type guard que verifica se o objeto capturado no bloco `catch` possui
     * uma propriedade `name` do tipo string.
     *
     * A partir do TypeScript 4.4, o valor capturado no `catch` tem o tipo `unknown`.
     * Isso exige verificação explícita antes de acessar qualquer propriedade.
     * Essa função garante segurança de tipo antes de acessar `error.name`.
     */
    function hasNameProperty(err: unknown): err is { name: string } {
      return typeof err === 'object' && err !== null && 'name' in err;
    }

    try {
      // Validação dos dados de entrada (email e senha)
      const { email, password } = await ctx.request.validateUsing(createSessionValidator);

      // Chamada ao service que realiza a autenticação e geração do token
      const result = await service.login(email, password);

      // Retorna resposta com token e informações do usuário
      return ctx.response.ok(result);
    } catch (error) {
      /**
       * Verifica se o erro é um erro de autenticação (UID ou senha inválidos).
       * Isso depende da propriedade `name`, que precisa ser validada com o type guard acima.
       * Esses códigos de erro (`E_INVALID_AUTH_UID`, `E_INVALID_AUTH_PASSWORD`) são emitidos
       * pelo método `verifyCredentials` do modelo `User`.
       */
      if (
        hasNameProperty(error) &&
        (error.name === 'E_INVALID_AUTH_UID' || error.name === 'E_INVALID_AUTH_PASSWORD')
      ) {
        return ctx.response.unauthorized({ message: 'Credenciais inválidas' });
      }

      /**
       * Verifica se o erro possui mensagens de validação, o que indica falha nos dados de entrada.
       * O validador `createSessionValidator` lança esse tipo de erro quando as regras não são atendidas.
       */
      if (typeof error === 'object' && error !== null && 'messages' in error) {
        return ctx.response.badRequest({
          message: 'Erro de validação',
          errors: (error as any).messages,
        });
      }

      /**
       * Caso não seja um erro conhecido ou validado acima, trata-se como erro interno genérico.
       * O erro é registrado no console para diagnóstico posterior.
       */
      console.error('Erro ao autenticar usuário:', error);
      return ctx.response.internalServerError({ message: 'Erro interno no login' });
    }
  }

  /**
   * Realiza o logout do usuário autenticado.
   */
  async destroy(ctx: HttpContext) {
    const service = new SessionService(ctx);

    try {
      await service.logout();
      return ctx.response.noContent();
    } catch (error) {
      console.error('Erro ao encerrar sessão:', error);
      return ctx.response.internalServerError({ message: 'Erro ao encerrar sessão' });
    }
  }
}
