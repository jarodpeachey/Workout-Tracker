import React from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Dumbbell, ListChecks, TrendingUp, Play, ArrowRight, Check } from "lucide-react";
import { useWorkout } from "../context/WorkoutContext";
import { getTodayLocalDate } from "../utils/timezoneUtils";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { schedule, exercises, workouts, profileData, setShouldOpenAddExercise, setShouldOpenAddWorkout } = useWorkout();

  // Check if there's a workout scheduled for today that's not completed
  const todayKey = getTodayLocalDate(profileData?.timezone);
  const todaySchedule = schedule[todayKey];
  
  const hasTodayWorkout =
    todaySchedule && (todaySchedule.workout_id || todaySchedule.workoutId) && !todaySchedule.completed;

  // Check if there are any scheduled workouts in the schedule
  const hasScheduledWorkouts = Object.values(schedule).some(
    (entry) => entry && (entry.workout_id || entry.workoutId)
  );

  // Determine onboarding step
  const getOnboardingStep = () => {
    if (exercises.length === 0) {
      return {
        step: 1,
        title: "Create Your First Exercise",
        description: "Start by creating an exercise to track. Choose from Reverse Pyramid or UFpwrLifter programs and set your starting weight.",
        buttonText: "Create Exercise",
        action: () => {
          navigate('/exercises');
          setShouldOpenAddExercise(true);
        },
      };
    }
    if (workouts.length === 0) {
      return {
        step: 2,
        title: "Build Your First Workout Template",
        description: "Combine your exercises into a workout template. You can create multiple templates for different training days.",
        buttonText: "Create Workout",
        action: () => {
          navigate('/workouts');
          setShouldOpenAddWorkout(true);
        },
      };
    }
    if (!hasScheduledWorkouts) {
      return {
        step: 3,
        title: "Schedule Your Week",
        description: "Assign your workout templates to specific days of the week. Plan your training schedule to stay consistent.",
        buttonText: "Schedule Workouts",
        action: () => {
          navigate('/schedule');
        },
      };
    }
    return null;
  };

  const onboardingStep = getOnboardingStep();

  // Get completed steps
  const getCompletedSteps = () => {
    const completed = [];
    if (exercises.length > 0) {
      completed.push({
        step: 1,
        title: "Create Your First Exercise",
      });
    }
    if (workouts.length > 0) {
      completed.push({
        step: 2,
        title: "Build Your First Workout Template",
      });
    }
    if (hasScheduledWorkouts) {
      completed.push({
        step: 3,
        title: "Schedule Your Week",
      });
    }
    // Only return completed steps that are before the current step
    if (onboardingStep) {
      return completed.filter(s => s.step < onboardingStep.step);
    }
    return completed;
  };

  const completedSteps = getCompletedSteps();

  // Get uncompleted steps (steps after the current step)
  const getUncompletedSteps = () => {
    const allSteps = [
      { step: 1, title: "Create Your First Exercise" },
      { step: 2, title: "Build Your First Workout Template" },
      { step: 3, title: "Schedule Your Week" },
    ];
    if (onboardingStep) {
      return allSteps.filter(s => s.step > onboardingStep.step);
    }
    return [];
  };

  const uncompletedSteps = getUncompletedSteps();

  const menuOptions = [
    {
      title: "Schedule",
      icon: Calendar,
      description: "View and manage your weekly workout schedule.",
      route: "/schedule",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Workouts",
      icon: Dumbbell,
      description: "Create and customize workout templates.",
      route: "/workouts",
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Exercises",
      icon: ListChecks,
      description:
        "Manage your exercise library by updating your weight, or adding new exercises to your programs.",
      route: "/exercises",
      color: "from-green-500 to-green-600",
    },
    {
      title: "Stats",
      icon: TrendingUp,
      description:
        "View your progress and improvement over time for all of your exercises.",
      route: "/stats",
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <div className="p-4 pt-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-2 text-text">
        {onboardingStep ? "Welcome!" : "Welcome back!"}
      </h1>
      <p className="text-center text-text-secondary mb-8">
        {onboardingStep ? "Let's finish setting up your fitness program." : "Let's get to work."}
      </p>

      {onboardingStep ? (
        <div className="max-w-2xl mx-auto mb-8 space-y-4">
          {completedSteps.map((completedStep) => (
            <div key={completedStep.step} className="card p-4 text-left border-success bg-success">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg text-white flex items-center justify-center">
                  <Check className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">{completedStep.title}</h3>
              </div>
            </div>
          ))}
          
          <div className="card p-6 text-left">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center font-bold">
                {onboardingStep.step}
              </div>
              <h2 className="text-xl font-bold text-text">{onboardingStep.title}</h2>
            </div>
            <p className="text-text-secondary mb-6">{onboardingStep.description}</p>
            <button
              onClick={onboardingStep.action}
              className="btn btn-primary w-full flex items-center justify-center gap-2"
            >
              {onboardingStep.buttonText}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {uncompletedSteps.map((uncompletedStep) => (
            <div key={uncompletedStep.step} className="card p-4 text-left bg-gray-light border-gray">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gray text-white flex items-center justify-center font-bold">
                  {uncompletedStep.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-dark">{uncompletedStep.title}</h3>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {hasTodayWorkout && (
            <button
              onClick={() => navigate("/schedule?view=daily")}
              className="card w-full mb-6 bg-gradient-to-r from-primary to-secondary text-white font-bold text-lg flex items-center justify-center gap-3 hover:opacity-90 transition-opacity shadow-lg border-none"
            >
              <Play className="w-6 h-6" />
              Start Today's Workout
            </button>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {menuOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.route}
                  onClick={() => navigate(option.route)}
                  className="card p-6 flex flex-col items-start gap-3 hover:border-gray-dark transition-colors text-left"
                >
                  <div
                    className={`p-3 rounded-lg bg-gradient-to-br ${option.color}`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-text">{option.title}</h2>
                  <p className="text-gray-dark">{option.description}</p>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
