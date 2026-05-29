export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed'
  method: string
}

export interface CreateIntentParams {
  amount: number
  currency: string
  method: string // 'gcash' | 'maya' | 'card' | 'bank' | 'stripe_card'
  metadata: {
    designId: string
    packageId: string
    userId: string
    buyerEmail: string
  }
}

export interface PaymentProvider {
  readonly name: string
  createIntent(params: CreateIntentParams): Promise<PaymentIntent>
  confirmIntent(intentId: string): Promise<PaymentIntent>
}
