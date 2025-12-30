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
    <div className="card mb-6">
      <h3 className="text-xl font-bold mb-4 text-text-primary">Create Custom Workout</h3>
      <input
        type="text"
        placeholder="Workout Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input w-full mb-4"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-auto mb-4">
        {exercises.map(ex => (
          <label key={ex.id} className="flex items-center gap-2 p-2 border-2 border-dark-border bg-[rgba(0,0,0,0.1)] hover:bg-[rgba(0,0,0,0.2)] cursor-pointer transition-colors">
            <input 
              type="checkbox" 
              checked={selected.includes(ex.id)} 
              onChange={() => toggleSelect(ex.id)} 
              className="w-5 h-5 accent-green-600 cursor-pointer"
              style={{ borderRadius: '0' }}
            />
            <div>
              <div className="font-medium text-sm text-text-primary">{ex.name}</div>
              <div className="text-xs text-text-dim">{ex.type === 'reverse' ? 'Reverse Pyramid' : ex.type === 'tensetslight' ? 'UFpwrLifter Program (Light)' : 'UFpwrLifter Program'}</div>
            </div>
          </label>
        ))}
      </div>

      <div className="flex gap-2">
        <button onClick={handleSubmit} className="btn-primary flex-1">Create</button>
        <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
      </div>
    </div>
  );
};

export default AddCustomWorkoutForm;
