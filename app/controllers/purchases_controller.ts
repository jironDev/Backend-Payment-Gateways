import { HttpContext } from '@adonisjs/core/http'
import { purchaseValidator } from '#validators/purchase'
import PaymentService from '#services/payment_service'
import Transaction from '#models/transaction'
import Customer from '#models/customer'
import TransactionProduct from '#models/transaction_product'
import db from '@adonisjs/lucid/services/db'

export default class PurchasesController {
  // Instanciamos el servicio (esto es el "cerebro")
  private paymentService = new PaymentService()

  public async store({ request, response }: HttpContext) {
    // 1. Validar los datos de entrada (VineJS)
    const payload = await request.validateUsing(purchaseValidator)

    // Iniciamos una TRANSACCIÓN DE BASE DE DATOS (Database Transaction)
    // Esto asegura que si algo falla al guardar, no se creen datos a medias en MySQL
    const trx = await db.transaction()

    try {
      // 2. Procesar el pago con el Failover de pasarelas
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

      // 3. Persistir en la DB (Solo si el pago fue exitoso)
      
      // A. Buscar o crear al cliente
      const customer = await Customer.firstOrCreate(
        { email: payload.email },
        { name: payload.name },
        { client: trx }
      )

      // B. Crear la transacción principal
      const transaction = await Transaction.create({
        customerId: customer.id,
        gatewayId: paymentResult.gatewayId,
        externalId: paymentResult.externalId,
        amount: paymentResult.amount,
        status: 'COMPLETED',
        lastFourDigits: payload.cardNumber.slice(-4) // Guardamos solo los últimos 4 por seguridad
      }, { client: trx })

      // C. Registrar los productos que se compraron
      const productRecords = payload.products.map(p => ({
        transactionId: transaction.id,
        productId: p.id,
        quantity: p.qty
      }))
      
      await TransactionProduct.createMany(productRecords, { client: trx })

      // Confirmamos los cambios en MySQL
      await trx.commit()

      return response.ok({
        message: 'Compra realizada con éxito',
        transactionId: transaction.id,
        amount: transaction.amount
      })

    } catch (error) {
      // Si algo sale mal guardando en la DB, deshacemos todo
      await trx.rollback()
      return response.internalServerError({ message: 'Error interno al procesar la compra', error: error.message })
    }
  }
}
