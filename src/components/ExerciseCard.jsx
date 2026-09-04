import React, { useState, useEffect } from "react";
import { Trash2, ChevronDown } from "lucide-react";
import { useWorkout } from "../context/WorkoutContext";
import Modal from "./Modal";

const ExerciseCard = ({ exercise }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [localSixRM, setLocalSixRM] = useState(exercise.sixRM);
  const [localOneRM, setLocalOneRM] = useState(exercise.oneRM);
  const [localSameWeightValue, setLocalSameWeightValue] = useState(exercise.same_weight_value);
  const [localSetNotes, setLocalSetNotes] = useState(exercise.set_notes || '');
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

  const handleTypeChange = (e) => {
    updateExercise(exercise.id, "type", e.target.value);
  };

  const handleBodyweightChange = (e) => {
    const checked = e.target.checked;
    updateExercise(exercise.id, "bodyweight", checked);
    if (checked && exercise.same_weight) {
      updateExercise(exercise.id, "same_weight", false);
    }
  };

  const handleSameWeightChange = (e) => {
    updateExercise(exercise.id, "same_weight", e.target.checked);
  };

  // Sync local state when exercise prop changes (after Supabase update)
  useEffect(() => {
    setLocalSixRM(exercise.sixRM);
  }, [exercise.sixRM]);

  useEffect(() => {
    setLocalOneRM(exercise.oneRM);
  }, [exercise.oneRM]);

  useEffect(() => {
    setLocalSameWeightValue(exercise.same_weight_value);
  }, [exercise.same_weight_value]);

  useEffect(() => {
    setLocalSetNotes(exercise.set_notes || '');
  }, [exercise.set_notes]);

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

  // Debounce same-weight value updates
  useEffect(() => {
    if (localSameWeightValue !== exercise.same_weight_value && localSameWeightValue !== "") {
      const timer = setTimeout(() => {
        updateExercise(exercise.id, "same_weight_value", localSameWeightValue);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [localSameWeightValue]);

  // Debounce set notes updates
  useEffect(() => {
    if (localSetNotes !== (exercise.set_notes || '')) {
      const timer = setTimeout(() => {
        updateExercise(exercise.id, "set_notes", localSetNotes);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [localSetNotes]);

  const plan = exercise.bodyweight
    ? [0, 1, 2].map(() => ({ weight: null, reps: null }))
    : exercise.same_weight
      ? [0, 1, 2].map(() => ({ weight: exercise.same_weight_value, reps: null }))
      : exercise.type === "reverse"
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
                {exercise.bodyweight
                  ? "Bodyweight"
                  : exercise.same_weight
                    ? "Same Weight (3 sets)"
                    : exercise.type === "reverse"
                      ? "Reverse Pyramid (6 sets)"
                      : exercise.type === "tensetslight"
                        ? "UFpwrLifter Program (Light)"
                        : "UFpwrLifter Program"}
              </p>
            </div>
          </button>
          {!exercise.bodyweight && exercise.same_weight && exercise.same_weight_value > 0 && (
            <p className="text-sm text-gray-dark font-mono mr-2">
              {exercise.same_weight_value} lbs
            </p>
          )}
          {!exercise.bodyweight && !exercise.same_weight && exercise.oneRM > 0 && (
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
              <div className="flex-1 mb-3">
                <label className="flex items-center gap-2 cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    checked={!!exercise.bodyweight}
                    onChange={handleBodyweightChange}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span>Bodyweight</span>
                </label>
                {!exercise.bodyweight && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!exercise.same_weight}
                      onChange={handleSameWeightChange}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span>Keep the same weight for all 3 sets</span>
                  </label>
                )}
              </div>

              {exercise.same_weight && !exercise.bodyweight && (
                <div className="flex-1 mb-3">
                  <label className="block mb-1">Weight (lbs)</label>
                  <input
                    type="number"
                    value={localSameWeightValue}
                    onChange={(e) => setLocalSameWeightValue(e.target.value)}
                    className="input w-full"
                  />
                </div>
              )}

              {(exercise.bodyweight || exercise.same_weight) && (
                <div className="flex-1 mb-3">
                  <label className="block mb-1">Reps &amp; Format</label>
                  <p className="text-xs text-gray-dark mb-1">Explain the reps and format of the workout (e.g. "12 reps each set" or "AMRAP on the last set")</p>
                  <input
                    type="text"
                    value={localSetNotes}
                    onChange={(e) => setLocalSetNotes(e.target.value)}
                    className="input w-full"
                  />
                </div>
              )}

              {!exercise.bodyweight && !exercise.same_weight && (
                <div className="flex-1 mb-3">
                  <label className="block mb-1">Program</label>
                  <select
                    value={exercise.type}
                    onChange={handleTypeChange}
                    className="input w-full"
                  >
                    <option value="reverse">Reverse Pyramid (6 sets)</option>
                    <option value="tensets">UFpwrLifter Program</option>
                    <option value="tensetslight">UFpwrLifter Program (Light)</option>
                  </select>
                </div>
              )}
              {!exercise.bodyweight && !exercise.same_weight && (
                exercise.type === "reverse" ? (
                  <div className="flex-1">
                    <label className="block mb-1">6 Rep Max (lbs)</label>
                    <input
                      type="number"
                      value={localSixRM}
                      onChange={(e) => setLocalSixRM(e.target.value)}
                      className="input w-full"
                    />
                  </div>
                ) : (
                  <div className="flex-1">
                    <label className="block mb-1">1 Rep Max (lbs)</label>
                    <input
                      type="number"
                      value={localOneRM}
                      onChange={(e) => setLocalOneRM(e.target.value)}
                      className="input w-full"
                    />
                  </div>
                )
              )}
              {!exercise.bodyweight && !exercise.same_weight && exercise.type === "reverse" && exercise.oneRM > 0 && (
                <div className="flex-1 mt-3">
                  <label className="block mb-1">1 Rep Max (lbs)</label>
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
                {exercise.bodyweight ? (
                  plan.map((set, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center py-2 border-b border-gray-light last:border-0"
                    >
                      <span className="font-medium text-black">
                        Set {idx + 1}
                      </span>
                      <span className="text-gray-dark">
                        Bodyweight{exercise.set_notes ? ` — ${exercise.set_notes}` : ""}
                      </span>
                    </div>
                  ))
                ) : exercise.same_weight ? (
                  plan.map((set, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center py-2 border-b border-gray-light last:border-0"
                    >
                      <span className="font-medium text-black">
                        Set {idx + 1}
                      </span>
                      <span className="text-gray-dark">
                        {set.weight} lbs{exercise.set_notes ? ` — ${exercise.set_notes}` : ""}
                      </span>
                    </div>
                  ))
                ) : plan.map((set, idx) => (
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
