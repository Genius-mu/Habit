import { useState, useEffect, useRef } from "react";
import { useHabitsStore } from "../store/habitsStore";

export default function AddHabitForm({ onClose }) {
  const addHabit = useHabitsStore((s) => s.addHabit);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

  const nameRef = useRef(null);

  // Auto-focus on name input when form opens
  useEffect(() => {
    if (nameRef.current) {
      nameRef.current.focus();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Please enter a habit name");
      nameRef.current?.focus();
      return;
    }

    const newHabit = {
      id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
      name: trimmedName,
      category: category.trim() || undefined,
      history: {},
      streak: 0,
      createdAt: new Date().toISOString(),
    };

    addHabit(newHabit);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">New Habit</h2>
        <p className="mt-1 text-sm text-gray-500">
          Start building better routines today
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {/* Habit Name */}
      <div className="relative">
        <input
          ref={nameRef}
          id="habit-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="peer w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 
            placeholder-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/50 
            focus:outline-none transition-all duration-200"
          placeholder=" "
          autoComplete="off"
        />
        <label
          htmlFor="habit-name"
          className="absolute left-4 -top-2.5 bg-white px-1.5 text-sm font-medium text-gray-600 
            transition-all duration-200 
            peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 
            peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600"
        >
          Habit Name
        </label>
      </div>

      {/* Category (optional) */}
      <div className="relative">
        <input
          id="category"
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="peer w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 
            placeholder-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/50 
            focus:outline-none transition-all duration-200"
          placeholder=" "
          autoComplete="off"
        />
        <label
          htmlFor="category"
          className="absolute left-4 -top-2.5 bg-white px-1.5 text-sm font-medium text-gray-600 
            transition-all duration-200 
            peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 
            peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-indigo-600"
        >
          Category (optional)
        </label>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-3 px-4 text-sm font-medium text-gray-700 bg-white 
            border border-gray-300 rounded-xl hover:bg-gray-50 
            focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="flex-1 py-3 px-4 text-sm font-semibold text-white 
            bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl 
            shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-indigo-800 
            focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 
            transition-all active:scale-[0.98]"
        >
          Create Habit
        </button>
      </div>
    </form>
  );
}
