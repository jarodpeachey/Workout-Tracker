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
import stats1 from "../stats.png";
import stats2 from "../stats-2.png";
import step1 from "../step-1.png";
import step2 from "../step-2.png";
import step3 from "../step-3.png";
import Header from "../components/Header";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
      {/* Custom Header with frosted effect */}
      <div className="h-20 backdrop-blur-md bg-black/80 border-b-2 border-primary/20 flex items-center justify-between px-6">
        <img src={logo} alt="Project 1,000" className="h-12" />
        <button
          onClick={() => navigate('/login')}
          className="btn btn-sm bg-primary hover:bg-primary/90 text-white font-bold border-0"
        >
          Log In
        </button>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative pb-32 md:pb-40">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-32">
          <div className="text-center">
            <h1 className="text-[65px] md:text-[90px] font-bold mb-6 text-primary uppercase font-display tracking-wide drop-shadow-[0_0_30px_rgba(188,57,8,0.5)]">Project 1,000</h1>
            <h3 className="mb-8 max-w-3xl mx-auto text-white/70 font-normal text-xl md:text-2xl">
              The no-bs training app designed to help you reach the{' '}
              <span className="font-bold text-primary">1,000 Pound Club</span>
            </h3>
            <button
              onClick={() => navigate('/login')}
              className="btn btn-lg bg-primary hover:bg-primary/90 text-white font-bold border-0 px-8 shadow-[0_0_30px_rgba(188,57,8,0.4)] hover:shadow-[0_0_40px_rgba(188,57,8,0.6)] transition-all"
            >
              GET STARTED TODAY
            </button>
          </div>
        </div>
        
        {/* What is 1,000 Pound Club - Floating Card */}
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-[calc(50%+120px)] md:translate-y-1/2 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-black to-gray-900 border border-primary/20 rounded-lg p-8 text-center" style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)' }}>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-primary/20 mb-4 shadow-[0_0_20px_rgba(188,57,8,0.3)] border border-primary/40">
                <Trophy className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                What is the 1,000 Pound Club?
              </h2>
              <p className="text-[17px] md:text-[19px] text-white/70 leading-loose">
                A prestigious strength milestone achieved by totaling 1,000+ pounds across your one-rep maxes in the bench press, squat, and deadlift. Project 1,000 helps you track, plan, and conquer this legendary feat.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 py-20 my-10 md:py-32 pt-[calc(256px+120px)] md:pt-48">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-primary/20 mb-4 shadow-[0_0_20px_rgba(188,57,8,0.3)] border border-primary/40">
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-[19px] text-white/70 leading-loose">Get started in three simple steps</p>
          </div>

          {/* Step 1 - Text Left, Image Right */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-0 items-center mb-12 md:mb-16">
            <div className="md:pr-24 md:-mr-24">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-secondary text-white text-2xl font-bold mb-4 shadow-[0_0_20px_rgba(188,57,8,0.4)]">
                1
              </div>
              <h3 className="text-white mb-4 font-bold text-2xl">
                Create Your Exercises
              </h3>
              <p className="text-[17px] text-white/70 leading-loose">
                Add exercises, input your one-rep max, and choose your program style. Project 1,000 automatically calculates your working weights for every set.
              </p>
            </div>
            <div>
              <div className="bg-black rounded-3xl p-3 border-[1px] border-gray-dark w-full max-w-xs mx-auto" style={{ boxShadow: '0 10px 40px rgba(188, 57, 8, 0.2), 0 0 20px rgba(255, 255, 255, 0.05)' }}>
                <img 
                  src={step1} 
                  alt="Create Exercise" 
                  className="w-full rounded-2xl" 
                />
              </div>
            </div>
          </div>

          {/* Step 2 - Image Left, Text Right */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-0 items-center mb-12 md:mb-16 md:-mt-8">
            <div className="order-2 md:order-1">
              <div className="bg-black rounded-3xl p-3 border-[1px] border-gray-dark w-full max-w-xs mx-auto" style={{ boxShadow: '0 10px 40px rgba(188, 57, 8, 0.2), 0 0 20px rgba(255, 255, 255, 0.05)' }}>
                <img 
                  src={step2} 
                  alt="Create Workout" 
                  className="w-full rounded-2xl" 
                />
              </div>
            </div>
            <div className="order-1 md:order-2 md:pl-24 md:-ml-24">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-secondary text-white text-2xl font-bold mb-4 shadow-[0_0_20px_rgba(188,57,8,0.4)]">
                2
              </div>
              <h3 className="text-white mb-4 font-bold text-2xl">
                Build Workout Templates
              </h3>
              <p className="text-[17px] text-white/70 leading-loose">
                Combine exercises into custom workout templates. Design different routines for different training days and save them to reuse week after week.
              </p>
            </div>
          </div>

          {/* Step 3 - Text Left, Image Right */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-0 items-center md:-mt-8">
            <div className="md:pr-24 md:-mr-24">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-secondary text-white text-2xl font-bold mb-4 shadow-[0_0_20px_rgba(188,57,8,0.4)]">
                3
              </div>
              <h3 className="text-white mb-4 font-bold text-2xl">
                Schedule & Complete Workouts
              </h3>
              <p className="text-[17px] text-white/70 leading-loose">
                Schedule templates across your training week. When it's time to train, complete each set and track every rep. Watch your progress compound over time.
              </p>
            </div>
            <div>
              <div className="bg-black rounded-3xl p-3 border-[1px] border-gray-dark w-full max-w-xs mx-auto" style={{ boxShadow: '0 10px 40px rgba(188, 57, 8, 0.2), 0 0 20px rgba(255, 255, 255, 0.05)' }}>
                <img 
                  src={step3} 
                  alt="Daily Workout" 
                  className="w-full rounded-2xl" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Stats Tracking */}
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-primary/20 mb-6 shadow-[0_0_90px_rgba(188,57,8,0.3)] border border-primary/40">
              <BarChart3 className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Advanced Stats Tracking
            </h2>
            <p className="text-[19px] text-white/70 mb-6 leading-loose">
              Monitor your 3-lift total in real-time as you approach the 1,000 Pound Club. Track starting vs. current maxes and workout completion rates to stay accountable and motivated.
            </p>
          </div>
          <div className="space-y-6">
            <img 
              src={stats1} 
              alt="Stats Dashboard" 
              className="w-full rounded-lg border border-primary/20" 
              style={{ boxShadow: '0 10px 40px rgba(188, 57, 8, 0.2), 0 0 20px rgba(255, 255, 255, 0.05)' }}
            />
            <img 
              src={stats2} 
              alt="Exercise Progress" 
              className="w-full rounded-lg border border-primary/20" 
              style={{ boxShadow: '0 10px 40px rgba(188, 57, 8, 0.2), 0 0 20px rgba(255, 255, 255, 0.05)' }}
            />
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-primary/20 mb-4 shadow-[0_0_20px_rgba(188,57,8,0.3)] border border-primary/40">
            <Dumbbell className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Key Features</h2>
            <p className="text-[19px] text-white/70 leading-loose">Everything you need to reach your strength goals</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-black to-gray-900 border border-primary/20 rounded-lg p-8 flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-white mb-2 text-lg">
                Intelligent Programming
              </h3>
              <p className="text-[17px] text-white/70 leading-loose">
                Auto-calculated working sets based on your maxes. Progressive overload made automatic. No thinking required—just lift.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-black to-gray-900 border border-primary/20 rounded-lg p-8 flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-white mb-2 text-lg">
                Training Domination
              </h3>
              <p className="text-[17px] text-white/70 leading-loose">
                Plan your attack week by week. Structure your assault on the 1,000 Pound Club with military precision.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-black to-gray-900 border border-primary/20 rounded-lg p-8 flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-white mb-2 text-lg">
                Progress Analytics
              </h3>
              <p className="text-[17px] text-white/70 leading-loose">
                Track every lift with detailed analytics. Visualize your strength gains over time and see exactly how close you are to your goals.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-black to-gray-900 border border-primary/20 rounded-lg p-8 flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-white mb-2 text-lg">
                Cloud Sync
              </h3>
              <p className="text-[17px] text-white/70 leading-loose">
                Your data securely stored and synced across all devices. Access your workouts anywhere, anytime.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA & Footer */}
      <div className="pb-10 pt-16 md:pt-24 border-primary/40" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="mb-8 text-white">
            Ready to Join the 1,000 Pound Club?
          </h2>
            <button
              onClick={() => navigate('/login')}
              className="btn btn-lg bg-primary hover:bg-primary/90 text-white font-bold border-0 px-8 shadow-[0_0_30px_rgba(188,57,8,0.4)] hover:shadow-[0_0_40px_rgba(188,57,8,0.6)] transition-all"
            >
              GET STARTED TODAY
            </button>
        </div>
        
        {/* Footer */}
        <div className="max-w-6xl mx-auto px-6 text-center mt-16">
          <p className="text-[16px] text-white/70 leading-loose">©2025 Project 1,000</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
