import vine from '@vinejs/vine'

export const updateTaskValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3).maxLength(255).optional(),
    description: vine.string().trim().maxLength(1000).optional(),
    done: vine.boolean().optional(),
  })
)
