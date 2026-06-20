import { useCallback, useState } from 'react';

interface UseSelectedDateResult {
  selectedDate: Date;
  currentMonth: Date;
  selectDate: (date: Date) => void;
  setCurrentMonth: (month: Date) => void;
}

export function useSelectedDate(initialDate: Date = new Date()): UseSelectedDateResult {
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [currentMonth, setCurrentMonth] = useState<Date>(
    new Date(initialDate.getFullYear(), initialDate.getMonth(), 1),
  );

  const selectDate = useCallback((date: Date) => {
    setSelectedDate(date);
    setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
  }, []);

  return {
    selectedDate,
    currentMonth,
    selectDate,
    setCurrentMonth,
  };
}
