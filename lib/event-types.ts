// Event management types and interfaces
export interface CalendarEvent {
  id: string
  title: string
  description?: string
  startDate: Date
  endDate: Date
  startTime?: string
  endTime?: string
  isAllDay: boolean
  category?: "work" | "personal" | "holiday" | "reminder"
  color?: string
  persianDate: {
    year: number
    month: number
    day: number
  }
}

export type ViewMode = "day" | "week" | "year"

export interface CalendarState {
  currentDate: Date
  viewMode: ViewMode
  events: CalendarEvent[]
  selectedDate?: Date
}
