import { useState } from "react";
import Modal from "./Modal";
import AddHabitForm from "./AddHabitForm";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-20 flex items-center justify-between px-4 py-3.5 
        bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        
        <div className="flex items-center gap-2.5">
          <span className="text-xl font-semibold tracking-tight text-gray-900">
            Habit Tracker
          </span>
          {/* Optional: small badge / version pill */}
          {/* <span className="text-[10px] font-medium px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full">v2</span> */}
        </div>

        <button
          onClick={() => setOpen(true)}
          className="group flex items-center gap-2 px-5 py-2.5 
            bg-gradient-to-r from-gray-900 to-black 
            text-white text-sm font-medium
            rounded-xl shadow-sm hover:shadow-md 
            transition-all duration-200 active:scale-[0.98]
            focus:outline-none focus:ring-2 focus:ring-gray-900/30"
        >
          <svg 
            className="w-4 h-4 group-hover:rotate-90 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Habit
        </button>
      </header>

      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <AddHabitForm onClose={() => setOpen(false)} />
      </Modal>
    </>
  );
}