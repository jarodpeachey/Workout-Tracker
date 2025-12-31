import React, { useState, useEffect } from "react";
import { Trash2, ChevronDown } from "lucide-react";
import { useWorkout } from "../context/WorkoutContext";
import Modal from "./Modal";

const WorkoutCard = ({ workout }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [localSixRM, setLocalSixRM] = useState(workout.sixRM);
  const [localOneRM, setLocalOneRM] = useState(workout.oneRM);
  const {
    updateExercise,
    deleteExercise,
    calculateReversePyramid,
    calculateTenSets,
    calculateTenSetsLight,
  } = useWorkout();

  const handleDelete = () => {
    deleteExercise(workout.id);
  };

  // Sync local state when workout prop changes (after Supabase update)
  useEffect(() => {
    setLocalSixRM(workout.sixRM);
  }, [workout.sixRM]);

  useEffect(() => {
    setLocalOneRM(workout.oneRM);
  }, [workout.oneRM]);

  // Debounce 6RM updates
  useEffect(() => {
    if (localSixRM !== workout.sixRM && localSixRM !== "") {
      const timer = setTimeout(() => {
        updateExercise(workout.id, "sixRM", localSixRM);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [localSixRM]);

  // Debounce 1RM updates
  useEffect(() => {
    if (localOneRM !== workout.oneRM && localOneRM !== "") {
      const timer = setTimeout(() => {
        updateExercise(workout.id, "oneRM", localOneRM);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [localOneRM]);

  const plan =
    workout.type === "reverse"
      ? calculateReversePyramid(workout.sixRM)
      : workout.type === "tensetslight"
      ? calculateTenSetsLight(workout.oneRM)
      : calculateTenSets(workout.oneRM);

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
              {workout.name}
            </h3>
            <p
              className="text-md text-gray-dark width-fit"
              style={{ width: "fit-content" }}
            >
              {workout.type === "reverse"
                ? "Reverse Pyramid (6 sets)"
                : workout.type === "tensetslight"
                ? "UFpwrLifter Program (Light)"
                : "UFpwrLifter Program"}
            </p>
          </div>
        </button>
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
            {workout.type === "reverse" ? (
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

export default WorkoutCard;
