

import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { AccessToken } from '@adonisjs/auth/access_tokens'

export default class AuthController {
  
  
  public async login({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    try {
     
      const user = await User.verifyCredentials(email, password)

      // Generate token
      const token = await User.accessTokens.create(user)

      return response.ok({
        token: token.value!.release(),
        role: user.role,
      })
    } catch (error) {
      // Capture error and return a generic message to avoid leaking info
      return response.unauthorized({ message: 'Credenciales inválidas' })
    }
  }
  
   //Logout and remove token
   
  public async logout({ auth, response }: HttpContext) {
    // Defined type to TS aknow currentAccessToken exists on user
    const user = auth.user as User & { currentAccessToken: AccessToken }
    
    if (user && user.currentAccessToken) {
      await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    }

    return response.ok({ message: 'Sesión cerrada' })
  }
}
