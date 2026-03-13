import { test } from '@japa/runner'
import Product from '#models/product'

test.group('Pagos con Failover', () => {
  test('debe completar la compra usando el Gateway 2 si el Gateway 1 falla (CVV 100)', async ({ client }) => {
    // 1. Make sure there is at least one product (from the seeder)
    const product = await Product.first()
    
    if (!product) {
      throw new Error('No hay productos en la DB para el test. Corre el seeder primero.')
    }

    // 2. Execute the POST request to your API
    const response = await client.post('/purchase').json({
      name: 'Tester TDD',
      email: 'tdd@test.com',
      cardNumber: '5569000000006063',
      cvv: '100', // <--- This CVV forces a gateway switch
      products: [
        { id: product.id, qty: 1 }
      ]
    })

    // 3. Verify that the response is 200 OK
    // If your Failover works, the user will receive success even if the first gateway fails.
    response.assertStatus(200)
    response.assertBodyContains({ message: 'Compra realizada con éxito' })
  })
})
