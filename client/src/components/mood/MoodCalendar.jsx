import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import analyticsService from '../../services/analyticsService';

const moodColorMap = {
  1: 'bg-mood-1',
  2: 'bg-mood-2',
  3: 'bg-mood-3',
  4: 'bg-mood-4',
  5: 'bg-mood-5'
};

const MoodCalendar = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [calendarData, setCalendarData] = useState([]);

  useEffect(() => {
    analyticsService.getCalendar(year, month)
      .then((res) => setCalendarData(res.data.data || []))
      .catch(() => setCalendarData([]));
  }, [year, month]);

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
  const monthName = new Date(year, month - 1).toLocaleString('en', { month: 'long' });

  // Create lookup map
  const dataMap = {};
  calendarData.forEach((d) => {
    const day = new Date(d.date).getDate();
    dataMap[day] = d;
  });

  const prevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  return (
    <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-1.5 rounded-lg hover:bg-dark-800 text-dark-400 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h3 className="text-white font-semibold">
          {monthName} {year}
        </h3>
        <button
          onClick={nextMonth}
          className="p-1.5 rounded-lg hover:bg-dark-800 text-dark-400 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <div key={day} className="text-center text-xs text-dark-500 font-medium py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells before first day */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {/* Days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const data = dataMap[day];
          const moodLevel = data ? Math.round(data.averageMood) : 0;
          const isToday =
            day === new Date().getDate() &&
            month === new Date().getMonth() + 1 &&
            year === new Date().getFullYear();

          return (
            <div
              key={day}
              className={`
                aspect-square rounded-lg flex items-center justify-center text-xs
                transition-all duration-200 relative
                ${moodLevel > 0
                  ? `${moodColorMap[moodLevel]} text-white font-medium`
                  : 'bg-dark-800/50 text-dark-600'
                }
                ${isToday ? 'ring-2 ring-primary-500 ring-offset-1 ring-offset-dark-900' : ''}
              `}
              title={
                data
                  ? `${monthName} ${day}: Mood ${data.averageMood}/5 (${data.entries} entries)`
                  : `${monthName} ${day}: No entry`
              }
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-3 mt-4">
        <span className="text-xs text-dark-500">Less</span>
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`w-4 h-4 rounded ${moodColorMap[level]}`}
            title={`Mood ${level}/5`}
          />
        ))}
        <span className="text-xs text-dark-500">More</span>
      </div>
    </div>
  );
};

export default MoodCalendar;