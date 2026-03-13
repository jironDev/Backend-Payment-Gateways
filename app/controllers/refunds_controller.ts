import { HttpContext } from '@adonisjs/core/http'
import Transaction from '#models/transaction'
import PaymentService from '#services/payment_service'

export default class Refunds_Controller {
  private paymentService = new PaymentService()

  public async store({ params, response }: HttpContext) {
    // 1. Buscar la transacción original
    const transaction = await Transaction.query()
      .where('id', params.id)
      .preload('gateway')
      .first()

    if (!transaction || !transaction.externalId) {
      return response.notFound({ message: 'Transacción no encontrada' })
    }

    // 2. Ejecutar reembolso a través del Service
    // Necesitamos crear este método en tu PaymentService o llamarlo directo
    const result = await this.paymentService.refund(
      transaction.gateway.name, 
      transaction.externalId
    )

    if (!result.success) {
      return response.badRequest({ message: result.error })
    }

    // 3. Actualizar estado en nuestra DB
    transaction.status = 'REFUNDED'
    await transaction.save()

    return response.ok({ message: 'Reembolso procesado con éxito' })
  }
}
