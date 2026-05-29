import type { Metadata } from 'next'
import LegalLayout from '@/components/legal/LegalLayout'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How PlanaCasa collects, uses, and protects your personal data in compliance with the Philippine Data Privacy Act and GDPR.',
}

const LAST_UPDATED = 'May 29, 2026'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'privacy@planacasa.com'

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated={LAST_UPDATED}>
      <p>
        PlanaCasa (&quot;we&quot;, &quot;us&quot;) respects your privacy. This
        policy explains what personal data we collect, how we use it, and the
        rights you have over it. We comply with the{' '}
        <strong>Philippine Data Privacy Act of 2012 (RA 10173)</strong> and, where
        applicable, the <strong>EU/UK General Data Protection Regulation
        (GDPR)</strong>.
      </p>

      <h2>1. Data We Collect</h2>
      <ul>
        <li>
          <strong>Account & contact data:</strong> name, email address, and phone
          number.
        </li>
        <li>
          <strong>Location data:</strong> city, province, and country you provide
          for cost estimates and contractor matching.
        </li>
        <li>
          <strong>Transaction data:</strong> purchase history, package selected,
          and payment status (we do not store full card numbers).
        </li>
        <li>
          <strong>Usage data:</strong> pages viewed, device and browser
          information, and analytics events.
        </li>
      </ul>

      <h2>2. How We Use Your Data</h2>
      <ul>
        <li>To process purchases and deliver your downloads.</li>
        <li>To create and manage your account.</li>
        <li>To connect you with contractors when you request it.</li>
        <li>To send transactional emails (receipts, download links).</li>
        <li>
          To send newsletters and marketing emails, where you have opted in (you
          may unsubscribe at any time).
        </li>
        <li>To improve our platform through aggregated analytics.</li>
      </ul>

      <h2>3. Cookies</h2>
      <p>
        We use cookies and similar technologies for authentication, to remember
        your preferences, and to measure site usage. You can control cookies
        through your browser settings; disabling certain cookies may affect site
        functionality.
      </p>

      <h2>4. Third-Party Services</h2>
      <p>
        We share data only as necessary with trusted service providers who process
        it on our behalf:
      </p>
      <ul>
        <li>
          <strong>Supabase</strong> — database, authentication, and file storage.
        </li>
        <li>
          <strong>PayMongo</strong> — local (PHP) payment processing.
        </li>
        <li>
          <strong>Stripe</strong> — international (USD) payment processing.
        </li>
        <li>
          <strong>Resend</strong> — transactional and marketing email delivery.
        </li>
        <li>
          <strong>Vercel</strong> — application hosting and content delivery.
        </li>
        <li>
          <strong>Google Analytics</strong> — anonymized usage analytics.
        </li>
      </ul>

      <h2>5. Your Rights</h2>
      <p>
        Under RA 10173 and the GDPR you have the right to{' '}
        <strong>access, correct, port, and request deletion</strong> of your
        personal data, and to withdraw consent at any time. To exercise any of
        these rights, contact us using the details below. We will respond within
        the timeframe required by applicable law.
      </p>

      <h2>6. Data Retention & Security</h2>
      <p>
        We retain personal data only as long as necessary to provide our services
        and to comply with legal obligations. We apply reasonable technical and
        organizational measures to protect your data, including encryption in
        transit and access controls.
      </p>

      <h2>7. Contact for Data Requests</h2>
      <p>
        For privacy questions or data requests, contact our data protection
        contact at <a href={`mailto:${ADMIN_EMAIL}`}>{ADMIN_EMAIL}</a> or{' '}
        <a href="mailto:privacy@planacasa.com">privacy@planacasa.com</a>.
      </p>

      <h2>8. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy periodically. Material changes will be
        posted on this page with an updated revision date.
      </p>
    </LegalLayout>
  )
}
