
import React, { useState } from 'react';
import { WheelDatePicker } from './components/WheelDatePicker';
import { CalendarIcon } from './components/Icons';

const App: React.FC = () => {
  // 2025年付近で初期化（または現在時刻）
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const formatJapaneseDate = (date: Date) => {
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    return `${y}年${m}月${d}日`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
        {/* Header Section */}
        <div className="p-8 text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-blue-50 p-3 rounded-2xl">
              <CalendarIcon className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-widest">選択された日付</h2>
            <p className="text-3xl font-bold text-gray-800 tracking-tight">
              {formatJapaneseDate(selectedDate)}
            </p>
          </div>
        </div>

        {/* Picker Section */}
        <div className="bg-gray-50 border-t border-gray-100 p-6">
          <WheelDatePicker 
            initialDate={selectedDate}
            minDate={new Date(1900, 0, 1)}
            maxDate={new Date(2100, 11, 31)} // 2100年まで選択可能に拡大
            onChange={setSelectedDate}
          />
        </div>

        {/* Footer info */}
        <div className="p-6 text-center">
          <p className="text-xs text-gray-400">
            SwiftUIスタイルの日付選択ピッカー
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
