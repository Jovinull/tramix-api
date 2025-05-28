import vine from '@vinejs/vine'

export const idParamValidator = vine.compile(
  vine.object({
    id: vine
      .string()
      .regex(/^\d+$/)
      .transform((v) => Number(v)),
    // ou use vine.string().uuid() se o ID for UUID
  })
)
