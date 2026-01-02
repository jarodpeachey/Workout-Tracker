import React, { useState } from "react";
import toast from "react-hot-toast";
import { useWorkout } from "../context/WorkoutContext";

const AddCustomWorkoutForm = ({ onClose }) => {
  const { exercises, addWorkout } = useWorkout();
  const [name, setName] = useState("");
  const [selected, setSelected] = useState([]);
  const [is_1rm, setIs1RM] = useState(false);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("Please enter a workout name");
      return;
    }
    if (selected.length === 0) {
      toast.error("Please select at least one exercise");
      return;
    }

    addWorkout({ name, exerciseIds: selected, is_1rm });
    setName("");
    setSelected([]);
    setIs1RM(false);
    onClose();
  };

  return (
    <div className="card mb-6">
      <h3 className="mb-4 text-black">
        Create Custom Workout
      </h3>
      <input
        type="text"
        placeholder="Workout Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input w-full mb-4"
      />

      <div className="mb-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={is_1rm}
            onChange={(e) => setIs1RM(e.target.checked)}
            className="w-5 h-5 cursor-pointer"
          />
          <div>
            <span className="text-md font-semibold text-black">
              1RM Testing Mode
            </span>
            <p className="font-normal text-gray-dark text-sm">
              Select this option to test your 1-rep max for the selected
              exercises
            </p>
          </div>
        </label>
      </div>

      <div className="text-sm font-medium text-gray-dark mb-3">
        Select exercises:
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
        {exercises.map((ex) => (
          <label
            key={ex.id}
            className={`card card-sm flex items-center gap-3 cursor-pointer transition-colors ${
              selected.includes(ex.id)
                ? "border border-primary bg-white"
                : "bg-white text-black hover:bg-gray-light"
            }`}
          >
            <input
              type="checkbox"
              checked={selected.includes(ex.id)}
              onChange={() => toggleSelect(ex.id)}
              className="w-5 h-5 accent-primary cursor-pointer"
            />
            <div>
              <p className={`font-normal ${
                selected.includes(ex.id) ? "text-primary" : "text-black"
              }`}>{ex.name}</p>
            </div>
          </label>
        ))}
      </div>

      <div className="flex gap-2">
        <button onClick={handleSubmit} className="btn btn-primary flex-1">
          Create
        </button>
        <button onClick={onClose} className="btn btn-secondary flex-1">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddCustomWorkoutForm;
