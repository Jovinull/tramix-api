import vine from '@vinejs/vine';

export const updateUserValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(255).optional(),
    email: vine.string().trim().email().optional(),
    password: vine.string().minLength(6).maxLength(255).optional(),
  })
);
