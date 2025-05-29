import vine from '@vinejs/vine';

/**
 * Validação para login de sessão (email + senha).
 */
export const createSessionValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(6),
  })
);
