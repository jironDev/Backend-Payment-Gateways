import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class UsersController {
  // List all users 
  public async index({ response }: HttpContext) {
    const users = await User.all()
    return response.ok(users)
  }

  // Create a new user (Staff)
  public async store({ request, response }: HttpContext) {
    const data = request.only(['email', 'password', 'role'])
    // The model will handle hashing the password thanks to the @beforeSave hook
    const user = await User.create(data)
    return response.created(user)
  }

  // Delete a user
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

  // If password is included, the model will hash it thanks to the @beforeSave hook
    user.merge(data)
  await user.save()

  return response.ok(user)
}

}
