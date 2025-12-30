import React, { useState } from "react";

const WeeklyCalendar = ({
  weekDays,
  workouts,
  schedule,
  onSetWorkout,
  exercises,
  calculateReversePyramid,
  calculateTenSets,
  calculateTenSetsLight,
  onStartWorkout,
}) => {
  const [selectedDay, setSelectedDay] = useState(null);

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const getScheduleKey = (date) => {
    return date.toISOString().split("T")[0]; // YYYY-MM-DD
  };

  const getExerciseDetails = (exerciseId) => {
    const exercise = exercises.find((e) => e.id === exerciseId);
    if (!exercise) return null;

    let plan;
    if (exercise.type === "reverse") {
      plan = calculateReversePyramid(exercise.sixRM);
    } else if (exercise.type === "tensetslight") {
      plan = calculateTenSetsLight(exercise.oneRM);
    } else {
      plan = calculateTenSets(exercise.oneRM);
    }

    return { exercise, plan };
  };

  const handleSelectWorkout = (workoutId) => {
    if (selectedDay !== null) {
      const key = getScheduleKey(weekDays[selectedDay]);
      onSetWorkout(key, workoutId === "none" ? null : workoutId);
      setSelectedDay(null);
    }
  };

  // compute scheduled workout id for the selected day (used by desktop picker)
  const selectedScheduledWorkoutId =
    selectedDay !== null
      ? schedule[getScheduleKey(weekDays[selectedDay])]
      : null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
        {weekDays.map((date, idx) => {
          const key = getScheduleKey(date);
          const scheduledWorkoutId = schedule[key];
          const scheduledWorkout = workouts.find(
            (w) => w.id === scheduledWorkoutId
          );
          const isSelected = selectedDay === idx;
          const dayName = dayNames[date.getDay()];
          const dayNum = date.getDate();
          const monthName = date.toLocaleString('default', { month: 'short' });

          const isToday = new Date().toDateString() === date.toDateString();

          return (
            <div
              key={idx}
              onClick={() => setSelectedDay(isSelected ? null : idx)}
              className={`card card-sm cursor-pointer transition ${
                isToday
                  ? "border-success shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
                  : isSelected
                  ? "border-primary shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
                  : "border-gray hover:bg-white"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div
                    className={`font-semibold ${
                      isToday ? "text-success" : "text-black"
                    }`}
                  >
                    {dayName}, {monthName} {dayNum}
                  </div>
                  {scheduledWorkout ? (
                    <div
                      className={`mt-2 text-sm break-words ${
                        isToday ? "text-success" : "text-gray-dark"
                      }`}
                    >
                      {scheduledWorkout.name}
                    </div>
                  ) : (
                    <div
                      className={`mt-2 text-sm break-words ${
                        isToday ? "text-success" : "text-gray-dark"
                      }`}
                    >
                      No workout selected
                    </div>
                  )}
                </div>
                {isToday && scheduledWorkout && onStartWorkout && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartWorkout(idx);
                    }}
                    className="md:hidden ml-3 btn btn-sm bg-success shadow-none border-success text-white hover:bg-success-dim hover:border-success-dim transition font-semibold uppercase tracking-wider whitespace-nowrap self-start"
                  >
                    Start
                  </button>
                )}
              </div>

              {isToday && scheduledWorkout && onStartWorkout && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartWorkout(idx);
                  }}
                  className="hidden md:block w-full mt-3 btn btn-sm bg-success shadow-none border-success text-white hover:bg-success-dim hover:border-success-dim transition font-semibold uppercase tracking-wider"
                >
                  Start
                </button>
              )}

              {/* Mobile picker - show inside box */}
              {isSelected && (
                <div className="md:hidden mt-4 pt-3 border-t border-gray space-y-2">
                  <div className="text-sm font-semibold text-black mb-1">
                    Select a workout:
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectWorkout("none");
                    }}
                    className={`w-full px-3 py-2 text-sm border rounded-sm shadow-none normal-case transition text-left ${
                      scheduledWorkoutId == null
                        ? "bg-primary border-primary text-white hover:bg-primary hover:border-primary"
                        : "bg-white border-gray text-black hover:bg-white"
                    }`}
                  >
                    No workout
                  </button>
                  {workouts.length > 0 ? (
                    workouts.map((workout) => (
                      <button
                        key={workout.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectWorkout(workout.id);
                        }}
                        className={`w-full px-3 py-2 text-sm border shadow-none rounded-sm normal-case transition text-left ${
                          workout.id == scheduledWorkoutId
                            ? "bg-primary border-primary text-white hover:bg-primary hover:border-primary"
                            : "bg-white border-gray text-black hover:bg-white"
                        }`}
                      >
                        {workout.name}
                      </button>
                    ))
                  ) : (
                    <div className="text-sm text-gray py-2">
                      No workouts created yet.
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Desktop picker - show below grid */}
      {selectedDay !== null && (
        <div className="hidden md:block bg-white p-3 border-2 border-gray-light">
          <div className="mb-3 font-semibold text-black">
            Select a workout for {dayNames[weekDays[selectedDay].getDay()]},{" "}
            {weekDays[selectedDay].toLocaleDateString()}
          </div>
          <div className="space-y-2">
            <button
              onClick={() => handleSelectWorkout("none")}
              className={`w-full px-3 py-2 text-left text-sm border rounded-sm shadow-none normal-case transition ${
                selectedScheduledWorkoutId == null
                  ? "bg-primary border-primary text-white hover:bg-primary hover:border-primary"
                  : "bg-white border-gray text-black hover:bg-white"
              }`}
            >
              No workout
            </button>
            {workouts.length > 0 ? (
              workouts.map((workout) => (
                <button
                  key={workout.id}
                  onClick={() => handleSelectWorkout(workout.id)}
                  className={`w-full px-3 py-2 text-left rounded-sm text-sm border shadow-none normal-case transition ${
                    workout.id == selectedScheduledWorkoutId
                      ? "bg-primary border-primary text-white hover:bg-primary hover:border-primary"
                      : "bg-white border-gray text-black hover:bg-white"
                  }`}
                >
                  {workout.name}
                </button>
              ))
            ) : (
              <div className="text-sm text-gray py-2">
                No workouts created yet.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyCalendar;
