import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';
import AddCustomWorkoutForm from '../components/AddCustomWorkoutForm';
import CustomWorkoutCard from '../components/CustomWorkoutCard';

const WorkoutsPage = () => {
  const [showAdd, setShowAdd] = useState(false);
  const { workouts } = useWorkout();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Workouts</h2>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          Create Workout
        </button>
      </div>

      {showAdd && <AddCustomWorkoutForm onClose={() => setShowAdd(false)} />}

      <div className="space-y-4">
        {workouts.length === 0 ? (
          <div className="text-gray-500">No custom workouts yet. Create one from your exercises.</div>
        ) : (
          workouts.map(w => <CustomWorkoutCard key={w.id} workout={w} />)
        )}
      </div>
    </div>
  );
};

export default WorkoutsPage;