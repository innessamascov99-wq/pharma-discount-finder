-- Create Pharmacy Pricing Table
-- 
-- 1. New Tables
--    - pharmacy_pricing: stores pricing data from various pharmacies
--      - id (uuid, primary key)
--      - drug_id (uuid, foreign key to drugs table)
--      - drug_name (text) - normalized name for matching
--      - drug_type (text) - Brand or Generic
--      - pharmacy_name (text) - CVS, Walgreens, etc.
--      - price_usd (numeric) - retail price
--      - discount_price_usd (numeric) - discounted price if available
--      - discount_description (text) - description of discount program
--      - source_url (text) - reference URL
--      - created_at (timestamptz)
--      - updated_at (timestamptz)
--
-- 2. Security
--    - Enable RLS on pharmacy_pricing table
--    - Add policy for public read access (anonymous users can view pricing)
--
-- 3. Indexes
--    - Index on drug_id for fast lookups
--    - Index on drug_name for searching
--    - Index on pharmacy_name for filtering

CREATE TABLE IF NOT EXISTS pharmacy_pricing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  drug_id uuid REFERENCES drugs(id) ON DELETE CASCADE,
  drug_name text NOT NULL,
  drug_type text,
  pharmacy_name text NOT NULL,
  price_usd numeric(10,2),
  discount_price_usd numeric(10,2),
  discount_description text,
  source_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE pharmacy_pricing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view pharmacy pricing"
  ON pharmacy_pricing
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_pharmacy_pricing_drug_id ON pharmacy_pricing(drug_id);
CREATE INDEX IF NOT EXISTS idx_pharmacy_pricing_drug_name ON pharmacy_pricing(drug_name);
CREATE INDEX IF NOT EXISTS idx_pharmacy_pricing_pharmacy_name ON pharmacy_pricing(pharmacy_name);