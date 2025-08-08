import * as React from "react"
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHospital, faCalendarCheck } from '@fortawesome/free-solid-svg-icons'

function Calendar({ className, classNames, showOutsideDays = true, selected, onSelect, ...props }) {
  // Mock data for patient counts per day
  const getPatientCounts = (date) => {
    const dayOfMonth = date.getDate()
    // Mock data - in real app this would come from props or API
    return {
      inpatient: Math.floor(Math.random() * 15) + 3, // 3-17
      outpatient: Math.floor(Math.random() * 20) + 5  // 5-24
    }
  }

  const formatDay = (date) => {
    const counts = getPatientCounts(date)
    const dayNum = date.getDate()
    
    return (
      <div className="flex flex-col items-center p-1">
        <div className="font-medium text-sm">{dayNum}</div>
        <div className="flex gap-1 text-xs">
          <span className="flex items-center gap-0.5">
            <FontAwesomeIcon icon={faHospital} className="text-red-600 w-2 h-2" />
            {counts.inpatient}
          </span>
          <span className="flex items-center gap-0.5">
            <FontAwesomeIcon icon={faCalendarCheck} className="text-blue-600 w-2 h-2" />
            {counts.outpatient}
          </span>
        </div>
      </div>
    )
  }

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] flex-1 text-center",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md flex-1",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md [&:has(>.day-range-start)>.day]:rounded-l-md [&:has(>.day-range-end)>.day]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          "h-16 w-full p-0 hover:bg-accent hover:text-accent-foreground"
        ),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        DayContent: ({ date, ...dayProps }) => formatDay(date)
      }}
      selected={selected}
      onSelect={onSelect}
      {...props}
    />
  )
}

Calendar.displayName = "Calendar"

export { Calendar }