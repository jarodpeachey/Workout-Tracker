import React, { useState, useEffect } from "react";
import { Trash2, ChevronDown } from "lucide-react";
import { useWorkout } from "../context/WorkoutContext";
import Modal from "./Modal";

const ExerciseCard = ({ exercise }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [localSixRM, setLocalSixRM] = useState(exercise.sixRM);
  const [localOneRM, setLocalOneRM] = useState(exercise.oneRM);
  const {
    updateExercise,
    deleteExercise,
    calculateReversePyramid,
    calculateTenSets,
    calculateTenSetsLight,
  } = useWorkout();

  const handleDelete = () => {
    deleteExercise(exercise.id);
  };

  // Sync local state when exercise prop changes (after Supabase update)
  useEffect(() => {
    setLocalSixRM(exercise.sixRM);
  }, [exercise.sixRM]);

  useEffect(() => {
    setLocalOneRM(exercise.oneRM);
  }, [exercise.oneRM]);

  // Debounce 6RM updates
  useEffect(() => {
    if (localSixRM !== exercise.sixRM && localSixRM !== "") {
      const timer = setTimeout(() => {
        updateExercise(exercise.id, "sixRM", localSixRM);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [localSixRM]);

  // Debounce 1RM updates
  useEffect(() => {
    if (localOneRM !== exercise.oneRM && localOneRM !== "") {
      const timer = setTimeout(() => {
        updateExercise(exercise.id, "oneRM", localOneRM);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [localOneRM]);

  const plan =
    exercise.type === "reverse"
      ? calculateReversePyramid(exercise.sixRM)
      : exercise.type === "tensetslight"
      ? calculateTenSetsLight(exercise.oneRM)
      : calculateTenSets(exercise.oneRM);

  return (
    <>
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Woah! That's dangerous!"
        message="Are you sure you want to delete this exercise? All your progress will be lost."
        confirmText="Yes, delete"
        cancelText="No, keep it"
        danger
      />
    <div className="card py-0">
      <div className="flex justify-between items-center">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 p-3 transition-all duration-150 flex-1 text-left"
        >
          <ChevronDown
            className={`w-5 h-5 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
          <div>
            <h3 className="font-bold text-black text-left">
              {exercise.name}
            </h3>
            <p
              className="text-md text-gray-dark width-fit"
              style={{ width: "fit-content" }}
            >
              {exercise.type === "reverse"
                ? "Reverse Pyramid (6 sets)"
                : exercise.type === "tensetslight"
                ? "UFpwrLifter Program (Light)"
                : "UFpwrLifter Program"}
            </p>
          </div>
        </button>
        {exercise.oneRM > 0 && (
          <p className="text-sm text-gray-dark font-mono mr-2">
            {exercise.oneRM} lbs
          </p>
        )}
        <button
          onClick={() => setShowDeleteModal(true)}
          className="text-danger rounded-sm hover:bg-[rgba(0,0,0,0.07)] p-3 ml-2 transition-all duration-150"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {isExpanded && (
        <>
          <div className="mb-4 mt-4">
            {exercise.type === "reverse" ? (
              <div className="flex-1">
                <label className="block mb-1">
                  6 Rep Max (lbs)
                </label>
                <input
                  type="number"
                  value={localSixRM}
                  onChange={(e) => setLocalSixRM(e.target.value)}
                  className="input w-full"
                />
              </div>
            ) : (
              <div className="flex-1">
                <label className="block mb-1">
                  1 Rep Max (lbs)
                </label>
                <input
                  type="number"
                  value={localOneRM}
                  onChange={(e) => setLocalOneRM(e.target.value)}
                  className="input w-full"
                />
              </div>
            )}
          </div>

          <div className="">
            <h4 className="font-semibold mb-3 text-black">Workout Plan</h4>
            <div className="space-y-2">
              {plan.map((set, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center py-2 border-b border-gray-light last:border-0"
                >
                  <span className="font-medium text-black">
                    Set {idx + 1}
                  </span>
                  <span className="text-gray-dark">
                    {set.reps} reps @ {set.weight} lbs
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
    </>
  );
};

export default ExerciseCard;
