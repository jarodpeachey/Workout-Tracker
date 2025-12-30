import React, { useState } from 'react';
import { Trash2, Edit2 } from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';

const CustomWorkoutCard = ({ workout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(workout.name);
  const [editExercises, setEditExercises] = useState(workout.exerciseIds || []);
  const { exercises, deleteCustomWorkout, updateWorkout } = useWorkout();

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
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-3">
        {isEditing ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="flex-1 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <h3 className="text-lg font-bold">{workout.name}</h3>
        )}
        <div className="flex items-center gap-2 ml-3">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditName(workout.name);
                  setEditExercises(workout.exerciseIds || []);
                }}
                className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-600 hover:text-blue-800"
                title="Edit workout"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => deleteCustomWorkout(workout.id)}
                className="text-red-600 hover:text-red-800"
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
          <div className="text-sm font-medium text-gray-700">Select exercises:</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-auto">
            {exercises.map(ex => (
              <label key={ex.id} className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={editExercises.includes(ex.id)}
                  onChange={() => toggleExercise(ex.id)}
                />
                <div>
                  <div className="font-medium text-sm">{ex.name}</div>
                  <div className="text-xs text-gray-500">{ex.type === 'reverse' ? 'Reverse Pyramid' : ex.type === 'tensetslight' ? '10 Sets (Light)' : '10 Sets'}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      ) : (
        <>
          {items && items.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              {items.map(it => (
                <li key={it.id}>{it.name} — {it.type === 'reverse' ? 'Reverse Pyramid' : it.type === 'tensetslight' ? '10 Sets (Light)' : '10 Sets'}</li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-500">No exercises selected.</div>
          )}
        </>
      )}
    </div>
  );
};

export default CustomWorkoutCard;
