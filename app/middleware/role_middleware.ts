import { HttpContext } from '@adonisjs/core/http'
import { NextFn } from '@adonisjs/core/types/http'

export default class RoleMiddleware {
  async handle(
    { auth, response }: HttpContext,
    next: NextFn,
    allowedRoles: string[] // Estos vienen de la definición de la ruta
  ) {
    // 1. Verificamos que el usuario esté autenticado (auth_middleware ya debió correr)
    const user = auth.user

    if (!user) {
      return response.unauthorized({ message: 'No autenticado' })
    }

    // 2. Verificamos si el rol del usuario está en la lista de permitidos
    if (!allowedRoles.includes(user.role)) {
      return response.forbidden({ 
        message: 'No tienes permisos suficientes para acceder a este recurso' 
      })
    }

    // 3. Si todo está bien, pasamos al siguiente paso (Controlador)
    return next()
  }
}
