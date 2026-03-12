import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Gateway from '#models/gateway'
import Product from '#models/product'
import User from '#models/user'



export default class extends BaseSeeder {
  async run() {
    
    // 1. Crear Gateways (Prioridad 1 para el que intentaremos primero)
    await Gateway.createMany([
      { name: 'Gateway 1', isActive: true, priority: 1 },
      { name: 'Gateway 2', isActive: true, priority: 2 },
    ])

    // 2. Crear Productos (Precios en centavos: 1000 = $10.00)
    await Product.createMany([
      { name: 'Teclado Mecánico', amount: 5000 },
      { name: 'Mouse Gamer', amount: 2500 },
      { name: 'Monitor 24"', amount: 15000 },
    ])

    // 3. Crear Usuario Admin (Para probar roles)
 await User.create({
  email: 'admin@test.com',
  password: 'password123', // Pásalo así, el modelo se encarga de encriptarlo
  // password: await hash.make('password123'),
  role: 'ADMIN',
})
  }
}
