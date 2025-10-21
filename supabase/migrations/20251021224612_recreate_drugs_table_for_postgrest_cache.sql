/*
  # Recreate drugs table to force PostgREST schema cache reload
  
  This migration drops and recreates the drugs table to ensure PostgREST
  recognizes it in the schema cache.
*/

-- Store existing data
CREATE TEMP TABLE drugs_backup AS SELECT * FROM public.drugs;

-- Drop the table
DROP TABLE IF EXISTS public.drugs CASCADE;

-- Recreate the table
CREATE TABLE public.drugs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_name text NOT NULL,
  generic_name text NOT NULL,
  manufacturer text NOT NULL,
  drug_class text NOT NULL,
  indication text NOT NULL DEFAULT '',
  dosage_forms text DEFAULT '',
  common_dosages text DEFAULT '',
  typical_retail_price text DEFAULT '',
  fda_approval_date date,
  description text NOT NULL DEFAULT '',
  side_effects text DEFAULT '',
  warnings text DEFAULT '',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Restore data
INSERT INTO public.drugs SELECT * FROM drugs_backup;

-- Enable RLS
ALTER TABLE public.drugs ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for anonymous access
CREATE POLICY "Allow anonymous read access to drugs"
  ON public.drugs
  FOR SELECT
  TO anon
  USING (true);

-- Create authenticated access policy
CREATE POLICY "Allow authenticated read access to drugs"
  ON public.drugs
  FOR SELECT
  TO authenticated
  USING (true);

-- Recreate indexes
CREATE INDEX IF NOT EXISTS idx_drugs_medication_name ON public.drugs(medication_name);
CREATE INDEX IF NOT EXISTS idx_drugs_generic_name ON public.drugs(generic_name);
CREATE INDEX IF NOT EXISTS idx_drugs_manufacturer ON public.drugs(manufacturer);
CREATE INDEX IF NOT EXISTS idx_drugs_drug_class ON public.drugs(drug_class);

-- Recreate foreign key relationship from drugs_programs
ALTER TABLE public.drugs_programs
  DROP CONSTRAINT IF EXISTS drugs_programs_drug_id_fkey,
  ADD CONSTRAINT drugs_programs_drug_id_fkey 
    FOREIGN KEY (drug_id) 
    REFERENCES public.drugs(id) 
    ON DELETE CASCADE;

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_drugs_updated_at ON public.drugs;
CREATE TRIGGER update_drugs_updated_at
  BEFORE UPDATE ON public.drugs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Notify PostgREST
NOTIFY pgrst, 'reload schema';
