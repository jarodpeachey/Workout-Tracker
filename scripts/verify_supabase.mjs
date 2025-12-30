import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dir = path.dirname(__filename);

// Simple .env parser (avoid adding dotenv dependency for this script)
async function loadEnvFile(p) {
  try {
    const txt = await fs.readFile(p, 'utf8');
    return txt.split(/\r?\n/).filter(Boolean).reduce((acc, line) => {
      const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!m) return acc;
      let val = m[2];
      // strip optional surrounding quotes
      if ((val.startsWith("\"") && val.endsWith("\"")) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      acc[m[1]] = val;
      return acc;
    }, {});
  } catch (e) {
    return {};
  }
}

const env1 = await loadEnvFile(path.resolve(process.cwd(), '.env'));
const env2 = await loadEnvFile(path.resolve(process.cwd(), '.env.local'));
const env = { ...env1, ...env2, ...process.env };

const SUPABASE_URL = env.VITE_SUPABASE_URL;
const SERVICE_ROLE = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env files.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

try {
  console.log('Querying Supabase tables: exercises, workouts, schedules...');

  const [exRes, wkRes, schRes] = await Promise.all([
    supabase.from('exercises').select('*').limit(100),
    supabase.from('workouts').select('*').limit(100),
    supabase.from('schedules').select('*').limit(100),
  ]);

  if (exRes.error) console.error('exercises error:', exRes.error.message, exRes.error);
  if (wkRes.error) console.error('workouts error:', wkRes.error.message, wkRes.error);
  if (schRes.error) console.error('schedules error:', schRes.error.message, schRes.error);

  console.log('\n--- exercises ---');
  console.log(JSON.stringify(exRes.data, null, 2));

  console.log('\n--- workouts ---');
  console.log(JSON.stringify(wkRes.data, null, 2));

  console.log('\n--- schedules ---');
  console.log(JSON.stringify(schRes.data, null, 2));
  
  // also list columns for diagnostics
  const colResEx = await supabase.from('information_schema.columns').select('column_name,data_type').eq('table_name','exercises');
  const colResWk = await supabase.from('information_schema.columns').select('column_name,data_type').eq('table_name','workouts');
  const colResSch = await supabase.from('information_schema.columns').select('column_name,data_type').eq('table_name','schedules');
  console.log('\n--- exercises columns ---');
  console.log(JSON.stringify(colResEx.data, null, 2));
  console.log('\n--- workouts columns ---');
  console.log(JSON.stringify(colResWk.data, null, 2));
  console.log('\n--- schedules columns ---');
  console.log(JSON.stringify(colResSch.data, null, 2));
} catch (e) {
  console.error('Query failed:', e.message || e);
  process.exit(1);
}
