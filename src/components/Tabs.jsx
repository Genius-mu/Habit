import { useState } from "react"; // only if you want local state for demo; otherwise pass props
// If using framer-motion for slide indicator (optional premium touch):
// import { motion } from "framer-motion";

export default function Tabs({ tab, setTab }) {
  const tabs = [
    { id: "daily", text: "Daily" },
    { id: "weekly", text: "Weekly" },
    { id: "monthly", text: "Monthly" },
    { id: "stats", text: "Stats" },
  ];

  // Optional: Find active tab index for slide indicator (if using motion)
  const activeIndex = tabs.findIndex((t) => t.id === tab);

  return (
    <div className="relative bg-gray-100/80 p-1 rounded-xl border border-gray-200/60">
      <div className="flex">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`relative flex-1 py-2.5 px-4 text-sm font-medium rounded-lg transition-all duration-200 
              ${
                tab === t.id
                  ? "text-gray-900 bg-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            role="tab"
            aria-selected={tab === t.id}
            tabIndex={tab === t.id ? 0 : -1}
          >
            {t.text}
          </button>
        ))}
      </div>

      {/* Optional sliding indicator with framer-motion (uncomment if you import motion) */}
      {/* 
      <motion.div
        className="absolute inset-1 bg-white rounded-lg shadow-sm"
        initial={false}
        animate={{ x: `${activeIndex * 25}%` }} // 25% per tab (4 tabs)
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{ width: "25%" }} // adjust if tab count changes
      />
      */}
    </div>
  );
}
