import React, { useState } from "react";
import { useWorkout } from "../context/WorkoutContext";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const { profileData, exercises } = useWorkout();
  const [expandedCards, setExpandedCards] = useState({});
  const [rmView, setRmView] = useState({}); // Track which RM view for each exercise (true = 1RM, false = 6RM)

  const getWorkoutFormat = (type) => {
    if (type === "reverse") return "Reverse Pyramid";
    if (type === "tensetslight") return "UFpwrLifter (Light)";
    return "UFpwrLifter";
  };

  const getStartingWeight = (exercise, useOneRM = null) => {
    // If useOneRM is explicitly passed, use it; otherwise default to exercise type
    if (useOneRM === true) {
      return exercise.starting_onerm || 0;
    } else if (useOneRM === false) {
      return exercise.starting_sixrm || 0;
    }
    // Default behavior based on exercise type
    if (exercise.type === "reverse") {
      return exercise.starting_sixrm || 0;
    } else {
      return exercise.starting_onerm || 0;
    }
  };

  const getCurrentWeight = (exercise, useOneRM = null) => {
    // If useOneRM is explicitly passed, use it; otherwise default to exercise type
    if (useOneRM === true) {
      return exercise.oneRM || 0;
    } else if (useOneRM === false) {
      return exercise.sixRM || 0;
    }
    // Default behavior based on exercise type
    if (exercise.type === "reverse") {
      return exercise.sixRM || 0;
    } else {
      return exercise.oneRM || 0;
    }
  };

  const calculateImprovement = (exercise, useOneRM = null) => {
    const starting = getStartingWeight(exercise, useOneRM);
    const current = getCurrentWeight(exercise, useOneRM);
    if (!starting || starting === 0 || !current) return 0;
    const improvement = ((current - starting) / starting) * 100;
    return improvement.toFixed(1);
  };

  const hasBothRMs = (exercise) => {
    return (
      exercise.oneRM &&
      exercise.starting_onerm &&
      exercise.sixRM &&
      exercise.starting_sixrm
    );
  };

  const toggleCard = (exerciseId) => {
    setExpandedCards((prev) => ({
      ...prev,
      [exerciseId]: !prev[exerciseId],
    }));
  };

  const toggleRMView = (exerciseId, e) => {
    e.stopPropagation(); // Prevent card collapse when clicking toggle
    setRmView((prev) => ({
      ...prev,
      [exerciseId]: !prev[exerciseId],
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${month}/${day}/${year}`;
  };

  // Calculate 3 lift total
  const calculate3LiftTotal = () => {
    const bench = exercises.find((ex) =>
      ex.name.toLowerCase().includes("bench")
    );
    const squat = exercises.find((ex) =>
      ex.name.toLowerCase().includes("squat")
    );
    const deadlift = exercises.find((ex) =>
      ex.name.toLowerCase().includes("deadlift")
    );

    const benchWeight = bench?.oneRM || 0;
    const squatWeight = squat?.oneRM || 0;
    const deadliftWeight = deadlift?.oneRM || 0;

    return {
      total: benchWeight + squatWeight + deadliftWeight,
      hasAll:
        bench &&
        squat &&
        deadlift &&
        benchWeight > 0 &&
        squatWeight > 0 &&
        deadliftWeight > 0,
      missing: [
        !bench || !benchWeight ? "Bench" : null,
        !squat || !squatWeight ? "Squat" : null,
        !deadlift || !deadliftWeight ? "Deadlift" : null,
      ].filter(Boolean),
    };
  };

  const liftTotal = calculate3LiftTotal();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="font-bold mb-6">Stats and Progress</h2>
      <div className="card mb-6">
        <h3 className="mb-4">Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-white border border-gray shadow-sm p-4 rounded-lg">
            <p className="text-black">Workouts Assigned</p>
            <p className="text-4xl mt-2 font-bold text-black">
              {profileData?.workouts_assigned || 0}
            </p>
          </div>
          <div className="bg-white border border-gray shadow-sm p-4 rounded-lg">
            <p className="text-black">Workouts Completed</p>
            <p className="text-4xl mt-2 font-bold text-black">
              {profileData?.workouts_completed || 0}
            </p>
          </div>
          <div className="bg-white border border-gray shadow-sm p-4 rounded-lg">
            <p className="text-black">Completion Rate</p>
            <p className="text-4xl mt-2 font-bold text-black">
              {profileData?.workouts_assigned > 0
                ? (
                    (profileData.workouts_completed /
                      profileData.workouts_assigned) *
                    100
                  ).toFixed(1)
                : 0}
              %
            </p>
          </div>
          <div className="bg-white border border-gray shadow-sm p-4 rounded-lg">
            <p className="text-black">3-Lift Total</p>
            <p className="text-4xl mt-2 font-bold text-black">
              {liftTotal.total > 0 ? `${liftTotal.total} lbs` : "-"}
            </p>
            {!liftTotal.hasAll && (
              <p className="text-xs mt-2 text-black">
                Missing: {liftTotal.missing.join(", ")}.{" "}
                <Link to="/exercises" className="text-primary underline">
                  Create exercises
                </Link>
              </p>
            )}
          </div>
        </div>
          {liftTotal.hasAll && (
            <div className="bg-white border border-gray shadow-sm p-4 rounded-lg">
              <p className="text-black">Project 1,000 Progress</p>

              <div className="w-full bg-gray-light rounded-full h-4 mt-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
                  style={{
                    width: `${Math.min((liftTotal.total / 1000) * 100, 100)}%`,
                  }}
                ></div>
              </div>
              <p className="text-sm mt-2 text-black font-medium">
                {liftTotal.total} / 1,000 lbs (
                {((liftTotal.total / 1000) * 100).toFixed(1)}%)
              </p>
            </div>
          )}
      </div>
      <div className="card">
        <h3 className="mb-4">Exercise Progress</h3>
        {exercises.length === 0 ? (
          <p className="text-black">No exercises tracked yet.</p>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {exercises.map((exercise) => {
                const isExpanded = expandedCards[exercise.id];
                const showOneRM = rmView[exercise.id];
                const bothRMs = hasBothRMs(exercise);
                const improvement = parseFloat(
                  calculateImprovement(exercise, showOneRM)
                );

                return (
                  <div key={exercise.id} className="card card-sm">
                    <div
                      className="flex justify-between items-center px-2 py-2 cursor-pointer"
                      onClick={() => toggleCard(exercise.id)}
                    >
                      <p className="font-semibold text-black">
                        {exercise.name}
                      </p>
                      <div className="flex items-center gap-2">
                        {bothRMs && isExpanded && (
                          <>
                            {showOneRM ? (
                              <span className="text-sm text-gray-dark">
                                Viewing 1RM data
                              </span>
                            ) : (
                              <span className="text-sm text-gray-dark">
                                Viewing 6RM data
                              </span>
                            )}
                            <button
                              onClick={(e) => toggleRMView(exercise.id, e)}
                              className="btn btn-sm text-xs px-2 py-1 rounded bg-primary text-white font-medium"
                            >
                              {showOneRM ? "6RM" : "1RM"}
                            </button>
                          </>
                        )}
                        <span className="text-black">
                          {isExpanded ? "▲" : "▼"}
                        </span>
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="">
                        <div className="flex justify-between px-2 py-2 border-gray border-t">
                          <span className="text-black font-medium">Format</span>
                          <span className="font-medium text-black">
                            {getWorkoutFormat(exercise.type)}
                          </span>
                        </div>
                        <div className="flex justify-between px-2 py-2 border-gray border-t">
                          <span className="text-black font-medium">
                            Started
                          </span>
                          <span className="font-medium text-black">
                            {formatDate(exercise.created_at)}
                          </span>
                        </div>
                        <div className="flex justify-between px-2 py-2 border-gray border-t">
                          <span className="text-black font-medium">
                            Starting Weight
                          </span>
                          <span className="font-medium text-black">
                            {getStartingWeight(exercise, showOneRM)} lbs
                          </span>
                        </div>
                        <div className="flex justify-between px-2 py-2 border-gray border-t">
                          <span className="text-black font-medium">
                            Current Weight
                          </span>
                          <span className="font-medium text-black">
                            {getCurrentWeight(exercise, showOneRM)} lbs
                          </span>
                        </div>
                        <div className="flex justify-between px-2 py-2 border-gray border-t">
                          <span className="text-black font-medium">
                            Progress
                          </span>
                          <span
                            className={`font-bold ${
                              improvement > 0
                                ? "text-success"
                                : improvement < 0
                                ? "text-danger"
                                : "text-black"
                            }`}
                          >
                            {improvement > 0 ? "+" : ""}
                            {improvement.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray">
                    <th className="text-left py-3 px-4 font-semibold text-black">
                      Exercise
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-black">
                      Date Started
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-black">
                      Format
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-black">
                      1RM Start
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-black">
                      1RM Current
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-black">
                      1RM Progress
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-black">
                      6RM Start
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-black">
                      6RM Current
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-black">
                      6RM Progress
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {exercises.map((exercise) => {
                    const improvement1RM = parseFloat(
                      calculateImprovement(exercise, true)
                    );
                    const improvement6RM = parseFloat(
                      calculateImprovement(exercise, false)
                    );
                    const hasOneRM = exercise.oneRM && exercise.starting_onerm;
                    const hasSixRM = exercise.sixRM && exercise.starting_sixrm;

                    return (
                      <tr
                        key={exercise.id}
                        className="border-b border-gray-light"
                      >
                        <td className="py-3 px-4 font-medium text-black">
                          {exercise.name}
                        </td>
                        <td className="py-3 px-4 text-black">
                          {formatDate(exercise.created_at)}
                        </td>
                        <td className="py-3 px-4 text-black">
                          {getWorkoutFormat(exercise.type)}
                        </td>
                        <td className="py-3 px-4 text-right text-black">
                          {hasOneRM
                            ? `${getStartingWeight(exercise, true)} lbs`
                            : "-"}
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-black">
                          {hasOneRM
                            ? `${getCurrentWeight(exercise, true)} lbs`
                            : "-"}
                        </td>
                        <td
                          className={`py-3 px-4 text-right ${
                            hasOneRM && improvement1RM > 0
                              ? "text-success"
                              : hasOneRM && improvement1RM < 0
                              ? "text-danger"
                              : "text-black"
                          }`}
                        >
                          {hasOneRM ? (
                            <>
                              {improvement1RM > 0 ? "+" : ""}
                              {improvement1RM.toFixed(1)}%
                            </>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="py-3 px-4 text-right text-black">
                          {hasSixRM
                            ? `${getStartingWeight(exercise, false)} lbs`
                            : "-"}
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-black">
                          {hasSixRM
                            ? `${getCurrentWeight(exercise, false)} lbs`
                            : "-"}
                        </td>
                        <td
                          className={`py-3 px-4 text-right ${
                            hasSixRM && improvement6RM > 0
                              ? "text-success"
                              : hasSixRM && improvement6RM < 0
                              ? "text-danger"
                              : "text-black"
                          }`}
                        >
                          {hasSixRM ? (
                            <>
                              {improvement6RM > 0 ? "+" : ""}
                              {improvement6RM.toFixed(1)}%
                            </>
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
