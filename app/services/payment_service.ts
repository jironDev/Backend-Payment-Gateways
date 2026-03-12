import Gateway from '#models/gateway'
import Gateway1Provider from './gateways/gateway1_provider.ts'
import Gateway2Provider from './gateways/gateway2_provider.ts'
import { PaymentRequest } from './gateways/type.ts'
import Product from '#models/product'


export default class PaymentService {
  // Mapa para encontrar la clase correcta según el nombre en la DB
  private providers = {
    'Gateway 1': new Gateway1Provider(),
    'Gateway 2': new Gateway2Provider(),
  }

 /**
   * Busca los productos en la DB y calcula el total real
   */
  private async calculateTotal(items: { id: number, qty: number }[]): Promise<number> {
    let total = 0

    for (const item of items) {
      const product = await Product.find(item.id)
      
      if (!product) {
        throw new Error(`Producto con ID ${item.id} no encontrado`)
      }

      total += product.amount * item.qty
    }

    return total
  }

  public async process(customerData: any, items: { id: number, qty: number }[]) {
    // 1. Calculamos el monto real desde nuestra DB
    const totalAmount = await this.calculateTotal(items)

    // 2. Obtenemos pasarelas activas por prioridad
    const activeGateways = await Gateway.query()
      .where('isActive', true)
      .orderBy('priority', 'asc')

    let lastError = ''

    // 3. Intentamos el pago (Failover)
    for (const gatewayModel of activeGateways) {
      const provider = this.providers[gatewayModel.name as keyof typeof this.providers]
      if (!provider) continue

      // Adaptamos los datos al formato que espera el Provider
      const paymentRequest: PaymentRequest = {
        ...customerData,
        amount: totalAmount
      }

      const result = await provider.charge(paymentRequest)

      if (result.success) {
        return {
          success: true,
          amount: totalAmount,
          gatewayId: gatewayModel.id,
          externalId: result.externalId
        }
      }
      
      lastError = result.error || 'Error desconocido'
    }

    return { success: false, error: `Pago fallido: ${lastError}` }
  }
}