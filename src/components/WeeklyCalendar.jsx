import React, { useState } from 'react';

const WeeklyCalendar = ({ weekDays, workouts, schedule, onSetWorkout, exercises, calculateReversePyramid, calculateTenSets, calculateTenSetsLight }) => {
  const [selectedDay, setSelectedDay] = useState(null);

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const getScheduleKey = (date) => {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  };

  const getExerciseDetails = (exerciseId) => {
    const exercise = exercises.find(e => e.id === exerciseId);
    if (!exercise) return null;
    
    let plan;
    if (exercise.type === 'reverse') {
      plan = calculateReversePyramid(exercise.sixRM);
    } else if (exercise.type === 'tensetslight') {
      plan = calculateTenSetsLight(exercise.oneRM);
    } else {
      plan = calculateTenSets(exercise.oneRM);
    }
    
    return { exercise, plan };
  };

  const handleSelectWorkout = (workoutId) => {
    if (selectedDay !== null) {
      const key = getScheduleKey(weekDays[selectedDay]);
      onSetWorkout(key, workoutId === 'none' ? null : workoutId);
      setSelectedDay(null);
    }
  };

  // compute scheduled workout id for the selected day (used by desktop picker)
  const selectedScheduledWorkoutId = selectedDay !== null ? schedule[getScheduleKey(weekDays[selectedDay])] : null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
        {weekDays.map((date, idx) => {
          const key = getScheduleKey(date);
          const scheduledWorkoutId = schedule[key];
          const scheduledWorkout = workouts.find(w => w.id === scheduledWorkoutId);
          const isSelected = selectedDay === idx;
          const dayName = dayNames[date.getDay()];
          const dayNum = date.getDate();

          const isToday = new Date().toDateString() === date.toDateString();
          
          return (
            <div
              key={idx}
              onClick={() => setSelectedDay(isSelected ? null : idx)}
              className={`p-3 border-2 cursor-pointer transition ${
                isToday
                  ? 'border-green-600 bg-dark-lighter shadow-[0_4px_12px_rgba(0,0,0,0.5)]'
                  : isSelected
                  ? 'border-accent-blue bg-dark-lighter shadow-[0_4px_12px_rgba(0,0,0,0.5)]'
                  : 'border-dark-border bg-dark-card hover:bg-dark-lighter'
              }`}
            >
              <div className="text-sm font-semibold text-text-primary">{dayName}</div>
              <div className="text-lg font-bold text-text-primary">{dayNum}</div>
              {scheduledWorkout ? (
                <div className={`mt-2 text-xs font-medium break-words ${isToday ? 'text-green-600' : 'text-text-secondary'}`}>
                  {scheduledWorkout.name}
                </div>
              ) : (<div className={`mt-2 text-xs font-medium break-words ${isToday ? 'text-green-600' : 'text-text-dim'}`}>
                  No workout selected
                </div>)}
              
              {/* Mobile picker - show inside box */}
              {isSelected && (
                <div className="md:hidden mt-4 pt-3 border-t border-green-600 space-y-2">
                  <div className="text-xs font-semibold text-text-primary">Select workout:</div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectWorkout('none');
                    }}
                    className={`w-full px-2 py-1 text-xs border-2 transition ${scheduledWorkoutId == null ? 'bg-green-600 border-green-600 text-white' : 'bg-dark-lighter border-dark-border text-text-primary hover:bg-dark-border'}`}
                  >
                    No workout
                  </button>
                  {workouts.length > 0 ? (
                    workouts.map(workout => (
                      <button
                        key={workout.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectWorkout(workout.id);
                        }}
                        className={`w-full px-2 py-1 text-xs border-2 transition text-left ${workout.id == scheduledWorkoutId ? 'bg-green-600 border-green-600 text-white' : 'bg-dark-lighter border-dark-border text-text-primary hover:bg-dark-border'}`}
                      >
                        {workout.name}
                      </button>
                    ))
                  ) : (
                    <div className="text-xs text-text-dim py-1">No workouts created yet.</div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Desktop picker - show below grid */}
      {selectedDay !== null && (
        <div className="hidden md:block bg-dark-card p-4 border-2 border-dark-border">
          <div className="mb-3 font-semibold text-text-primary">
            Select a workout for {dayNames[weekDays[selectedDay].getDay()]}, {weekDays[selectedDay].toLocaleDateString()}
          </div>
          <div className="space-y-2">
            <button
              onClick={() => handleSelectWorkout('none')}
              className={`w-full px-3 py-2 text-left text-sm border-2 transition ${selectedScheduledWorkoutId == null ? 'bg-green-600 border-green-600 text-white' : 'bg-dark-lighter border-dark-border text-text-primary hover:bg-dark-border'}`}
            >
              No workout
            </button>
            {workouts.length > 0 ? (
              workouts.map(workout => (
                <button
                  key={workout.id}
                  onClick={() => handleSelectWorkout(workout.id)}
                  className={`w-full px-3 py-2 text-left text-sm border-2 transition ${workout.id == selectedScheduledWorkoutId ? 'bg-green-600 border-green-600 text-white' : 'bg-dark-lighter border-dark-border text-text-primary hover:bg-dark-border'}`}
                >
                  {workout.name}
                </button>
              ))
            ) : (
              <div className="text-sm text-text-dim py-2">No workouts created yet.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyCalendar;
