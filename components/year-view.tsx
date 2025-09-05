"use client"

import { useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { CalendarEvent } from "@/lib/event-types"
import {
  jsDateToPersian,
  persianToJsDate,
  getPersianMonthDays,
  PERSIAN_MONTHS,
  PERSIAN_WEEKDAYS,
  type PersianDate,
} from "@/lib/solar-hijri"
import { Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

interface YearViewProps {
  selectedDate: Date
  events: CalendarEvent[]
  onDateSelect: (date: Date) => void
  onCreateEvent: (date: Date) => void
}

const PERSIAN_NUMBERS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"]

const toPersianNumbers = (str: string): string => {
  return str.replace(/\d/g, (digit) => PERSIAN_NUMBERS[Number.parseInt(digit)])
}

interface MonthCalendarProps {
  year: number
  month: number
  events: CalendarEvent[]
  selectedDate: Date
  onDateSelect: (date: Date) => void
  onCreateEvent: (date: Date) => void
}

function MonthCalendar({ year, month, events, selectedDate, onDateSelect, onCreateEvent }: MonthCalendarProps) {
  const daysInMonth = getPersianMonthDays(year, month)
  const firstDayOfMonth = persianToJsDate({ year, month, day: 1 })
  const firstDayWeekday = (firstDayOfMonth.getDay() + 1) % 7 // Adjust for Persian week starting on Saturday

  const selectedPersianDate = jsDateToPersian(selectedDate)
  const today = jsDateToPersian(new Date())

  // Group events by day for this month
  const eventsByDay = useMemo(() => {
    const grouped: { [day: number]: CalendarEvent[] } = {}

    events.forEach((event) => {
      const eventPersianDate = event.persianDate
      if (eventPersianDate.year === year && eventPersianDate.month === month) {
        if (!grouped[eventPersianDate.day]) {
          grouped[eventPersianDate.day] = []
        }
        grouped[eventPersianDate.day].push(event)
      }
    })

    return grouped
  }, [events, year, month])

  const renderCalendarDays = () => {
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(<div key={`empty-${i}`} className="h-8" />)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate: PersianDate = { year, month, day }
      const jsDate = persianToJsDate(dayDate)
      const dayEvents = eventsByDay[day] || []

      const isSelected =
        selectedPersianDate.year === year && selectedPersianDate.month === month && selectedPersianDate.day === day

      const isToday = today.year === year && today.month === month && today.day === day

      days.push(
        <div key={day} className="relative">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 w-8 p-0 font-normal text-xs relative",
              isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
              isToday && !isSelected && "bg-accent text-accent-foreground font-semibold",
              dayEvents.length > 0 && !isSelected && "bg-secondary/50",
              "hover:bg-accent hover:text-accent-foreground",
            )}
            onClick={() => onDateSelect(jsDate)}
            onDoubleClick={() => onCreateEvent(jsDate)}
          >
            {toPersianNumbers(day.toString())}
            {dayEvents.length > 0 && (
              <div className="absolute -top-1 -right-1">
                <div className="w-2 h-2 bg-primary rounded-full" />
              </div>
            )}
          </Button>
        </div>,
      )
    }

    return days
  }

  const monthEventCount = Object.values(eventsByDay).flat().length

  return (
    <Card className="p-3">
      <div className="space-y-3">
        {/* Month Header */}
        <div className="text-center">
          <h3 className="font-semibold text-sm" dir="rtl">
            {PERSIAN_MONTHS[month - 1]}
          </h3>
          {monthEventCount > 0 && (
            <Badge variant="secondary" className="text-xs mt-1">
              {toPersianNumbers(monthEventCount.toString())} رویداد
            </Badge>
          )}
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1">
          {PERSIAN_WEEKDAYS.map((weekday) => (
            <div
              key={weekday}
              className="h-6 flex items-center justify-center text-xs font-medium text-muted-foreground"
            >
              {weekday.slice(0, 1)}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>
      </div>
    </Card>
  )
}

export function YearView({ selectedDate, events, onDateSelect, onCreateEvent }: YearViewProps) {
  const selectedPersianDate = jsDateToPersian(selectedDate)
  const currentYear = selectedPersianDate.year

  // Calculate year statistics
  const yearStats = useMemo(() => {
    const yearEvents = events.filter((event) => event.persianDate.year === currentYear)
    const eventsByMonth = PERSIAN_MONTHS.map((_, index) => {
      const monthNumber = index + 1
      return yearEvents.filter((event) => event.persianDate.month === monthNumber).length
    })

    return {
      totalEvents: yearEvents.length,
      eventsByMonth,
      busiestMonth: eventsByMonth.indexOf(Math.max(...eventsByMonth)) + 1,
    }
  }, [events, currentYear])

  return (
    <div className="space-y-6">
      {/* Year Header */}
      <div className="bg-muted p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground" dir="rtl">
              سال {toPersianNumbers(currentYear.toString())}
            </h2>
            <p className="text-sm text-muted-foreground" dir="rtl">
              {toPersianNumbers(yearStats.totalEvents.toString())} رویداد در کل سال
            </p>
          </div>

          {yearStats.busiestMonth && yearStats.eventsByMonth[yearStats.busiestMonth - 1] > 0 && (
            <div className="text-right">
              <p className="text-sm text-muted-foreground" dir="rtl">
                پرترافیک‌ترین ماه:
              </p>
              <p className="font-semibold text-primary" dir="rtl">
                {PERSIAN_MONTHS[yearStats.busiestMonth - 1]}
              </p>
              <p className="text-xs text-muted-foreground" dir="rtl">
                {toPersianNumbers(yearStats.eventsByMonth[yearStats.busiestMonth - 1].toString())} رویداد
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Year Statistics */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-3" dir="rtl">
          آمار سالانه
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{toPersianNumbers(yearStats.totalEvents.toString())}</div>
            <div className="text-sm text-muted-foreground" dir="rtl">
              کل رویدادها
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary">
              {toPersianNumbers(yearStats.eventsByMonth.filter((count) => count > 0).length.toString())}
            </div>
            <div className="text-sm text-muted-foreground" dir="rtl">
              ماه‌های فعال
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">
              {toPersianNumbers(Math.round(yearStats.totalEvents / 12).toString())}
            </div>
            <div className="text-sm text-muted-foreground" dir="rtl">
              میانگین ماهانه
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-muted-foreground">
              {toPersianNumbers(Math.max(...yearStats.eventsByMonth).toString())}
            </div>
            <div className="text-sm text-muted-foreground" dir="rtl">
              بیشترین در ماه
            </div>
          </div>
        </div>
      </Card>

      {/* 12-Month Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {PERSIAN_MONTHS.map((monthName, index) => {
          const monthNumber = index + 1
          return (
            <MonthCalendar
              key={monthNumber}
              year={currentYear}
              month={monthNumber}
              events={events}
              selectedDate={selectedDate}
              onDateSelect={onDateSelect}
              onCreateEvent={onCreateEvent}
            />
          )
        })}
      </div>

      {/* Usage Instructions */}
      <Card className="p-4 bg-muted/50">
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium" dir="rtl">
              راهنمای استفاده:
            </p>
            <ul className="text-xs text-muted-foreground space-y-1" dir="rtl">
              <li>• روی هر تاریخ کلیک کنید تا به آن روز بروید</li>
              <li>• دوبار کلیک کنید تا رویداد جدید ایجاد کنید</li>
              <li>• نقطه‌های کوچک نشان‌دهنده روزهای دارای رویداد هستند</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
