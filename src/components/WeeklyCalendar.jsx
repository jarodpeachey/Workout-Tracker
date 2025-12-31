import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkout } from "../context/WorkoutContext";
import Modal from "./Modal";

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
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { setShouldOpenAddWorkout } = useWorkout();

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
      const scheduleEntry = schedule[key];
      const currentWorkoutId = scheduleEntry?.workout_id || scheduleEntry;
      const newWorkoutId = workoutId === "none" ? null : workoutId;
      
      // Only call onSetWorkout if there's an actual change
      if (currentWorkoutId !== newWorkoutId) {
        onSetWorkout(key, newWorkoutId);
      }
      setSelectedDay(null);
    }
  };

  const handleDayClick = (isPastDate, idx) => {
    if (isPastDate) return;
    
    if (workouts.length === 0) {
      setShowModal(true);
      return;
    }
    
    setSelectedDay(selectedDay === idx ? null : idx);
  };

  const handleConfirmNavigate = () => {
    navigate('/workouts');
    setShouldOpenAddWorkout(true);
  };

  // compute scheduled workout id for the selected day (used by desktop picker)
  const selectedScheduledWorkoutId =
    selectedDay !== null
      ? schedule[getScheduleKey(weekDays[selectedDay])]
      : null;

  return (
    <>
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmNavigate}
        message="There are no workouts created. Please create a workout first."
        confirmText="Create Workout"
      />
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
        {weekDays.map((date, idx) => {
          const key = getScheduleKey(date);
          const scheduleEntry = schedule[key];
          const scheduledWorkoutId = scheduleEntry?.workout_id || scheduleEntry;
          const scheduledWorkout = workouts.find(
            (w) => w.id === scheduledWorkoutId
          );
          const isCompleted = scheduleEntry?.completed || false;
          const isSelected = selectedDay === idx;
          const dayName = dayNames[date.getDay()];
          const dayNum = date.getDate();
          const monthName = date.toLocaleString('default', { month: 'short' });

          const isToday = new Date().toDateString() === date.toDateString();
          
          // Check if date is in the past
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const dateOnly = new Date(date);
          dateOnly.setHours(0, 0, 0, 0);
          const isPastDate = dateOnly < today;

          // Determine status for past dates
          let statusText = "";
          let statusColor = "";
          if (isPastDate) {
            if (!scheduledWorkout) {
              statusText = "No workout";
              statusColor = "text-gray-dark";
            } else if (isCompleted) {
              statusText = "Workout Complete";
              statusColor = "text-gray-dark";
            } else {
              statusText = "Workout Incomplete";
              statusColor = "text-gray-dark";
            }
          }

          return (
            <div
              key={idx}
              onClick={() => handleDayClick(isPastDate, idx)}
              className={`card card-sm transition ${
                isPastDate
                  ? "bg-gray-light cursor-not-allowed"
                  : isToday
                  ? "border-success shadow-[0_4px_12px_rgba(0,0,0,0.5)] cursor-pointer"
                  : isSelected
                  ? "border-primary shadow-[0_4px_12px_rgba(0,0,0,0.5)] cursor-pointer"
                  : "border-gray hover:bg-white cursor-pointer"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div
                    className={`font-semibold ${
                      isPastDate ? "text-gray-dark" : isToday ? "text-success" : "text-black"
                    }`}
                  >
                    {dayName}, {monthName} {dayNum}
                  </div>
                  {isPastDate ? (
                    <div className={`mt-2 text-sm break-words ${statusColor}`}>
                      {statusText}
                    </div>
                  ) : scheduledWorkout ? (
                    <div
                      className={`mt-2 text-sm break-words ${
                        isPastDate ? "text-gray-dark" : isToday ? "text-success" : "text-gray-dark"
                      }`}
                    >
                      {scheduledWorkout.name}
                    </div>
                  ) : (
                    <div
                      className={`mt-2 text-sm break-words ${
                        isPastDate ? "text-gray-dark" : isToday ? "text-success" : "text-gray-dark"
                      }`}
                    >
                      Select a workout
                    </div>
                  )}
                </div>
                {isToday && scheduledWorkout && onStartWorkout && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartWorkout(idx);
                    }}
                    className="md:hidden ml-3 btn btn-sm shadow-none text-white transition font-semibold uppercase tracking-wider whitespace-nowrap self-start"
                    style={{ background: "linear-gradient(135deg, #567335 0%, #7a8f4a 100%)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.filter = "brightness(0.9)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.filter = "";
                    }}
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
                  className="hidden md:block w-full mt-3 btn btn-sm shadow-none text-white transition font-semibold uppercase tracking-wider"
                  style={{ background: "linear-gradient(135deg, #567335 0%, #7a8f4a 100%)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.filter = "brightness(0.9)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.filter = "";
                  }}
                >
                  Start
                </button>
              )}

              {/* Mobile picker - show inside box */}
              {isSelected && workouts.length > 0 && (
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
                        ? "border-primary text-white"
                        : "bg-white border-gray text-black hover:bg-white"
                    }`}
                    style={
                      scheduledWorkoutId == null
                        ? { background: "linear-gradient(135deg, #BC3908 0%, #F6AA1C 100%)" }
                        : {}
                    }
                  >
                    No workout
                  </button>
                  {workouts.map((workout) => (
                      <button
                        key={workout.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectWorkout(workout.id);
                        }}
                        className={`w-full px-3 py-2 text-sm border shadow-none rounded-sm normal-case transition text-left ${
                          workout.id == scheduledWorkoutId
                            ? "border-primary text-white"
                            : "bg-white border-gray text-black hover:bg-white"
                        }`}
                        style={
                          workout.id == scheduledWorkoutId
                            ? { background: "linear-gradient(135deg, #BC3908 0%, #F6AA1C 100%)" }
                            : {}
                        }
                      >
                        {workout.name}
                      </button>
                    ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Desktop picker - show below grid */}
      {selectedDay !== null && workouts.length > 0 && (
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
                  ? "border-primary text-white"
                  : "bg-white border-gray text-black hover:bg-white"
              }`}
              style={
                selectedScheduledWorkoutId == null
                  ? { background: "linear-gradient(135deg, #BC3908 0%, #F6AA1C 100%)" }
                  : {}
              }
            >
              No workout
            </button>
            {workouts.map((workout) => (
                <button
                  key={workout.id}
                  onClick={() => handleSelectWorkout(workout.id)}
                  className={`w-full px-3 py-2 text-left rounded-sm text-sm border shadow-none normal-case transition ${
                    workout.id == selectedScheduledWorkoutId
                      ? "border-primary text-white"
                      : "bg-white border-gray text-black hover:bg-white"
                  }`}
                  style={
                    workout.id == selectedScheduledWorkoutId
                      ? { background: "linear-gradient(135deg, #BC3908 0%, #F6AA1C 100%)" }
                      : {}
                  }
                >
                  {workout.name}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default WeeklyCalendar;
