import React, { createContext, useContext, useState, useEffect } from 'react';
import { setCookie, getCookie, deleteCookie } from '../utils/cookieUtils';

const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    return getCookie('currentUser') || null;
  });
  const [exercises, setExercises] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [currentTab, setCurrentTab] = useState('workouts');
  const [schedule, setSchedule] = useState({});

  useEffect(() => {
    const loadUserData = async () => {
      if (!currentUser) return;

      try {
        const exercisesResult = await window.storage.get(`user_${currentUser}_exercises`);
        if (exercisesResult) setExercises(JSON.parse(exercisesResult.value));

        const workoutsResult = await window.storage.get(`user_${currentUser}_workouts`);
        if (workoutsResult) setWorkouts(JSON.parse(workoutsResult.value));

        const scheduleResult = await window.storage.get(`user_${currentUser}_schedule`);
        if (scheduleResult) setSchedule(JSON.parse(scheduleResult.value));
      } catch (error) {
        console.log('No existing workout data');
      }
    };

    loadUserData();
  }, [currentUser]);

  useEffect(() => {
    const saveUserData = async () => {
      if (!currentUser) return;

      try {
        await window.storage.set(
          `user_${currentUser}_exercises`,
          JSON.stringify(exercises)
        );

        await window.storage.set(
          `user_${currentUser}_workouts`,
          JSON.stringify(workouts)
        );

        await window.storage.set(
          `user_${currentUser}_schedule`,
          JSON.stringify(schedule)
        );
      } catch (error) {
        console.error('Error saving data:', error);
      }
    };

    saveUserData();
  }, [exercises, workouts, schedule, currentUser]);

  const login = (username) => {
    setCurrentUser(username);
    setCookie('currentUser', username);
  };

  const logout = () => {
    setCurrentUser(null);
    setExercises([]);
    setWorkouts([]);
    setSchedule({});
    deleteCookie('currentUser');
  };

  const addExercise = (exercise) => {
    setExercises([...exercises, { ...exercise, id: Date.now() }]);
  };

  const updateExercise = (id, field, value) => {
    setExercises(exercises.map(w => 
      w.id === id ? { ...w, [field]: parseFloat(value) } : w
    ));
  };

  const deleteExercise = (id) => {
    setExercises(exercises.filter(w => w.id !== id));
  };

  const addWorkout = (workout) => {
    setWorkouts([...workouts, { ...workout, id: Date.now() }]);
  };

  const updateWorkout = (id, updates) => {
    setWorkouts(workouts.map(w =>
      w.id === id ? { ...w, ...updates } : w
    ));
  };

  const deleteCustomWorkout = (id) => {
    setWorkouts(workouts.filter(w => w.id !== id));
  };

  const setScheduleWorkout = (dateKey, workoutId) => {
    setSchedule(prev => {
      if (workoutId === null) {
        const updated = { ...prev };
        delete updated[dateKey];
        return updated;
      }
      return { ...prev, [dateKey]: workoutId };
    });
  };

  const calculateReversePyramid = (sixRM) => {
    const rm = parseFloat(sixRM);
    return [
      { sets: 1, reps: 5, weight: Math.round(rm * 0.3) },
      { sets: 1, reps: 5, weight: Math.round(rm * 0.4) },
      { sets: 1, reps: 5, weight: Math.round(rm * 0.5) },
      { sets: 1, reps: '6-8', weight: Math.round(rm * 1.0) },
      { sets: 1, reps: '8-10', weight: Math.round(rm * 0.9) },
      { sets: 1, reps: '10-12', weight: Math.round(rm * 0.8) }
    ];
  };

  const calculateTenSets = (oneRM) => {
    const rm = parseFloat(oneRM);
    return [
      { sets: 1, reps: 10, weight: Math.round(rm * 0.33) },
      { sets: 1, reps: 10, weight: Math.round(rm * 0.56) },
      { sets: 1, reps: 5, weight: Math.round(rm * 0.79) },
      { sets: 1, reps: 3, weight: Math.round(rm * 0.86) },
      { sets: 1, reps: 1, weight: Math.round(rm * 0.91) },
      { sets: 1, reps: 1, weight: Math.round(rm * 0.96) },
      { sets: 1, reps: 1, weight: Math.round(rm * 0.91) },
      { sets: 1, reps: 1, weight: Math.round(rm * 0.91) },
      { sets: 1, reps: 1, weight: Math.round(rm * 0.86) },
      { sets: 1, reps: 1, weight: Math.round(rm * 0.79) }
    ];
  };

  const calculateTenSetsLight = (oneRM) => {
    const rm = parseFloat(oneRM);
    return [
      { sets: 1, reps: 10, weight: Math.round(rm * 0.05) },
      { sets: 1, reps: 10, weight: Math.round(rm * 0.10) },
      { sets: 1, reps: 10, weight: Math.round(rm * 0.33) },
      { sets: 1, reps: 8, weight: Math.round(rm * 0.60) },
      { sets: 1, reps: 6, weight: Math.round(rm * 0.85) },
      { sets: 1, reps: 3, weight: Math.round(rm * 0.96) },
      { sets: 1, reps: 6, weight: Math.round(rm * 0.85) },
      { sets: 1, reps: 8, weight: Math.round(rm * 0.85) },
      { sets: 1, reps: 10, weight: Math.round(rm * 0.60) },
      { sets: 1, reps: 10, weight: Math.round(rm * 0.33) }
    ];
  };

  return (
    <WorkoutContext.Provider value={{
      currentUser,
      exercises,
      workouts,
      currentTab,
      schedule,
      setCurrentTab,
      login,
      logout,
      addExercise,
      updateExercise,
      deleteExercise,
      addWorkout,
      updateWorkout,
      deleteCustomWorkout,
      setScheduleWorkout,
      calculateReversePyramid,
      calculateTenSets,
      calculateTenSetsLight
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