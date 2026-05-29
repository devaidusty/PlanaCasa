import { MockPaymentProvider } from './mock'
import type { PaymentProvider } from './types'

export * from './types'

/**
 * Returns the payment provider for a given method.
 * For now always the mock provider. Later:
 *   'stripe_card' → StripeProvider
 *   others        → PayMongoProvider
 */
export function getPaymentProvider(_method: string): PaymentProvider {
  return new MockPaymentProvider()
}
