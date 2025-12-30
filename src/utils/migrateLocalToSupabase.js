// Migration helper: call this in the browser console after signing in (so supabase.auth session exists).
// It will look for localStorage keys matching `user_*_exercises`, `user_*_workouts`, `user_*_schedule`
// and copy their contents into Supabase tables `exercises`, `workouts`, and `schedules` using the current
// authenticated Supabase user's id as `user_id`.
//
// Usage (in browser console):
// (async () => { await window.migrateLocalToSupabase(); })();
//
// Note: make sure the tables and RLS policies described in README are configured before running.

export async function migrateLocalToSupabase() {
  if (typeof window === 'undefined' || !window.supabase) {
    throw new Error('supabase client not available on window. Ensure src/utils/supabaseClient.js sets window.supabase');
  }

  const { data: userData } = await window.supabase.auth.getUser();
  const user = userData?.user;
  if (!user) {
    throw new Error('No authenticated user. Sign in first in the app before running migration.');
  }
  const userId = user.id;

  const keys = Object.keys(localStorage);
  // find the relevant keys
  const exerciseKey = keys.find(k => k.includes('_exercises'));
  const workoutKey = keys.find(k => k.includes('_workouts'));
  const scheduleKey = keys.find(k => k.includes('_schedule'));

  // helper to upsert array items into a table
  const upsertArray = async (table, arr) => {
    if (!arr || !Array.isArray(arr) || arr.length === 0) return;
    const rows = arr.map(item => ({ id: String(item.id), user_id: userId, data: item }));
    // delete existing rows for user
    const { data: deleted, error: delErr, status: delStatus } = await window.supabase.from(table).delete().eq('user_id', userId);
    if (delErr) console.error(`Error deleting existing rows in ${table}:`, { delErr, delStatus, deleted });
    const { data: inserted, error, status } = await window.supabase.from(table).insert(rows);
    if (error) console.error(`Error inserting into ${table}:`, { error, status, inserted, rows });
  };

  try {
    if (exerciseKey) {
      const raw = localStorage.getItem(exerciseKey);
      const arr = JSON.parse(raw);
      await upsertArray('exercises', arr);
    }

    if (workoutKey) {
      const raw = localStorage.getItem(workoutKey);
      const arr = JSON.parse(raw);
      await upsertArray('workouts', arr);
    }

    if (scheduleKey) {
      const raw = localStorage.getItem(scheduleKey);
      const sched = JSON.parse(raw);
      // delete existing
      const { data: deleted, error: delErr, status: delStatus } = await window.supabase.from('schedules').delete().eq('user_id', userId);
      if (delErr) console.error('Error deleting existing schedules:', { delErr, delStatus, deleted });
      const rows = Object.entries(sched || {}).map(([dateKey, workoutId]) => ({ id: dateKey, user_id: userId, data: { workoutId } }));
      if (rows.length > 0) {
        const { data: inserted, error, status } = await window.supabase.from('schedules').insert(rows);
        if (error) console.error('Error inserting schedules:', { error, status, inserted, rows });
      }
    }

    console.log('Migration finished.');
  } catch (e) {
    console.error('Migration failed:', e);
    throw e;
  }
}

// also attach to window for convenience
if (typeof window !== 'undefined') {
  window.migrateLocalToSupabase = migrateLocalToSupabase;
}
