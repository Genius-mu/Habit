# Habit XP Tracker

A simple **habit tracking app** that gamifies your daily, weekly, and monthly habits by awarding XP and tracking your progress with interactive charts. Built with **React**, **Zustand**, **Recharts**, and **Dexie.js** for offline persistence.

---

## Features

- ✅ **Track Habits**: Add daily, weekly, or monthly habits.
- 🎯 **XP System**: Gain XP for completing habits; streaks increase your progress.
- 📊 **Charts**: View your progress in **line** and **bar charts**, filtered by daily, weekly, or monthly habits.
- 🧩 **Leveling**: Level up as you accumulate XP.
- 💾 **Offline Persistence**: Data is stored locally with Dexie.js.
- ⚡ **Dynamic Tabs**: Switch between daily, weekly, and monthly stats with interactive charts.

---

## Installation

```bash
git clone https://github.com/Genius-mu/Habit.git
cd habit-xp-tracker
npm install
npm start
```

---

## Usage

1. **Add Habits**: Click “Add Habit” and choose frequency (daily, weekly, monthly).
2. **Mark Completion**: Toggle habits each day you complete them.
3. **View Stats**: Switch tabs to see your XP trends for daily, weekly, or monthly habits.
4. **Level Up**: Watch your XP increase and level progress dynamically.

---

## Tech Stack

- **React** – UI components
- **Zustand** – Global state management
- **Recharts** – Line and Bar charts
- **Dexie.js** – IndexedDB wrapper for persistent storage
- **date-fns** – Date formatting and calculations

---

## Folder Structure

```
src/
├─ components/        # UI components
├─ pages/             # Main pages (Stats, Habits, etc.)
├─ store/             # Zustand stores
├─ db/                # Dexie.js database setup
└─ App.jsx            # Entry point
```

---

## License

MIT © [Your Name]

---

## Future Improvements

- Dark mode / theming
- XP notifications and toasts
- Habit streak reminders
- Export / import data
- More advanced charts (cumulative XP, averages, comparisons)
