import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 Supabase Client Initialization:');
console.log('  - VITE_SUPABASE_URL exists:', !!SUPABASE_URL);
console.log('  - VITE_SUPABASE_ANON_KEY exists:', !!SUPABASE_ANON_KEY);
console.log('  - URL type:', typeof SUPABASE_URL);
console.log('  - Key type:', typeof SUPABASE_ANON_KEY);
console.log('  - URL value:', SUPABASE_URL || 'UNDEFINED');
console.log('  - Key prefix:', SUPABASE_ANON_KEY?.substring(0, 20) || 'UNDEFINED');

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('  - Supabase client created:', !!supabase);
console.log('  - Has auth property:', !!supabase?.auth);
console.log('  - Client type:', typeof supabase);

// Expose client on window for easy console-based migration/testing (optional)
if (typeof window !== 'undefined') {
	window.supabase = supabase;
	console.log('  - Exposed on window.supabase');
}

// Note: ensure you add the environment variables `VITE_SUPABASE_URL` and
// `VITE_SUPABASE_ANON_KEY` to your .env file and run
// `npm install @supabase/supabase-js`.
