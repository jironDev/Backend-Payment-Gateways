//version 1 debugging

// import { HttpContext } from '@adonisjs/core/http'
// import User from '#models/user'
// import hash from '@adonisjs/core/services/hash' //

// export default class AuthController {

  
// public async login({ request, response }: HttpContext) {
//   const { email, password } = request.only(['email', 'password'])

//   const user = await User.findBy('email', email)
  
//   if (!user) {
//     console.log('❌ Error: Usuario no encontrado en DB')
//     return response.unauthorized({ message: 'Usuario no encontrado' })
//   }

//   // Verificamos manualmente
//   const isMatched = await hash.verify(user.password, password)
  
//   console.log('--- DEBUG DE CREDENCIALES ---')
//   console.log('Password enviado:', password)
//   console.log('Hash en DB:', user.password)
//   console.log('¿Coinciden?:', isMatched)
//   console.log('Driver actual:', hash.use().constructor.name)
//   console.log('-----------------------------')

//   if (!isMatched) {
//     return response.unauthorized({ message: 'Clave incorrecta' })
//   }

//   const token = await User.accessTokens.create(user)
//   return response.ok({ token: token.value!.release() })
// }

// }



//Version 2 y funcional

import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { AccessToken } from '@adonisjs/auth/access_tokens'

export default class AuthController {
  
  
  public async login({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    try {
      // Ahora este método funcionará gracias al mixin en el modelo
      const user = await User.verifyCredentials(email, password)

      // Generar token de acceso
      const token = await User.accessTokens.create(user)

      return response.ok({
        token: token.value!.release(),
        role: user.role,
      })
    } catch (error) {
      // Captura si el usuario no existe o la contraseña es incorrecta
      return response.unauthorized({ message: 'Credenciales inválidas' })
    }
  }
  
   //Logout: Revoca el token actual
   
  public async logout({ auth, response }: HttpContext) {
    // Definimos el tipo para que TS reconozca currentAccessToken
    const user = auth.user as User & { currentAccessToken: AccessToken }
    
    if (user && user.currentAccessToken) {
      await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    }

    return response.ok({ message: 'Sesión cerrada' })
  }
}
