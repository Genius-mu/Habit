import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useHabitsStore } from "../store/habitsStore";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import {
  parseISO,
  format,
  startOfWeek,
  startOfMonth,
  addDays,
  addWeeks,
  addMonths,
  isSameDay,
} from "date-fns";
import { TrendingUp, Award, Calendar, Zap } from "lucide-react";

export default function Stats() {
  const { xpHistory = [], habits = [], xp = 0, level = 1 } = useHabitsStore();
  const [activeTab, setActiveTab] = useState("combined");

  const tabs = [
    { id: "combined", label: "All" },
    { id: "daily", label: "Daily" },
    { id: "weekly", label: "Weekly" },
    { id: "monthly", label: "Monthly" },
  ];

  const tabColors = {
    daily: "#3b82f6", // blue
    weekly: "#10b981", // emerald
    monthly: "#f59e0b", // amber
    combined: "#8b5cf6", // violet for combined
  };

  // Memoize sorted & parsed history
  const sortedHistory = useMemo(() => {
    return [...xpHistory]
      .filter((item) => item.date && item.xp)
      .map((item) => ({
        ...item,
        dateObj: parseISO(item.date),
      }))
      .sort((a, b) => a.dateObj - b.dateObj);
  }, [xpHistory]);

  if (sortedHistory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <Zap className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No data yet</h2>
        <p className="text-gray-600 max-w-md">
          Start completing habits to see your progress charts and statistics
          appear here.
        </p>
      </div>
    );
  }

  const firstDate = sortedHistory[0].dateObj;
  const lastDate = sortedHistory[sortedHistory.length - 1].dateObj;

  // Generate timeline keys based on frequency
  const generateTimeline = (freq) => {
    const timeline = [];
    let current =
      freq === "daily"
        ? firstDate
        : freq === "weekly"
          ? startOfWeek(firstDate, { weekStartsOn: 1 })
          : startOfMonth(firstDate);

    const end =
      freq === "daily"
        ? lastDate
        : freq === "weekly"
          ? startOfWeek(lastDate, { weekStartsOn: 1 })
          : startOfMonth(lastDate);

    while (current <= end) {
      if (freq === "daily") {
        timeline.push(format(current, "MMM d"));
        current = addDays(current, 1);
      } else if (freq === "weekly") {
        const weekEnd = addDays(current, 6);
        timeline.push(
          `${format(current, "MMM d")}-${format(weekEnd, "MMM d")}`,
        );
        current = addWeeks(current, 1);
      } else {
        timeline.push(format(current, "MMM yyyy"));
        current = addMonths(current, 1);
      }
    }
    return timeline;
  };

  // Aggregate XP by period
  const prepareData = (freq) => {
    const timeline = generateTimeline(freq);
    const dataMap = {};

    sortedHistory.forEach((entry) => {
      const habit = habits.find((h) => h.id === entry.habitId);
      if (!habit || habit.frequency !== freq) return;

      let key = "";
      if (freq === "daily") key = format(entry.dateObj, "MMM d");
      else if (freq === "weekly") {
        const ws = startOfWeek(entry.dateObj, { weekStartsOn: 1 });
        key = `${format(ws, "MMM d")}-${format(addDays(ws, 6), "MMM d")}`;
      } else {
        key = format(startOfMonth(entry.dateObj), "MMM yyyy");
      }

      dataMap[key] = (dataMap[key] || 0) + entry.xp;
    });

    return timeline.map((label) => ({
      label,
      xp: dataMap[label] || 0,
    }));
  };

  const dailyData = useMemo(
    () => prepareData("daily"),
    [sortedHistory, habits],
  );
  const weeklyData = useMemo(
    () => prepareData("weekly"),
    [sortedHistory, habits],
  );
  const monthlyData = useMemo(
    () => prepareData("monthly"),
    [sortedHistory, habits],
  );

  // Combined view preparation
  const combinedData = useMemo(() => {
    const allLabels = Array.from(
      new Set([
        ...dailyData.map((d) => d.label),
        ...weeklyData.map((d) => d.label),
        ...monthlyData.map((d) => d.label),
      ]),
    ).sort();

    return allLabels.map((label) => ({
      label,
      daily: dailyData.find((d) => d.label === label)?.xp || 0,
      weekly: weeklyData.find((d) => d.label === label)?.xp || 0,
      monthly: monthlyData.find((d) => d.label === label)?.xp || 0,
    }));
  }, [dailyData, weeklyData, monthlyData]);

  const activeData =
    activeTab === "combined"
      ? combinedData
      : activeTab === "daily"
        ? dailyData
        : activeTab === "weekly"
          ? weeklyData
          : monthlyData;

  const currentColor = tabColors[activeTab] || "#8b5cf6";

  return (
    <div className="space-y-8 pb-12 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-indigo-600" />
          Progress Dashboard
        </h1>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-center"
        >
          <Zap className="w-6 h-6 mx-auto mb-2 text-indigo-600" />
          <p className="text-sm text-gray-600">Total XP</p>
          <p className="text-3xl font-bold text-indigo-700 mt-1">
            {xp.toLocaleString()}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-center"
        >
          <Award className="w-6 h-6 mx-auto mb-2 text-amber-600" />
          <p className="text-sm text-gray-600">Level</p>
          <p className="text-3xl font-bold text-amber-700 mt-1">Lv {level}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-center"
        >
          <Calendar className="w-6 h-6 mx-auto mb-2 text-green-600" />
          <p className="text-sm text-gray-600">Days Active</p>
          <p className="text-3xl font-bold text-green-700 mt-1">
            {xpHistory.length}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-center"
        >
          <TrendingUp className="w-6 h-6 mx-auto mb-2 text-purple-600" />
          <p className="text-sm text-gray-600">Habits Tracked</p>
          <p className="text-3xl font-bold text-purple-700 mt-1">
            {habits.length}
          </p>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-100/70 p-1.5 rounded-xl border border-gray-200 inline-flex">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === t.id
                ? "bg-white shadow-sm text-gray-900"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/80"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Main Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6 h-[400px]"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          XP Progress —{" "}
          {activeTab === "combined"
            ? "All Frequencies"
            : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </h2>

        <ResponsiveContainer width="100%" height="100%">
          {activeTab === "combined" ? (
            <LineChart
              data={activeData}
              margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="label"
                angle={-45}
                textAnchor="end"
                height={60}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip
                contentStyle={{
                  background: "white",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Legend verticalAlign="top" height={36} />
              <Line
                type="monotone"
                dataKey="daily"
                stroke={tabColors.daily}
                name="Daily"
                strokeWidth={2.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="weekly"
                stroke={tabColors.weekly}
                name="Weekly"
                strokeWidth={2.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="monthly"
                stroke={tabColors.monthly}
                name="Monthly"
                strokeWidth={2.5}
                dot={false}
              />
            </LineChart>
          ) : (
            <LineChart
              data={activeData}
              margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="label"
                angle={-45}
                textAnchor="end"
                height={60}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip
                contentStyle={{
                  background: "white",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="xp"
                stroke={currentColor}
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </motion.div>

      {/* Optional: Bar version for single frequency */}
      {activeTab !== "combined" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6 h-[400px]"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Weekly Breakdown —{" "}
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={activeData}
              margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="label"
                angle={-45}
                textAnchor="end"
                height={60}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip
                contentStyle={{
                  background: "white",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Bar dataKey="xp" fill={currentColor} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}
    </div>
  );
}
