import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHabitsStore } from "../store/habitsStore";

export default function StatsBar() {
  const { xp, level } = useHabitsStore();

  const [lastXP, setLastXP] = useState(xp);
  const [lastLevel, setLastLevel] = useState(level);
  const [delta, setDelta] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    const xpDiff = xp - lastXP;

    if (xpDiff !== 0) {
      setDelta(xpDiff);
      setLastXP(xp);

      // Clear popup after animation
      const timer = setTimeout(() => setDelta(0), 1800);
      return () => clearTimeout(timer);
    }

    // Detect level up
    if (level > lastLevel) {
      setShowLevelUp(true);
      const levelTimer = setTimeout(() => setShowLevelUp(false), 3000);
      setLastLevel(level);
      return () => clearTimeout(levelTimer);
    }
  }, [xp, level, lastXP, lastLevel]);

  // Assuming 100 XP per level (customize this formula as needed)
  const xpForCurrentLevel = xp % 100;
  const progressPercent = (xpForCurrentLevel / 100) * 100;

  return (
    <div className="relative bg-gradient-to-b from-white to-gray-50/80 p-5 rounded-2xl shadow-md border border-gray-100 overflow-hidden mt-4">
      {/* Floating XP popup */}
      <AnimatePresence>
        {delta !== 0 && (
          <motion.div
            key={`delta-${delta}`}
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: -50, scale: 1 }}
            exit={{ opacity: 0, y: -80, scale: 0.7 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute left-1/2 top-2 -translate-x-1/2 px-4 py-1.5 rounded-full text-sm font-bold shadow-lg ${
              delta > 0
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-red-100 text-red-700 border border-red-200"
            }`}
          >
            {delta > 0 ? `+${delta} XP` : `${delta} XP`}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <motion.div
            animate={
              showLevelUp
                ? {
                    scale: [1, 1.15, 1.08, 1.15, 1],
                    rotate: [0, 3, -3, 2, 0],
                    transition: { duration: 1.2, repeat: 0 },
                  }
                : {}
            }
            className="relative"
          >
            <span className="text-lg font-bold text-gray-900">
              Level {level}
            </span>
            {showLevelUp && (
              <span className="absolute -top-1 -right-2 text-yellow-500 text-xl animate-ping">
                ✨
              </span>
            )}
          </motion.div>
        </div>

        <span className="text-sm font-medium text-gray-600">
          {xp} <span className="text-gray-400">XP</span>
        </span>
      </div>

      {/* Progress bar */}
      <div className="relative h-3.5 bg-gray-200/70 rounded-full overflow-hidden shadow-inner">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* Subtle shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </motion.div>
      </div>

      {/* Next level hint */}
      <div className="mt-2 text-right text-xs text-gray-500">
        {100 - xpForCurrentLevel} XP to Level {level + 1}
      </div>

      {/* Optional: shimmer animation keyframe */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2.5s infinite linear;
        }
      `}</style>
    </div>
  );
}