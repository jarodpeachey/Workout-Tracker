import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [weekOffset, setWeekOffset] = useState(0);
  // Convert JavaScript day (0=Sun, 6=Sat) to weekDays array index (0=Mon, 6=Sun)
  const jsDay = new Date().getDay();
  const todayArrayIndex = jsDay === 0 ? 6 : jsDay - 1;
  const [currentDayIndex, setCurrentDayIndex] = useState(todayArrayIndex);
  
  // Get view from URL or default to weekly
  const view = searchParams.get('view') || 'weekly';

  // Update URL when view changes
  const setView = (newView) => {
    setSearchParams({ view: newView });
  };

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
    <div className="max-w-6xl mx-auto p-6 mt-8">
      <div className="flex justify-between items-center mb-2">
        <h2 className="mb-3">Schedule</h2>
        <div className="card card-sm flex gap-1 bg-white p-1 pt-1 pl-1 pr-1 pb-1 rounded-sm">
          <button
            onClick={() => setView("weekly")}
            className={`px-6 py-2 text-[14px] font-medium rounded-sm normal-case transition-all duration-150 ${
              view === "weekly"
                ? "text-white shadow border-primary hover:border-primary"
                : "bg-transparent text-black hover:bg-gray-light hover:border-transparent shadow-none border-transparent"
            }`}
            style={
              view === "weekly"
                ? { background: "linear-gradient(135deg, #BC3908 0%, #F6AA1C 100%)" }
                : {}
            }
            onMouseEnter={(e) => {
              if (view === "weekly") e.currentTarget.style.filter = "brightness(0.9)";
            }}
            onMouseLeave={(e) => {
              if (view === "weekly") e.currentTarget.style.filter = "";
            }}
          >
            Weekly
          </button>
          <button
            onClick={() => {
              setView("daily");
              setWeekOffset(0);
              // Convert JavaScript day (0=Sun, 6=Sat) to weekDays array index (0=Mon, 6=Sun)
              const jsDay = new Date().getDay();
              const arrayIndex = jsDay === 0 ? 6 : jsDay - 1;
              setCurrentDayIndex(arrayIndex);
            }}
            className={`px-6 py-2 text-[14px] font-medium rounded-sm normal-case transition-all duration-150 ${
              view === "daily"
                ? "text-white shadow border-primary hover:border-primary"
                : "bg-transparent text-black hover:bg-gray-light hover:border-transparent shadow-none border-transparent"
            }`}
            style={
              view === "daily"
                ? { background: "linear-gradient(135deg, #BC3908 0%, #F6AA1C 100%)" }
                : {}
            }
            onMouseEnter={(e) => {
              if (view === "daily") e.currentTarget.style.filter = "brightness(0.9)";
            }}
            onMouseLeave={(e) => {
              if (view === "daily") e.currentTarget.style.filter = "";
            }}
          >
            Daily
          </button>
        </div>
      </div>
      {/* <p className="text-gray-dark mb-6">Plan your training week by assigning workouts to specific days. View your schedule in weekly or daily format to stay organized.</p> */}

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
                    : "text-white"
                }`}
                style={
                  weekOffset !== 0
                    ? { background: "linear-gradient(135deg, #BC3908 0%, #F6AA1C 100%)" }
                    : {}
                }
                onMouseEnter={(e) => {
                  if (weekOffset !== 0) e.currentTarget.style.filter = "brightness(0.9)";
                }}
                onMouseLeave={(e) => {
                  if (weekOffset !== 0) e.currentTarget.style.filter = "";
                }}
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
                    : "text-white"
                }`}
                style={
                  weekOffset !== 5
                    ? { background: "linear-gradient(135deg, #BC3908 0%, #F6AA1C 100%)" }
                    : {}
                }
                onMouseEnter={(e) => {
                  if (weekOffset !== 5) e.currentTarget.style.filter = "brightness(0.9)";
                }}
                onMouseLeave={(e) => {
                  if (weekOffset !== 5) e.currentTarget.style.filter = "";
                }}
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
