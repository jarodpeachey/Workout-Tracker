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
      oneRM: parseFloat(newWorkout.oneRM) || null,
      starting_onerm: parseFloat(newWorkout.oneRM) || null,
      sixRM: newWorkout.type === 'reverse' ? parseFloat(newWorkout.sixRM) : null,
      starting_sixrm: newWorkout.type === 'reverse' ? parseFloat(newWorkout.sixRM) : null
    };

    addExercise(exercise);
    setNewWorkout({ name: '', type: 'reverse', oneRM: '', sixRM: '' });
    onClose();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-[1.125rem] mb-6">
      <h3 className="text-xl font-bold mb-4">Add New Exercise</h3>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Workout Name (e.g., Bench Press)"
          value={newWorkout.name}
          onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-light focus:outline-none focus:border-primary"
        />
        
        <select
          value={newWorkout.type}
          onChange={(e) => setNewWorkout({ ...newWorkout, type: e.target.value })}
          className="w-full px-4 py-2 border border-gray-light focus:outline-none focus:border-primary"
        >
          <option value="reverse">Reverse Pyramid (6 sets)</option>
          <option value="tensets">UFpwrLifter Program Plan</option>
          <option value="tensetslight">UFpwrLifter Program Plan (Light)</option>
        </select>
        
        <input
          type="number"
          placeholder="1 Rep Max (lbs)"
          value={newWorkout.oneRM}
          onChange={(e) => setNewWorkout({ ...newWorkout, oneRM: e.target.value })}
          className="w-full px-4 py-2 border border-gray-light focus:outline-none focus:border-primary"
        />
        
        {newWorkout.type === 'reverse' && (
          <input
            type="number"
            placeholder="6 Rep Max (lbs)"
            value={newWorkout.sixRM}
            onChange={(e) => setNewWorkout({ ...newWorkout, sixRM: e.target.value })}
            className="w-full px-4 py-2 border border-gray-light focus:outline-none focus:border-primary"
          />
        )}
        
        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            className="flex-1 text-white py-2 rounded-lg transition"
            style={{ background: "linear-gradient(135deg, #BC3908 0%, #F6AA1C 100%)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = "brightness(0.9)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = "";
            }}
          >
            Add Exercise
          </button>
          <button
            onClick={onClose}
            className="flex-1 btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddWorkoutForm;