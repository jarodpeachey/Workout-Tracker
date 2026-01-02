import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';
import Modal from './Modal';

const AddWorkoutForm = ({ onClose, initialName = '' }) => {
  const [newWorkout, setNewWorkout] = useState({
    name: initialName,
    type: 'reverse',
    oneRM: '',
    sixRM: ''
  });
  const [showModal, setShowModal] = useState(false);
  const { addExercise } = useWorkout();

  // Update name if initialName changes
  React.useEffect(() => {
    if (initialName) {
      setNewWorkout(prev => ({ ...prev, name: initialName }));
    }
  }, [initialName]);

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
      <h3 className="mb-4">Add New Exercise</h3>
      <div className="space-y-4">
        <div>
          <label className="block mb-1">Exercise Name</label>
          <input
            type="text"
            placeholder="Workout Name (e.g., Bench Press)"
            value={newWorkout.name}
            onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-light focus:outline-none focus:border-primary placeholder:font-light placeholder:text-sm"
          />
        </div>
        
        <div className="relative">
          <label className="flex items-center gap-1 mb-1">
            Workout Type
            <HelpCircle 
              className="w-4 h-4 text-gray-dark cursor-pointer" 
              onClick={() => setShowModal(true)}
            />
          </label>
          <select
            value={newWorkout.type}
            onChange={(e) => setNewWorkout({ ...newWorkout, type: e.target.value })}
            className="w-full px-4 py-2 border border-gray-light focus:outline-none focus:border-primary"
          >
            <option value="reverse">Reverse Pyramid (6 sets)</option>
            <option value="tensets">UFpwrLifterProgram Plan</option>
            <option value="tensetslight">UFpwrLifter Program Plan (Light)</option>
          </select>
          
          {/* Modal */}
          <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onConfirm={() => setShowModal(false)}
            title="Workout Type Guide"
            confirmText="Got It"
            cancelText=""
          >
            <div className="space-y-4 text-left mb-6">
              <div>
                <p className="font-bold mb-1">Reverse Pyramid (6 sets)</p>
                <p className="text-xs text-gray-dark mb-2">Uses your 6 Rep Max</p>
                <p className="font-mono text-xs leading-relaxed text-gray-dark">
                  Set 1: 5 reps @ 30% (warmup)<br/>
                  Set 2: 5 reps @ 40% (warmup)<br/>
                  Set 3: 5 reps @ 50% (warmup)<br/>
                  Set 4: 6-8 reps @ 100%<br/>
                  Set 5: 8-10 reps @ 90%<br/>
                  Set 6: 10-12 reps @ 80%
                </p>
              </div>
              <div>
                <p className="font-bold mb-1">UFpwrLifter Program</p>
                <p className="text-xs text-gray-dark mb-2">Uses your 1 Rep Max</p>
                <p className="font-mono text-xs leading-relaxed text-gray-dark">
                  Set 1: 10 reps @ 33%<br/>
                  Set 2: 10 reps @ 56%<br/>
                  Set 3: 5 reps @ 79%<br/>
                  Set 4: 3 reps @ 86%<br/>
                  Set 5: 1 rep @ 91%<br/>
                  Set 6: 1 rep @ 96%<br/>
                  Set 7: 1 rep @ 91%<br/>
                  Set 8: 1 rep @ 91%<br/>
                  Set 9: 1 rep @ 86%<br/>
                  Set 10: 1 rep @ 79%
                </p>
              </div>
              <div>
                <p className="font-bold mb-1">UFpwrLifter Program (Light)</p>
                <p className="text-xs text-gray-dark mb-2">Uses your 1 Rep Max</p>
                <p className="font-mono text-xs leading-relaxed text-gray-dark">
                  Set 1: 10 reps @ 5%<br/>
                  Set 2: 10 reps @ 10%<br/>
                  Set 3: 10 reps @ 33%<br/>
                  Set 4: 8 reps @ 60%<br/>
                  Set 5: 6 reps @ 85%<br/>
                  Set 6: 3 reps @ 96%<br/>
                  Set 7: 6 reps @ 85%<br/>
                  Set 8: 8 reps @ 85%<br/>
                  Set 9: 10 reps @ 60%<br/>
                  Set 10: 10 reps @ 33%
                </p>
              </div>
            </div>
          </Modal>
        </div>
        
        <div>
          <label className="block mb-1">1 Rep Max</label>
          <input
            type="number"
            placeholder="1 Rep Max (lbs)"
            value={newWorkout.oneRM}
            onChange={(e) => setNewWorkout({ ...newWorkout, oneRM: e.target.value })}
            className="w-full px-4 py-2 border border-gray-light focus:outline-none focus:border-primary placeholder:font-light placeholder:text-sm"
          />
        </div>
        
        {newWorkout.type === 'reverse' && (
          <div>
            <label className="block mb-1">6 Rep Max</label>
            <input
              type="number"
              placeholder="6 Rep Max (lbs)"
              value={newWorkout.sixRM}
              onChange={(e) => setNewWorkout({ ...newWorkout, sixRM: e.target.value })}
              className="w-full px-4 py-2 border border-gray-light focus:outline-none focus:border-primary placeholder:font-light placeholder:text-sm"
            />
          </div>
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