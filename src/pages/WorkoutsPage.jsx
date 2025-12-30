import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';
import AddCustomWorkoutForm from '../components/AddCustomWorkoutForm';
import CustomWorkoutCard from '../components/CustomWorkoutCard';

const WorkoutsPage = () => {
  const [showAdd, setShowAdd] = useState(false);
  const { workouts, editingWorkoutId } = useWorkout();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2>My Workouts</h2>
        <button
          onClick={() => setShowAdd(true)}
          disabled={editingWorkoutId !== null}
          className={`btn btn-sm flex items-center gap-2 p-3 md:px-4 transition-all duration-150 ${
            editingWorkoutId !== null
              ? 'bg-gray-light text-gray border-gray-light cursor-not-allowed hover:bg-gray-light hover:text-gray hover:border-gray-light'
              : 'btn-primary'
          }`}
        >
          <Plus className="w-5 h-5" />
          <span className="hidden md:inline">Add Workout</span>
        </button>
      </div>

      {showAdd && <AddCustomWorkoutForm onClose={() => setShowAdd(false)} />}

      <div className="space-y-4">
        {workouts.length === 0 ? (
          <div className="text-center py-12 text-gray">
            <p className="text-lg">No workouts yet. Add your first workout to get started!</p>
          </div>
        ) : (
          workouts.map(w => <CustomWorkoutCard key={w.id} workout={w} />)
        )}
      </div>
    </div>
  );
};

export default WorkoutsPage;