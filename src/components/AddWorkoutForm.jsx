import React, { useState } from 'react';
import { useWorkout } from '../context/WorkoutContext';

const AddWorkoutForm = ({ onClose }) => {
  const [newWorkout, setNewWorkout] = useState({
    name: '',
    type: 'reverse',
    oneRM: '',
    sixRM: ''
  });
  const { addExercise } = useWorkout();

  const handleSubmit = () => {
    if (!newWorkout.name) return;

    const exercise = {
      name: newWorkout.name,
      type: newWorkout.type,
      oneRM: (newWorkout.type === 'tensets' || newWorkout.type === 'tensetslight') ? parseFloat(newWorkout.oneRM) : null,
      sixRM: newWorkout.type === 'reverse' ? parseFloat(newWorkout.sixRM) : null
    };

    addExercise(exercise);
    setNewWorkout({ name: '', type: 'reverse', oneRM: '', sixRM: '' });
    onClose();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-xl font-bold mb-4">Add New Exercise</h3>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Workout Name (e.g., Bench Press)"
          value={newWorkout.name}
          onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <select
          value={newWorkout.type}
          onChange={(e) => setNewWorkout({ ...newWorkout, type: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="reverse">Reverse Pyramid (6 sets)</option>
          <option value="tensets">10 Sets Plan</option>
          <option value="tensetslight">10 Sets Plan (Light)</option>
        </select>
        
        {newWorkout.type === 'reverse' ? (
          <input
            type="number"
            placeholder="6 Rep Max (lbs)"
            value={newWorkout.sixRM}
            onChange={(e) => setNewWorkout({ ...newWorkout, sixRM: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <input
            type="number"
            placeholder="1 Rep Max (lbs)"
            value={newWorkout.oneRM}
            onChange={(e) => setNewWorkout({ ...newWorkout, oneRM: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
        
        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Add Exercise
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddWorkoutForm;