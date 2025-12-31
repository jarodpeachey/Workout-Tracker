import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useWorkout } from "../context/WorkoutContext";

const DailyCalendar = ({
  weekDays,
  workouts,
  schedule,
  onSetWorkout,
  exercises,
  calculateReversePyramid,
  calculateTenSets,
  calculateTenSetsLight,
  currentDayIndex,
  onDayChange,
}) => {
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const { saveSchedule, setCurrentTab, setShouldOpenAddWorkout } = useWorkout();
  const [showWorkoutPicker, setShowWorkoutPicker] = useState(false);
  const [completedSets, setCompletedSets] = useState({});

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

  const currentDate = weekDays[currentDayIndex];
  const key = getScheduleKey(currentDate);
  const scheduleEntry = schedule[key];
  const scheduledWorkoutId = scheduleEntry?.workout_id || scheduleEntry;
  const scheduledWorkout = workouts.find((w) => w.id === scheduledWorkoutId);
  const isCompleted = scheduleEntry?.completed || false;

  // Debug logging for Tuesday, December 30
  console.log("=== DailyCalendar Debug ===");
  console.log("Current Date:", currentDate.toDateString());
  console.log("Schedule Key:", key);
  console.log("Schedule Entry (raw):", scheduleEntry);
  console.log("Scheduled Workout ID:", scheduledWorkoutId);
  console.log("Is Completed:", isCompleted);
  console.log("Schedule Entry completed field:", scheduleEntry?.completed);
  console.log("=========================");

  const dayName = dayNames[currentDate.getDay()];
  const dayNum = currentDate.getDate();
  const month = currentDate.toLocaleString("default", { month: "short" });

  // Check if date is in the past
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentDateOnly = new Date(currentDate);
  currentDateOnly.setHours(0, 0, 0, 0);
  const isPastDate = currentDateOnly < today;

  // Load completed sets from localStorage and Supabase on mount or when day changes
  useEffect(() => {
    const storageKey = `workout-${key}-${scheduledWorkoutId}`;
    const stored = localStorage.getItem(storageKey);

    console.log("=== useEffect: Loading Completed Sets ===");
    console.log("Storage Key:", storageKey);
    console.log("Is Completed from Supabase:", isCompleted);
    console.log("Has Scheduled Workout:", !!scheduledWorkout);
    console.log("LocalStorage Data:", stored);

    if (isCompleted && scheduledWorkout) {
      // If workout is marked complete in Supabase, check all sets
      console.log(
        "Loading completion status from Supabase - marking all sets complete"
      );
      const allSets = {};
      scheduledWorkout.exerciseIds?.forEach((exerciseId) => {
        const details = getExerciseDetails(exerciseId);
        if (details) {
          details.plan.forEach((_, i) => {
            allSets[`${exerciseId}-${i}`] = true;
          });
        }
      });
      console.log("All Sets Completed:", allSets);
      setCompletedSets(allSets);
    } else if (stored) {
      console.log("Loading completion status from localStorage");
      setCompletedSets(JSON.parse(stored));
    } else {
      console.log("No completion data found");
      setCompletedSets({});
    }
    console.log("======================================");
  }, [key, scheduledWorkoutId, isCompleted]);

  const toggleSetCompletion = async (exerciseId, setIndex) => {
    if (isPastDate || isCompleted) return; // Don't allow changes for past dates or completed workouts

    const setKey = `${exerciseId}-${setIndex}`;
    const newCompletedSets = {
      ...completedSets,
      [setKey]: !completedSets[setKey],
    };

    setCompletedSets(newCompletedSets);

    // Save to localStorage
    const storageKey = `workout-${key}-${scheduledWorkoutId}`;
    localStorage.setItem(storageKey, JSON.stringify(newCompletedSets));

    // Check if all sets are now completed
    if (scheduledWorkout) {
      let totalSets = 0;
      let completedCount = 0;

      scheduledWorkout.exerciseIds?.forEach((exId) => {
        const details = getExerciseDetails(exId);
        if (details) {
          details.plan.forEach((_, i) => {
            totalSets++;
            if (newCompletedSets[`${exId}-${i}`]) {
              completedCount++;
            }
          });
        }
      });

      // If all sets are completed, ask user to confirm
      if (completedCount === totalSets && totalSets > 0) {
        const confirmed = window.confirm(
          "All sets completed! Mark this workout as done?"
        );
        if (confirmed) {
          // Update Supabase with completion status
          await saveSchedule(key, scheduledWorkoutId, {
            completed: true,
            completedAt: new Date().toISOString(),
          });
        }
      }
    }
  };

  const handleSelectWorkout = (workoutId) => {
    const newWorkoutId = workoutId === "none" ? null : workoutId;
    
    // Only call onSetWorkout if there's an actual change
    if (scheduledWorkoutId !== newWorkoutId) {
      onSetWorkout(key, newWorkoutId);
    }
    setShowWorkoutPicker(false);
  };

  const handleOpenWorkoutPicker = () => {
    if (workouts.length === 0) {
      const confirmed = window.confirm("There are no workouts created. Please create a workout first.");
      if (confirmed) {
        setCurrentTab('workouts');
        setShouldOpenAddWorkout(true);
      }
      return;
    }
    setShowWorkoutPicker(true);
  };

  const handlePrevDay = () => {
    if (currentDayIndex > 0) onDayChange(currentDayIndex - 1);
  };

  const handleNextDay = () => {
    if (currentDayIndex < 6) onDayChange(currentDayIndex + 1);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevDay}
          disabled={currentDayIndex === 0}
          className={`sm p-3 rounded-sm transition-all duration-150 shadow-none ${
            currentDayIndex === 0
              ? "bg-gray-light text-gray border-gray-light cursor-not-allowed hover:bg-gray-light hover:text-gray hover:border-gray-light"
              : "text-white"
          }`}
          style={
            currentDayIndex !== 0
              ? {
                  background:
                    "linear-gradient(135deg, #BC3908 0%, #F6AA1C 100%)",
                }
              : {}
          }
          onMouseEnter={(e) => {
            if (currentDayIndex !== 0)
              e.currentTarget.style.filter = "brightness(0.9)";
          }}
          onMouseLeave={(e) => {
            if (currentDayIndex !== 0) e.currentTarget.style.filter = "";
          }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <h3
          className={`text-lg font-semibold tracking-wider ${
            isPastDate && !isCompleted && scheduledWorkout
              ? "text-gray"
              : isCompleted
              ? "text-success"
              : ""
          }`}
        >
          {dayName}, {month} {dayNum}
        </h3>

        <button
          onClick={handleNextDay}
          disabled={currentDayIndex === 6}
          className={`sm p-3 rounded-sm transition-all duration-150 shadow-none ${
            currentDayIndex === 6
              ? "bg-gray-light text-gray border-gray-light cursor-not-allowed hover:bg-gray-light hover:text-gray hover:border-gray-light"
              : "text-white"
          }`}
          style={
            currentDayIndex !== 6
              ? {
                  background:
                    "linear-gradient(135deg, #BC3908 0%, #F6AA1C 100%)",
                }
              : {}
          }
          onMouseEnter={(e) => {
            if (currentDayIndex !== 6)
              e.currentTarget.style.filter = "brightness(0.9)";
          }}
          onMouseLeave={(e) => {
            if (currentDayIndex !== 6) e.currentTarget.style.filter = "";
          }}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="relative">
        {showWorkoutPicker && workouts.length > 0 ? (
          <div className="">
            <div className="flex justify-between items-center mb-3">
              <div className="font-semibold text-black">Select a workout</div>
              <button
                onClick={() => setShowWorkoutPicker(false)}
                className="text-gray-dark rounded-sm hover:text-danger p-3 h-auto w-auto transition-all duration-150 text-lg"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => handleSelectWorkout("none")}
                className={`w-full px-3 py-2 text-left text-sm border rounded-sm transition ${
                  scheduledWorkoutId == null
                    ? "border-primary text-white"
                    : "bg-white border-gray text-black hover:bg-gray-light"
                }`}
                style={
                  scheduledWorkoutId == null
                    ? {
                        background:
                          "linear-gradient(135deg, #BC3908 0%, #F6AA1C 100%)",
                      }
                    : {}
                }
              >
                No workout
              </button>
              {workouts.map((workout) => (
                  <button
                    key={workout.id}
                    onClick={() => handleSelectWorkout(workout.id)}
                    className={`w-full px-3 py-2 text-left text-sm border rounded-sm transition ${
                      workout.id === scheduledWorkoutId
                        ? "border-primary text-white"
                        : "bg-white border-gray text-black hover:bg-gray-light"
                    }`}
                    style={
                      workout.id === scheduledWorkoutId
                        ? {
                            background:
                              "linear-gradient(135deg, #BC3908 0%, #F6AA1C 100%)",
                          }
                        : {}
                    }
                  >
                    {workout.name}
                  </button>
                ))}
            </div>
          </div>
        ) : scheduledWorkout ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h4
                className={`text-xl font-bold ${
                  isPastDate && !isCompleted
                    ? "text-gray"
                    : isCompleted
                    ? "text-success"
                    : "text-black"
                }`}
              >
                {scheduledWorkout.name}
              </h4>
              {!isPastDate && !isCompleted && (
                <button
                  onClick={() => setShowWorkoutPicker(true)}
                  className="text-sm text-gray-dark hover:text-primary transition relative pt-1"
                >
                  Change
                </button>
              )}
              {isPastDate && !isCompleted && (
                <p className="text-danger">Workout Incomplete</p>
              )}
              {isCompleted && (
                <p className="text-success">Workout Complete!</p>
              )}
            </div>

            <div className="space-y-6">
              {scheduledWorkout.exerciseIds?.map((exerciseId) => {
                const details = getExerciseDetails(exerciseId);
                if (!details) return null;
                const { exercise, plan } = details;

                return (
                  <div
                    key={exerciseId}
                    className={`border-l-4 pl-4 ${
                      isPastDate && !isCompleted
                        ? "border-danger"
                        : isCompleted
                        ? "border-success"
                        : "border-primary"
                    }`}
                  >
                    <h5
                      className={`text-lg font-bold mb-2 ${
                        isPastDate && !isCompleted
                          ? "text-gray"
                          : isCompleted
                          ? "text-success"
                          : "text-black"
                      }`}
                    >
                      {exercise.name}
                    </h5>
                    <div className="space-y-1 text-sm text-black">
                      {plan.map((set, i) => {
                        const setKey = `${exerciseId}-${i}`;
                        const isSetCompleted = completedSets[setKey];
                        const isDisabled = isPastDate || isCompleted;
                        return (
                          <div
                            key={i}
                            className={`flex items-center gap-2 ${
                              isDisabled ? "opacity-60" : ""
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSetCompleted || false}
                              onChange={() =>
                                toggleSetCompletion(exerciseId, i)
                              }
                              disabled={isDisabled}
                              className={`w-4 h-4 ${
                                isDisabled
                                  ? "cursor-not-allowed"
                                  : "cursor-pointer"
                              }`}
                              style={
                                isCompleted ? { accentColor: "#567335" } : {}
                              }
                            />
                            <div
                              className={`flex justify-between flex-1 ${
                                isSetCompleted ? "line-through opacity-50" : ""
                              }`}
                            >
                              <span>Set {i + 1}:</span>
                              <span className="font-medium">
                                {set.weight} lbs × {set.reps} reps
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            {isPastDate ? (
              <div className="text-gray-dark">
                This day is in the past - you can't schedule a workout here
              </div>
            ) : (
              <>
                <div className="text-gray-dark mb-4">No workout scheduled</div>
                <button
                  onClick={handleOpenWorkoutPicker}
                  className="btn btn-primary px-4 py-2"
                >
                  Add Workout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyCalendar;
