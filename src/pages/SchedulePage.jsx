import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useWorkout } from "../context/WorkoutContext";
import WeeklyCalendar from "../components/WeeklyCalendar";
import DailyCalendar from "../components/DailyCalendar";

const SchedulePage = () => {
  const {
    workouts,
    schedule,
    setScheduleWorkout,
    exercises,
    calculateReversePyramid,
    calculateTenSets,
    calculateTenSetsLight,
  } = useWorkout();
  const [weekOffset, setWeekOffset] = useState(0);
  const [view, setView] = useState("weekly"); // 'weekly' or 'daily'
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
    const startMonth = monday.toLocaleString("default", { month: "short" });
    const endMonth = weekDays[6].toLocaleString("default", { month: "short" });
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
        <h2>My Schedule</h2>
        <div className="flex gap-1 bg-gray-light p-1 rounded-sm">
          <button
            onClick={() => setView("weekly")}
            className={`px-6 py-2 text-[14px] font-medium rounded-sm normal-case transition-all duration-150 ${
              view === "weekly"
                ? "bg-primary text-white shadow border-primary hover:bg-primary hover:border-primary"
                : "bg-transparent text-black hover:bg-gray hover:border-transparent shadow-none border-transparent"
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setView("daily")}
            className={`px-6 py-2 text-[14px] font-medium rounded-sm normal-case transition-all duration-150 ${
              view === "daily"
                ? "bg-primary text-white shadow border-primary hover:bg-primary hover:border-primary"
                : "bg-transparent text-black hover:bg-gray hover:border-transparent shadow-none border-transparent"
            }`}
          >
            Daily
          </button>
        </div>
      </div>

      <div className="card">
        {view === "weekly" ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={handlePrevWeek}
                disabled={weekOffset === 0}
                className={`sm p-3 rounded-md transition-all duration-150 shadow-none ${
                  weekOffset === 0
                    ? "bg-gray-light text-gray border-gray-light cursor-not-allowed hover:bg-gray-light hover:text-gray hover:border-gray-light"
                    : "bg-primary text-white hover:bg-primary-dim"
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-semibold tracking-wider">
                {getWeekLabel()}
              </h3>

              <button
                onClick={handleNextWeek}
                disabled={weekOffset === 5}
                className={`sm p-3 rounded-md transition-all duration-150 shadow-none ${
                  weekOffset === 5
                    ? "bg-gray-light text-gray border-gray-light cursor-not-allowed hover:bg-gray-light hover:text-gray hover:border-gray-light"
                    : "bg-primary text-white hover:bg-primary-dim"
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
                setView("daily");
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
