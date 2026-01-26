import React from 'react';
import { Dumbbell } from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';
import ExerciseCard from './ExerciseCard';

const ExerciseList = () => {
  const { exercises, setShouldOpenAddExercise, setPrefilledExerciseName } = useWorkout();

  // Check which big three lifts are missing
  const hasBench = exercises.some(ex => ex.name.toLowerCase().includes('bench'));
  const hasSquat = exercises.some(ex => ex.name.toLowerCase().includes('squat'));
  const hasDeadlift = exercises.some(ex => ex.name.toLowerCase().includes('deadlift'));

  const missingLifts = [];
  if (!hasBench) missingLifts.push({ name: 'Bench Press', key: 'bench' });
  if (!hasSquat) missingLifts.push({ name: 'Squat', key: 'squat' });
  if (!hasDeadlift) missingLifts.push({ name: 'Deadlift', key: 'deadlift' });

  return (
    <div className="space-y-4">
      {missingLifts.map((lift) => (
        <button
          key={lift.key}
          onClick={() => {
            setPrefilledExerciseName(lift.name);
            setShouldOpenAddExercise(true);
          }}
          className="card w-full border-2 border-dashed border-primary hover:bg-gray-light transition-colors text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-primary">Create {lift.name} Now</p>
              <p className="text-sm text-gray-dark font-mono">Track your progress on {lift.name}</p>
            </div>
            <Dumbbell className="w-6 h-6 text-primary" />
          </div>
        </button>
      ))}
      
      {[...exercises]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise} />
        ))}
    </div>
  );
};

export default ExerciseList;
