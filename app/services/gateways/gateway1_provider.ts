import { PaymentGateway, PaymentRequest, PaymentResponse } from './type.ts'

export default class Gateway1Provider implements PaymentGateway {
  public name = 'Gateway 1'
  private baseUrl = 'http://localhost:3001'

  // El mock pide estas credenciales fijas para el login
  private credentials = {
    email: 'dev@betalent.tech',
    token: 'FEC9BB078BF338F464F96B48089EB498'
  }

  private async getToken(): Promise<string> {
    const response = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.credentials)
    })
    const data = await response.json() as { token: string }
    return data.token
  }

  public async charge(data: PaymentRequest): Promise<PaymentResponse> {
    try {
      const token = await this.getToken()
      
      const response = await fetch(`${this.baseUrl}/transactions`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: data.amount,
          name: data.name,
          email: data.email,
          cardNumber: data.cardNumber,
          cvv: data.cvv
        })
      })

      const result = await response.json() as any
      
      if (!response.ok) throw new Error(result.message || 'Error en Gateway 1')

      return { success: true, externalId: result.id }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

public async refund(externalId: string): Promise<PaymentResponse> {
  try {
    const token = await this.getToken()
    const response = await fetch(`${this.baseUrl}/transactions/${externalId}/charge_back`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}` 
      }
    })

    if (!response.ok) throw new Error('Falló el reembolso en Gateway 1')
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
}
