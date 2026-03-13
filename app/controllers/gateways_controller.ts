import { HttpContext } from '@adonisjs/core/http'
import Gateway from '#models/gateway'

export default class GatewaysController {
  public async updatePriority({ params, request, response }: HttpContext) {
    const gateway = await Gateway.findOrFail(params.id)
    const { priority, isActive } = request.only(['priority', 'isActive'])

    if (priority !== undefined) gateway.priority = priority
    if (isActive !== undefined) gateway.isActive = isActive

    await gateway.save()
    return response.ok({ message: 'Gateway actualizado', gateway })
  }
}
