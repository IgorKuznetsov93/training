import { useMemo, useState } from 'react';
import { ChangesNotification } from './components/ChangesNotification/ChangesNotification';
import { Calendar } from './components/Calendar/Calendar';
import { DayDetail } from './components/DayDetail/DayDetail';
import { SettingsModal } from './components/Settings/SettingsModal';
import { SyncProvider, useSync } from './context/SyncContext';
import { useSelectedDate } from './hooks/useSelectedDate';
import './styles/global.css';

function AppContent() {
  const { selectedDate, currentMonth, selectDate, setCurrentMonth } = useSelectedDate();
  const {
    isConfigured,
    syncStatus,
    getWorkoutForDate,
    hasOverride,
    saveWorkout,
    resetWorkout,
  } = useSync();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const workout = useMemo(
    () => getWorkoutForDate(selectedDate),
    [getWorkoutForDate, selectedDate],
  );

  return (
    <div className="app">
      <header className="app-header">
        <button
          type="button"
          className="app-header__settings"
          onClick={() => setIsSettingsOpen(true)}
          aria-label="Настройки"
        >
          ⚙
        </button>
        <h1>Календарь тренировок</h1>
        <p>
          {isConfigured ? 'Синхронизация включена' : 'Скалолазание · 16 недель'}
        </p>
      </header>

      <Calendar
        currentMonth={currentMonth}
        selectedDate={selectedDate}
        onMonthChange={setCurrentMonth}
        onSelectDate={selectDate}
      />

      <DayDetail
        workout={workout}
        isSelected
        canEdit={isConfigured}
        hasOverride={hasOverride(workout.date)}
        isSaving={syncStatus === 'syncing'}
        onSave={saveWorkout}
        onReset={resetWorkout}
      />

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <ChangesNotification />
    </div>
  );
}

function App() {
  return (
    <SyncProvider>
      <AppContent />
    </SyncProvider>
  );
}

export default App;
