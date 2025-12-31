import React, { useState } from "react";
import toast from "react-hot-toast";
import { useWorkout } from "../context/WorkoutContext";

const AddCustomWorkoutForm = ({ onClose }) => {
  const { exercises, addWorkout } = useWorkout();
  const [name, setName] = useState("");
  const [selected, setSelected] = useState([]);

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

    addWorkout({ name, exerciseIds: selected });
    setName("");
    setSelected([]);
    onClose();
  };

  return (
    <div className="card mb-6">
      <h3 className="text-xl font-bold mb-4 text-black">
        Create Custom Workout
      </h3>
      <input
        type="text"
        placeholder="Workout Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input w-full mb-4"
      />

      <div className="text-sm font-medium text-gray-dark mb-3">
        Select exercises:
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
        {exercises.map((ex) => (
          <label
            key={ex.id}
            className={`card card-sm flex items-center gap-2 cursor-pointer transition-colors ${
              selected.includes(ex.id)
                ? "text-white border-success"
                : "bg-white text-black hover:bg-gray-light"
            }`}
            style={
              selected.includes(ex.id)
                ? { background: "linear-gradient(135deg, #619624 0%, #86bd48 100%)" }
                : {}
            }
          >
            <input
              type="checkbox"
              checked={selected.includes(ex.id)}
              onChange={() => toggleSelect(ex.id)}
              className="invisible w-0 h-0"
            />
            <div>
              <p className="font-normal text-inherit">{ex.name}</p>
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
