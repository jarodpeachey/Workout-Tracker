
import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../utils/supabaseClient';
import { getUserTimezone, getTodayLocalDate } from '../utils/timezoneUtils';

const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
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
  const [prefilledExerciseName, setPrefilledExerciseName] = useState('');

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

  // Helper to reload profile data
  const reloadProfileData = async () => {
    try {
      const user_id = await getCurrentUserId();
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user_id)
        .single();
      
      if (!error && profile) {
        // Query counts from schedules table
        const { data: schedules, error: schedError } = await supabase
          .from('schedules')
          .select('*')
          .eq('user_id', user_id);
        
        if (!schedError && schedules) {
          // Only count past workouts (today and before)
          const today = getTodayLocalDate();
          // console.log('[Stats Debug] Today:', today);
          // console.log('[Stats Debug] All schedules:', schedules);
          const pastSchedules = schedules.filter(s => s.id <= today);
          // console.log('[Stats Debug] Past schedules:', pastSchedules);
          profile.workouts_assigned = pastSchedules.length;
          profile.workouts_completed = pastSchedules.filter(s => s.completed).length;
          // console.log('[Stats Debug] Assigned:', profile.workouts_assigned, 'Completed:', profile.workouts_completed);
        }
        
        setProfileData(profile);
      }
    } catch (err) {
      console.error('Error reloading profile data:', err);
    }
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
          setProfileData(null);
          setGlobalLoading(false);
          return;
        }
        const user_id = user.id;
        // Profile - ensure it exists with timezone
        let { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('id', user_id).single();
        
        if (profileError && profileError.code === 'PGRST116') {
          // Profile doesn't exist, create it
          const userTimezone = getUserTimezone();
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert([{ 
              id: user_id, 
              timezone: userTimezone,
              workouts_created: 0, 
              workouts_completed: 0, 
              workouts_assigned: 0 
            }])
            .select()
            .single();
          
          if (!insertError) {
            profile = newProfile;
          }
        } else if (profile && !profile.timezone) {
          // Profile exists but no timezone, update it
          const userTimezone = getUserTimezone();
          await supabase
            .from('profiles')
            .update({ timezone: userTimezone })
            .eq('id', user_id);
          profile.timezone = userTimezone;
        }
        
        setProfileData(profile || { workouts_created: 0, workouts_completed: 0, workouts_assigned: 0, timezone: getUserTimezone() });
        // Exercises
        await loadExercises(user_id);
        // Workouts
        await loadWorkouts(user_id);
        // Schedules
        const { data: schedRows } = await supabase.from('schedules').select('*').eq('user_id', user_id);
        const schedObj = {};
        (schedRows || []).forEach(r => { schedObj[r.id] = r; });
        setSchedule(schedObj);
        
        // Update profile with actual counts from schedules
        if (profile && schedRows) {
          // Only count past workouts (today and before)
          const today = getTodayLocalDate();
          // console.log('[Stats Debug LoadAll] Today:', today);
          // console.log('[Stats Debug LoadAll] All schedules:', schedRows);
          const pastSchedules = schedRows.filter(s => s.id <= today);
          // console.log('[Stats Debug LoadAll] Past schedules:', pastSchedules);
          profile.workouts_assigned = pastSchedules.length;
          profile.workouts_completed = pastSchedules.filter(s => s.completed).length;
          // console.log('[Stats Debug LoadAll] Assigned:', profile.workouts_assigned, 'Completed:', profile.workouts_completed);
          setProfileData(profile);
        }
        
        // Calculate lift_total after exercises are loaded
        setTimeout(() => {
          updateLiftTotal();
        }, 500);
        
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
      
      // If workout is being marked as completed, reload profile to update counts
      if (data.completed) {
        await reloadProfileData();
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
    setProfileData(null);
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
      // console.log('[updateExercise] Supabase update payload:', {
        table: 'exercises',
        updatePayload,
        match: { id, user_id }
      });
      const { data: updatedData, error, status } = await supabase
        .from('exercises')
        .update(updatePayload)
        .match({ id, user_id });
      // console.log('[updateExercise] Supabase response:', { error, status, updatedData });
      if (error) {
        console.error('Failed to update exercise:', { error, status, updatedData, payload: updatePayload });
      } else {
        toast.success('Exercise updated');
        
        // If updating oneRM for bench/squat/deadlift, recalculate lift_total
        if (field === 'oneRM') {
          const exercise = exercises.find(ex => ex.id === id);
          const exerciseName = exercise?.name?.toLowerCase() || '';
          if (exerciseName.includes('bench') || exerciseName.includes('squat') || exerciseName.includes('deadlift')) {
            // Wait a bit for state to update, then recalculate
            setTimeout(() => {
              updateLiftTotal();
            }, 500);
          }
        }
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
      const updatePayload = { ...updates };
      const { data: updatedData, error, status } = await supabase
        .from('workouts')
        .update(updatePayload)
        .match({ id, user_id });
      if (error) {
        console.error('Failed to update workout:', { error, status, updatedData, payload: updatePayload });
      } else {
        toast.success('Workout updated');
      }
    })();
  };

  const deleteWorkout = (id) => {
    (async () => {
      try {
        const user_id = await getCurrentUserId();
        
        // First, delete all schedule entries that reference this workout
        const { error: schedError } = await supabase
          .from('schedules')
          .delete()
          .match({ workout_id: String(id), user_id });
        
        if (schedError) {
          console.error('Failed to delete schedules:', schedError);
          return;
        }
        
        // Then delete the workout itself
        const { error } = await supabase
          .from('workouts')
          .delete()
          .match({ id: String(id), user_id });
        
        if (error) {
          console.error('Failed to delete workout:', error);
        } else {
          // Only update local state after successful deletion
          setWorkouts(prev => prev.filter(w => w.id !== id));
          toast.success('Workout deleted');
        }
      } catch (err) {
        console.error('Error deleting workout:', err);
      }
    })();
  };

  const setScheduleWorkout = (dateKey, workoutId) => {
    setSchedule(prev => {
      const scheduleEntry = prev[dateKey];
      const existingWorkoutId = scheduleEntry?.workout_id || scheduleEntry;
      const wasAssigned = existingWorkoutId !== undefined && existingWorkoutId !== null;
      
      if (workoutId === null) {
        // Always try to delete from Supabase when explicitly setting to null
        const updated = { ...prev };
        delete updated[dateKey];
        
        // Clear localStorage for the removed workout
        if (existingWorkoutId) {
          const storageKey = `workout-${dateKey}-${existingWorkoutId}`;
          localStorage.removeItem(storageKey);
          localStorage.removeItem(`${storageKey}-1rm`);
        }
        
        (async () => {
          const user_id = await getCurrentUserId();
          const { error } = await supabase.from('schedules').delete().match({ id: dateKey, user_id });
          if (error) {
            console.error('Failed to delete schedule:', { error, dateKey, user_id });
          } else {
            const date = new Date(dateKey).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            toast.success(`Workout removed from ${date}`);
            // Reload profile to update counts
            await reloadProfileData();
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
          // Reload profile to update counts
          await reloadProfileData();
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
      
      // Reload profile data to update UI
      await reloadProfileData();
    } catch (err) {
      console.error('Error in updateProfileCounters:', err);
    }
  };

  // Helper function to update lift_total in profile
  const updateLiftTotal = async () => {
    try {
      const user_id = await getCurrentUserId();
      
      // Query exercises directly from Supabase to get the latest data
      const { data: exercisesList, error: exError } = await supabase
        .from('exercises')
        .select('*')
        .eq('user_id', user_id);
      
      if (exError) {
        console.error('Error fetching exercises for lift_total:', exError);
        return;
      }
      
      // Find the big 3 lifts
      const bench = exercisesList?.find((ex) => ex.name.toLowerCase().includes('bench'));
      const squat = exercisesList?.find((ex) => ex.name.toLowerCase().includes('squat'));
      const deadlift = exercisesList?.find((ex) => ex.name.toLowerCase().includes('deadlift'));

      const benchWeight = bench?.oneRM || 0;
      const squatWeight = squat?.oneRM || 0;
      const deadliftWeight = deadlift?.oneRM || 0;
      const total = benchWeight + squatWeight + deadliftWeight;

      const { error } = await supabase
        .from('profiles')
        .update({ lift_total: total })
        .eq('id', user_id);

      if (error) {
        console.error('Error updating lift_total:', error);
      } else {
        // Reload profile data to update UI
        await reloadProfileData();
      }
    } catch (err) {
      console.error('Error in updateLiftTotal:', err);
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
      { sets: 1, reps: 3, weight: roundToNearestFive(rm * 0.86) },
      { sets: 1, reps: 5, weight: roundToNearestFive(rm * 0.79) }
    ];
  };

  const calculateTenSetsLight = (oneRM) => {
    const rm = parseFloat(oneRM);
    return [
      { sets: 1, reps: 10, weight: roundToNearestFive(rm * 0.05) },
      { sets: 1, reps: 10, weight: roundToNearestFive(rm * 0.10) },
      { sets: 1, reps: 5, weight: roundToNearestFive(rm * 0.33) },
      { sets: 1, reps: 3, weight: roundToNearestFive(rm * 0.60) },
      { sets: 1, reps: 1, weight: roundToNearestFive(rm * 0.85) },
      { sets: 1, reps: 1, weight: roundToNearestFive(rm * 0.96) },
      { sets: 1, reps: 1, weight: roundToNearestFive(rm * 0.85) },
      { sets: 1, reps: 1, weight: roundToNearestFive(rm * 0.85) },
      { sets: 1, reps: 3, weight: roundToNearestFive(rm * 0.60) },
      { sets: 1, reps: 5, weight: roundToNearestFive(rm * 0.33) }
    ];
  };

  const calculate1RMProgression = (oneRM) => {
    const rm = parseFloat(oneRM);
    return [
      { sets: 1, reps: 10, weight: roundToNearestFive(rm * 0.33) },
      { sets: 1, reps: 10, weight: roundToNearestFive(rm * 0.56) },
      { sets: 1, reps: 5, weight: roundToNearestFive(rm * 0.79) },
      { sets: 1, reps: 3, weight: roundToNearestFive(rm * 0.86) },
      { sets: 1, reps: 1, weight: roundToNearestFive(rm * 0.91) },
      { sets: 1, reps: 1, weight: roundToNearestFive(rm * 0.96) },
      { sets: 1, reps: 1, weight: roundToNearestFive(rm * 1.00) },
      { sets: 1, reps: 1, weight: roundToNearestFive(rm * 1.00) + 5 },
      { sets: 1, reps: 1, weight: roundToNearestFive(rm * 1.00) + 10 },
      { sets: 1, reps: 1, weight: roundToNearestFive(rm * 1.00) + 15 },
      { sets: 1, reps: 1, weight: roundToNearestFive(rm * 1.00) + 20 }
    ];
  };

  return (
    <WorkoutContext.Provider value={{
      currentUser,
      profileData,
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
      calculate1RMProgression,
      globalLoading,
      globalError,
      setGlobalLoading,
      setGlobalError,
      editingWorkoutId,
      setEditingWorkoutId,
      shouldOpenAddWorkout,
      setShouldOpenAddWorkout,
      shouldOpenAddExercise,
      setShouldOpenAddExercise,
      prefilledExerciseName,
      setPrefilledExerciseName
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