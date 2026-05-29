import type { Metadata } from 'next'
import LegalLayout from '@/components/legal/LegalLayout'

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description:
    'The terms and conditions governing the use of PlanaCasa house plans and services.',
}

const LAST_UPDATED = 'May 29, 2026'

export default function TermsPage() {
  return (
    <LegalLayout title="Terms & Conditions" lastUpdated={LAST_UPDATED}>
      <p>
        Welcome to PlanaCasa. By accessing our website, purchasing a house plan,
        or using any of our services, you agree to be bound by these Terms &
        Conditions. Please read them carefully before making a purchase.
      </p>

      <h2>1. Plans Are Conceptual Reference Only</h2>
      <p>
        All house plans, drawings, renders, and documents sold or displayed on
        PlanaCasa are provided as <strong>conceptual reference materials</strong>.
        They are <strong>not a substitute for licensed, signed, and sealed
        construction documents</strong> prepared by a licensed architect or civil
        engineer for your specific lot and locality. Before construction, you must
        engage a Philippine-licensed professional to review, adapt, sign, and seal
        the plans in accordance with the National Building Code of the Philippines
        (PD 1096), local ordinances, soil conditions, and your local building
        official&apos;s requirements.
      </p>

      <h2>2. No-Refund Policy on Digital Downloads</h2>
      <p>
        Because our products are <strong>digital goods delivered instantly</strong>,
        all sales are final. Once a plan or package has been purchased and made
        available for download, <strong>no refunds, returns, or exchanges</strong>
        will be issued. By completing your purchase you acknowledge and accept this
        policy. If you experience a technical issue accessing your files, contact
        us and we will make reasonable efforts to resolve it.
      </p>

      <h2>3. Single-Use License</h2>
      <p>
        Each purchase grants you a <strong>single-use, single-build license</strong>:
        the right to construct <strong>one (1) physical structure</strong> from the
        purchased plan. The license is <strong>non-transferable</strong> and may not
        be resold, sublicensed, shared, or redistributed. You may not use the plans
        to build multiple homes, for commercial resale of the design, or distribute
        the files to third parties.
      </p>

      <h2>4. Download Limits</h2>
      <p>
        For security and license-enforcement purposes, each purchase permits a
        maximum of <strong>five (5) downloads</strong>. We recommend you save your
        files to a secure backup location after downloading. Download access may be
        time-limited as described at checkout.
      </p>

      <h2>5. Limitation of Liability</h2>
      <p>
        PlanaCasa provides plans &quot;as is&quot; and makes no warranty that they
        are fit for construction without professional adaptation. To the fullest
        extent permitted by law, <strong>PlanaCasa shall not be liable for any
        construction issues, structural failures, cost overruns, permit denials,
        delays, injuries, or any other outcomes</strong> arising from the use,
        adaptation, or construction of any plan. You assume full responsibility for
        engaging qualified professionals and securing all required permits.
      </p>

      <h2>6. Contractor Connections</h2>
      <p>
        PlanaCasa may connect you with independent contractors listed in our
        marketplace. These contractors are <strong>independent third parties</strong>,
        not employees or agents of PlanaCasa. Any agreement, contract, payment, or
        dispute between you and a contractor is <strong>strictly between the two
        parties</strong>. PlanaCasa is <strong>not a party</strong> to any such
        arrangement and is not responsible for the quality, timeliness, conduct, or
        outcome of any contractor&apos;s work. Verification badges indicate
        documentation we have reviewed; they are not a guarantee of work quality.
      </p>

      <h2>7. Intellectual Property</h2>
      <p>
        PlanaCasa (and its collaborating architects) <strong>retains all
        intellectual property rights</strong> in every design, drawing, render, and
        document offered through the platform. Your purchase grants only the limited
        single-build license described in Section 3. <strong>You do not acquire
        ownership of the design IP.</strong> Copying, reverse-engineering,
        republishing, or creating derivative works for distribution is prohibited.
      </p>

      <h2>8. Governing Law</h2>
      <p>
        These Terms are governed by and construed in accordance with the laws of the
        <strong> Republic of the Philippines</strong>. Any dispute arising out of
        or relating to these Terms shall be subject to the exclusive jurisdiction of
        the courts of the Philippines.
      </p>

      <h2>9. Changes to These Terms</h2>
      <p>
        We may update these Terms from time to time. Continued use of the platform
        after changes are posted constitutes acceptance of the revised Terms.
      </p>

      <h2>10. Contact</h2>
      <p>
        Questions about these Terms? Reach us at{' '}
        <a href="mailto:support@planacasa.com">support@planacasa.com</a>.
      </p>
    </LegalLayout>
  )
}
