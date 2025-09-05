"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { jsDateToPersian, formatPersianNumber, PERSIAN_WEEKDAYS } from "@/lib/solar-hijri"
import type { CalendarEvent } from "@/lib/event-types"
import { Trash2, Edit } from "lucide-react"

interface WeekViewProps {
  selectedDate: Date
  events: CalendarEvent[]
  onCreateEvent: (date: Date, time?: string) => void
  onEditEvent: (event: CalendarEvent) => void
  onDeleteEvent: (eventId: string) => void
}

export function WeekView({ selectedDate, events, onCreateEvent, onEditEvent, onDeleteEvent }: WeekViewProps) {
  const getWeekStart = (date: Date) => {
    const dayOfWeek = date.getDay()
    const diff = dayOfWeek === 6 ? 0 : dayOfWeek + 1
    const weekStart = new Date(date)
    weekStart.setDate(date.getDate() - diff)
    return weekStart
  }

  const weekStart = getWeekStart(selectedDate)
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(weekStart)
    day.setDate(weekStart.getDate() + i)
    return day
  })

  const hours = Array.from({ length: 24 }, (_, i) => i)
  const today = new Date()

  const getEventsForDayAndHour = (day: Date, hour: number) => {
    return events.filter((event) => {
      const eventDate = new Date(event.startDate)
      const isSameDay = eventDate.toDateString() === day.toDateString()

      if (!isSameDay) return false
      if (event.isAllDay) return false

      const eventHour = Number.parseInt(event.startTime?.split(":")[0] || "0")
      return eventHour === hour
    })
  }

  const getAllDayEvents = (day: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.startDate)
      return eventDate.toDateString() === day.toDateString() && event.isAllDay
    })
  }

  const handleTimeSlotClick = (day: Date, hour: number) => {
    const timeString = `${hour.toString().padStart(2, "0")}:00`
    onCreateEvent(day, timeString)
  }

  return (
    <div className="space-y-4" dir="rtl">
      <div className="grid grid-cols-8 gap-2">
        <div className="p-2"></div>
        {weekDays.map((day, index) => {
          const persianDay = jsDateToPersian(day)
          const isToday = day.toDateString() === today.toDateString()
          const isSelected = day.toDateString() === selectedDate.toDateString()

          return (
            <Card
              key={index}
              className={cn(
                "p-3 text-center",
                isToday && "bg-emerald-100 border-emerald-300",
                isSelected && "bg-emerald-200 border-emerald-400",
              )}
            >
              <div className="text-sm font-medium">{PERSIAN_WEEKDAYS[index]}</div>
              <div className="text-lg font-bold">{formatPersianNumber(persianDay.day)}</div>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-8 gap-2">
        <div className="p-2 text-sm font-medium text-muted-foreground">رویدادهای تمام روز</div>
        {weekDays.map((day, dayIndex) => {
          const allDayEvents = getAllDayEvents(day)

          return (
            <Card key={dayIndex} className="p-2 min-h-[60px]">
              <div className="space-y-1">
                {allDayEvents.map((event) => (
                  <div
                    key={event.id}
                    className={cn(
                      "text-xs p-1 rounded text-white cursor-pointer group relative",
                      event.category === "work" && "bg-blue-500",
                      event.category === "personal" && "bg-green-500",
                      event.category === "health" && "bg-red-500",
                      event.category === "other" && "bg-gray-500",
                    )}
                  >
                    <div className="truncate">{event.title}</div>
                    <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 flex gap-1 p-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-4 w-4 p-0 text-white hover:bg-white/20"
                        onClick={(e) => {
                          e.stopPropagation()
                          onEditEvent(event)
                        }}
                      >
                        <Edit className="h-2 w-2" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-4 w-4 p-0 text-white hover:bg-white/20"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteEvent(event.id)
                        }}
                      >
                        <Trash2 className="h-2 w-2" />
                      </Button>
                    </div>
                  </div>
                ))}
                {allDayEvents.length === 0 && (
                  <Button
                    variant="ghost"
                    className="w-full h-8 text-xs text-muted-foreground hover:bg-emerald-50"
                    onClick={() => onCreateEvent(day)}
                  >
                    افزودن رویداد
                  </Button>
                )}
              </div>
            </Card>
          )
        })}
      </div>

      <div className="max-h-[600px] overflow-y-auto">
        <div className="grid grid-cols-8 gap-2">
          {hours.map((hour) => (
            <div key={hour} className="contents">
              {/* Time label */}
              <div className="p-2 text-sm font-medium text-muted-foreground text-center border-l">
                {formatPersianNumber(hour)}:۰۰
              </div>

              {/* Day columns */}
              {weekDays.map((day, dayIndex) => {
                const dayEvents = getEventsForDayAndHour(day, hour)

                return (
                  <Card
                    key={`${hour}-${dayIndex}`}
                    className="p-1 min-h-[50px] cursor-pointer hover:bg-emerald-50 transition-colors"
                    onClick={() => handleTimeSlotClick(day, hour)}
                  >
                    <div className="space-y-1">
                      {dayEvents.map((event) => (
                        <div
                          key={event.id}
                          className={cn(
                            "text-xs p-1 rounded text-white cursor-pointer group relative",
                            event.category === "work" && "bg-blue-500",
                            event.category === "personal" && "bg-green-500",
                            event.category === "health" && "bg-red-500",
                            event.category === "other" && "bg-gray-500",
                          )}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="truncate font-medium">{event.title}</div>
                          {event.startTime && event.endTime && (
                            <div className="text-xs opacity-90">
                              {formatPersianNumber(event.startTime)} - {formatPersianNumber(event.endTime)}
                            </div>
                          )}
                          <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 flex gap-1 p-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-4 w-4 p-0 text-white hover:bg-white/20"
                              onClick={(e) => {
                                e.stopPropagation()
                                onEditEvent(event)
                              }}
                            >
                              <Edit className="h-2 w-2" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-4 w-4 p-0 text-white hover:bg-white/20"
                              onClick={(e) => {
                                e.stopPropagation()
                                onDeleteEvent(event.id)
                              }}
                            >
                              <Trash2 className="h-2 w-2" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
