import { ConsoleEmailService } from './console'
import type { EmailService } from './types'

export * from './types'
export * from './templates'

/**
 * Returns the active email service.
 * For now the console mock. Later: ResendEmailService when RESEND_API_KEY is set.
 */
export function getEmailService(): EmailService {
  return new ConsoleEmailService()
}
