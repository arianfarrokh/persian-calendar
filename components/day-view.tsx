"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { CalendarEvent } from "@/lib/event-types"
import { jsDateToPersian, formatPersianDate } from "@/lib/solar-hijri"
import { Clock, Plus, Edit, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface DayViewProps {
  selectedDate: Date
  events: CalendarEvent[]
  onCreateEvent: (date: Date, time?: string) => void
  onEditEvent: (event: CalendarEvent) => void
  onDeleteEvent: (eventId: string) => void
}

interface TimeSlot {
  hour: number
  time: string
  displayTime: string
}

const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = []
  for (let hour = 0; hour < 24; hour++) {
    const time = `${hour.toString().padStart(2, "0")}:00`
    const displayTime =
      hour === 0 ? "۱۲:۰۰ ص" : hour < 12 ? `${hour}:۰۰ ص` : hour === 12 ? "۱۲:۰۰ ظ" : `${hour - 12}:۰۰ ظ`
    slots.push({ hour, time, displayTime })
  }
  return slots
}

const PERSIAN_NUMBERS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"]

const toPersianNumbers = (str: string): string => {
  return str.replace(/\d/g, (digit) => PERSIAN_NUMBERS[Number.parseInt(digit)])
}

export function DayView({ selectedDate, events, onCreateEvent, onEditEvent, onDeleteEvent }: DayViewProps) {
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null)

  const timeSlots = useMemo(() => generateTimeSlots(), [])
  const persianDate = jsDateToPersian(selectedDate)

  // Filter events for the selected date
  const dayEvents = useMemo(() => {
    return events.filter((event) => {
      const eventDate = new Date(event.startDate)
      return eventDate.toDateString() === selectedDate.toDateString()
    })
  }, [events, selectedDate])

  // Group events by hour for positioning
  const eventsByHour = useMemo(() => {
    const grouped: { [hour: number]: CalendarEvent[] } = {}

    dayEvents.forEach((event) => {
      if (event.isAllDay) {
        // All-day events go in hour -1 (special slot)
        if (!grouped[-1]) grouped[-1] = []
        grouped[-1].push(event)
      } else {
        const startHour = new Date(event.startDate).getHours()
        if (!grouped[startHour]) grouped[startHour] = []
        grouped[startHour].push(event)
      }
    })

    return grouped
  }, [dayEvents])

  const handleTimeSlotClick = (hour: number) => {
    const time = `${hour.toString().padStart(2, "0")}:00`
    onCreateEvent(selectedDate, time)
  }

  const formatEventTime = (event: CalendarEvent) => {
    if (event.isAllDay) return "تمام روز"

    const start = event.startTime || "00:00"
    const end = event.endTime || "23:59"
    return `${toPersianNumbers(start)} - ${toPersianNumbers(end)}`
  }

  const getEventDuration = (event: CalendarEvent) => {
    if (event.isAllDay) return 1

    const startTime = new Date(event.startDate)
    const endTime = new Date(event.endDate)
    const durationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)
    return Math.max(1, Math.ceil(durationHours))
  }

  return (
    <div className="space-y-4">
      {/* Date Header */}
      <div className="bg-muted p-4 rounded-lg">
        <h2 className="text-xl font-semibold text-foreground" dir="rtl">
          {formatPersianDate(persianDate, true)}
        </h2>
        <p className="text-sm text-muted-foreground" dir="rtl">
          {dayEvents.length} رویداد برای این روز
        </p>
      </div>

      {/* All-day Events */}
      {eventsByHour[-1] && (
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-3" dir="rtl">
            رویدادهای تمام روز
          </h3>
          <div className="space-y-2">
            {eventsByHour[-1].map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-3 bg-primary/10 border border-primary/20 rounded-lg"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: event.color || "#059669" }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground truncate" dir="rtl">
                      {event.title}
                    </h4>
                    {event.description && (
                      <p className="text-sm text-muted-foreground truncate" dir="rtl">
                        {event.description}
                      </p>
                    )}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    تمام روز
                  </Badge>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => onEditEvent(event)} className="h-8 w-8 p-0">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteEvent(event.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Hourly Time Slots */}
      <Card className="overflow-hidden">
        <div className="max-h-[600px] overflow-y-auto">
          {timeSlots.map((slot) => {
            const slotEvents = eventsByHour[slot.hour] || []
            const isHovered = hoveredSlot === slot.hour

            return (
              <div
                key={slot.hour}
                className={cn("border-b border-border last:border-b-0 transition-colors", isHovered && "bg-accent/50")}
                onMouseEnter={() => setHoveredSlot(slot.hour)}
                onMouseLeave={() => setHoveredSlot(null)}
              >
                <div className="flex min-h-[60px]">
                  {/* Time Label */}
                  <div className="w-20 flex-shrink-0 p-3 border-l border-border bg-muted/30">
                    <div className="text-sm font-medium text-muted-foreground text-center">
                      {toPersianNumbers(slot.displayTime)}
                    </div>
                  </div>

                  {/* Event Area */}
                  <div className="flex-1 relative">
                    {slotEvents.length > 0 ? (
                      <div className="p-2 space-y-1">
                        {slotEvents.map((event) => (
                          <div
                            key={event.id}
                            className="group flex items-center justify-between p-2 bg-card border border-border rounded-md hover:shadow-sm transition-shadow"
                            style={{
                              borderLeftColor: event.color || "#059669",
                              borderLeftWidth: "4px",
                            }}
                          >
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm text-foreground truncate" dir="rtl">
                                {event.title}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <Clock className="w-3 h-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{formatEventTime(event)}</span>
                              </div>
                              {event.description && (
                                <p className="text-xs text-muted-foreground mt-1 truncate" dir="rtl">
                                  {event.description}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onEditEvent(event)}
                                className="h-6 w-6 p-0"
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDeleteEvent(event.id)}
                                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <button
                        className="w-full h-full p-3 text-left hover:bg-accent/30 transition-colors group"
                        onClick={() => handleTimeSlotClick(slot.hour)}
                      >
                        <div className="flex items-center justify-center h-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Plus className="w-4 h-4" />
                            <span className="text-sm" dir="rtl">
                              رویداد جدید
                            </span>
                          </div>
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
