import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import AddWorkoutForm from "../components/AddWorkoutForm";
import ExerciseList from "../components/ExerciseList";
import { useWorkout } from "../context/WorkoutContext";

const ExercisesPage = () => {
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [prefilledName, setPrefilledName] = useState("");
  const { shouldOpenAddExercise, setShouldOpenAddExercise, prefilledExerciseName, setPrefilledExerciseName } = useWorkout();

  // Open add exercise form if triggered from elsewhere
  useEffect(() => {
    if (shouldOpenAddExercise) {
      setShowAddExercise(true);
      if (prefilledExerciseName) {
        setPrefilledName(prefilledExerciseName);
        setPrefilledExerciseName("");
      }
      setShouldOpenAddExercise(false);
    }
  }, [shouldOpenAddExercise, setShouldOpenAddExercise, prefilledExerciseName, setPrefilledExerciseName]);

  return (
    <div className="max-w-6xl mx-auto p-6 mt-8">
      <div className="flex justify-between items-center mb-2">
        <h2 className="mb-3">Exercises</h2>
        <button
          onClick={() => setShowAddExercise(true)}
          className="btn btn-primary btn-sm flex items-center gap-2 p-3 md:px-4"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden md:inline">Add Exercise</span>
        </button>
      </div>
      <p className="text-gray-dark mb-6">Track individual exercises and monitor your progress over time. Select a training type and track your 1RM for each exercise.</p>

      {showAddExercise && (
        <AddWorkoutForm 
          onClose={() => {
            setShowAddExercise(false);
            setPrefilledName("");
          }} 
          initialName={prefilledName}
        />
      )}

      <ExerciseList />
    </div>
  );
};

export default ExercisesPage;
