-- ─── Cost Calculator Data ─────────────────────────────────────────────────────
-- cost_per_sqm: low / mid / high in PHP

INSERT INTO public.cost_calculator_data (region, province, cost_per_sqm_low, cost_per_sqm_mid, cost_per_sqm_high) VALUES
  ('NCR',                   'Metro Manila',        18000, 25000, 38000),
  ('Region III',            'Pampanga',            14000, 19000, 28000),
  ('Region IV-A',           'Laguna',              14500, 20000, 30000),
  ('Region IV-A',           'Batangas',            13500, 18500, 27000),
  ('Region VII',            'Cebu',                15000, 21000, 32000),
  ('Region XI',             'Davao del Sur',       13000, 18000, 26000),
  ('Region VI',             'Iloilo',              12500, 17000, 25000),
  ('Region X',              'Misamis Oriental',    12000, 16500, 24000),
  ('Region VI',             'Negros Occidental',   12000, 16000, 23000);

-- ─── Designs ──────────────────────────────────────────────────────────────────

INSERT INTO public.designs (
  title, slug, description, style,
  bedrooms, bathrooms, floor_area_sqm, lot_area_sqm,
  estimated_build_cost_min, estimated_build_cost_max,
  plan_price, floors, garage, featured, climate_notes,
  preview_images, floor_plan_images, tags
) VALUES

-- 1. Modern Filipino
(
  'Casa Rizal',
  'casa-rizal',
  'A refined Modern Filipino home that blends bahay-kubo proportions with contemporary finishes. Wide eaves, natural ventilation, and open living spaces make this ideal for tropical living. Perfect for OFW families returning home.',
  'modern_filipino',
  4, 3, 180, 250,
  2700000, 4500000,
  2499,
  2, TRUE, TRUE,
  'Deep overhangs protect against heavy rains. Cross-ventilation design reduces reliance on AC. Elevated first floor guards against flooding common in low-lying areas.',
  ARRAY[
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'
  ],
  ARRAY[
    'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800'
  ],
  ARRAY['modern', 'filipino', 'OFW', '2-storey', 'garage', 'featured']
),

-- 2. Modern Filipino (2nd)
(
  'Bahay Kubo Modern',
  'bahay-kubo-modern',
  'A contemporary reinterpretation of the traditional bahay kubo. Raised on concrete piers with bamboo-inspired cladding, open plan interiors, and a generous wraparound deck perfect for entertaining.',
  'modern_filipino',
  3, 2, 120, 180,
  1800000, 3000000,
  1499,
  1, FALSE, FALSE,
  'Elevated foundation protects against localized flooding. Bamboo-inspired siding allows airflow. Nipa-style roof pitch handles heavy monsoon rainfall.',
  ARRAY[
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800'
  ],
  ARRAY[],
  ARRAY['bungalow', 'modern-filipino', 'eco', 'budget-friendly']
),

-- 3. Tropical Modern
(
  'Batangas Modern',
  'batangas-modern',
  'A tropical modern home designed for warm coastal climates. Features louvered walls, a plunge pool-ready lanai, and a dramatic double-height living area that captures sea breezes.',
  'tropical_modern',
  4, 3, 210, 300,
  3150000, 5250000,
  2999,
  2, TRUE, TRUE,
  'Louvered walls maximise airflow. Pool-ready design — structurally engineered for a 6×3m plunge pool. Typhoon-rated roof connections per NSCP standards.',
  ARRAY[
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'
  ],
  ARRAY[],
  ARRAY['tropical', 'coastal', 'pool-ready', '2-storey', 'featured']
),

-- 4. Tropical Modern (2nd)
(
  'Davao Tropical',
  'davao-tropical',
  'Designed for Mindanao''s warm humid climate. Large cantilevered overhangs, indoor-outdoor dining terrace, and a rooftop garden that insulates against heat while providing a relaxing retreat.',
  'tropical_modern',
  3, 2, 145, 200,
  1885000, 3190000,
  1799,
  2, FALSE, FALSE,
  'Rooftop garden reduces heat island effect. Large overhangs keep walls dry during heavy rain. Natural stone finishes are heat-resistant and low-maintenance.',
  ARRAY[
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800'
  ],
  ARRAY[],
  ARRAY['tropical', 'mindanao', 'rooftop-garden', 'eco']
),

-- 5. European Modern
(
  'Villa Europea',
  'villa-europea',
  'A European-inspired residence featuring arched doorways, stone cladding, and a grand entrance foyer. Combines old-world charm with modern Philippine construction methods.',
  'european_modern',
  5, 4, 280, 400,
  4200000, 7000000,
  3499,
  2, TRUE, TRUE,
  'Stone cladding is locally sourced Rizal sandstone — durable against tropical humidity. Double-glazed windows reduce noise and heat gain. Designed with generous overhangs for rain protection.',
  ARRAY[
    'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'
  ],
  ARRAY[],
  ARRAY['european', 'luxury', 'grand', '2-storey', 'garage', 'featured']
),

-- 6. UK Contemporary
(
  'Metro Contemporary',
  'metro-contemporary',
  'A UK-influenced contemporary design adapted for the Philippine urban context. Flat roof with roof deck, floor-to-ceiling windows, and minimalist grey-and-white palettes. Built for compact city lots.',
  'uk_contemporary',
  3, 3, 160, 120,
  2400000, 4000000,
  2499,
  3, FALSE, TRUE,
  'Flat roof engineered for 150kg/m² live load including roof deck furniture. All window frames are aluminium for corrosion resistance. Waterproofing system rated for NCR annual rainfall.',
  ARRAY[
    'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800'
  ],
  ARRAY[],
  ARRAY['uk-style', 'minimalist', '3-storey', 'urban', 'roof-deck']
),

-- 7. Scandinavian
(
  'Nordic Narra',
  'nordic-narra',
  'A Scandinavian aesthetic reimagined with Philippine materials. Narra timber ceilings, white-washed walls, and clean lines create a serene, light-filled home. Designed for highland and cooler provinces.',
  'scandinavian',
  3, 2, 130, 180,
  1950000, 3250000,
  1999,
  1, FALSE, FALSE,
  'Ideal for Baguio, Tagaytay, and Bukidnon climates. Narra timber is Class-A fire resistant when treated. Pitched roof handles Baguio''s annual 3,000mm rainfall with ease.',
  ARRAY[
    'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800',
    'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800'
  ],
  ARRAY[],
  ARRAY['scandinavian', 'highland', 'baguio', 'timber', 'minimal']
),

-- 8. OFW Dream
(
  'OFW Pride Home',
  'ofw-pride-home',
  'Purpose-built for the returning OFW. Six bedrooms accommodate large extended families. A dedicated maid''s quarter, two car garage, and a covered entertainment area for homecoming celebrations.',
  'ofw_dream',
  6, 4, 250, 350,
  3750000, 6250000,
  3499,
  2, TRUE, TRUE,
  'Extra-strong typhoon straps on all roof trusses — designed for Signal No. 3+ winds. Separate utility entrance for helpers. Generator-ready electrical panel included in plan.',
  ARRAY[
    'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=800',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'
  ],
  ARRAY[],
  ARRAY['OFW', '6-bedroom', 'large-family', 'garage', 'featured']
),

-- 9. Small Lot
(
  'Metro Mini',
  'metro-mini',
  'Maximises every square metre of a 60sqm lot. A vertical 3-storey design with a roof deck, open-plan living on the ground floor, 2 bedrooms above, and a master suite on the top floor with city views.',
  'small_lot',
  3, 2, 90, 60,
  1350000, 2250000,
  999,
  3, FALSE, FALSE,
  'Structural walls carry lateral typhoon loads without interior shear walls — keeping floor plans open. Roof deck with 1.2m parapets provides safety and privacy. Compact footprint fits BLISS and socialized housing lots.',
  ARRAY[
    'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800'
  ],
  ARRAY[],
  ARRAY['small-lot', 'urban', '3-storey', 'budget-friendly', 'featured']
),

-- 10. Two-Storey Rental
(
  'Rental Plus',
  'rental-plus',
  'An income-generating design with a fully independent ground-floor apartment and a spacious owner''s unit on the upper floor. Each unit has its own entrance, water meter stub-out, and electrical panel.',
  'two_storey_rental',
  4, 4, 200, 200,
  3000000, 5000000,
  2999,
  2, FALSE, FALSE,
  'Independent plumbing stacks for each unit prevent cross-contamination and simplify billing. Soundproofing between floors using hollow blocks + insulation. Fire-rated party wall separating units.',
  ARRAY[
    'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800'
  ],
  ARRAY[],
  ARRAY['rental', 'income-generating', '2-storey', 'duplex', 'investment']
),

-- 11. Bungalow
(
  'Baguio Bungalow',
  'baguio-bungalow',
  'A charming single-storey bungalow designed for cool highland climates. Features a steep A-frame roof, stone fireplace nook, enclosed garden, and large picture windows framing mountain views.',
  'bungalow',
  3, 2, 110, 200,
  1650000, 2750000,
  1499,
  1, FALSE, FALSE,
  'Steep roof pitch (35°) handles Baguio''s heavy snowfall-equivalent rainfall and prevents moss buildup. Stone fireplace nook uses local Benguet river stone. Foundation designed for hilly terrain and clay-heavy soils.',
  ARRAY[
    'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800',
    'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800'
  ],
  ARRAY[],
  ARRAY['bungalow', 'highland', 'baguio', 'stone', 'cozy']
),

-- 12. Bungalow (2nd)
(
  'Cebu Contemporary',
  'cebu-contemporary',
  'A sleek single-storey contemporary home for the Visayas market. Open floor plan with a central atrium garden, modern kitchen island, and an outdoor shower perfect for Cebu''s beach lifestyle.',
  'bungalow',
  3, 2, 125, 175,
  1875000, 3125000,
  1799,
  1, TRUE, TRUE,
  'Atrium garden improves natural lighting and ventilation — reducing electricity costs. All concrete is Type IP blended cement for superior sulphate resistance in coastal areas. Wind-resistant clip-type metal roofing.',
  ARRAY[
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'
  ],
  ARRAY[],
  ARRAY['bungalow', 'cebu', 'visayas', 'coastal', 'contemporary', 'featured']
);

-- ─── Design Packages ──────────────────────────────────────────────────────────
-- Create Basic/Standard/Premium packages for every design

INSERT INTO public.design_packages (design_id, package_name, price, includes, file_urls)
SELECT
  d.id,
  pkg.package_name,
  pkg.price,
  pkg.includes,
  '{}'
FROM public.designs d
CROSS JOIN (
  VALUES
    (
      'Basic',
      999::NUMERIC,
      ARRAY[
        'Architectural floor plans (PDF)',
        'Front & rear elevations',
        'Site development plan',
        'Basic material specifications',
        '1 revision request'
      ]
    ),
    (
      'Standard',
      1999::NUMERIC,
      ARRAY[
        'Everything in Basic',
        'Structural drawings',
        'Electrical layout plan',
        'Plumbing layout plan',
        'Bill of Materials (BoM)',
        '3D perspective renders (4 views)',
        '3 revision requests'
      ]
    ),
    (
      'Premium',
      3499::NUMERIC,
      ARRAY[
        'Everything in Standard',
        'Full working drawings (CAD files)',
        'Detailed BoM with cost estimates',
        'Interior design mood board',
        'As-built drawing template',
        'Construction schedule (Gantt)',
        'Permit-ready document set',
        'Unlimited revisions (30 days)',
        'Dedicated architect consultation (1 hr)'
      ]
    )
) AS pkg(package_name, price, includes);

-- ─── Contractors ──────────────────────────────────────────────────────────────

INSERT INTO public.contractors (
  business_name, owner_name, description,
  city, province, region,
  coverage_areas, specializations, years_experience,
  license_number, pcab_accredited, prc_licensed,
  contact_phone, contact_email, facebook_page,
  price_range_min, price_range_max,
  is_verified, is_featured, listing_tier
) VALUES

(
  'BuildRight NCR',
  'Engr. Ramon Santos',
  'Metro Manila''s trusted mid-to-high-end residential builder. Specialises in contemporary and OFW dream homes. 120+ projects completed across NCR since 2008.',
  'Quezon City', 'Metro Manila', 'NCR',
  ARRAY['NCR', 'Bulacan', 'Rizal'],
  ARRAY['residential', 'two-storey', 'luxury', 'renovation'],
  17, 'PCAB-G-12345', TRUE, TRUE,
  '+63 917 555 0101', 'buildright@email.com', 'fb.com/buildrightnc',
  20000, 35000,
  TRUE, TRUE, 'featured'
),

(
  'Cebu Premier Builders',
  'Arch. Maria Lim',
  'Leading Cebu-based design-build firm with 85+ residential and commercial projects. Expert in tropical modern and coastal contemporary designs.',
  'Cebu City', 'Cebu', 'Region VII',
  ARRAY['Cebu', 'Mandaue', 'Lapu-Lapu', 'Mactan'],
  ARRAY['tropical-modern', 'coastal', 'design-build', 'commercial'],
  12, 'PCAB-G-67890', TRUE, TRUE,
  '+63 916 555 0202', 'cebupremier@email.com', 'fb.com/cebupremierbuilders',
  18000, 30000,
  TRUE, TRUE, 'featured'
),

(
  'Davao Home Builders',
  'Engr. Jose Reyes',
  'Mindanao''s dependable residential contractor. Known for quality workmanship, honest pricing, and on-time delivery. Serving Davao Region since 2010.',
  'Davao City', 'Davao del Sur', 'Region XI',
  ARRAY['Davao City', 'Digos', 'Tagum', 'General Santos'],
  ARRAY['residential', 'bungalow', 'budget-builds'],
  15, 'PCAB-G-11222', TRUE, FALSE,
  '+63 915 555 0303', 'davaohome@email.com', 'fb.com/davaohomebuilders',
  13000, 22000,
  TRUE, FALSE, 'verified'
),

(
  'Pampanga Construction Group',
  'Engr. Ernesto dela Cruz',
  'Central Luzon''s premier builder for OFW dream homes and large residential projects. Strong network of licensed sub-contractors across Pampanga and Bulacan.',
  'San Fernando', 'Pampanga', 'Region III',
  ARRAY['Pampanga', 'Bulacan', 'Tarlac', 'Nueva Ecija'],
  ARRAY['OFW-homes', 'large-residential', 'two-storey', 'structural'],
  20, 'PCAB-G-33444', TRUE, TRUE,
  '+63 918 555 0404', 'pampangaconst@email.com', 'fb.com/pampangaconstruction',
  15000, 26000,
  TRUE, FALSE, 'verified'
),

(
  'Laguna Build & Design',
  'Arch. Ana Villanueva',
  'Full-service architect-builder in CALABARZON. Specialises in Scandinavian and contemporary designs for families upgrading from townhouses to single-detached homes.',
  'Santa Rosa', 'Laguna', 'Region IV-A',
  ARRAY['Laguna', 'Batangas', 'Cavite', 'Quezon'],
  ARRAY['scandinavian', 'contemporary', 'small-lot', 'design-build'],
  9, 'PCAB-G-55666', FALSE, TRUE,
  '+63 919 555 0505', 'lagunabuild@email.com', 'fb.com/lagunabuilddesign',
  16000, 28000,
  FALSE, FALSE, 'free'
),

(
  'Iloilo Builders Cooperative',
  'Engr. Luis Fortes',
  'A community-focused builders cooperative serving Western Visayas. Competitive rates, licensed engineers on every project, and transparent billing.',
  'Iloilo City', 'Iloilo', 'Region VI',
  ARRAY['Iloilo', 'Capiz', 'Aklan', 'Antique'],
  ARRAY['residential', 'bungalow', 'budget-builds', 'social-housing'],
  11, 'PCAB-G-77888', TRUE, FALSE,
  '+63 920 555 0606', 'iloilobuilders@email.com', 'fb.com/iloilocooperative',
  11000, 18000,
  TRUE, FALSE, 'verified'
);

-- ─── Guides ───────────────────────────────────────────────────────────────────

INSERT INTO public.guides (title, slug, excerpt, content, category, read_time_minutes, is_free, tags) VALUES

(
  'Foundation Types for Philippine Soil Conditions',
  'foundation-types-philippine-soil',
  'Understanding which foundation is right for your lot — from shallow footings in stable NCR clay to deep pile foundations in soft Visayan silt.',
  '## Why Foundation Choice Matters in the Philippines

The Philippines has highly variable soil conditions. NCR''s stiff clay differs dramatically from coastal Visayan silt or Mindanao''s volcanic soil. Choosing the wrong foundation type is the single most common — and most expensive — mistake in Philippine residential construction.

## Common Foundation Types

### Shallow Footings (Isolated / Spread Footings)
Best for: Stable, bearing soil (>150 kPa) — common in upland NCR, Pampanga, and parts of Cebu.
Cost: ₱8,000–₱15,000 per column.

### Continuous/Strip Footings
Best for: Load-bearing walls on stable ground. Typical in bungalows.
Cost: ₱3,500–₱7,000 per linear metre.

### Raft / Mat Foundation
Best for: Soft soils with low bearing capacity. Common in flood-prone areas.
Cost: ₱1,800–₱3,500 per sqm.

### Pile Foundation (Bored or Driven)
Best for: Very soft soils, waterfront properties, high-rise.
Cost: ₱12,000–₱45,000 per pile.

## How to Know Your Soil Type
Always request a Soil Boring Report (SBR) from a licensed Geotechnical Engineer before construction. Cost: ₱15,000–₱35,000. It will save you multiples of that amount.

## Philippine Building Code Reference
Section 4.3 of the National Structural Code of the Philippines (NSCP 2015) governs foundation design. Your licensed civil engineer is required to design foundations to these standards.',
  'foundation',
  8, TRUE,
  ARRAY['foundation', 'soil', 'NSCP', 'construction', 'guide']
),

(
  'Home Electrical Wiring: Philippine Standards & Safety',
  'home-electrical-wiring-philippine-standards',
  'A homeowner''s guide to Philippine electrical standards — from PEC compliance to safe panel sizing for modern appliances.',
  '## The Philippine Electrical Code (PEC)

All residential electrical work in the Philippines must comply with the Philippine Electrical Code (PEC), administered by the Board of Electrical Engineering under the Professional Regulation Commission (PRC).

## Minimum Requirements for a Modern Home

### Main Panel (Load Center)
- Minimum 100A main breaker for homes up to 150sqm
- 200A recommended for large homes or those with air conditioning in every room
- Separate circuits: lighting, convenience outlets, aircon, kitchen appliances, water heater

### Branch Circuit Sizing
| Circuit | Wire Size | Breaker |
|---------|-----------|---------|
| Lighting | 2.0mm² | 15A |
| General outlets | 3.5mm² | 20A |
| Air conditioning | 5.5mm² | 30A |
| Electric range | 8.0mm² | 40A |

### Safety Requirements
- GFCI outlets in bathrooms, kitchen, and outdoor areas
- All outdoor wiring in conduit (PVC minimum, GI preferred)
- Grounding rod at main panel (minimum 3m depth)

## Common Mistakes to Avoid
1. Undersizing the main panel — always oversize by 20%
2. Using substandard wiring (avoid "jumbo" wire — specify THHN/THWN rated)
3. No separate AC circuit — trips the whole house
4. Skipping permits — illegal and creates problems during sale',
  'electrical',
  7, TRUE,
  ARRAY['electrical', 'PEC', 'wiring', 'safety', 'panel']
),

(
  'Plumbing Layout for Philippine Homes',
  'plumbing-layout-philippine-homes',
  'How to plan your home''s plumbing system for Philippine water pressure conditions, rainwater harvesting, and septic tank requirements.',
  '## Philippine Plumbing Standards

Residential plumbing is governed by the National Plumbing Code of the Philippines (RA 1378) and local government building regulations.

## Water Supply System

### Understanding Philippine Water Pressure
LWUA-regulated water districts typically deliver 10–20 psi at the meter — well below the 35–60 psi ideal for home fixtures. Solutions:
- **Pressure tank system**: 1,000L elevated tank + 0.5HP pump (~₱25,000)
- **Pressure booster pump**: Direct pressurisation (~₱15,000–₱30,000)

### Pipe Material Recommendations
| Application | Material | Notes |
|-------------|----------|-------|
| Cold water supply | uPVC (Class 150) | Standard, affordable |
| Hot water | CPVC or copper | uPVC degrades with heat |
| Drainage | uPVC (SDR 35) | Required by code |

## Drainage & Sewage

### Septic Tank Requirements
Per DPWH guidelines, septic tanks are mandatory unless connected to a municipal sewerage system. Minimum size: 1.2m × 2.4m × 1.5m for a 4-bedroom home.

### Rainwater Harvesting
With 2,000–3,000mm of annual rainfall in most of the Philippines, a 5,000L rainwater collection tank can significantly reduce water bills. Connect gutters → filtration → storage → pump.

## Permits Required
Your plumber must be a licensed Master Plumber (PRC-registered) to sign off on drawings for building permits.',
  'plumbing',
  6, TRUE,
  ARRAY['plumbing', 'septic', 'water', 'rainwater', 'pipes']
),

(
  'Philippine Roofing Guide: Materials, Typhoon Resistance & Costs',
  'roofing-guide-typhoon-resistance',
  'Choosing the right roof for Philippine typhoon conditions — from traditional color roof to standing seam metal and concrete deck.',
  '## Why Roofing Failures Happen

The Philippines experiences 20+ typhoons per year, with sustained winds up to 250 kph in extreme events (Signal 4+). The roof is the most vulnerable part of any home.

## Roofing Materials Compared

### Corrugated Metal (Color Roof / Pre-painted GI)
- Cost: ₱250–₱450/sqm installed
- Lifespan: 15–25 years
- Typhoon resistance: Good (with proper fastening)
- Best for: Most residential applications
- Weakness: Noise in heavy rain, thermal bridging

### Long-Span Roofing (Spandek / Trimrib)
- Cost: ₱350–₱650/sqm installed
- Lifespan: 20–30 years
- Typhoon resistance: Excellent
- Best for: Wide-span roofs, commercial-adjacent

### Standing Seam Metal
- Cost: ₱800–₱1,400/sqm installed
- Lifespan: 40–50 years
- Typhoon resistance: Superior
- Best for: Premium homes, areas with frequent typhoons

### Concrete Deck (Flat Roof / Roof Deck)
- Cost: ₱2,500–₱4,500/sqm installed (with waterproofing)
- Lifespan: 40+ years
- Typhoon resistance: Excellent
- Best for: Urban homes needing roof deck living space

## Fastening Requirements (NSCP)
- Minimum 12mm diameter anchor bolts at 600mm spacing on ridge
- Hurricane clips on every rafter-to-purlin connection
- All fasteners must be galvanised or stainless steel

## The Golden Rule
Never undersize your roof purlins. Undersized purlins are the #1 cause of roof failure during typhoons — even when the roofing material itself survives.',
  'roofing',
  9, TRUE,
  ARRAY['roofing', 'typhoon', 'metal-roof', 'waterproofing', 'NSCP']
),

(
  'Getting Your Building Permit in the Philippines: Step-by-Step',
  'building-permit-philippines-step-by-step',
  'A practical guide to securing a building permit from your local government — documents required, fees, timelines, and common rejection reasons.',
  '## Why You Need a Building Permit

A building permit is a legal requirement under the National Building Code (PD 1096). Building without one risks demolition orders, fines of up to ₱200,000, and inability to register the property title.

## Required Documents

### Primary Documents
1. Lot ownership proof (TCT / OCT / Deed of Sale)
2. Tax Declaration (updated)
3. Barangay Clearance for construction
4. Signed architectural plans (Licensed Architect)
5. Signed structural plans (Licensed Civil Engineer)
6. Signed electrical plans (Licensed Electrical Engineer)
7. Signed sanitary/plumbing plans (Licensed Master Plumber)
8. Bill of Materials (signed by Architect)
9. Specifications (signed by Architect)

### Optional but Often Required
- Soil Boring Report (for 2-storey and above)
- Homeowners Association clearance
- HLURB endorsement (for subdivisions)

## Fee Computation
Building permit fees are computed by the Office of the Building Official (OBO) based on:
- Floor area
- Type of occupancy (residential = lower rates)
- Location (each LGU has its own rate schedule)

Typical for a 150sqm residential: ₱8,000–₱25,000 total fees.

## Timeline
| Step | Duration |
|------|----------|
| Document preparation | 1–3 weeks |
| LGU submission | 1 day |
| Processing | 10–30 working days |
| Permit release | 1–3 working days after approval |

Total: 2–8 weeks depending on LGU and completeness of documents.

## Common Rejection Reasons
1. Plans not wet-signed and sealed by licensed professionals
2. Lot plan doesn't match TCT boundary
3. Missing Barangay clearance
4. Building setback violations (front: 3m, side: 1.5m, rear: 2m minimum)
5. Floor-area ratio exceeds zone limits',
  'permits',
  10, TRUE,
  ARRAY['permits', 'building-permit', 'LGU', 'OBO', 'NSCP', 'legal']
);
