import { useMemo } from 'react';
import { Calendar } from './components/Calendar/Calendar';
import { DayDetail } from './components/DayDetail/DayDetail';
import { useSelectedDate } from './hooks/useSelectedDate';
import { getWorkoutByDate } from './utils/dateUtils';
import './styles/global.css';

function App() {
  const { selectedDate, currentMonth, selectDate, setCurrentMonth } = useSelectedDate();

  const workout = useMemo(() => getWorkoutByDate(selectedDate), [selectedDate]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Календарь тренировок</h1>
        <p>Скалолазание · 16 недель</p>
      </header>

      <Calendar
        currentMonth={currentMonth}
        selectedDate={selectedDate}
        onMonthChange={setCurrentMonth}
        onSelectDate={selectDate}
      />

      <DayDetail workout={workout} isSelected />
    </div>
  );
}

export default App;
