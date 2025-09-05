"use client"

import { useState, useCallback } from "react"
import type { CalendarEvent } from "@/lib/event-types"

export function useEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([])

  const addEvent = useCallback((eventData: Omit<CalendarEvent, "id">) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: crypto.randomUUID(),
    }
    setEvents((prev) => [...prev, newEvent])
  }, [])

  const updateEvent = useCallback((eventId: string, eventData: Omit<CalendarEvent, "id">) => {
    setEvents((prev) => prev.map((event) => (event.id === eventId ? { ...eventData, id: eventId } : event)))
  }, [])

  const deleteEvent = useCallback((eventId: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId))
  }, [])

  const getEventsForDate = useCallback(
    (date: Date) => {
      return events.filter((event) => {
        const eventDate = new Date(event.startDate)
        return eventDate.toDateString() === date.toDateString()
      })
    },
    [events],
  )

  const getEventsForDateRange = useCallback(
    (startDate: Date, endDate: Date) => {
      return events.filter((event) => {
        const eventStart = new Date(event.startDate)
        return eventStart >= startDate && eventStart <= endDate
      })
    },
    [events],
  )

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsForDate,
    getEventsForDateRange,
  }
}
