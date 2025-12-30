import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import AddWorkoutForm from '../components/AddWorkoutForm';
import WorkoutList from '../components/WorkoutList';

const ExercisesPage = () => {
  const [showAddExercise, setShowAddExercise] = useState(false);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold uppercase tracking-wider">My Exercises</h2>
        <button
          onClick={() => setShowAddExercise(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Exercise
        </button>
      </div>

      {showAddExercise && (
        <AddWorkoutForm onClose={() => setShowAddExercise(false)} />
      )}

      <WorkoutList />
    </div>
  );
};

export default ExercisesPage;
