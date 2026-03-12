
export interface PaymentResponse {
  success: boolean
  externalId?: string // El ID que nos devuelva el mock
  error?: string
}

export interface PaymentRequest {
  amount: number
  name: string
  email: string
  cardNumber: string
  cvv: string
}

export interface PaymentGateway {
  name: string
  charge(data: PaymentRequest): Promise<PaymentResponse>
  refund(externalId: string): Promise<PaymentResponse>
}