import React from "react";

export const BENCH_VARIANTS = [
  { value: "upf", label: "UFpwrLifter Program" },
  { value: "reverse", label: "3x6-8 (Reverse Pyramid)" },
  { value: "threes", label: "3x3-5 (3x3s)" },
];

export const getBenchVariantLabel = (value) =>
  (BENCH_VARIANTS.find((v) => v.value === value) || BENCH_VARIANTS[0]).label;

const BenchVariantSelect = ({ value, onChange }) => (
  <div className="mb-4">
    <label className="block text-md font-semibold text-black mb-1">
      Bench Press Program
    </label>
    <p className="font-normal text-gray-dark text-sm mb-2">
      Choose which bench program this workout uses
    </p>
    <select
      value={value || "upf"}
      onChange={(e) => onChange(e.target.value)}
      className="input w-full"
    >
      {BENCH_VARIANTS.map((v) => (
        <option key={v.value} value={v.value}>
          {v.label}
        </option>
      ))}
    </select>
  </div>
);

export default BenchVariantSelect;
