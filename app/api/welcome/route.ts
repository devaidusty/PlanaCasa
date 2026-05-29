import { NextRequest, NextResponse } from 'next/server'
import { getEmailService, welcomeEmail } from '@/lib/email'

interface WelcomeBody {
  email?: string
  name?: string
}

export async function POST(request: NextRequest) {
  let body: WelcomeBody
  try {
    body = (await request.json()) as WelcomeBody
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { email, name } = body
  if (!email) {
    return NextResponse.json({ error: 'email required' }, { status: 400 })
  }

  try {
    const service = getEmailService()
    await service.send(welcomeEmail({ name: name ?? '', email }))
  } catch (err) {
    console.error('[welcome] Failed to send welcome email:', err)
  }

  return NextResponse.json({ ok: true })
}
