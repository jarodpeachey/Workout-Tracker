
import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../utils/supabaseClient';

const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [exercisesLoading, setExercisesLoading] = useState(true);
  const [workouts, setWorkouts] = useState([]);
  const [workoutsLoading, setWorkoutsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('schedule');
  const [schedule, setSchedule] = useState({});
  const [globalLoading, setGlobalLoading] = useState(false);
  const [globalError, setGlobalError] = useState(false);
  const [editingWorkoutId, setEditingWorkoutId] = useState(null);
  const [shouldOpenAddWorkout, setShouldOpenAddWorkout] = useState(false);
  const [shouldOpenAddExercise, setShouldOpenAddExercise] = useState(false);

  // Auth state
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      const user = session?.user ?? null;
      setCurrentUser(user?.email ?? null);
    });
    return () => listener?.subscription?.unsubscribe?.();
  }, []);

  // Load all data for current user
  // Helper to load all exercises
  const loadExercises = async (user_id) => {
    setExercisesLoading(true);
    const { data: exRows } = await supabase.from('exercises').select('*').eq('user_id', user_id);
    setExercises(exRows || []);
    setExercisesLoading(false);
  };

  // Helper to load all workouts
  const loadWorkouts = async (user_id) => {
    setWorkoutsLoading(true);
    const { data: wkRows } = await supabase.from('workouts').select('*').eq('user_id', user_id);
    setWorkouts(wkRows || []);
    setWorkoutsLoading(false);
  };

  useEffect(() => {
    async function loadAll() {
      setGlobalLoading(true);
      setGlobalError(false);
      try {
        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;
        if (!user) {
          setExercises([]);
          setExercisesLoading(false);
          setWorkouts([]);
          setWorkoutsLoading(false);
          setSchedule({});
          setGlobalLoading(false);
          return;
        }
        const user_id = user.id;
        // Exercises
        await loadExercises(user_id);
        // Workouts
        await loadWorkouts(user_id);
        // Schedules
        const { data: schedRows } = await supabase.from('schedules').select('*').eq('user_id', user_id);
        const schedObj = {};
        (schedRows || []).forEach(r => { schedObj[r.id] = r; });
        setSchedule(schedObj);
        setGlobalLoading(false);
      } catch (err) {
        setGlobalError(true);
        setGlobalLoading(false);
      }
    }
    loadAll();
  }, [currentUser]);

  // Helper to get user id
  async function getCurrentUserId() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error(error?.message || 'No authenticated user');
    return user.id;
  }

  // Exercises
  // async function addExercise removed (duplicate)

  // async function updateExercise removed (duplicate)

  // async function deleteExercise removed (duplicate)

  // Workouts
  // async function addWorkout removed (duplicate)

  // async function updateWorkout removed (duplicate)

  // async function deleteWorkout removed (duplicate)

  // Schedules
  async function saveSchedule(dateId, workoutId, data = {}) {
    try {
      const user_id = await getCurrentUserId();
      const payload = { 
        id: dateId, 
        user_id, 
        workout_id: workoutId, 
        completed: data.completed || false,
        completed_at: data.completedAt || (data.completed ? new Date().toISOString() : null)
      };
      const { data: upserted, error } = await supabase.from('schedules').upsert([payload], { onConflict: 'id' }).select().single();
      if (error) throw error;
      setSchedule(prev => ({ ...prev, [dateId]: upserted }));
      
      // If workout is being marked as completed, increment workoutsCompleted
      if (data.completed) {
        await updateProfileCounters('workouts_completed', 1);
      }
      
      return upserted;
    } catch (err) {
      console.error('saveSchedule error', err);
      return null;
    }
  }

  async function clearSchedule(dateId) {
    try {
      const user_id = await getCurrentUserId();
      const { error } = await supabase.from('schedules').delete().match({ id: dateId, user_id });
      if (error) throw error;
      setSchedule(prev => {
        const copy = { ...prev };
        delete copy[dateId];
        return copy;
      });
      return true;
    } catch (err) {
      console.error('clearSchedule error', err);
      return false;
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error('Error signing out', e);
    }
    setCurrentUser(null);
    setExercises([]);
    setWorkouts([]);
    setSchedule({});
  };

  const addExercise = (exercise) => {
    (async () => {
      const user_id = await getCurrentUserId();
      const payload = { ...exercise, user_id };
      delete payload.id;
      const { data, error } = await supabase.from('exercises').insert([payload]).select().single();
      if (error) {
        console.error('addExercise error', error);
      } else {
        toast.success('Exercise created');
        await loadExercises(user_id);
      }
    })();
  };

  const updateExercise = (id, field, value) => {
    setExercises(prev => prev.map(w => w.id === id ? { ...w, [field]: parseFloat(value) } : w));
    (async () => {
      const user_id = await getCurrentUserId();
      const updatePayload = { [field]: parseFloat(value) };
      console.log('[updateExercise] Supabase update payload:', {
        table: 'exercises',
        updatePayload,
        match: { id, user_id }
      });
      const { data: updatedData, error, status } = await supabase
        .from('exercises')
        .update(updatePayload)
        .match({ id, user_id });
      console.log('[updateExercise] Supabase response:', { error, status, updatedData });
      if (error) {
        console.error('Failed to update exercise:', { error, status, updatedData, payload: updatePayload });
      } else {
        toast.success('Exercise updated');
      }
    })();
  };

  const deleteExercise = (id) => {
    setExercises(prev => prev.filter(w => w.id !== id));
    (async () => {
      const user_id = await getCurrentUserId();
      const { data: deleted, error, status } = await supabase.from('exercises').delete().match({ id: String(id), user_id });
      if (error) {
        console.error('Failed to delete exercise:', { error, status, deleted, id, user_id });
      } else {
        toast.success('Exercise deleted');
      }
    })();
  };

  const addWorkout = (workout) => {
    setGlobalLoading(true);
    setGlobalError(false);
    (async () => {
      try {
        const user_id = await getCurrentUserId();
        const payload = { ...workout, user_id };
        delete payload.id; // Let Supabase assign if not present
        const { data, error } = await supabase.from('workouts').insert([payload]).select().single();
        if (error) {
          setGlobalError(true);
          setGlobalLoading(false);
          console.error('Failed to insert workout:', { error, data, payload });
          return;
        }
        toast.success('Workout created');
        await loadWorkouts(user_id);
        setGlobalLoading(false);
      } catch (err) {
        setGlobalError(true);
        setGlobalLoading(false);
        console.error('addWorkout error', err);
      }
    })();
  };

  const updateWorkout = (id, updates) => {
    setWorkouts(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
    (async () => {
      const user_id = await getCurrentUserId();
      const updatePayload = { ...updates, user_id };
      const { data: updatedData, error, status } = await supabase
        .from('workouts')
        .update(updatePayload)
        .match({ id });
      if (error) {
        console.error('Failed to update workout:', { error, status, updatedData, payload: updatePayload });
      } else {
        toast.success('Workout updated');
      }
    })();
  };

  const deleteWorkout = (id) => {
    setWorkouts(prev => prev.filter(w => w.id !== id));
    (async () => {
      const user_id = await getCurrentUserId();
      const { data: deleted, error, status } = await supabase.from('workouts').delete().match({ id: String(id), user_id });
      if (error) {
        console.error('Failed to delete workout:', { error, status, deleted, id, user_id });
      } else {
        toast.success('Workout deleted');
      }
    })();
  };

  const setScheduleWorkout = (dateKey, workoutId) => {
    setSchedule(prev => {
      const wasAssigned = prev[dateKey] !== undefined;
      
      if (workoutId === null) {
        // Only delete if there was something to delete
        if (!wasAssigned) {
          // Nothing to delete, return unchanged
          return prev;
        }
        
        const updated = { ...prev };
        delete updated[dateKey];
        (async () => {
          const user_id = await getCurrentUserId();
          const { error } = await supabase.from('schedules').delete().match({ id: dateKey, user_id });
          if (error) {
            console.error('Failed to delete schedule:', { error, dateKey, user_id });
          } else {
            const date = new Date(dateKey).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            toast.success(`Workout removed from ${date}`);
            // Decrement workoutsAssigned
            await updateProfileCounters('workouts_assigned', -1);
          }
        })();
        return updated;
      }
      const updated = { ...prev, [dateKey]: workoutId };
      const isUpdating = prev[dateKey] !== undefined;
      (async () => {
        const user_id = await getCurrentUserId();
        const row = { id: dateKey, user_id, workout_id: workoutId };
        const { error } = await supabase.from('schedules').upsert([row], { onConflict: 'id' });
        if (error) {
          console.error('Failed to upsert schedule:', { error, payload: row });
        } else {
          const date = new Date(dateKey).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          toast.success(`Workout ${isUpdating ? 'updated' : 'added'} to ${date}`);
          // Increment workoutsAssigned only if this is a new assignment (not an update)
          if (!isUpdating) {
            await updateProfileCounters('workouts_assigned', 1);
          }
        }
      })();
      return updated;
    });
  };

  const roundToNearestFive = (value) => Math.round(value / 5) * 5;

  // Helper function to update profile counters
  const updateProfileCounters = async (field, increment) => {
    try {
      const user_id = await getCurrentUserId();
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user_id)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching profile:', fetchError);
        return;
      }

      if (!profile) {
        // Create profile if it doesn't exist
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{ id: user_id, [field]: increment }]);
        if (insertError) console.error('Error creating profile:', insertError);
      } else {
        // Update existing profile
        const newValue = Math.max(0, (profile[field] || 0) + increment);
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ [field]: newValue })
          .eq('id', user_id);
        if (updateError) console.error('Error updating profile:', updateError);
      }
    } catch (err) {
      console.error('Error in updateProfileCounters:', err);
    }
  };

  const calculateReversePyramid = (sixRM) => {
    const rm = parseFloat(sixRM);
    return [
      { sets: 1, reps: 5, weight: roundToNearestFive(rm * 0.3) },
      { sets: 1, reps: 5, weight: roundToNearestFive(rm * 0.4) },
      { sets: 1, reps: 5, weight: roundToNearestFive(rm * 0.5) },
      { sets: 1, reps: '6-8', weight: roundToNearestFive(rm * 1.0) },
      { sets: 1, reps: '8-10', weight: roundToNearestFive(rm * 0.9) },
      { sets: 1, reps: '10-12', weight: roundToNearestFive(rm * 0.8) }
    ];
  };

  const calculateTenSets = (oneRM) => {
    const rm = parseFloat(oneRM);
    return [
      { sets: 1, reps: 10, weight: roundToNearestFive(rm * 0.33) },
      { sets: 1, reps: 10, weight: roundToNearestFive(rm * 0.56) },
      { sets: 1, reps: 5, weight: roundToNearestFive(rm * 0.79) },
      { sets: 1, reps: 3, weight: roundToNearestFive(rm * 0.86) },
      { sets: 1, reps: 1, weight: roundToNearestFive(rm * 0.91) },
      { sets: 1, reps: 1, weight: roundToNearestFive(rm * 0.96) },
      { sets: 1, reps: 1, weight: roundToNearestFive(rm * 0.91) },
      { sets: 1, reps: 1, weight: roundToNearestFive(rm * 0.91) },
      { sets: 1, reps: 1, weight: roundToNearestFive(rm * 0.86) },
      { sets: 1, reps: 1, weight: roundToNearestFive(rm * 0.79) }
    ];
  };

  const calculateTenSetsLight = (oneRM) => {
    const rm = parseFloat(oneRM);
    return [
      { sets: 1, reps: 10, weight: roundToNearestFive(rm * 0.05) },
      { sets: 1, reps: 10, weight: roundToNearestFive(rm * 0.10) },
      { sets: 1, reps: 10, weight: roundToNearestFive(rm * 0.33) },
      { sets: 1, reps: 8, weight: roundToNearestFive(rm * 0.60) },
      { sets: 1, reps: 6, weight: roundToNearestFive(rm * 0.85) },
      { sets: 1, reps: 3, weight: roundToNearestFive(rm * 0.96) },
      { sets: 1, reps: 6, weight: roundToNearestFive(rm * 0.85) },
      { sets: 1, reps: 8, weight: roundToNearestFive(rm * 0.85) },
      { sets: 1, reps: 10, weight: roundToNearestFive(rm * 0.60) },
      { sets: 1, reps: 10, weight: roundToNearestFive(rm * 0.33) }
    ];
  };

  return (
    <WorkoutContext.Provider value={{
      currentUser,
      exercises,
      exercisesLoading,
      workouts,
      workoutsLoading,
      currentTab,
      schedule,
      setCurrentTab,
      logout,
      addExercise,
      updateExercise,
      deleteExercise,
      addWorkout,
      updateWorkout,
      deleteWorkout,
      saveSchedule,
      clearSchedule,
      setScheduleWorkout,
      calculateTenSets,
      calculateReversePyramid,
      calculateTenSetsLight,
      globalLoading,
      globalError,
      setGlobalLoading,
      setGlobalError,
      editingWorkoutId,
      setEditingWorkoutId,
      shouldOpenAddWorkout,
      setShouldOpenAddWorkout,
      shouldOpenAddExercise,
      setShouldOpenAddExercise
    }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within WorkoutProvider');
  }
  return context;
};