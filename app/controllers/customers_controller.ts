import { HttpContext } from '@adonisjs/core/http'
import Customer from '#models/customer'

export default class CustomersController {

  // list all customers with their purchase history

  public async index({ response }: HttpContext) {
    const customers = await Customer.query()
      .preload('transactions', (transactionQuery) => {
        transactionQuery.preload('gateway') // To know through which gateway they bought
        transactionQuery.preload('transactionProducts', (tpQuery) => {
          tpQuery.preload('product') // To know what products they bought
        })
      })
      .orderBy('name', 'asc')

    return response.ok(customers)
  }

public async show({ params, response }: HttpContext) {
  // Show a specific customer with their full purchase history
    const customer = await Customer.query()
    .where('id', params.id)
    .preload('transactions', (transactionQuery) => {
      transactionQuery.preload('gateway')
      transactionQuery.preload('transactionProducts', (tpQuery) => {
        tpQuery.preload('product')
      })
    })
    .firstOrFail() // Throws 404 if not found

  return response.ok(customer)
}


}
