import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class UsersController {
  // Listar todos los usuarios
  public async index({ response }: HttpContext) {
    const users = await User.all()
    return response.ok(users)
  }

  // Crear un nuevo usuario (Staff)
  public async store({ request, response }: HttpContext) {
    const data = request.only(['email', 'password', 'role'])
    // El modelo se encargará de hashear la clave gracias al @beforeSave
    const user = await User.create(data)
    return response.created(user)
  }

  // Eliminar un usuario
  public async destroy({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    await user.delete()
    return response.noContent()
  }

public async show({ params, response }: HttpContext) {
  const user = await User.findOrFail(params.id)
  return response.ok(user)
}

public async update({ params, request, response }: HttpContext) {
  const user = await User.findOrFail(params.id)
  const data = request.only(['email', 'password', 'role'])

  // Si viene password, el modelo lo hasheará por el @beforeSave que pusimos
  user.merge(data)
  await user.save()

  return response.ok(user)
}

}
