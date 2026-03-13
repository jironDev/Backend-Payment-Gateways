import { test } from '@japa/runner'
import Product from '#models/product'

test.group('Cálculo de Montos', () => {
  test('debe calcular el monto real basado en la DB aunque el cliente no envíe precio', async ({ client }) => {
    const product = await Product.firstOrFail()
    
    const response = await client.post('/purchase').json({
      name: 'Tester Monto',
      email: 'monto@test.com',
      cardNumber: '5569000000006063',
      cvv: '010', 
      products: [{ id: product.id, qty: 2 }] // We bought 2 units, but we don't send the price, the system should calculate it based on the DB price * quantity
    })

    response.assertStatus(200)
    // Verify that the saved amount is (db_price * 2)
    response.assertBodyContains({ amount: product.amount * 2 })
  })
})
