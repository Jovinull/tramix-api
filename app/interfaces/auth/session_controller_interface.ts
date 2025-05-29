import type { HttpContext } from '@adonisjs/core/http';

/**
 * Interface que define os métodos do SessionController.
 */
export interface SessionControllerInterface {
  store(ctx: HttpContext): Promise<any>;
  destroy(ctx: HttpContext): Promise<any>;
}
