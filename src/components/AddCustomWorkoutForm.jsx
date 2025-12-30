import React, { useState } from 'react';
import { useWorkout } from '../context/WorkoutContext';

const AddCustomWorkoutForm = ({ onClose }) => {
  const { exercises, addWorkout } = useWorkout();
  const [name, setName] = useState('');
  const [selected, setSelected] = useState([]);

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSubmit = () => {
    if (!name || selected.length === 0) return;

    addWorkout({ name, exerciseIds: selected });
    setName('');
    setSelected([]);
    onClose();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-xl font-bold mb-4">Create Custom Workout</h3>
      <input
        type="text"
        placeholder="Workout Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-auto mb-4">
        {exercises.map(ex => (
          <label key={ex.id} className="flex items-center gap-2 p-2 border rounded">
            <input type="checkbox" checked={selected.includes(ex.id)} onChange={() => toggleSelect(ex.id)} />
            <div>
              <div className="font-medium">{ex.name}</div>
              <div className="text-sm text-gray-500">{ex.type === 'reverse' ? 'Reverse Pyramid' : ex.type === 'tensetslight' ? '10 Sets (Light)' : '10 Sets'}</div>
            </div>
          </label>
        ))}
      </div>

      <div className="flex gap-2">
        <button onClick={handleSubmit} className="flex-1 bg-blue-600 text-white py-2 rounded-lg">Create</button>
        <button onClick={onClose} className="flex-1 bg-gray-200 py-2 rounded-lg">Cancel</button>
      </div>
    </div>
  );
};

export default AddCustomWorkoutForm;
