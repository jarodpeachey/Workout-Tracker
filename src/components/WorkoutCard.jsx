import React, { useState } from "react";
import { Trash2, ChevronDown } from "lucide-react";
import { useWorkout } from "../context/WorkoutContext";

const WorkoutCard = ({ workout }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    updateExercise,
    deleteExercise,
    calculateReversePyramid,
    calculateTenSets,
    calculateTenSetsLight,
  } = useWorkout();

  const plan =
    workout.type === "reverse"
      ? calculateReversePyramid(workout.sixRM)
      : workout.type === "tensetslight"
      ? calculateTenSetsLight(workout.oneRM)
      : calculateTenSets(workout.oneRM);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 hover:opacity-75 transition"
          >
            <ChevronDown
              className={`w-5 h-5 transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
            <div>
              <h3 className="text-xl font-bold text-gray-800 text-left">
                {workout.name}
              </h3>
              <p
                className="text-sm text-gray-600 width-fit"
                style={{ width: "fit-content" }}
              >
                {workout.type === "reverse"
                  ? "Reverse Pyramid (6 sets)"
                  : workout.type === "tensetslight"
                  ? "10 Sets Plan (Light)"
                  : "10 Sets Plan"}
              </p>
            </div>
          </button>
        </div>
        <button
          onClick={() => deleteExercise(workout.id)}
          className="text-red-600 hover:text-red-800"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {isExpanded && (
        <>
          <div className="mb-4 mt-4 flex gap-4">
            {workout.type === "reverse" ? (
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  6 Rep Max (lbs)
                </label>
                <input
                  type="number"
                  value={workout.sixRM}
                  onChange={(e) =>
                    updateExercise(workout.id, "sixRM", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ) : (
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  1 Rep Max (lbs)
                </label>
                <input
                  type="number"
                  value={workout.oneRM}
                  onChange={(e) =>
                    updateExercise(workout.id, "oneRM", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold mb-3 text-gray-700">Workout Plan</h4>
            <div className="space-y-2">
              {plan.map((set, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0"
                >
                  <span className="font-medium text-gray-700">
                    Set {idx + 1}
                  </span>
                  <span className="text-gray-600">
                    {set.reps} reps @ {set.weight} lbs
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WorkoutCard;
