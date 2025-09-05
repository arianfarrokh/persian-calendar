"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  jsDateToPersian,
  persianToJsDate,
  getPersianMonthDays,
  PERSIAN_MONTHS,
  PERSIAN_WEEKDAYS,
  type PersianDate,
} from "@/lib/solar-hijri"
import { cn } from "@/lib/utils"

interface MiniCalendarProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
  className?: string
}

export function MiniCalendar({ selectedDate, onDateSelect, className }: MiniCalendarProps) {
  const [viewDate, setViewDate] = useState(jsDateToPersian(selectedDate))
  const selectedPersianDate = jsDateToPersian(selectedDate)
  const today = jsDateToPersian(new Date())

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = { ...viewDate }

    if (direction === "next") {
      if (newDate.month === 12) {
        newDate.month = 1
        newDate.year += 1
      } else {
        newDate.month += 1
      }
    } else {
      if (newDate.month === 1) {
        newDate.month = 12
        newDate.year -= 1
      } else {
        newDate.month -= 1
      }
    }

    setViewDate(newDate)
  }

  const getDaysInMonth = () => {
    return getPersianMonthDays(viewDate.year, viewDate.month)
  }

  const getFirstDayOfMonth = () => {
    const firstDay = persianToJsDate({ ...viewDate, day: 1 })
    return (firstDay.getDay() + 1) % 7 // Adjust for Persian week starting on Saturday
  }

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth()
    const firstDay = getFirstDayOfMonth()
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8" />)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate: PersianDate = { ...viewDate, day }
      const jsDate = persianToJsDate(dayDate)

      const isSelected =
        selectedPersianDate.year === dayDate.year &&
        selectedPersianDate.month === dayDate.month &&
        selectedPersianDate.day === dayDate.day

      const isToday = today.year === dayDate.year && today.month === dayDate.month && today.day === dayDate.day

      days.push(
        <Button
          key={day}
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 w-8 p-0 font-normal",
            isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
            isToday && !isSelected && "bg-accent text-accent-foreground",
            "hover:bg-accent hover:text-accent-foreground",
          )}
          onClick={() => onDateSelect(jsDate)}
        >
          {day}
        </Button>,
      )
    }

    return days
  }

  return (
    <Card className={cn("p-4", className)}>
      <div className="space-y-4">
        {/* Month/Year Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigateMonth("prev")}>
            <ChevronRight className="w-4 h-4" />
          </Button>

          <div className="text-sm font-medium" dir="rtl">
            {PERSIAN_MONTHS[viewDate.month - 1]} {viewDate.year}
          </div>

          <Button variant="ghost" size="sm" onClick={() => navigateMonth("next")}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1">
          {PERSIAN_WEEKDAYS.map((weekday) => (
            <div
              key={weekday}
              className="h-8 flex items-center justify-center text-xs font-medium text-muted-foreground"
            >
              {weekday.slice(0, 2)}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>
      </div>
    </Card>
  )
}
