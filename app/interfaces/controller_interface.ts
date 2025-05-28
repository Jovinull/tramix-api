import type { HttpContext } from '@adonisjs/core/http';

export interface ControllerInterface {
  index(ctx: HttpContext): Promise<any>;
  show(ctx: HttpContext): Promise<any>;
  store(ctx: HttpContext): Promise<any>;
  update(ctx: HttpContext): Promise<any>;
  destroy(ctx: HttpContext): Promise<any>;
}
