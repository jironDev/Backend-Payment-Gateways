import { HttpContext } from '@adonisjs/core/http'
import { NextFn } from '@adonisjs/core/types/http'

export default class RoleMiddleware {
  async handle(
    { auth, response }: HttpContext,
    next: NextFn,
    allowedRoles: string[] 
  ) {
    // 1. Check if the user is authenticated (auth_middleware should have already run)
     const user = auth.user

    if (!user) {
      return response.unauthorized({ message: 'No autenticado' })
    }

    // 2. Check if the user's role is in the allowed list
       if (!allowedRoles.includes(user.role)) {
      return response.forbidden({ 
        message: 'No tienes permisos suficientes para acceder a este recurso' 
      })
    }

    // If we reach this point, the user is authenticated and has the right role
    return next()
  }
}
