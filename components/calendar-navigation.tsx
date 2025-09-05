"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { formatPersianDate, jsDateToPersian, PERSIAN_MONTHS } from "@/lib/solar-hijri"
import type { ViewMode } from "@/lib/event-types"

interface CalendarNavigationProps {
  currentDate: Date
  viewMode: ViewMode
  onDateChange: (date: Date) => void
  onViewModeChange: (mode: ViewMode) => void
}

export function CalendarNavigation({ currentDate, viewMode, onDateChange, onViewModeChange }: CalendarNavigationProps) {
  const currentPersianDate = jsDateToPersian(currentDate)

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)

    switch (viewMode) {
      case "day":
        newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1))
        break
      case "week":
        newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7))
        break
      case "year":
        newDate.setFullYear(newDate.getFullYear() + (direction === "next" ? 1 : -1))
        break
    }

    onDateChange(newDate)
  }

  const goToToday = () => {
    onDateChange(new Date())
  }

  const getNavigationTitle = () => {
    const pDate = jsDateToPersian(currentDate)

    switch (viewMode) {
      case "day":
        return formatPersianDate(pDate, true)
      case "week":
        return `هفته ${PERSIAN_MONTHS[pDate.month - 1]} ${pDate.year}`
      case "year":
        return `سال ${pDate.year}`
      default:
        return formatPersianDate(pDate)
    }
  }

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-card-foreground" dir="rtl">
          {viewMode === "day" && "نمای روزانه"}
          {viewMode === "week" && "نمای هفتگی"}
          {viewMode === "year" && "نمای سالانه"}
        </h2>
        <div className="text-lg font-medium text-muted-foreground" dir="rtl">
          {getNavigationTitle()}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => navigateDate("prev")}>
          <ChevronRight className="w-4 h-4" />
          قبلی
        </Button>
        <Button variant="outline" size="sm" onClick={goToToday}>
          امروز
        </Button>
        <Button variant="outline" size="sm" onClick={() => navigateDate("next")}>
          بعدی
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
