import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useWorkout } from "../context/WorkoutContext";
import AddCustomWorkoutForm from "../components/AddCustomWorkoutForm";
import CustomWorkoutCard from "../components/CustomWorkoutCard";
import Modal from "../components/Modal";

const WorkoutsPage = () => {
  const [showAdd, setShowAdd] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { workouts, exercises, editingWorkoutId, shouldOpenAddWorkout, setShouldOpenAddWorkout, setShouldOpenAddExercise } = useWorkout();

  // Open add workout form if triggered from elsewhere
  useEffect(() => {
    if (shouldOpenAddWorkout) {
      setShowAdd(true);
      setShouldOpenAddWorkout(false);
    }
  }, [shouldOpenAddWorkout, setShouldOpenAddWorkout]);

  const handleAddWorkout = () => {
    if (exercises.length === 0) {
      setShowModal(true);
      return;
    }
    setShowAdd(true);
  };

  const handleConfirmNavigate = () => {
    navigate('/exercises');
    setShouldOpenAddExercise(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 mt-8">
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmNavigate}
        message="There are no exercises created. Please create at least one exercise before building your first workout template."
        confirmText="Create Exercise"
      />
      <div className="flex justify-between items-center mb-2">
        <h2 className="mb-3">Workouts</h2>
        <button
          onClick={handleAddWorkout}
          disabled={editingWorkoutId !== null}
          className={`btn btn-sm flex items-center gap-2 p-3 md:px-4 transition-all duration-150 ${
            editingWorkoutId !== null
              ? "bg-gray-light text-gray border-gray-light cursor-not-allowed hover:bg-gray-light hover:text-gray hover:border-gray-light"
              : "btn-primary"
          }`}
        >
          <Plus className="w-5 h-5" />
          <span className="hidden md:inline">Add Workout</span>
        </button>
      </div>
      <p className="text-gray-dark mb-6">
        Workouts are templates that combine multiple exercises into a workout
        you can assign to days. Create and customize your workout routines here.
      </p>
      {showAdd && <AddCustomWorkoutForm onClose={() => setShowAdd(false)} />}
      <div className="space-y-4">
        {workouts.length === 0 && !showAdd ? (
          <div className="text-center py-12 text-gray card">
            <p className="text-gray-dark text-lg">
              No workouts yet. Add your first workout to get started!
              <button
                onClick={handleAddWorkout}
                disabled={editingWorkoutId !== null}
                className={`mx-auto mt-4 btn flex items-center gap-2 p-3 md:px-4 transition-all duration-150 ${
                  editingWorkoutId !== null
                    ? "bg-gray-light text-gray border-gray-light cursor-not-allowed hover:bg-gray-light hover:text-gray hover:border-gray-light"
                    : "btn-primary"
                }`}
              >
                <Plus className="w-5 h-5" />
                <span>Add Workout</span>
              </button>
            </p>
          </div>
        ) : (
          [...workouts]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((w) => <CustomWorkoutCard key={w.id} workout={w} />)
        )}
      </div>
    </div>
  );
};

export default WorkoutsPage;
