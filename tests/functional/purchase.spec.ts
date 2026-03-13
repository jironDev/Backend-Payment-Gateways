import { test } from '@japa/runner'
import Product from '#models/product'

test.group('Pagos con Failover', () => {
  test('debe completar la compra usando el Gateway 2 si el Gateway 1 falla (CVV 100)', async ({ client }) => {
    // 1. Aseguramos que existe al menos un producto (el del seeder)
    const product = await Product.first()
    
    if (!product) {
      throw new Error('No hay productos en la DB para el test. Corre el seeder primero.')
    }

    // 2. Ejecutamos la petición POST a tu API
    const response = await client.post('/purchase').json({
      name: 'Tester TDD',
      email: 'tdd@test.com',
      cardNumber: '5569000000006063',
      cvv: '100', // <--- Este CVV fuerza el salto de pasarela
      products: [
        { id: product.id, qty: 1 }
      ]
    })

    // 3. Verificamos que la respuesta sea 200 OK
    // Si tu Failover funciona, el usuario recibe éxito aunque la primera pasarela fallara.
    response.assertStatus(200)
    response.assertBodyContains({ message: 'Compra realizada con éxito' })
  })
})
