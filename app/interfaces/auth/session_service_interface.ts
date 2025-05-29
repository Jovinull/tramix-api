import type User from '#models/user';

/**
 * Interface que define os métodos do SessionService.
 */
export interface SessionServiceInterface {
  login(
    email: string,
    password: string
  ): Promise<{
    type: string;
    token: string;
    expiresAt: Date | null | undefined;
    user: User;
  }>;
  logout(): Promise<void>;
}
