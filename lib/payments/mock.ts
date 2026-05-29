import type {
  CreateIntentParams,
  PaymentIntent,
  PaymentProvider,
} from './types'

/**
 * Mock payment provider — server-side only.
 * Simulates a payment processor while we have no PayMongo/Stripe keys.
 * Real adapters slot in during Phase 7.
 */
export class MockPaymentProvider implements PaymentProvider {
  readonly name = 'mock'

  // Track intents created in this process so confirmIntent can echo back amount/currency.
  private intents = new Map<string, PaymentIntent>()

  async createIntent(params: CreateIntentParams): Promise<PaymentIntent> {
    const intent: PaymentIntent = {
      id: `mock_${crypto.randomUUID()}`,
      amount: params.amount,
      currency: params.currency,
      status: 'pending',
      method: params.method,
    }
    this.intents.set(intent.id, intent)
    return intent
  }

  async confirmIntent(intentId: string): Promise<PaymentIntent> {
    const existing = this.intents.get(intentId)
    // An intentId containing 'fail' simulates a failed payment for testing.
    const status: PaymentIntent['status'] = intentId.includes('fail')
      ? 'failed'
      : 'completed'

    const confirmed: PaymentIntent = {
      id: intentId,
      amount: existing?.amount ?? 0,
      currency: existing?.currency ?? 'PHP',
      status,
      method: existing?.method ?? 'mock',
    }
    this.intents.set(intentId, confirmed)
    return confirmed
  }
}
