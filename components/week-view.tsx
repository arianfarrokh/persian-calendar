"use client"

import { Card } from "@/components/ui/card"
import type { CalendarEvent } from "@/lib/event-types"

interface WeekViewProps {
  selectedDate: Date
  events: CalendarEvent[]
  onCreateEvent: (date: Date, time?: string) => void
  onEditEvent: (event: CalendarEvent) => void
  onDeleteEvent: (eventId: string) => void
}

export function WeekView({ selectedDate, events, onCreateEvent, onEditEvent, onDeleteEvent }: WeekViewProps) {
  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h2 className="text-xl font-semibold">Week View</h2>
        <p className="text-sm text-muted-foreground">Week view for {selectedDate.toDateString()}</p>
      </Card>
    </div>
  )
}
