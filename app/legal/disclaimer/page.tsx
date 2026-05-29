import type { Metadata } from 'next'
import LegalLayout from '@/components/legal/LegalLayout'

export const metadata: Metadata = {
  title: 'Disclaimer',
  description:
    'Important disclaimers regarding PlanaCasa cost estimates, plans, and contractor listings.',
}

const LAST_UPDATED = 'May 29, 2026'

export default function DisclaimerPage() {
  return (
    <LegalLayout title="Disclaimer" lastUpdated={LAST_UPDATED}>
      <p>
        The information, plans, and tools provided by PlanaCasa are offered for
        general reference and educational purposes only. Please read the following
        disclaimers carefully.
      </p>

      <h2>1. Cost Estimates Are Approximate</h2>
      <p>
        All cost estimates produced by our calculator, listed on design pages, or
        included in any document are <strong>approximate and for reference
        only</strong>. They are not quotations and do not constitute a guarantee of
        actual construction cost.
      </p>

      <h2>2. Costs Vary</h2>
      <p>
        Actual construction costs vary significantly based on{' '}
        <strong>location, time, material price fluctuations, labor rates, site
        conditions, design changes, and your chosen contractor</strong>. Always
        obtain detailed, written quotations from licensed contractors before
        budgeting or committing to a project.
      </p>

      <h2>3. Consult Licensed Professionals</h2>
      <p>
        Plans sold on PlanaCasa are conceptual references. You must{' '}
        <strong>consult licensed architects and civil/structural engineers</strong>{' '}
        to review, adapt, sign, and seal plans for your specific lot, and you must{' '}
        <strong>secure all required building permits and clearances</strong> from
        your local government before construction.
      </p>

      <h2>4. PlanaCasa Is Not a Construction Company</h2>
      <p>
        PlanaCasa is a digital marketplace for house plans. We are{' '}
        <strong>not a construction company, architectural firm, or engineering
        firm</strong>. We do not build, supervise, or manage construction projects,
        and we do not provide professional engineering or architectural services.
      </p>

      <h2>5. Contractor Vetting Disclaimer</h2>
      <p>
        Contractors listed in our marketplace are independent third parties. Any
        &quot;verified&quot; badge reflects documentation (such as business
        registration or licensing) that we have reviewed at a point in time.{' '}
        <strong>Verification is not a guarantee of work quality, reliability, or
        outcome.</strong> You are responsible for performing your own due diligence
        before engaging any contractor.
      </p>

      <h2>6. No Professional Advice</h2>
      <p>
        Guides, articles, and other content on PlanaCasa are general information,
        not professional advice. Always seek qualified professional guidance for
        your specific circumstances.
      </p>

      <h2>7. Contact</h2>
      <p>
        Questions about this disclaimer? Contact us at{' '}
        <a href="mailto:support@planacasa.com">support@planacasa.com</a>.
      </p>
    </LegalLayout>
  )
}
