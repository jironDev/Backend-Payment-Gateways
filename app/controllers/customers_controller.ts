import { HttpContext } from '@adonisjs/core/http'
import Customer from '#models/customer'

export default class CustomersController {
  /**
   * Lista todos los clientes con su historial de compras
   */
  public async index({ response }: HttpContext) {
    const customers = await Customer.query()
      .preload('transactions', (transactionQuery) => {
        transactionQuery.preload('gateway') // Para saber por qué pasarela pagó
        transactionQuery.preload('transactionProducts', (tpQuery) => {
          tpQuery.preload('product') // Para saber qué productos compró
        })
      })
      .orderBy('name', 'asc')

    return response.ok(customers)
  }

public async show({ params, response }: HttpContext) {
  // Buscamos un cliente específico y precargamos todo su historial
  const customer = await Customer.query()
    .where('id', params.id)
    .preload('transactions', (transactionQuery) => {
      transactionQuery.preload('gateway')
      transactionQuery.preload('transactionProducts', (tpQuery) => {
        tpQuery.preload('product')
      })
    })
    .firstOrFail() // Lanza 404 si el ID no existe

  return response.ok(customer)
}


}
