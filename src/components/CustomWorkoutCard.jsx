import React, { useState } from 'react';
import { Trash2, Edit2 } from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';

const CustomWorkoutCard = ({ workout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(workout.name);
  const [editExercises, setEditExercises] = useState(workout.exerciseIds || []);
  const { exercises, deleteWorkout, updateWorkout } = useWorkout();

  const items = workout.exerciseIds?.map(id => exercises.find(e => e.id === id)).filter(Boolean);

  const toggleExercise = (id) => {
    setEditExercises(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSave = () => {
    if (editName && editExercises.length > 0) {
      updateWorkout(workout.id, { name: editName, exerciseIds: editExercises });
      setIsEditing(false);
    }
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-3">
        {isEditing ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="input flex-1"
          />
        ) : (
          <h3 className="text-lg font-bold text-text-primary">{workout.name}</h3>
        )}
        <div className="flex items-center gap-2 ml-3">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="btn-primary px-4 py-2 text-sm"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditName(workout.name);
                  setEditExercises(workout.exerciseIds || []);
                }}
                className="btn-secondary px-4 py-2 text-sm"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="text-accent-blue hover:bg-[rgba(0,0,0,0.3)] p-3 transition-all duration-150"
                title="Edit workout"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => deleteWorkout(workout.id)}
                className="text-red-600 hover:bg-[rgba(0,0,0,0.3)] p-3 transition-all duration-150"
                title="Delete workout"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <div className="text-sm font-medium text-text-primary">Select exercises:</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-auto">
            {exercises.map(ex => (
              <label key={ex.id} className="flex items-center gap-2 p-2 border-2 border-dark-border bg-[rgba(0,0,0,0.1)] hover:bg-[rgba(0,0,0,0.2)] cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={editExercises.includes(ex.id)}
                  onChange={() => toggleExercise(ex.id)}
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
        </div>
      ) : (
        <>
          {items && items.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1 text-text-primary">
              {items.map(it => (
                <li key={it.id}>{it.name} — {it.type === 'reverse' ? 'Reverse Pyramid' : it.type === 'tensetslight' ? 'UFpwrLifter Program (Light)' : 'UFpwrLifter Program'}</li>
              ))}
            </ul>
          ) : (
            <div className="text-text-dim">No exercises selected.</div>
          )}
        </>
      )}
    </div>
  );
};

export default CustomWorkoutCard;
