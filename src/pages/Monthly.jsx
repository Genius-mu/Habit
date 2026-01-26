import { useState, useMemo } from "react";
import { useHabitsStore } from "../store/habitsStore";
import { Flame, ChevronLeft, ChevronRight } from "lucide-react";
import AnimatedCheckbox from "../components/AnimatedCheckbox";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  addMonths,
  subMonths,
  isSameDay,
  isToday,
  isPast,
} from "date-fns";

export default function Monthly() {
  const { habits, toggleHabit } = useHabitsStore();

  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDates = useMemo(
    () =>
      eachDayOfInterval({ start: monthStart, end: monthEnd }).map((d) =>
        format(d, "yyyy-MM-dd"),
      ),
    [currentMonth],
  );

  const monthName = format(currentMonth, "MMMM yyyy");

  const goToPrevMonth = () => setCurrentMonth((prev) => subMonths(prev, 1));
  const goToNextMonth = () => setCurrentMonth((prev) => addMonths(prev, 1));

  const getMonthlyStreak = (habit) => {
    // Simple streak: consecutive completed days from the end of the month backward
    let streak = 0;
    for (let i = monthDates.length - 1; i >= 0; i--) {
      const date = monthDates[i];
      if (habit.history?.[date]) {
        streak++;
      } else if (isPast(new Date(date))) {
        break; // stop counting if we hit a missed past day
      }
    }
    return streak;
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Month Header with Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={goToPrevMonth}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft size={20} />
        </button>

        <h2 className="text-xl font-bold text-gray-900">{monthName}</h2>

        <button
          onClick={goToNextMonth}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Next month"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {habits.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <Flame className="w-10 h-10 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-700">
            No habits tracked yet
          </h3>
          <p className="text-sm text-gray-500 mt-2 max-w-md">
            Add habits to start seeing your monthly progress calendar
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {habits.map((habit) => {
            const monthlyStreak = getMonthlyStreak(habit);
            const flameColor =
              monthlyStreak >= 20
                ? "text-red-600"
                : monthlyStreak >= 10
                  ? "text-orange-500"
                  : monthlyStreak >= 5
                    ? "text-amber-500"
                    : "text-gray-400";

            return (
              <div
                key={habit.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
              >
                {/* Habit Header */}
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{habit.name}</p>
                    {habit.category && (
                      <span className="text-xs text-gray-500 mt-0.5 inline-block">
                        {habit.category}
                      </span>
                    )}
                  </div>

                  <div className={`flex items-center gap-1.5 ${flameColor}`}>
                    <Flame size={18} className="fill-current" />
                    <span className="font-medium text-sm">
                      {monthlyStreak} month{monthlyStreak === 1 ? "" : "s"}
                    </span>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="p-4 grid grid-cols-7 gap-2 text-center">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (day) => (
                      <div
                        key={day}
                        className="text-xs font-medium text-gray-500 py-1"
                      >
                        {day}
                      </div>
                    ),
                  )}

                  {/* Offset empty cells for correct weekday start */}
                  {Array.from({ length: monthStart.getDay() || 7 }).map(
                    (_, i) => (
                      <div key={`offset-${i}`} />
                    ),
                  )}

                  {monthDates.map((dateStr) => {
                    const date = new Date(dateStr);
                    const isCompleted = !!habit.history?.[dateStr];
                    const isCurrentDay = isToday(date);
                    const isFuture = date > new Date();

                    return (
                      <div
                        key={dateStr}
                        className={`flex flex-col items-center py-1 rounded-lg transition-all ${
                          isCurrentDay
                            ? "bg-indigo-50 ring-1 ring-indigo-200"
                            : ""
                        } ${isFuture ? "opacity-50 pointer-events-none" : ""}`}
                      >
                        <span
                          className={`text-xs font-medium mb-1 ${
                            isCurrentDay ? "text-indigo-700" : "text-gray-600"
                          }`}
                        >
                          {format(date, "d")}
                        </span>

                        <AnimatedCheckbox
                          checked={isCompleted}
                          onChange={() => toggleHabit(habit.id, dateStr)}
                          disabled={isFuture}
                          size="sm"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
