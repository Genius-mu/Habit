import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import Navbar from "./components/Navbar";
import Tabs from "./components/Tabs";
import Daily from "./pages/Daily";
import Weekly from "./pages/Weekly";
import Monthly from "./pages/Monthly";
import Stats from "./pages/Stats";
import AddHabitForm from "./components/AddHabitForm"; 
import XpToast from "./XpToast";

import { useHabitsStore } from "./store/habitsStore";

function App() {
  const [tab, setTab] = useState("daily");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { initialized, habits, init, addHabit, isLoading } = useHabitsStore();

  // One-time initialization + demo data seeding
  useEffect(() => {
    const initializeApp = async () => {
      if (initialized) return;

      try {
        await init();

        // Seed demo data only if no habits exist
        if (habits.length === 0) {
          await addHabit({
            name: "Workout 💪",
            frequency: "daily",
            xpPerTick: 25,
            // add other defaults if needed
          });
          console.log("Seeded initial demo habit");
        }
      } catch (error) {
        console.error("Failed to initialize habits:", error);
        // Optional: show user-facing error toast here
      }
    };

    initializeApp();
  }, [init, addHabit, initialized, habits.length]);

  // Optional: handle any critical loading state from store
  if (!initialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your habits...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (tab) {
      case "daily":
        return <Daily />;
      case "weekly":
        return <Weekly />;
      case "monthly":
        return <Monthly />;
      case "stats":
        return <Stats />;
      default:
        return <Daily />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <Navbar onAddClick={() => setIsModalOpen(true)} />

      <main className="flex-1 container mx-auto px-4 py-6 md:px-6 lg:px-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Tabs tab={tab} setTab={setTab} />
        </motion.div>

        <motion.div
          key={tab} // animate content change when tab switches
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6"
        >
          {renderContent()}
        </motion.div>
      </main>

      {/* Add Habit Modal */}
      {isModalOpen && (
        <AddHabitForm
          onClose={() => setIsModalOpen(false)}
          // You can pass extra props if needed (e.g. default frequency)
        />
      )}

      {/* Global XP toast / notification system */}
      <XpToast />
    </div>
  );
}

export default App;