import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calculator, ArrowLeft } from "lucide-react";
import logo from "../logo-2.png";

const DemoPage = () => {
  const navigate = useNavigate();
  const [inputType, setInputType] = useState("1rm"); // "1rm" or "6rm"
  const [weight, setWeight] = useState("");
  const [results, setResults] = useState(null);
  const [checkedSets, setCheckedSets] = useState({});

  // Calculate UFpwrLifter program sets (uses 1RM)
  const calculateUFpwrLifter = (oneRM) => {
    return [
      { set: 1, reps: 10, percentage: 33, weight: Math.round(oneRM * 0.33) },
      { set: 2, reps: 10, percentage: 56, weight: Math.round(oneRM * 0.56) },
      { set: 3, reps: 5, percentage: 79, weight: Math.round(oneRM * 0.79) },
      { set: 4, reps: 3, percentage: 86, weight: Math.round(oneRM * 0.86) },
      { set: 5, reps: 1, percentage: 91, weight: Math.round(oneRM * 0.91) },
      { set: 6, reps: 1, percentage: 96, weight: Math.round(oneRM * 0.96) },
      { set: 7, reps: 1, percentage: 91, weight: Math.round(oneRM * 0.91) },
      { set: 8, reps: 1, percentage: 91, weight: Math.round(oneRM * 0.91) },
      { set: 9, reps: 3, percentage: 86, weight: Math.round(oneRM * 0.86) },
      { set: 10, reps: 5, percentage: 79, weight: Math.round(oneRM * 0.79) },
    ];
  };

  // Calculate Reverse Pyramid sets (uses 6RM)
  const calculateReversePyramid = (sixRM) => {
    return [
      { set: 1, reps: 5, percentage: 30, weight: Math.round(sixRM * 0.30), warmup: true },
      { set: 2, reps: 5, percentage: 40, weight: Math.round(sixRM * 0.40), warmup: true },
      { set: 3, reps: 5, percentage: 50, weight: Math.round(sixRM * 0.50), warmup: true },
      { set: 4, reps: "6-8", percentage: 100, weight: Math.round(sixRM * 1.00), warmup: false },
      { set: 5, reps: "8-10", percentage: 90, weight: Math.round(sixRM * 0.90), warmup: false },
      { set: 6, reps: "10-12", percentage: 80, weight: Math.round(sixRM * 0.80), warmup: false },
    ];
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    const weightValue = parseFloat(weight);
    
    if (!weightValue || weightValue <= 0) {
      return;
    }

    let ufpwrlifter, reversePyramid;

    if (inputType === "1rm") {
      // If 1RM is provided, use it directly for UFpwrLifter
      // Estimate 6RM as ~85% of 1RM for Reverse Pyramid
      const estimated6RM = weightValue * 0.85;
      ufpwrlifter = calculateUFpwrLifter(weightValue);
      reversePyramid = calculateReversePyramid(estimated6RM);
    } else {
      // If 6RM is provided, estimate 1RM as ~117% of 6RM
      const estimated1RM = weightValue * 1.17;
      ufpwrlifter = calculateUFpwrLifter(estimated1RM);
      reversePyramid = calculateReversePyramid(weightValue);
    }

    setResults({
      ufpwrlifter,
      reversePyramid,
      inputType,
      inputWeight: weightValue,
    });
  };

  const handleReset = () => {
    setWeight("");
    setResults(null);
    setCheckedSets({});
  };

  const toggleCheckbox = (program, setIndex) => {
    const key = `${program}-${setIndex}`;
    setCheckedSets(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
      {/* Header */}
      <div className="h-20 backdrop-blur-md bg-black/80 border-b-2 border-primary/20 flex items-center justify-between px-6">
        <img src={logo} alt="Project 1,000" className="h-12" />
        <button
          onClick={() => navigate('/')}
          className="btn btn-sm bg-primary hover:bg-primary/90 text-white font-bold border-0"
        >
          Back to Home
        </button>
      </div>

      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 min-h-screen text-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Page Title */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-primary/20 mb-4 shadow-[0_0_20px_rgba(188,57,8,0.3)] border border-primary/40">
              <Calculator className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Program Demo
            </h1>
            <p className="text-lg text-white/70">
              Try our workout calculators - no sign up required
            </p>
          </div>

          {/* Input Form */}
          <div className="bg-gradient-to-br from-black to-gray-900 border border-primary/20 rounded-lg p-8 mb-8" style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)' }}>
            <form onSubmit={handleCalculate} className="space-y-6">
              <div>
                <label className="block text-white mb-3 font-semibold">
                  What do you know?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setInputType("1rm")}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                      inputType === "1rm"
                        ? "bg-primary text-white shadow-[0_0_20px_rgba(188,57,8,0.4)]"
                        : "bg-black/100 text-white/60 hover:bg-gray-700"
                    }`}
                  >
                    1 Rep Max
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputType("6rm")}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                      inputType === "6rm"
                        ? "bg-primary text-white shadow-[0_0_20px_rgba(188,57,8,0.4)]"
                        : "bg-black/100 text-white/60 hover:bg-gray-700"
                    }`}
                  >
                    6 Rep Max
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-white mb-3 font-semibold">
                  Enter Weight (lbs)
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder={inputType === "1rm" ? "e.g., 225" : "e.g., 190"}
                  className="w-full text-black px-4 py-3 bg-gray-800 border border-gray-700 rounded-lgfocus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  min="1"
                  step="1"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 btn bg-primary hover:bg-primary/90 text-white font-bold border-0 shadow-[0_0_30px_rgba(188,57,8,0.4)] hover:shadow-[0_0_40px_rgba(188,57,8,0.6)] transition-all"
                >
                  Calculate Programs
                </button>
                {results && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="btn bg-gray-700 hover:bg-gray-600 text-white font-bold border-0"
                  >
                    Reset
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Results */}
          {results && (
            <div className="space-y-8">
              {/* UFpwrLifter Program */}
              <div className="bg-white border-l-4 border-primary rounded-lg p-6">
                <h2 className="text-xl font-bold text-black mb-2">
                  UFpwrLifter Program
                </h2>
                <p className="text-gray-dark text-sm mb-4">
                  {inputType === "1rm" 
                    ? `Based on your 1RM of ${results.inputWeight} lbs`
                    : `Based on estimated 1RM of ${Math.round(results.inputWeight * 1.17)} lbs (from ${results.inputWeight} lbs 6RM)`
                  }
                </p>
                <div className="space-y-1 text-sm text-black">
                  {results.ufpwrlifter.map((set, index) => {
                    const key = `ufpwrlifter-${index}`;
                    const isChecked = checkedSets[key] || false;
                    return (
                      <div key={set.set} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="w-4 h-4 cursor-pointer"
                          checked={isChecked}
                          onChange={() => toggleCheckbox('ufpwrlifter', index)}
                        />
                        <div className={`flex justify-between flex-1 ${isChecked ? 'line-through opacity-50' : ''}`}>
                          <span>Set {set.set}:</span>
                          <span className="font-medium">
                            {set.weight} lbs × {set.reps} reps
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reverse Pyramid Program */}
              <div className="bg-white border-l-4 border-primary rounded-lg p-6">
                <h2 className="text-xl font-bold text-black mb-2">
                  Reverse Pyramid Program
                </h2>
                <p className="text-gray-dark text-sm mb-4">
                  {inputType === "6rm" 
                    ? `Based on your 6RM of ${results.inputWeight} lbs`
                    : `Based on estimated 6RM of ${Math.round(results.inputWeight * 0.85)} lbs (from ${results.inputWeight} lbs 1RM)`
                  }
                </p>
                <p className="text-xs text-gray-dark mb-3 font-mono italic">
                  💡 If you reach 8 reps on Set 4, update your 6 rep max by 5 pounds for every extra rep you did.
                </p>
                <div className="space-y-1 text-sm text-black">
                  {results.reversePyramid.map((set, index) => {
                    const key = `reversePyramid-${index}`;
                    const isChecked = checkedSets[key] || false;
                    return (
                      <div key={set.set} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="w-4 h-4 cursor-pointer"
                          checked={isChecked}
                          onChange={() => toggleCheckbox('reversePyramid', index)}
                        />
                        <div className={`flex justify-between flex-1 ${isChecked ? 'line-through opacity-50' : ''}`}>
                          <span>
                            Set {set.set}:
                            {set.warmup && (
                              <span className="ml-2 text-xs text-gray-dark uppercase tracking-wider">(warmup)</span>
                            )}
                          </span>
                          <span className="font-medium">
                            {set.weight} lbs × {set.reps} reps
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 rounded-lg p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-3">
                  Ready to track your progress?
                </h3>
                <p className="text-white/70 mb-6">
                  Sign up for Project 1,000 to save your workouts, track your progress, and reach the 1,000 Pound Club
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="btn bg-primary hover:bg-primary/90 text-white font-bold border-0 px-8 shadow-[0_0_30px_rgba(188,57,8,0.4)] hover:shadow-[0_0_40px_rgba(188,57,8,0.6)] transition-all"
                >
                  Get Started Free
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemoPage;
