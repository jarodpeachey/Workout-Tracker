import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DailyCalendar = ({ weekDays, workouts, schedule, onSetWorkout, exercises, calculateReversePyramid, calculateTenSets, calculateTenSetsLight, currentDayIndex, onDayChange }) => {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const [showWorkoutPicker, setShowWorkoutPicker] = useState(false);

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

  const currentDate = weekDays[currentDayIndex];
  const key = getScheduleKey(currentDate);
  const scheduledWorkoutId = schedule[key];
  const scheduledWorkout = workouts.find(w => w.id === scheduledWorkoutId);
  const dayName = dayNames[currentDate.getDay()];
  const dayNum = currentDate.getDate();
  const month = currentDate.toLocaleString('default', { month: 'short' });

  const handleSelectWorkout = (workoutId) => {
    onSetWorkout(key, workoutId === 'none' ? null : workoutId);
    setShowWorkoutPicker(false);
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
          className={`p-3 transition-all duration-150 ${
            currentDayIndex === 0
              ? 'bg-dark-lighter text-text-dim cursor-not-allowed'
              : 'bg-accent-blue text-white hover:bg-accent-blue-dim'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold text-text-primary">{dayName}</h3>
          <p className="text-text-secondary">{month} {dayNum}</p>
        </div>
        
        <button
          onClick={handleNextDay}
          disabled={currentDayIndex === 6}
          className={`p-3 transition-all duration-150 ${
            currentDayIndex === 6
              ? 'bg-dark-lighter text-text-dim cursor-not-allowed'
              : 'bg-accent-blue text-white hover:bg-accent-blue-dim'
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="min-h-96 relative">
        {showWorkoutPicker ? (
          <div className="">
            <div className="flex justify-between items-center mb-3">
              <div className="font-semibold text-text-primary">Select a workout</div>
              <button
                onClick={() => setShowWorkoutPicker(false)}
                className="text-text-secondary hover:bg-[rgba(0,0,0,0.3)] p-2 transition-all duration-150 text-lg"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => handleSelectWorkout('none')}
                className={`w-full px-3 py-2 text-left text-sm border-2 transition ${scheduledWorkoutId == null ? 'bg-green-600 border-green-600 text-white' : 'bg-dark-lighter border-dark-border text-text-primary hover:bg-dark-border'}`}
              >
                No workout
              </button>
              {workouts.length > 0 ? (
                workouts.map(workout => (
                  <button
                    key={workout.id}
                    onClick={() => handleSelectWorkout(workout.id)}
                    className={`w-full px-3 py-2 text-left text-sm border-2 transition ${workout.id === scheduledWorkoutId ? 'bg-green-600 border-green-600 text-white' : 'bg-dark-lighter border-dark-border text-text-primary hover:bg-dark-border'}`}
                  >
                    {workout.name}
                  </button>
                ))
              ) : (
                <div className="text-sm text-text-dim py-2">No workouts created yet.</div>
              )}
            </div>
          </div>
        ) : scheduledWorkout ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h4 className="text-xl font-bold text-text-primary">{scheduledWorkout.name}</h4>
              <button
                onClick={() => setShowWorkoutPicker(true)}
                className="text-sm text-text-secondary hover:text-text-primary transition"
              >
                Change
              </button>
            </div>

            <div className="space-y-6">
              {scheduledWorkout.exerciseIds?.map(exerciseId => {
                const details = getExerciseDetails(exerciseId);
                if (!details) return null;
                const { exercise, plan } = details;
                
                return (
                  <div key={exerciseId} className="border-l-4 border-accent-blue pl-4">
                    <h5 className="text-lg font-bold text-text-primary mb-2">{exercise.name}</h5>
                    <div className="space-y-1 text-sm text-text-primary">
                      {plan.map((set, i) => (
                        <div key={i} className="flex justify-between">
                          <span>Set {i + 1}:</span>
                          <span className="font-medium">{set.weight} lbs × {set.reps} reps</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-text-dim mb-4">No workout scheduled</div>
            <button
              onClick={() => setShowWorkoutPicker(true)}
              className="btn-primary px-4 py-2"
            >
              Add Workout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyCalendar;
