import React from 'react';
import { Trash2 } from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';

const CustomWorkoutCard = ({ workout }) => {
  const { exercises, deleteCustomWorkout } = useWorkout();

  const items = workout.exerciseIds?.map(id => exercises.find(e => e.id === id)).filter(Boolean);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold">{workout.name}</h3>
        <button onClick={() => deleteCustomWorkout(workout.id)} className="text-red-600 hover:text-red-800">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {items && items.length > 0 ? (
        <ul className="list-disc pl-5 space-y-1 text-gray-700">
          {items.map(it => (
            <li key={it.id}>{it.name} — {it.type === 'reverse' ? 'Reverse Pyramid' : '10 Sets'}</li>
          ))}
        </ul>
      ) : (
        <div className="text-gray-500">No exercises selected.</div>
      )}
    </div>
  );
};

export default CustomWorkoutCard;
