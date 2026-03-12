import { UserSchema } from '#database/schema'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { type AccessToken, DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
// IMPORTANTE: Importa el decorador column si vas a definir campos manualmente
import { column } from '@adonisjs/lucid/orm'

export default class User extends compose(UserSchema, withAuthFinder(hash)) {
  static accessTokens = DbAccessTokensProvider.forModel(User)
  declare currentAccessToken?: AccessToken

  // Definimos explícitamente el rol para que TypeScript no se queje
  @column()
  declare role: 'ADMIN' | 'GERENTE' | 'FINANZAS' | 'USUARIO'

  // El método de las iniciales que ya tenías (puedes dejarlo o quitarlo, no afecta la prueba)
  get initials() {
   // Usamos el email ya que no tenemos campo fullName en la base de datos
    const [first] = this.email.split('@')
    return `${first.slice(0, 2)}`.toUpperCase()
  }
}

