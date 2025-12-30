import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';
import AddCustomWorkoutForm from '../components/AddCustomWorkoutForm';
import CustomWorkoutCard from '../components/CustomWorkoutCard';
import Loading from '../components/Loading';

const WorkoutsPage = () => {
  const [showAdd, setShowAdd] = useState(false);
  const { workouts } = useWorkout();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold uppercase tracking-wider">My Workouts</h2>
        <button
          onClick={() => setShowAdd(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Workout
        </button>
      </div>

      {showAdd && <AddCustomWorkoutForm onClose={() => setShowAdd(false)} />}

      <div className="space-y-4">
        {workouts.length === 0 ? (
          <Loading />
        ) : (
          workouts.map(w => <CustomWorkoutCard key={w.id} workout={w} />)
        )}
      </div>
    </div>
  );
};

export default WorkoutsPage;