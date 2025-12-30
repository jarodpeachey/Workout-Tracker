import React, { useState } from 'react';

const WeeklyCalendar = ({ weekDays, workouts, schedule, onSetWorkout }) => {
  const [selectedDay, setSelectedDay] = useState(null);

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const getScheduleKey = (date) => {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  };

  const handleSelectWorkout = (workoutId) => {
    if (selectedDay !== null) {
      const key = getScheduleKey(weekDays[selectedDay]);
      onSetWorkout(key, workoutId === 'none' ? null : workoutId);
      setSelectedDay(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((date, idx) => {
          const key = getScheduleKey(date);
          const scheduledWorkoutId = schedule[key];
          const scheduledWorkout = workouts.find(w => w.id === scheduledWorkoutId);
          const isSelected = selectedDay === idx;
          const dayName = dayNames[date.getDay()];
          const dayNum = date.getDate();

          return (
            <div
              key={idx}
              onClick={() => setSelectedDay(isSelected ? null : idx)}
              className={`p-3 rounded-lg border-2 cursor-pointer transition ${
                isSelected
                  ? 'border-blue-600 bg-blue-50'
                  : scheduledWorkout
                  ? 'border-green-600 bg-green-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="text-sm font-semibold text-gray-700">{dayName}</div>
              <div className="text-lg font-bold text-gray-800">{dayNum}</div>
              {scheduledWorkout && (
                <div className="mt-2 text-xs font-medium text-green-700 break-words">
                  {scheduledWorkout.name}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedDay !== null && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="mb-3 font-semibold text-gray-800">
            Select a workout for {dayNames[weekDays[selectedDay].getDay()]}, {weekDays[selectedDay].toLocaleDateString()}
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

export default WeeklyCalendar;
