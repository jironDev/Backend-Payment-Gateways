import { HttpContext } from '@adonisjs/core/http'
import { purchaseValidator } from '#validators/purchase'
import PaymentService from '#services/payment_service'
import Transaction from '#models/transaction'
import Customer from '#models/customer'
import TransactionProduct from '#models/transaction_product'
import db from '@adonisjs/lucid/services/db'

export default class PurchasesController {
  
  // I instance the service
  private paymentService = new PaymentService()

  public async store({ request, response }: HttpContext) {

    // 1. Check the input data (VineJS)
       const payload = await request.validateUsing(purchaseValidator)

       // I start a DATABASE TRANSACTION  
    const trx = await db.transaction()

    try {
      // 2. Process the payment with the Failover of gateways
       const paymentResult = await this.paymentService.process(
        {
          name: payload.name,
          email: payload.email,
          cardNumber: payload.cardNumber,
          cvv: payload.cvv,
        },
        payload.products
      )

      if (!paymentResult.success) {
        return response.badRequest({ message: paymentResult.error })
      }

      // 3. If payment was successful, we save the purchase in our DB
      
      // A. Look for the customer by email, if not exists, create it. We use the same transaction for consistency
      const customer = await Customer.firstOrCreate(
        { email: payload.email },
        { name: payload.name },
        { client: trx }
      )

      // B. Create the transaction record with the info from the payment result
      const transaction = await Transaction.create({
        customerId: customer.id,
        gatewayId: paymentResult.gatewayId,
        externalId: paymentResult.externalId,
        amount: paymentResult.amount,
        status: 'COMPLETED',
        lastFourDigits: payload.cardNumber.slice(-4) // Just the last 4 digits for security
      }, { client: trx })

      // C. Create the records in the pivot table for the products bought
      const productRecords = payload.products.map(p => ({
        transactionId: transaction.id,
        productId: p.id,
        quantity: p.qty
      }))
      
      await TransactionProduct.createMany(productRecords, { client: trx })

      // Confirm the transaction in the DB
      await trx.commit()

      return response.ok({
        message: 'Compra realizada con éxito',
        transactionId: transaction.id,
        amount: transaction.amount
      })

    } catch (error) {
      await trx.rollback()
      return response.internalServerError({ message: 'Error interno al procesar la compra', error: error.message })
    }
  }


public async index({ response }: HttpContext) {
  // List all transactions with customer and gateway info (for admin view)
  const transactions = await Transaction.query()
    .preload('customer')
    .preload('gateway')
    .orderBy('createdAt', 'desc')

  return response.ok(transactions)
}

public async show({ params, response }: HttpContext) {
  // Detail of a specific purchase with its products
  const transaction = await Transaction.query()
    .where('id', params.id)
    .preload('customer')
    .preload('gateway')
    .preload('transactionProducts', (query) => query.preload('product'))
    .firstOrFail()

  return response.ok(transaction)
}

}
