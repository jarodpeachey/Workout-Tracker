import React from 'react';
import { Dumbbell } from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';
import WorkoutCard from './WorkoutCard';

const WorkoutList = () => {
  const { exercises } = useWorkout();

  if (exercises.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Dumbbell className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p className="text-lg">No exercises yet. Add your first exercise to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {exercises.map((workout) => (
        <WorkoutCard key={workout.id} workout={workout} />
      ))}
    </div>
  );
};

export default WorkoutList;