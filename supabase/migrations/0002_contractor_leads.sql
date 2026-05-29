-- ─── Contractor leads ─────────────────────────────────────────────────────────
-- Captures enquiries sent to contractors from the marketplace (Phase 5).
-- NOTE: This migration was applied to the live database via the Supabase MCP
-- during Phase 5 (migration name: add_contractor_leads). This file mirrors the
-- exact applied schema so the migrations directory is an accurate record.

CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'quoted', 'won', 'lost');

CREATE TABLE public.contractor_leads (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contractor_id UUID NOT NULL REFERENCES public.contractors(id) ON DELETE CASCADE,
  user_id       UUID REFERENCES public.users(id) ON DELETE SET NULL,
  design_id     UUID REFERENCES public.designs(id) ON DELETE SET NULL,
  name          TEXT NOT NULL,
  phone         TEXT NOT NULL,
  email         TEXT,
  location      TEXT,
  message       TEXT,
  status        lead_status NOT NULL DEFAULT 'new',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_leads_contractor ON public.contractor_leads(contractor_id);
CREATE INDEX idx_leads_user ON public.contractor_leads(user_id);

ALTER TABLE public.contractor_leads ENABLE ROW LEVEL SECURITY;

-- Anyone (including anonymous visitors) can submit a lead.
CREATE POLICY "Anyone can submit a lead"
  ON public.contractor_leads FOR INSERT WITH CHECK (TRUE);

-- A logged-in user can read leads they submitted.
CREATE POLICY "Users read own leads"
  ON public.contractor_leads FOR SELECT USING (auth.uid() = user_id);

-- Admins can read all leads.
CREATE POLICY "Admin reads all leads"
  ON public.contractor_leads FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );
