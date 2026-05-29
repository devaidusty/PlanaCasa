import type { EmailMessage, EmailService } from './types'

/**
 * Console email service — logs the fully-rendered email so the flow is testable
 * while we have no Resend key. ResendEmailService slots in during Phase 7.
 */
export class ConsoleEmailService implements EmailService {
  async send(msg: EmailMessage): Promise<{ id: string }> {
    const divider = '─'.repeat(60)
    console.log(`\n┌${divider}┐`)
    console.log(`📧 EMAIL  [to: ${msg.to}] — ${msg.subject}`)
    console.log(`├${divider}┤`)
    console.log(msg.text)
    console.log(`└${divider}┘\n`)
    return { id: `console_${Date.now()}` }
  }
}
