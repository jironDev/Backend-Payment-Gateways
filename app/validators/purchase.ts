import vine from '@vinejs/vine'

export const purchaseValidator = vine.compile(
  vine.object({
    name: vine.string().trim(),
    email: vine.string().email(),
    cardNumber: vine.string().minLength(16).maxLength(16),
    cvv: vine.string().minLength(3).maxLength(3),
    // Validamos que envíen un arreglo de productos
    products: vine.array(
      vine.object({
        id: vine.number(),
        qty: vine.number().min(1)
      })
    )
  })
)
