import { test } from '@japa/runner'
import User from '#models/user'

test.group('Seguridad de Roles', () => {
  test('un usuario con rol USUARIO no debe poder listar clientes', async ({ client }) => {
    // 1. Look for a user with the 'USUARIO' role (make sure it exists in your seeder)
    const user = await User.findByOrFail('role', 'USUARIO')

    // 2. Try to access /customers using their session (.loginAs is native to Adonis)
    const response = await client.get('/customers').loginAs(user)

    // 3. Must return 403 Forbidden
    response.assertStatus(403)
  })
})
