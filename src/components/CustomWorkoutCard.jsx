import React, { useState } from 'react';
import { Trash2, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useWorkout } from '../context/WorkoutContext';

const CustomWorkoutCard = ({ workout }) => {
  const [editName, setEditName] = useState(workout.name);
  const [editExercises, setEditExercises] = useState(workout.exerciseIds || []);
  const { exercises, deleteWorkout, updateWorkout, editingWorkoutId, setEditingWorkoutId } = useWorkout();
  const isEditing = editingWorkoutId === workout.id;

  const items = workout.exerciseIds?.map(id => exercises.find(e => e.id === id)).filter(Boolean);

  const toggleExercise = (id) => {
    setEditExercises(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSave = () => {
    if (!editName.trim()) {
      toast.error("Please enter a workout name");
      return;
    }
    if (editExercises.length === 0) {
      toast.error("Please select at least one exercise");
      return;
    }
    updateWorkout(workout.id, { name: editName, exerciseIds: editExercises });
    setEditingWorkoutId(null);
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
          <h3 className="text-lg font-bold text-black">{workout.name}</h3>
        )}
        <div className="flex items-center gap-2 ml-3">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="btn btn-primary"
              >
                Save
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditingWorkoutId(workout.id)}
                className="text-secondary hover:bg-gray-light p-3 transition-all duration-150 rounded-sm"
                title="Edit workout"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => deleteWorkout(workout.id)}
                className="text-danger hover:bg-gray-light p-3 transition-all duration-150 rounded-sm"
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
          <p className="font-medium text-gray-dark">Select exercises:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {exercises.map(ex => (
              <label key={ex.id} className={`card card-sm flex items-center gap-2 cursor-pointer transition-colors ${
                editExercises.includes(ex.id)
                  ? 'text-white border-success'
                  : 'bg-white text-black hover:bg-gray-light'
              }`}
              style={
                editExercises.includes(ex.id)
                  ? { background: "linear-gradient(135deg, #619624 0%, #86bd48 100%)" }
                  : {}
              }
              >
                <input
                  type="checkbox"
                  checked={editExercises.includes(ex.id)}
                  onChange={() => toggleExercise(ex.id)}
                  className="invisible w-0 h-0"
                />
                <div>
                  <p className='font-normal text-inherit'>{ex.name}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      ) : (
        <>
          {items && items.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1 text-black">
              {items.map(it => (
                <li key={it.id}>{it.name} — <span className="text-gray-dark">{it.type === 'reverse' ? 'Reverse Pyramid' : it.type === 'tensetslight' ? 'UFpwrLifter Program (Light)' : 'UFpwrLifter Program'}</span></li>
              ))}
            </ul>
          ) : (
            <div className="text-gray">No exercises selected.</div>
          )}
        </>
      )}
    </div>
  );
};

export default CustomWorkoutCard;
