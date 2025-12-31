import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  TrendingUp,
  CheckCircle,
  Dumbbell,
  BarChart3,
  Trophy,
  Weight,
  Armchair,
} from "lucide-react";
import logo from "../logo-2.png";
import Header from "../components/Header";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Custom Header with frosted effect */}
      <div className="h-20 backdrop-blur-md bg-white/30 border-b-2 border-white flex items-center justify-center">
        <img src={logo} alt="Project 1,000" className="h-12" />
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-secondary text-white">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-32">
          <div className="text-center">
            <h1 className="text-[65px] md:text-[78px] font-bold mb-6 text-white uppercase font-display tracking-wide">Project 1,000</h1>
            <h3 className="mb-8 max-w-3xl mx-auto text-white font-normal">
              Track your journey to the legendary{" "}
              <span className="font-bold text-white">1,000 Pound Club</span>
            </h3>
            <button
              onClick={() => navigate('/login')}
              className="btn btn-primary text-primary"
              style={{ background: '#ffffff', border: '2px solid #ffffff', color: '#bc3908' }}
            >
              Get Started Free
            </button>
          </div>
        </div>
      </div>

      {/* What is 1,000 Pound Club */}
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-primary/10 mb-4">
            <Trophy className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            What is the 1,000 Pound Club?
          </h2>
          <p className="text-[19px] text-gray-dark max-w-3xl mx-auto">
            A prestigious strength milestone achieved by totaling 1,000+ pounds across your one-rep maxes in three core lifts.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="card p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-primary/10 mb-4">
              <Armchair className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-primary mb-3">Bench Press</h3>
            <p className="text-[17px] text-gray-dark">Upper body pushing strength</p>
          </div>
          <div className="card p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-primary/10 mb-4">
              <Weight className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-primary mb-3">Squat</h3>
            <p className="text-[17px] text-gray-dark">Lower body strength and power</p>
          </div>
          <div className="card p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-primary/10 mb-4">
              <Dumbbell className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-primary mb-3">Deadlift</h3>
            <p className="text-[17px] text-gray-dark">Total body strength</p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-light py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-primary/10 mb-4">
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">How It Works</h2>
            <p className="text-[19px] text-gray-dark">Get started in three simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-secondary text-white text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-black mb-3">
                Add Your Exercises
              </h3>
              <p className="text-[17px] text-gray-dark">
                Input your current max weight and let the app automatically calculate your working weights for every set. Add the big three or create as many custom exercises as you want.
              </p>
            </div>

            <div className="card p-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-secondary text-white text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Select Your Program</h3>
              <p className="text-[17px] text-gray-dark">
                Choose from Reverse Pyramid Training or UFpwrLifter Program for structured strength development.
              </p>
            </div>

            <div className="card p-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-secondary text-white text-2xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-black mb-3">
                Create & Schedule
              </h3>
              <p className="text-[17px] text-gray-dark">
                Build custom workouts and schedule them to specific days. Your training plan made simple.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-primary/10 mb-4">
            <Dumbbell className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Powerful Features</h2>
            <p className="text-[19px] text-gray-dark">Everything you need to reach your goals</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-6 flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-black mb-2">
                Smart Workout Plans
              </h3>
              <p className="text-[17px] text-gray-dark">
                Automatically generated based on your current maxes
              </p>
            </div>
          </div>

          <div className="card p-6 flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-success" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-black mb-2">
                Weekly Scheduler
              </h3>
              <p className="text-[17px] text-gray-dark">
                Plan your entire training week in advance
              </p>
            </div>
          </div>

          <div className="card p-6 flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-success" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-black mb-2">
                Progress Tracking
              </h3>
              <p className="text-[17px] text-gray-dark">
                Visualize your strength gains over time
              </p>
            </div>
          </div>

          <div className="card p-6 flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-black mb-2">
                Cloud Sync
              </h3>
              <p className="text-[17px] text-gray-dark">
                Your data securely stored and synced across devices
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA & Footer */}
      <div className="bg-gradient-to-br from-primary to-secondary text-white py-16 md:py-24 pb-8">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-bold mb-6 text-white">
            Ready to Join the Club?
          </h2>
          <p className="text-[17px] md:text-xl mb-8 text-white/90">
            Start tracking your lifts and crushing your goals today.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="btn btn-primary text-primary"
            style={{ background: '#ffffff', border: '2px solid #ffffff', color: '#bc3908' }}
          >
            Sign Up
          </button>
        </div>
        
        {/* Footer */}
        <div className="max-w-6xl mx-auto px-6 text-center mt-16">
          <p className="text-[17px] text-white/70">© 2025 Project 1,000. Built for lifters, by lifters.</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
