import React from "react";
import {
  Dumbbell,
  Target,
  Calendar,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

const LandingPage = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Dumbbell className="w-16 h-16 md:w-20 md:h-20 text-secondary" />
          </div>
          <h1 className="font-bold text-gray-900 mb-6">Project 1,000</h1>
          <p className=" mb-8 max-w-3xl mx-auto">
            The easiest way to track your progress towards the legendary{" "}
            <span className="text-primary font-semibold">1,000 Pound Club</span>
          </p>
          <button
            onClick={onGetStarted}
            className="btn btn-primary"
          >
            Get Started
          </button>
        </div>

        {/* What is 1,000 Pound Club */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6 justify-center">
            <Target className="w-8 h-8 text-primary" />
            <h2 className="font-bold text-gray-900">
              What is the 1,000 Pound Club?
            </h2>
          </div>
          <p className=" text-lg leading-relaxed mb-4">
            The 1,000 Pound Club is a prestigious strength milestone achieved by
            lifters who can total 1,000 pounds or more across their one-rep
            maxes (1RM) in three core lifts:
          </p>
          <ul className="space-y-3 text-gray-800 text-lg">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
              <span>
                <strong className="text-primary">Bench Press</strong> – Upper
                body pushing strength
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
              <span>
                <strong className="text-primary">Squat</strong> – Lower body
                strength and power
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
              <span>
                <strong className="text-primary">Deadlift</strong> – Total body
                strength
              </span>
            </li>
          </ul>
        </div>

        {/* How It Works */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-8 justify-center">
            <TrendingUp className="w-8 h-8 text-primary" />
            <h2 className="font-bold text-gray-900">How It Works</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-white shadow-lg p-[1.125rem] border-2 border-gray-200">
              <div
                className="font-bold text-secondary mb-3"
                style={{ fontSize: "48px" }}
              >
                01
              </div>
              <h3 className="font-bold text-gray-900 mb-3">
                Add Your Exercise
              </h3>
              <p className="">
                Add any exercise you want to track. Input your current max
                weight, and the app will automatically calculate and update your
                working weights for every set.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white shadow-lg p-[1.125rem] border-2 border-gray-200">
              <div
                className="font-bold text-secondary mb-3"
                style={{ fontSize: "48px" }}
              >
                02
              </div>
              <h3 className="font-bold text-gray-900 mb-3">Select a Program</h3>
              <p className="">
                Choose your preferred training style: Reverse Pyramid Training
                for progressive overload or the UFpwrLifter Program for
                structured strength development.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white shadow-lg p-[1.125rem] border-2 border-gray-200">
              <div
                className="font-bold text-secondary mb-3"
                style={{ fontSize: "48px" }}
              >
                03
              </div>
              <h3 className="font-bold text-gray-900 mb-3">
                Create & Schedule Workouts
              </h3>
              <p className="">
                Build custom workouts by combining multiple exercises, then
                schedule them to specific days. Your weekly training plan made
                simple.
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6 justify-center">
            <Calendar className="w-8 h-8 text-primary" />
            <h2 className="font-bold text-gray-900">Features</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1 text-base">
                  Smart Workout Plans
                </h3>
                <p className="text-gray-600 text-sm">
                  Automatically generated based on your maxes
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1 text-base">
                  Weekly Scheduler
                </h3>
                <p className="text-gray-600 text-sm">
                  Plan your entire training week in advance
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1 text-base">
                  Custom Workouts
                </h3>
                <p className="text-gray-600 text-sm">
                  Combine multiple exercises into custom routines
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1 text-base">
                  Cloud Sync
                </h3>
                <p className="text-gray-600 text-sm">
                  Your data is securely stored and synced
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h2 className="font-bold text-gray-900 mb-4">
            Ready to Join the Club?
          </h2>
          <p className="mb-8">
            Start tracking your lifts and crushing your goals today.
          </p>
          <button
            onClick={onGetStarted}
            className="btn btn-primary"
          >
            Sign Up / Sign In
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-2 border-gray-light py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-600 text-sm">
          <p>© 2025 Project 1,000. Built for lifters, by lifters.</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
