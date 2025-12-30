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
          onClick={() => deleteExercise(workout.id)}
          className="text-danger hover:bg-[rgba(0,0,0,0.3)] p-3 ml-2 transition-all duration-150"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {isExpanded && (
        <>
          <div className="mb-4 mt-4 flex gap-4">
            {workout.type === "reverse" ? (
              <div className="flex-1">
                <label className="block mb-1">
                  6 Rep Max (lbs)
                </label>
                <input
                  type="number"
                  value={workout.sixRM}
                  onChange={(e) =>
                    updateExercise(workout.id, "sixRM", e.target.value)
                  }
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
                  value={workout.oneRM}
                  onChange={(e) =>
                    updateExercise(workout.id, "oneRM", e.target.value)
                  }
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
  );
};

export default WorkoutCard;
