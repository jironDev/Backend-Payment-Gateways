import { PaymentGateway, PaymentRequest, PaymentResponse } from './type.ts'

export default class Gateway2Provider implements PaymentGateway {
  public name = 'Gateway 2'
  private baseUrl = 'http://localhost:3002'

  public async charge(data: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/transacoes`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Gateway-Auth-Token': 'tk_f2198cc671b5289fa856',
          'Gateway-Auth-Secret': '3d15e8ed6131446ea7e3456728b1211f'
        },
        body: JSON.stringify({
          valor: data.amount, // Traducción a portugués
          nome: data.name,
          email: data.email,
          numeroCartao: data.cardNumber,
          cvv: data.cvv
        })
      })

      const result = await response.json() as any


      // ¿Qué responde el mock?
// console.log('Respuesta Mock Gateway 2:', result)
      
      // En Gateway2Provider.ts dentro de charge()
    if (!response.ok || result.erros) {
      const message = result.erros ? result.erros[0].message : 'Error en Gateway 2'
      throw new Error(message)
    }


       return { 
      success: true, 
      externalId: result.id 
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

public async refund(externalId: string): Promise<PaymentResponse> {
  try {
    const response = await fetch(`${this.baseUrl}/transacoes/reembolso`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Gateway-Auth-Token': 'tk_f2198cc671b5289fa856',
        'Gateway-Auth-Secret': '3d15e8ed6131446ea7e3456728b1211f'
      },
      body: JSON.stringify({ id: externalId }) // Aquí usamos el externalId
    })

    if (!response.ok) throw new Error('Falló el reembolso en Gateway 2')
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
}
