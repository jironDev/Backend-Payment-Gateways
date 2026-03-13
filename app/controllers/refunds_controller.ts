import { HttpContext } from '@adonisjs/core/http'
import Transaction from '#models/transaction'
import PaymentService from '#services/payment_service'

export default class Refunds_Controller {
  private paymentService = new PaymentService()

  public async store({ params, response }: HttpContext) {
    // 1. Look for the transaction in our DB to get the gateway and external ID
    const transaction = await Transaction.query()
      .where('id', params.id)
      .preload('gateway')
      .first()

    if (!transaction || !transaction.externalId) {
      return response.notFound({ message: 'Transacción no encontrada' })
    }

    // 2. Execute refund through the Service   
    
    const result = await this.paymentService.refund(
      transaction.gateway.name, 
      transaction.externalId
    )

    if (!result.success) {
      return response.badRequest({ message: result.error })
    }

    // 3. Update the transaction status in our DB
    transaction.status = 'REFUNDED'
    await transaction.save()

    return response.ok({ message: 'Reembolso procesado con éxito' })
  }
}
