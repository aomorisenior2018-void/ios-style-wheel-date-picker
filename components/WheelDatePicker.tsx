
import React, { useState, useEffect, useMemo } from 'react';
import { WheelColumn } from './WheelColumn';
import { getDaysInMonth } from '../utils/dateUtils';

interface WheelDatePickerProps {
  initialDate: Date;
  minDate: Date;
  maxDate: Date;
  onChange: (date: Date) => void;
}

export const WheelDatePicker: React.FC<WheelDatePickerProps> = ({
  initialDate,
  minDate,
  maxDate,
  onChange,
}) => {
  const [year, setYear] = useState(() => initialDate.getFullYear());
  const [month, setMonth] = useState(() => initialDate.getMonth() + 1);
  const [day, setDay] = useState(() => initialDate.getDate());

  const years = useMemo(() => {
    const startYear = minDate.getFullYear();
    const endYear = maxDate.getFullYear();
    const result = [];
    for (let i = startYear; i <= endYear; i++) {
      result.push({ value: i, label: `${i}年` });
    }
    return result;
  }, [minDate, maxDate]);

  const months = useMemo(() => {
    const result = [];
    for (let i = 1; i <= 12; i++) {
      result.push({ value: i, label: `${i}月` });
    }
    return result;
  }, []);

  const days = useMemo(() => {
    const daysInMonth = getDaysInMonth(year, month);
    const result = [];
    for (let i = 1; i <= daysInMonth; i++) {
      result.push({ value: i, label: `${i}日` });
    }
    return result;
  }, [year, month]);

  useEffect(() => {
    const maxDays = getDaysInMonth(year, month);
    let targetDay = day;
    if (day > maxDays) {
      targetDay = maxDays;
      setDay(maxDays);
    }

    const newDate = new Date(year, month - 1, targetDay);
    
    if (newDate.toDateString() !== initialDate.toDateString()) {
      onChange(newDate);
    }
  }, [year, month, day, initialDate, onChange]);

  return (
    <div className="relative flex items-center justify-center h-[200px] select-none w-full max-w-sm mx-auto overflow-hidden">
      {/* 選択ハイライト */}
      <div className="absolute top-1/2 left-0 right-0 h-10 -translate-y-1/2 bg-gray-200/40 rounded-lg pointer-events-none z-0 border-y border-gray-300/10" />
      
      <div className="flex w-full h-full items-stretch relative z-10">
        {/* 年カラム - 幅を少し広く確保し、最小幅を明示 */}
        <div style={{ flex: '1.4 1 0%', minWidth: '85px' }}>
          <WheelColumn 
            items={years} 
            value={year} 
            onValueChange={setYear} 
          />
        </div>
        {/* 月カラム */}
        <div style={{ flex: '1 1 0%', minWidth: '60px' }}>
          <WheelColumn 
            items={months} 
            value={month} 
            onValueChange={setMonth} 
          />
        </div>
        {/* 日カラム */}
        <div style={{ flex: '1 1 0%', minWidth: '60px' }}>
          <WheelColumn 
            items={days} 
            value={day} 
            onValueChange={setDay} 
          />
        </div>
      </div>
    </div>
  );
};
