import React, { createContext, useContext, useState, useEffect } from 'react';

const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [currentTab, setCurrentTab] = useState('workouts');

  useEffect(() => {
    const loadUserData = async () => {
      if (!currentUser) return;

      try {
        const exercisesResult = await window.storage.get(`user_${currentUser}_exercises`);
        if (exercisesResult) setExercises(JSON.parse(exercisesResult.value));

        const workoutsResult = await window.storage.get(`user_${currentUser}_workouts`);
        if (workoutsResult) setWorkouts(JSON.parse(workoutsResult.value));
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
      } catch (error) {
        console.error('Error saving data:', error);
      }
    };

    saveUserData();
  }, [workoutTypes, currentUser]);

  const login = (username) => {
    setCurrentUser(username);
  };

  const logout = () => {
    setCurrentUser(null);
    setExercises([]);
    setWorkouts([]);
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

  const deleteCustomWorkout = (id) => {
    setWorkouts(workouts.filter(w => w.id !== id));
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

  return (
    <WorkoutContext.Provider value={{
      currentUser,
      exercises,
      workouts,
      currentTab,
      setCurrentTab,
      login,
      logout,
      addExercise,
      updateExercise,
      deleteExercise,
      addWorkout,
      deleteCustomWorkout,
      calculateReversePyramid,
      calculateTenSets
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