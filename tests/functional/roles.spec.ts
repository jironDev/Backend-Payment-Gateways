import { test } from '@japa/runner'
import User from '#models/user'

test.group('Seguridad de Roles', () => {
  test('un usuario con rol USUARIO no debe poder listar clientes', async ({ client }) => {
    // 1. Buscamos un usuario con rol 'USUARIO' (asegúrate que exista en tu seeder)
    const user = await User.findByOrFail('role', 'USUARIO')

    // 2. Intentamos entrar a /customers usando su sesión (.loginAs es nativo de Adonis)
    const response = await client.get('/customers').loginAs(user)

    // 3. Debe dar 403 Forbidden
    response.assertStatus(403)
  })
})
