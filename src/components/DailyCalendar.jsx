import React, { useState } from 'react';

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
          className={`p-2 rounded-lg transition ${
            currentDayIndex === 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          ← Prev
        </button>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800">{dayName}</h3>
          <p className="text-gray-600">{month} {dayNum}</p>
        </div>
        
        <button
          onClick={handleNextDay}
          disabled={currentDayIndex === 6}
          className={`p-2 rounded-lg transition ${
            currentDayIndex === 6
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Next →
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 min-h-96">
        {scheduledWorkout ? (
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-xl font-bold text-gray-800 mb-4">{scheduledWorkout.name}</h4>
              </div>
              <button
                onClick={() => setShowWorkoutPicker(true)}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
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
                  <div key={exerciseId} className="border-l-4 border-blue-600 pl-4">
                    <h5 className="text-lg font-bold text-gray-800 mb-2">{exercise.name}</h5>
                    <div className="space-y-1 text-sm text-gray-700">
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
            <div className="text-gray-500 mb-4">No workout scheduled</div>
            <button
              onClick={() => setShowWorkoutPicker(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Workout
            </button>
          </div>
        )}
      </div>

      {showWorkoutPicker && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <div className="font-semibold text-gray-800">Select a workout</div>
            <button
              onClick={() => setShowWorkoutPicker(false)}
              className="text-gray-600 hover:text-gray-800 text-lg"
            >
              ✕
            </button>
          </div>
          <div className="space-y-2">
            <button
              onClick={() => handleSelectWorkout('none')}
              className="w-full px-3 py-2 text-left text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 transition"
            >
              No workout
            </button>
            {workouts.length > 0 ? (
              workouts.map(workout => (
                <button
                  key={workout.id}
                  onClick={() => handleSelectWorkout(workout.id)}
                  className="w-full px-3 py-2 text-left text-sm bg-white border border-gray-300 rounded hover:bg-blue-50 hover:border-blue-300 transition"
                >
                  {workout.name}
                </button>
              ))
            ) : (
              <div className="text-sm text-gray-500 py-2">No workouts created yet.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyCalendar;
