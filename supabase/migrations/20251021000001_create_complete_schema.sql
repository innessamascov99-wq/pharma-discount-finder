/*
  # Complete Database Schema Migration

  1. New Tables
    - `users` - User profiles linked to Supabase auth
      - Personal information (name, phone, address)
      - Insurance details
      - Admin and blocking flags
    - `drugs` - Pharmaceutical drugs database
      - Medication details, generic names, manufacturers
      - Drug class, indication, dosages
      - Pricing, FDA approval, descriptions
    - `programs` - Discount programs
      - Program details and types
      - Eligibility and enrollment information
      - Contact information and URLs
    - `drugs_programs` - Junction table linking drugs to programs
    - `admin_actions` - Audit log for admin activities

  2. Security
    - Enable RLS on all tables
    - Policies for authenticated users to read their own data
    - Policies for anonymous users to read drugs and programs
    - Admin-only policies for user management and audit logs

  3. Indexes
    - Performance indexes on frequently queried columns
    - Text search indexes for drug and program names
    - Foreign key indexes for joins
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  first_name text,
  last_name text,
  phone text,
  date_of_birth date,
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  zip_code text,
  country text DEFAULT 'USA',
  insurance_type text,
  insurance_provider text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  is_admin boolean NOT NULL DEFAULT false,
  is_blocked boolean NOT NULL DEFAULT false,
  last_login timestamptz
);

-- Create drugs table
CREATE TABLE IF NOT EXISTS drugs (
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

-- Create programs table
CREATE TABLE IF NOT EXISTS programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_name text NOT NULL,
  program_type text NOT NULL DEFAULT 'copay_card',
  description text NOT NULL DEFAULT '',
  manufacturer text NOT NULL,
  eligibility_criteria text NOT NULL DEFAULT '',
  income_requirements text DEFAULT '',
  insurance_requirements text DEFAULT '',
  discount_details text NOT NULL DEFAULT '',
  program_url text DEFAULT '',
  phone_number text DEFAULT '',
  email text DEFAULT '',
  enrollment_process text NOT NULL DEFAULT '',
  required_documents text NOT NULL DEFAULT '',
  coverage_duration text DEFAULT '12 months',
  renewal_required boolean NOT NULL DEFAULT true,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create drugs_programs junction table
CREATE TABLE IF NOT EXISTS drugs_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  drug_id uuid NOT NULL REFERENCES drugs(id) ON DELETE CASCADE,
  program_id uuid NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(drug_id, program_id)
);

-- Create admin_actions table
CREATE TABLE IF NOT EXISTS admin_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action_type text NOT NULL,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE drugs ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE drugs_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

CREATE POLICY "Admins can update all users"
  ON users FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

-- RLS Policies for drugs table (public read)
CREATE POLICY "Anyone can view active drugs"
  ON drugs FOR SELECT
  TO anon, authenticated
  USING (active = true);

CREATE POLICY "Admins can manage drugs"
  ON drugs FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

-- RLS Policies for programs table (public read)
CREATE POLICY "Anyone can view active programs"
  ON programs FOR SELECT
  TO anon, authenticated
  USING (active = true);

CREATE POLICY "Admins can manage programs"
  ON programs FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

-- RLS Policies for drugs_programs junction (public read)
CREATE POLICY "Anyone can view drug-program relationships"
  ON drugs_programs FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage drug-program relationships"
  ON drugs_programs FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

-- RLS Policies for admin_actions (admin only)
CREATE POLICY "Admins can view all admin actions"
  ON admin_actions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

CREATE POLICY "Admins can create admin actions"
  ON admin_actions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin);
CREATE INDEX IF NOT EXISTS idx_drugs_medication_name ON drugs(medication_name);
CREATE INDEX IF NOT EXISTS idx_drugs_generic_name ON drugs(generic_name);
CREATE INDEX IF NOT EXISTS idx_drugs_manufacturer ON drugs(manufacturer);
CREATE INDEX IF NOT EXISTS idx_drugs_active ON drugs(active);
CREATE INDEX IF NOT EXISTS idx_programs_program_name ON programs(program_name);
CREATE INDEX IF NOT EXISTS idx_programs_manufacturer ON programs(manufacturer);
CREATE INDEX IF NOT EXISTS idx_programs_active ON programs(active);
CREATE INDEX IF NOT EXISTS idx_drugs_programs_drug_id ON drugs_programs(drug_id);
CREATE INDEX IF NOT EXISTS idx_drugs_programs_program_id ON drugs_programs(program_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_admin_id ON admin_actions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_created_at ON admin_actions(created_at DESC);

-- Create search function for drugs
CREATE OR REPLACE FUNCTION search_drugs(search_term text)
RETURNS TABLE (
  id uuid,
  medication_name text,
  generic_name text,
  manufacturer text,
  drug_class text,
  indication text,
  description text,
  typical_retail_price text
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.id,
    d.medication_name,
    d.generic_name,
    d.manufacturer,
    d.drug_class,
    d.indication,
    d.description,
    d.typical_retail_price
  FROM drugs d
  WHERE d.active = true
    AND (
      d.medication_name ILIKE '%' || search_term || '%'
      OR d.generic_name ILIKE '%' || search_term || '%'
      OR d.manufacturer ILIKE '%' || search_term || '%'
      OR d.indication ILIKE '%' || search_term || '%'
    )
  ORDER BY
    CASE
      WHEN d.medication_name ILIKE search_term || '%' THEN 1
      WHEN d.generic_name ILIKE search_term || '%' THEN 2
      ELSE 3
    END,
    d.medication_name;
END;
$$ LANGUAGE plpgsql STABLE;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_drugs_updated_at BEFORE UPDATE ON drugs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON programs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to automatically create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.created_at,
    NEW.updated_at
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
