import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const GridCalendar = ({ selected, onSelect, className = '' }) => {
  const currentDate = selected || new Date();
  const [displayDate, setDisplayDate] = React.useState(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1));
  
  // Mock data for patient counts
  const getPatientCounts = (date) => {
    const dayOfMonth = date.getDate();
    return {
      inpatient: Math.floor(Math.random() * 15) + 3, // 3-17
      outpatient: Math.floor(Math.random() * 20) + 5  // 5-24
    };
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    // Convert Sunday (0) to 6, Monday (1) to 0, etc.
    return firstDay === 0 ? 6 : firstDay - 1;
  };

  const previousMonth = () => {
    setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 1));
  };

  const selectDate = (day) => {
    const newDate = new Date(displayDate.getFullYear(), displayDate.getMonth(), day);
    if (onSelect) {
      onSelect(newDate);
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const daysInMonth = getDaysInMonth(displayDate);
  const firstDay = getFirstDayOfMonth(displayDate);
  const today = new Date();

  // Generate calendar days
  const calendarDays = [];
  
  // Empty cells for days before the first day of month
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const isToday = (day) => {
    if (!day) return false;
    const checkDate = new Date(displayDate.getFullYear(), displayDate.getMonth(), day);
    return checkDate.toDateString() === today.toDateString();
  };

  const isSelected = (day) => {
    if (!day || !currentDate) return false;
    const checkDate = new Date(displayDate.getFullYear(), displayDate.getMonth(), day);
    return checkDate.toDateString() === currentDate.toDateString();
  };

  return (
    <div className={`bg-white border rounded-lg p-3 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={previousMonth}
          className="h-6 w-6"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-sm font-semibold">
          {monthNames[displayDate.getMonth()]} {displayDate.getFullYear()}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={nextMonth}
          className="h-6 w-6"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground p-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          if (!day) {
            return <div key={index} className="h-14"></div>;
          }

          const counts = getPatientCounts(new Date(displayDate.getFullYear(), displayDate.getMonth(), day));
          
          return (
            <button
              key={day}
              onClick={() => selectDate(day)}
              className={`h-14 p-1 rounded text-xs transition-colors ${
                isSelected(day) ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground' :
                isToday(day) ? 'bg-accent text-accent-foreground hover:bg-accent/90' :
                'hover:bg-muted hover:text-foreground'
              }`}
            >
              <div className="flex flex-col items-center">
                <div className="font-medium">{day}</div>
                <div className="flex gap-1 mt-1">
                  <span className="flex items-center gap-0.5">
                    <span className="text-destructive text-xs">🏥</span>
                    <span className="text-xs">{counts.inpatient}</span>
                  </span>
                  <span className="flex items-center gap-0.5">
                    <span className="text-primary text-xs">📅</span>
                    <span className="text-xs">{counts.outpatient}</span>
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export { GridCalendar };