#!/usr/bin/env node
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env files.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { persistSession: false }
});

(async () => {
  try {
    console.log('Querying Supabase tables: exercises, workouts, schedules...');

    const [exRes, wkRes, schRes] = await Promise.all([
      supabase.from('exercises').select('id, user_id, data, created_at').limit(100),
      supabase.from('workouts').select('id, user_id, data, created_at').limit(100),
      supabase.from('schedules').select('id, user_id, data, created_at').limit(100),
    ]);

    if (exRes.error) console.error('exercises error:', exRes.error.message);
    if (wkRes.error) console.error('workouts error:', wkRes.error.message);
    if (schRes.error) console.error('schedules error:', schRes.error.message);

    console.log('\n--- exercises ---');
    console.log(JSON.stringify(exRes.data, null, 2));

    console.log('\n--- workouts ---');
    console.log(JSON.stringify(wkRes.data, null, 2));

    console.log('\n--- schedules ---');
    console.log(JSON.stringify(schRes.data, null, 2));
  } catch (e) {
    console.error('Query failed:', e.message || e);
    process.exit(1);
  }
})();
