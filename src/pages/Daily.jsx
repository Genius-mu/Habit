import { useMemo } from "react";
import { useHabitsStore } from "../store/habitsStore";
import { Flame, Sparkles } from "lucide-react";
import StatsBar from "../components/StatsBar";
import AnimatedCheckbox from "../components/AnimatedCheckbox";

export default function Daily() {
  const { habits, toggleHabit } = useHabitsStore();

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  // Optional: sort habits – e.g. by streak descending or name
  const sortedHabits = [...habits].sort(
    (a, b) => (b.streak || 0) - (a.streak || 0),
  );

  const completedCount = habits.filter((h) => h.history?.[today]).length;
  const totalHabits = habits.length;

  return (
    <div className="space-y-6 pb-8">
      {/* Header area with progress summary */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Today’s Habits</h1>
          <p className="text-sm text-gray-600 mt-1">
            {completedCount} of {totalHabits} completed
          </p>
        </div>

        {totalHabits > 0 && (
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full">
              {Math.round((completedCount / totalHabits) * 100)}% done
            </span>
          </div>
        )}
      </div>

      <StatsBar />

      {habits.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50/80 rounded-2xl border border-dashed border-gray-300">
          <Sparkles className="w-10 h-10 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-700">No habits yet</h3>
          <p className="text-sm text-gray-500 mt-1 mb-4">
            Start building your routine by adding your first habit
          </p>
          {/* Optional: if you have a global add button trigger, call it here */}
          {/* <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700">
            Add First Habit
          </button> */}
        </div>
      ) : (
        <div className="space-y-3">
          {sortedHabits.map((habit) => {
            const isCompleted = !!habit.history?.[today];
            const streak = habit.streak || 0;

            // Dynamic flame color based on streak length
            const flameColor =
              streak >= 30
                ? "text-orange-600"
                : streak >= 14
                  ? "text-amber-500"
                  : streak >= 7
                    ? "text-yellow-500"
                    : streak >= 3
                      ? "text-orange-400"
                      : "text-gray-400";

            return (
              <div
                key={habit.id}
                className={`group flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 
                  shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200
                  ${isCompleted ? "bg-gradient-to-r from-green-50/40 to-transparent" : ""}`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <AnimatedCheckbox
                    checked={isCompleted}
                    onChange={() => toggleHabit(habit.id, today)}
                    size="lg" // assuming your AnimatedCheckbox supports size prop
                  />

                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {habit.name}
                    </p>

                    {habit.category && (
                      <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                        {habit.category}
                      </span>
                    )}

                    <div
                      className={`flex items-center gap-1.5 mt-1.5 text-sm ${flameColor}`}
                    >
                      <Flame size={16} className="fill-current" />
                      <span className="font-medium">
                        {streak} day{streak === 1 ? "" : "s"}
                        {streak >= 7 && " 🔥"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Optional: show XP reward preview if your habits have xpPerTick */}
                {habit.xpPerTick && !isCompleted && (
                  <div className="text-xs text-green-600 font-medium whitespace-nowrap">
                    +{habit.xpPerTick} XP
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
