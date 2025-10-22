-- Option 1: Send reload signal to PostgREST
NOTIFY pgrst, 'reload schema';

-- Option 2: Send config reload (more aggressive)
NOTIFY pgrst, 'reload config';

-- Option 3: Both together
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';
