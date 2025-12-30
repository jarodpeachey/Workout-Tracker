import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';
import WeeklyCalendar from '../components/WeeklyCalendar';
import DailyCalendar from '../components/DailyCalendar';

const SchedulePage = () => {
  const { workouts, schedule, setScheduleWorkout, exercises, calculateReversePyramid, calculateTenSets, calculateTenSetsLight } = useWorkout();
  const [weekOffset, setWeekOffset] = useState(0);
  const [view, setView] = useState('weekly'); // 'weekly' or 'daily'
  const [currentDayIndex, setCurrentDayIndex] = useState(new Date().getDay()); // 0-6 for current week

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
        <h2 className="text-2xl font-bold uppercase tracking-wider">My Schedule</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setView('weekly')}
            className={`px-4 py-2 font-semibold uppercase tracking-wider transition ${
              view === 'weekly'
                ? 'bg-accent-blue text-white'
                : 'bg-dark-lighter text-text-secondary hover:bg-dark-border'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setView('daily')}
            className={`px-4 py-2 font-semibold uppercase tracking-wider transition ${
              view === 'daily'
                ? 'bg-accent-blue text-white'
                : 'bg-dark-lighter text-text-secondary hover:bg-dark-border'
            }`}
          >
            Daily
          </button>
        </div>
      </div>

      <div className="card">
        {view === 'weekly' ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={handlePrevWeek}
                disabled={weekOffset === 0}
                className={`p-3 transition-all duration-150 ${
                  weekOffset === 0
                    ? 'bg-dark-lighter text-text-dim cursor-not-allowed'
                    : 'bg-accent-blue text-white hover:bg-accent-blue-dim'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <h3 className="text-lg font-semibold uppercase tracking-wider">{getWeekLabel()}</h3>
              
              <button
                onClick={handleNextWeek}
                disabled={weekOffset === 5}
                className={`p-3 transition-all duration-150 ${
                  weekOffset === 5
                    ? 'bg-dark-lighter text-text-dim cursor-not-allowed'
                    : 'bg-accent-blue text-white hover:bg-accent-blue-dim'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <WeeklyCalendar 
              weekDays={weekDays} 
              workouts={workouts} 
              schedule={schedule} 
              onSetWorkout={setScheduleWorkout}
              exercises={exercises}
              calculateReversePyramid={calculateReversePyramid}
              calculateTenSets={calculateTenSets}
              calculateTenSetsLight={calculateTenSetsLight}
              onStartWorkout={(dayIndex) => {
                setCurrentDayIndex(dayIndex);
                setView('daily');
              }}
            />
          </>
        ) : (
          <DailyCalendar
            weekDays={weekDays}
            workouts={workouts}
            schedule={schedule}
            onSetWorkout={setScheduleWorkout}
            exercises={exercises}
            calculateReversePyramid={calculateReversePyramid}
            calculateTenSets={calculateTenSets}
            calculateTenSetsLight={calculateTenSetsLight}
            currentDayIndex={currentDayIndex}
            onDayChange={setCurrentDayIndex}
          />
        )}
      </div>
    </div>
  );
};

export default SchedulePage;
