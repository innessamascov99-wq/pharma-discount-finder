/*
  # Create Pharmaceutical Discount Programs Table

  1. New Tables
    - `pharma_programs`
      - `id` (uuid, primary key) - Unique identifier
      - `medication_name` (text) - Brand name of the medication (e.g., Mounjaro, Januvia)
      - `generic_name` (text) - Generic name if applicable
      - `manufacturer` (text) - Pharmaceutical company name
      - `program_name` (text) - Name of the discount/assistance program
      - `program_description` (text) - Detailed description of the program
      - `eligibility_criteria` (text) - Who qualifies for this program
      - `discount_amount` (text) - Amount or percentage of discount
      - `program_url` (text) - Link to manufacturer's program page
      - `phone_number` (text) - Contact number for the program
      - `enrollment_process` (text) - Steps to enroll
      - `required_documents` (text) - Documents needed to apply
      - `active` (boolean) - Whether program is currently active
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record update timestamp
      
  2. Security
    - Enable RLS on `pharma_programs` table
    - Add policy for public read access (search is public)
    - Add policy for authenticated users to read their data
    
  3. Indexes
    - Create indexes on medication_name and manufacturer for fast search
    - Create full-text search index for comprehensive searching
*/

-- Create pharma_programs table
CREATE TABLE IF NOT EXISTS pharma_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_name text NOT NULL,
  generic_name text DEFAULT '',
  manufacturer text NOT NULL,
  program_name text NOT NULL,
  program_description text DEFAULT '',
  eligibility_criteria text DEFAULT '',
  discount_amount text DEFAULT '',
  program_url text DEFAULT '',
  phone_number text DEFAULT '',
  enrollment_process text DEFAULT '',
  required_documents text DEFAULT '',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE pharma_programs ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read active programs (public search)
CREATE POLICY "Anyone can view active programs"
  ON pharma_programs
  FOR SELECT
  USING (active = true);

-- Create indexes for fast search
CREATE INDEX IF NOT EXISTS idx_pharma_programs_medication_name 
  ON pharma_programs(medication_name);

CREATE INDEX IF NOT EXISTS idx_pharma_programs_manufacturer 
  ON pharma_programs(manufacturer);

-- Create full-text search index
CREATE INDEX IF NOT EXISTS idx_pharma_programs_search 
  ON pharma_programs 
  USING gin(to_tsvector('english', 
    medication_name || ' ' || 
    generic_name || ' ' || 
    manufacturer || ' ' || 
    program_name || ' ' || 
    program_description
  ));

-- Insert sample pharmaceutical discount programs
INSERT INTO pharma_programs (
  medication_name, 
  generic_name, 
  manufacturer, 
  program_name, 
  program_description,
  eligibility_criteria,
  discount_amount,
  program_url,
  phone_number,
  enrollment_process
) VALUES
(
  'Mounjaro',
  'tirzepatide',
  'Eli Lilly',
  'Mounjaro Savings Card',
  'Save on your Mounjaro prescription with the manufacturer savings card program.',
  'Adults with commercial insurance. Not eligible for government insurance (Medicare, Medicaid).',
  'As low as $25 for a 1-month or 3-month prescription',
  'https://www.mounjaro.com/savings-resources',
  '1-800-545-5979',
  'Download card online or call to enroll. Present card at pharmacy.'
),
(
  'Ozempic',
  'semaglutide',
  'Novo Nordisk',
  'Ozempic Savings Card',
  'Eligible patients may pay as little as $25 per prescription.',
  'For patients with commercial insurance only. Not valid for prescriptions covered by or submitted for reimbursement under Medicare, Medicaid.',
  'Pay as little as $25 per prescription',
  'https://www.ozempic.com/savings-and-resources.html',
  '1-866-310-7549',
  'Register online or by phone. Download savings card and present at pharmacy.'
),
(
  'Januvia',
  'sitagliptin',
  'Merck',
  'Merck Patient Assistance Program',
  'Provides free medication to eligible patients who cannot afford their medicine.',
  'Uninsured or underinsured patients, income limits apply.',
  'Free medication for eligible patients',
  'https://www.merckhelps.com',
  '1-800-727-5400',
  'Complete application with healthcare provider. Submit proof of income.'
),
(
  'Humira',
  'adalimumab',
  'AbbVie',
  'Humira Complete Savings Card',
  'May pay as little as $5 per month with savings card.',
  'For commercially insured patients. Income restrictions may apply.',
  'Pay as little as $5 per month',
  'https://www.humira.com/humira-complete/cost-and-copay',
  '1-800-448-6472',
  'Enroll online or call. Receive savings card to use at pharmacy.'
),
(
  'Eliquis',
  'apixaban',
  'Bristol Myers Squibb',
  'Eliquis Co-Pay Card',
  'Eligible patients may pay as little as $10 per 30-day supply.',
  'For commercially insured patients with valid prescription.',
  'As low as $10 per 30-day supply',
  'https://www.eliquis.bmscustomerconnect.com',
  '1-855-354-7847',
  'Download card online. Present at pharmacy with prescription.'
),
(
  'Xarelto',
  'rivaroxaban',
  'Janssen',
  'Xarelto Savings Card',
  'Pay as little as $0 per month for eligible patients.',
  'Commercially insured patients only. Not valid for government insurance.',
  'As low as $0 per month',
  'https://www.xarelto-us.com/savings-and-support',
  '1-888-927-3586',
  'Activate card online or by phone. Show card at pharmacy.'
),
(
  'Trulicity',
  'dulaglutide',
  'Eli Lilly',
  'Trulicity Savings Card',
  'Save on your Trulicity prescription costs.',
  'For commercially insured patients. Income and other restrictions may apply.',
  'Pay as little as $25 per prescription',
  'https://www.trulicity.com/savings-and-support',
  '1-800-545-5979',
  'Register for savings card online. Present at pharmacy with prescription.'
),
(
  'Jardiance',
  'empagliflozin',
  'Boehringer Ingelheim',
  'Jardiance Savings Card',
  'Eligible patients may save on their out-of-pocket costs.',
  'For commercially insured patients with valid prescription.',
  'Up to $300 savings per prescription',
  'https://www.jardiance.com/savings-support',
  '1-866-279-8990',
  'Download savings card. Present card at participating pharmacies.'
)
ON CONFLICT DO NOTHING;