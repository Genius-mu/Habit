import { useMemo, useState } from "react";
import { useHabitsStore } from "../store/habitsStore";
import { Flame, ChevronLeft, ChevronRight } from "lucide-react";
import AnimatedCheckbox from "../components/AnimatedCheckbox";
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isToday,
  isPast,
  addWeeks,
  subWeeks,
  isSameDay,
} from "date-fns";

// Uncomment if you want the bar chart
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

export default function Weekly() {
  const { habits, toggleHabit, xpHistory } = useHabitsStore();

  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );

  const weekStart = currentWeekStart;
  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });

  const weekDates = useMemo(
    () =>
      eachDayOfInterval({ start: weekStart, end: weekEnd }).map((d) =>
        format(d, "yyyy-MM-dd"),
      ),
    [weekStart],
  );

  const weekName = `${format(weekStart, "MMM d")} – ${format(weekEnd, "MMM d, yyyy")}`;

  const goToPrevWeek = () => setCurrentWeekStart((prev) => subWeeks(prev, 1));
  const goToNextWeek = () => setCurrentWeekStart((prev) => addWeeks(prev, 1));

  // Calculate total XP this week (from xpHistory)
  const weeklyXP = useMemo(() => {
    return weekDates.reduce((sum, date) => {
      const entry = xpHistory?.find((x) => x.date === date);
      return sum + (entry?.xp || 0);
    }, 0);
  }, [weekDates, xpHistory]);

  // Optional: prepare chart data
  // const chartData = weekDates.map((date) => {
  //   const entry = xpHistory?.find((x) => x.date === date);
  //   return {
  //     day: format(new Date(date), "EEE"),
  //     xp: entry?.xp || 0,
  //   };
  // });

  const getWeeklyStreak = (habit) => {
    let streak = 0;
    for (let i = weekDates.length - 1; i >= 0; i--) {
      const date = weekDates[i];
      if (habit.history?.[date]) {
        streak++;
      } else if (isPast(new Date(date))) {
        break;
      }
    }
    return streak;
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Week Header + Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={goToPrevWeek}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Previous week"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">
            Week of {weekName}
          </h2>
          {weeklyXP > 0 && (
            <p className="text-sm text-green-600 font-medium mt-1">
              +{weeklyXP} XP this week
            </p>
          )}
        </div>

        <button
          onClick={goToNextWeek}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Next week"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Weekly XP Summary Card */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-sm border border-green-100 p-5 text-center">
        <p className="text-sm text-gray-600">Total XP This Week</p>
        <p className="text-4xl font-bold text-emerald-700 mt-1">{weeklyXP}</p>
      </div>

      {habits.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <Flame className="w-10 h-10 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-700">No habits yet</h3>
          <p className="text-sm text-gray-500 mt-2 max-w-md">
            Add habits to track your weekly progress
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {habits.map((habit) => {
            const weeklyStreak = getWeeklyStreak(habit);
            const flameColor =
              weeklyStreak >= 7
                ? "text-red-600"
                : weeklyStreak >= 4
                  ? "text-orange-500"
                  : weeklyStreak >= 2
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
                      {weeklyStreak} week{weeklyStreak === 1 ? "" : "s"}
                    </span>
                  </div>
                </div>

                {/* Week Days Grid */}
                <div className="p-4 grid grid-cols-7 gap-2 text-center">
                  {weekDates.map((dateStr) => {
                    const date = new Date(dateStr);
                    const isCompleted = !!habit.history?.[dateStr];
                    const isCurrentDay = isToday(date);
                    const isFuture = date > new Date();

                    return (
                      <div
                        key={dateStr}
                        className={`flex flex-col items-center py-2 rounded-lg transition-all ${
                          isCurrentDay
                            ? "bg-indigo-50 ring-1 ring-indigo-200"
                            : ""
                        } ${isFuture ? "opacity-50 pointer-events-none" : ""}`}
                      >
                        <span
                          className={`text-xs font-medium mb-1.5 ${
                            isCurrentDay
                              ? "text-indigo-700 font-semibold"
                              : "text-gray-600"
                          }`}
                        >
                          {format(date, "EEE")}
                        </span>

                        <div className="transform transition-transform hover:scale-110">
                          <AnimatedCheckbox
                            checked={isCompleted}
                            onChange={() => toggleHabit(habit.id, dateStr)}
                            disabled={isFuture}
                            size="md"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Optional: XP Bar Chart – uncomment if desired */}
      {/* <div className="bg-white rounded-xl shadow-sm p-5 h-80 mt-6">
        <h3 className="text-lg font-semibold mb-4">XP Earned This Week</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" axisLine={false} tick={{ fill: "#6b7280" }} />
            <YAxis axisLine={false} tick={{ fill: "#6b7280" }} />
            <Tooltip 
              contentStyle={{ background: "white", borderRadius: "8px", border: "1px solid #e5e7eb" }}
              cursor={{ fill: "rgba(0,0,0,0.05)" }}
            />
            <Bar dataKey="xp" fill="#10b981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div> */}
    </div>
  );
}
