"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { CalendarEvent } from "@/lib/event-types"
import { formatPersianDate } from "@/lib/solar-hijri"
import { Clock, Edit, Trash2, Calendar } from "lucide-react"

interface EventListProps {
  events: CalendarEvent[]
  onEditEvent: (event: CalendarEvent) => void
  onDeleteEvent: (eventId: string) => void
  selectedDate?: Date
}

const EVENT_CATEGORY_LABELS = {
  work: "کاری",
  personal: "شخصی",
  holiday: "تعطیلات",
  reminder: "یادآوری",
}

export function EventList({ events, onEditEvent, onDeleteEvent, selectedDate }: EventListProps) {
  // Filter events for selected date if provided
  const filteredEvents = selectedDate
    ? events.filter((event) => {
        const eventDate = new Date(event.startDate)
        return eventDate.toDateString() === selectedDate.toDateString()
      })
    : events

  // Sort events by start time
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (a.isAllDay && !b.isAllDay) return -1
    if (!a.isAllDay && b.isAllDay) return 1
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  })

  if (sortedEvents.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p dir="rtl">هیچ رویدادی برای این تاریخ وجود ندارد</p>
          <p className="text-sm mt-2" dir="rtl">
            برای ایجاد رویداد جدید روی دکمه "رویداد جدید" کلیک کنید
          </p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {sortedEvents.map((event) => (
        <Card key={event.id} className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: event.color || "#059669" }}
                />
                <h3 className="font-semibold text-card-foreground truncate" dir="rtl">
                  {event.title}
                </h3>
                <Badge variant="secondary" className="text-xs">
                  {EVENT_CATEGORY_LABELS[event.category || "personal"]}
                </Badge>
              </div>

              {event.description && (
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2" dir="rtl">
                  {event.description}
                </p>
              )}

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span dir="rtl">{formatPersianDate(event.persianDate)}</span>
                </div>

                {!event.isAllDay && event.startTime && event.endTime && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>
                      {event.startTime} - {event.endTime}
                    </span>
                  </div>
                )}

                {event.isAllDay && (
                  <Badge variant="outline" className="text-xs">
                    تمام روز
                  </Badge>
                )}
              </div>
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
        </Card>
      ))}
    </div>
  )
}
