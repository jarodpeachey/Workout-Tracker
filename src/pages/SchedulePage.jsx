import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';
import WeeklyCalendar from '../components/WeeklyCalendar';

const SchedulePage = () => {
  const { workouts, schedule, setScheduleWorkout } = useWorkout();
  const [weekOffset, setWeekOffset] = useState(0);

  // Get Monday of the current week
  const getMonday = (offset) => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    const monday = new Date(today.setDate(diff));
    
    // Add weeks offset
    monday.setDate(monday.getDate() + offset * 7);
    return monday;
  };

  const monday = getMonday(weekOffset);
  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(date.getDate() + i);
    weekDays.push(date);
  }

  const handlePrevWeek = () => {
    if (weekOffset > 0) setWeekOffset(weekOffset - 1);
  };

  const handleNextWeek = () => {
    if (weekOffset < 5) setWeekOffset(weekOffset + 1);
  };

  const getWeekLabel = () => {
    const startMonth = monday.toLocaleString('default', { month: 'short' });
    const endMonth = weekDays[6].toLocaleString('default', { month: 'short' });
    const startDay = monday.getDate();
    const endDay = weekDays[6].getDate();
    
    if (startMonth === endMonth) {
      return `${startMonth} ${startDay} - ${endDay}`;
    }
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Schedule</h2>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handlePrevWeek}
            disabled={weekOffset === 0}
            className={`p-2 rounded-lg transition ${
              weekOffset === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <h3 className="text-lg font-semibold text-gray-800">{getWeekLabel()}</h3>
          
          <button
            onClick={handleNextWeek}
            disabled={weekOffset === 5}
            className={`p-2 rounded-lg transition ${
              weekOffset === 5
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <WeeklyCalendar weekDays={weekDays} workouts={workouts} schedule={schedule} onSetWorkout={setScheduleWorkout} />
      </div>
    </div>
  );
};

export default SchedulePage;
