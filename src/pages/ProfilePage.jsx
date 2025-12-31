import React from "react";
import { useWorkout } from "../context/WorkoutContext";

const ProfilePage = () => {
  const { currentUser, exercises } = useWorkout();

  const getWorkoutFormat = (type) => {
    if (type === "reverse") return "Reverse Pyramid";
    if (type === "tensetslight") return "UFpwrLifter (Light)";
    return "UFpwrLifter";
  };

  const getStartingWeight = (exercise) => {
    // Use starting_onerm if available, otherwise fall back to starting_sixrm for reverse pyramid
    if (exercise.starting_onerm) return exercise.starting_onerm;
    if (exercise.type === "reverse" && exercise.starting_sixrm)
      return exercise.starting_sixrm;
    // Fallback for old exercises without starting weights
    if (exercise.type === "reverse") return exercise.sixRM;
    return exercise.oneRM;
  };

  const getCurrentWeight = (exercise) => {
    // Always use oneRM as the primary current weight
    if (exercise.oneRM) return exercise.oneRM;
    // Fallback to sixRM for reverse pyramid
    if (exercise.type === "reverse") return exercise.sixRM;
    return exercise.oneRM;
  };

  const calculateImprovement = (exercise) => {
    const current = getCurrentWeight(exercise);
    const starting = getStartingWeight(exercise);

    if (!starting || starting === 0) return 0;
    const improvement = ((current - starting) / starting) * 100;
    return improvement.toFixed(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${month}/${day}/${year}`;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="font-bold mb-6">Stats and Progress</h2>
      <div className="card mb-6">
        <h3 className="mb-4">Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-light p-4 rounded-lg">
                <p className="text-black">Workouts Created</p>
                <p className="text-4xl mt-2 font-bold text-black">
                    {currentUser?.workouts_created || 0}
                </p>
            </div>
            <div className="bg-gray-light p-4 rounded-lg">
                <p className="text-black">Workouts Completed</p>
                <p className="text-4xl mt-2 font-bold text-black">
                    {currentUser?.workouts_completed || 0}
                </p>
            </div>
            <div className="bg-gray-light p-4 rounded-lg">
                <p className="text-black">Completion Rate</p>
                <p className="text-4xl mt-2 font-bold text-black">
                    {currentUser?.workouts_created > 0
                        ? (
                                (currentUser.workouts_completed / currentUser.workouts_created) *
                                100
                            ).toFixed(1)
                        : 0}
                    %
                </p>
            </div>
        </div>
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
                const improvement = parseFloat(calculateImprovement(exercise));
                return (
                  <div key={exercise.id} className="card card-sm">
                    <p className="font-semibold text-black mb-1 pl-2 mt-2">{exercise.name}</p>
                    <div className="">
                      <div className="flex justify-between px-2 py-2 border-gray">
                        <span className="text-black font-medium">Format</span>
                        <span className="font-medium text-black">{getWorkoutFormat(exercise.type)}</span>
                      </div>
                      <div className="flex justify-between px-2 py-2 border-gray border-t">
                        <span className="text-black font-medium">Started</span>
                        <span className="font-medium text-black">{formatDate(exercise.created_at)}</span>
                      </div>
                      <div className="flex justify-between px-2 py-2 border-gray border-t">
                        <span className="text-black font-medium">Starting Weight</span>
                        <span className="font-medium text-black">{getStartingWeight(exercise)} lbs</span>
                      </div>
                      <div className="flex justify-between px-2 py-2 border-gray border-t">
                        <span className="text-black font-medium">Current Weight</span>
                        <span className="font-medium text-black">{getCurrentWeight(exercise)} lbs</span>
                      </div>
                      <div className="flex justify-between px-2 py-2 border-gray border-t">
                        <span className="text-black font-medium">Progress</span>
                        <span className={`font-bold ${
                          improvement > 0 ? "text-success" : 
                          improvement < 0 ? "text-danger" : 
                          "text-black"
                        }`}>
                          {improvement > 0 ? "+" : ""}{improvement}%
                        </span>
                      </div>
                    </div>
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
                      Starting Weight
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-black">
                      Current Weight
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-black">
                      Improvement
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {exercises.map((exercise) => {
                    const improvement = parseFloat(
                      calculateImprovement(exercise)
                    );
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
                          {getStartingWeight(exercise)} lbs
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-black">
                          {getCurrentWeight(exercise)} lbs
                        </td>
                        <td
                          className={`py-3 px-4 text-right ${
                            improvement > 0
                              ? "text-success"
                              : improvement < 0
                              ? "text-danger"
                              : "text-black"
                          }`}
                        >
                          {improvement > 0 ? "+" : ""}
                          {improvement}%
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
