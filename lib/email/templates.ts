import type { EmailMessage } from './types'

const NAVY = '#1B2A4A'
const GOLD = '#C9A84C'

function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
}

function layout(opts: { heading: string; bodyHtml: string }): string {
  const { heading, bodyHtml } = opts
  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background-color:#F8F5F0;font-family:Arial,Helvetica,sans-serif;color:#1A1A2E;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F8F5F0;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 20px rgba(27,42,74,0.08);">
            <tr>
              <td style="background-color:${NAVY};padding:28px 32px;">
                <span style="font-size:22px;font-weight:bold;color:#ffffff;">Plan<span style="color:${GOLD};">a</span>Casa</span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <h1 style="margin:0 0 16px;font-size:24px;color:${NAVY};">${heading}</h1>
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px;background-color:#F8F5F0;color:#6B7280;font-size:12px;line-height:1.6;">
                PlanaCasa — Premium house plans for the Philippines.<br/>
                Plans are conceptual reference documents. Always consult a licensed engineer or architect before construction.<br/>
                <a href="${siteUrl()}" style="color:${NAVY};">${siteUrl()}</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

function button(label: string, href: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;">
    <tr>
      <td style="border-radius:8px;background-color:${GOLD};">
        <a href="${href}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:bold;color:${NAVY};text-decoration:none;border-radius:8px;">${label}</a>
      </td>
    </tr>
  </table>`
}

export function welcomeEmail(params: { name: string; email: string }): EmailMessage {
  const { name, email } = params
  const galleryUrl = `${siteUrl()}/gallery`
  const firstName = name?.split(' ')[0] || 'there'

  const html = layout({
    heading: 'Welcome to PlanaCasa',
    bodyHtml: `
      <p style="font-size:15px;line-height:1.7;margin:0 0 16px;">Hi ${firstName},</p>
      <p style="font-size:15px;line-height:1.7;margin:0 0 16px;">
        Welcome to <strong>PlanaCasa</strong> — your home for premium, ready-to-build house plans designed
        for the Philippine climate and lifestyle. We're thrilled to have you.
      </p>
      ${button('Browse Designs', galleryUrl)}
      <h2 style="font-size:17px;color:${NAVY};margin:24px 0 8px;">How it works</h2>
      <ol style="font-size:14px;line-height:1.8;color:#1A1A2E;padding-left:20px;margin:0;">
        <li>Browse our curated gallery of architect-designed plans.</li>
        <li>Pick a package and purchase securely — plans download instantly.</li>
        <li>Connect with verified contractors in your province to start building.</li>
      </ol>
      <p style="font-size:13px;line-height:1.7;color:#6B7280;margin:24px 0 0;">
        Questions? Just reply to this email and our team will help.
      </p>`,
  })

  const text = `Welcome to PlanaCasa, ${firstName}!

We're thrilled to have you. PlanaCasa is your home for premium, ready-to-build house plans designed for the Philippine climate and lifestyle.

Browse Designs: ${galleryUrl}

How it works:
1. Browse our curated gallery of architect-designed plans.
2. Pick a package and purchase securely — plans download instantly.
3. Connect with verified contractors in your province to start building.

Questions? Just reply to this email.

(Sent to ${email})`

  return { to: email, subject: 'Welcome to PlanaCasa', html, text }
}

export function purchaseConfirmationEmail(params: {
  name: string
  email: string
  designTitle: string
  packageName: string
  amount: number
  currency: string
  downloadUrl: string
  orderId: string
}): EmailMessage {
  const {
    name,
    email,
    designTitle,
    packageName,
    amount,
    currency,
    downloadUrl,
    orderId,
  } = params
  const firstName = name?.split(' ')[0] || 'there'
  const contractorsUrl = `${siteUrl()}/constructors`
  const amountLabel =
    currency === 'PHP'
      ? `₱${Math.round(amount).toLocaleString('en-PH')}`
      : `${currency} ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  const html = layout({
    heading: 'Thank you for your purchase!',
    bodyHtml: `
      <p style="font-size:15px;line-height:1.7;margin:0 0 16px;">Hi ${firstName},</p>
      <p style="font-size:15px;line-height:1.7;margin:0 0 16px;">
        Your plans are ready. Here's a summary of your order:
      </p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eee;border-radius:8px;margin:0 0 8px;">
        <tr><td style="padding:12px 16px;font-size:14px;color:#6B7280;">Order ID</td><td style="padding:12px 16px;font-size:14px;text-align:right;color:${NAVY};font-weight:bold;">#${orderId.slice(0, 8).toUpperCase()}</td></tr>
        <tr><td style="padding:12px 16px;font-size:14px;color:#6B7280;border-top:1px solid #eee;">Design</td><td style="padding:12px 16px;font-size:14px;text-align:right;color:${NAVY};border-top:1px solid #eee;">${designTitle}</td></tr>
        <tr><td style="padding:12px 16px;font-size:14px;color:#6B7280;border-top:1px solid #eee;">Package</td><td style="padding:12px 16px;font-size:14px;text-align:right;color:${NAVY};border-top:1px solid #eee;">${packageName}</td></tr>
        <tr><td style="padding:12px 16px;font-size:14px;color:#6B7280;border-top:1px solid #eee;">Total paid</td><td style="padding:12px 16px;font-size:16px;text-align:right;color:${GOLD};font-weight:bold;border-top:1px solid #eee;">${amountLabel}</td></tr>
      </table>
      ${button('Download Your Plans', downloadUrl)}
      <p style="font-size:13px;line-height:1.7;color:#6B7280;margin:0 0 16px;">
        Your plans are available for <strong>5 downloads</strong> over <strong>30 days</strong> of access.
      </p>
      <h2 style="font-size:17px;color:${NAVY};margin:24px 0 8px;">Ready to build?</h2>
      <p style="font-size:14px;line-height:1.7;margin:0 0 8px;">
        Connect with verified, licensed contractors in your province.
      </p>
      ${button('Find a Contractor', contractorsUrl)}
      <p style="font-size:13px;line-height:1.7;color:#6B7280;margin:24px 0 0;">
        Need help? Reply to this email and our support team will assist you.
      </p>`,
  })

  const text = `Thank you for your purchase, ${firstName}!

Your plans are ready.

Order ID: #${orderId.slice(0, 8).toUpperCase()}
Design: ${designTitle}
Package: ${packageName}
Total paid: ${amountLabel}

Download Your Plans: ${downloadUrl}
(Available for 5 downloads over 30 days of access.)

Ready to build? Find a verified contractor in your province: ${contractorsUrl}

Need help? Reply to this email.

(Sent to ${email})`

  return {
    to: email,
    subject: `Your PlanaCasa plans are ready — ${designTitle}`,
    html,
    text,
  }
}

export function contractorLeadEmail(params: {
  contractorName: string
  contractorEmail: string
  leadName: string
  leadPhone: string
  leadEmail?: string
  leadLocation?: string
  message?: string
  designTitle?: string
}): EmailMessage {
  const {
    contractorName,
    contractorEmail,
    leadName,
    leadPhone,
    leadEmail,
    leadLocation,
    message,
    designTitle,
  } = params

  const dashboardUrl = siteUrl()
  const projectLine = designTitle
    ? `interested in building <strong>${designTitle}</strong>`
    : 'interested in building a home'

  const rows: Array<[string, string]> = [
    ['Name', leadName],
    ['Phone', leadPhone],
  ]
  if (leadEmail) rows.push(['Email', leadEmail])
  if (leadLocation) rows.push(['Location', leadLocation])
  if (designTitle) rows.push(['Design', designTitle])

  const rowsHtml = rows
    .map(
      ([label, value], i) =>
        `<tr><td style="padding:12px 16px;font-size:14px;color:#6B7280;${i > 0 ? 'border-top:1px solid #eee;' : ''}">${label}</td><td style="padding:12px 16px;font-size:14px;text-align:right;color:${NAVY};font-weight:bold;${i > 0 ? 'border-top:1px solid #eee;' : ''}">${value}</td></tr>`
    )
    .join('')

  const html = layout({
    heading: 'You have a new lead!',
    bodyHtml: `
      <p style="font-size:15px;line-height:1.7;margin:0 0 16px;">Hi ${contractorName},</p>
      <p style="font-size:15px;line-height:1.7;margin:0 0 16px;">
        A potential client found you on PlanaCasa and is ${projectLine}. Here are their details:
      </p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eee;border-radius:8px;margin:0 0 16px;">
        ${rowsHtml}
      </table>
      ${
        message
          ? `<h2 style="font-size:17px;color:${NAVY};margin:16px 0 8px;">Their message</h2>
             <p style="font-size:14px;line-height:1.7;margin:0 0 16px;padding:14px 16px;background-color:#F8F5F0;border-radius:8px;">${message}</p>`
          : ''
      }
      <p style="font-size:14px;line-height:1.7;margin:0 0 8px;">
        Reach out to <strong>${leadName}</strong> at <a href="tel:${leadPhone}" style="color:${NAVY};">${leadPhone}</a> as soon as you can.
      </p>
      ${button('Visit PlanaCasa', dashboardUrl)}
      <p style="font-size:13px;line-height:1.7;color:#6B7280;margin:24px 0 0;">
        PlanaCasa connects you with potential clients but is not party to any agreement between you and the client.
      </p>`,
  })

  const text = `New lead from PlanaCasa!

Hi ${contractorName},

A potential client is ${designTitle ? `interested in building ${designTitle}` : 'interested in building a home'}.

${rows.map(([label, value]) => `${label}: ${value}`).join('\n')}
${message ? `\nMessage:\n${message}\n` : ''}
Reach out to ${leadName} at ${leadPhone} as soon as you can.

(Sent to ${contractorEmail})`

  return {
    to: contractorEmail,
    subject: `New PlanaCasa lead — ${leadName}`,
    html,
    text,
  }
}
