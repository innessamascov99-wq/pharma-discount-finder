-- Any of these will trigger PostgREST to reload:

-- Add/modify a comment
COMMENT ON TABLE public.drugs IS 'Updated to force cache reload';

-- Add/remove a column (even temporarily)
ALTER TABLE public.drugs ADD COLUMN IF NOT EXISTS temp_reload_trigger boolean DEFAULT true;
ALTER TABLE public.drugs DROP COLUMN IF EXISTS temp_reload_trigger;

-- Modify a constraint
ALTER TABLE public.drugs DROP CONSTRAINT IF EXISTS drugs_pkey CASCADE;
ALTER TABLE public.drugs ADD PRIMARY KEY (id);

-- Grant/revoke permissions
GRANT SELECT ON public.drugs TO anon;
REVOKE SELECT ON public.drugs FROM anon;
GRANT SELECT ON public.drugs TO anon;
