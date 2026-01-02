import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
	console.error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

export const supabase = SUPABASE_URL && SUPABASE_ANON_KEY 
	? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
	: null;

// Expose client on window for easy console-based migration/testing (optional)
if (typeof window !== 'undefined') {
	window.supabase = supabase;
}

// Note: ensure you add the environment variables `VITE_SUPABASE_URL` and
// `VITE_SUPABASE_ANON_KEY` to your .env file and run
// `npm install @supabase/supabase-js`.
