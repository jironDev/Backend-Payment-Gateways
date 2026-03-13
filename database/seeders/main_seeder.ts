import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Gateway from '#models/gateway'
import Product from '#models/product'
import User from '#models/user'



export default class extends BaseSeeder {
  async run() {
    
    // 1. Create Gateways (Priority 1 for the one we will try first)
        await Gateway.createMany([
      { name: 'Gateway 1', isActive: true, priority: 1 },
      { name: 'Gateway 2', isActive: true, priority: 2 },
    ])

    // 2. Create Products (Prices in cents: 1000 = $10.00)
      await Product.createMany([
      { name: 'Teclado Mecánico', amount: 5000 },
      { name: 'Mouse Gamer', amount: 2500 },
      { name: 'Monitor 24"', amount: 15000 },
    ])

    // 3. Create Admin User (To test roles)
 await User.create({
  email: 'admin@test.com',
  password: 'password123', 
  role: 'ADMIN',
})

// 4. Create Regular User (To test roles)
await User.create({
  email: 'user@test.com',
  password: 'password123', 
  role: 'USUARIO',
})

  }
}
