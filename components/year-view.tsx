"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, } from "@mui/material"
import { Button, Badge, Stack, Grid, Typography } from "@mui/material"
import { Calendar } from "lucide-react"
import type { CalendarEvent } from "@/lib/event-types"
import {
  jsDateToPersian,
  persianToJsDate,
  getPersianMonthDays,
  PERSIAN_MONTHS,
  PERSIAN_WEEKDAYS,
  type PersianDate,
} from "@/lib/solar-hijri"

interface YearViewProps {
  selectedDate: Date
  events: CalendarEvent[]
  onDateSelect: (date: Date) => void
  onCreateEvent: (date: Date) => void
}

interface MonthCalendarProps {
  year: number
  month: number
  events: CalendarEvent[]
  selectedDate: Date
  onDateSelect: (date: Date) => void
  onCreateEvent: (date: Date) => void
}

const PERSIAN_NUMBERS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"]
const toPersianNumbers = (str: string) =>
  str.replace(/\d/g, (digit) => PERSIAN_NUMBERS[Number.parseInt(digit)])

function MonthCalendar({ year, month, events, selectedDate, onDateSelect, onCreateEvent }: MonthCalendarProps) {
  const daysInMonth = getPersianMonthDays(year, month)
  const firstDayOfMonth = persianToJsDate({ year, month, day: 1 })
  const firstDayWeekday = (firstDayOfMonth.getDay() + 1) % 7

  const selectedPersianDate = jsDateToPersian(selectedDate)
  const today = jsDateToPersian(new Date())

  const eventsByDay = useMemo(() => {
    const grouped: { [day: number]: CalendarEvent[] } = {}
    events.forEach((event) => {
      const eventPersianDate = event.persianDate
      if (eventPersianDate.year === year && eventPersianDate.month === month) {
        if (!grouped[eventPersianDate.day]) grouped[eventPersianDate.day] = []
        grouped[eventPersianDate.day].push(event)
      }
    })
    return grouped
  }, [events, year, month])

  return (
    <Card variant="outlined" sx={{ p: 1, textAlign: "center" }}>
      <CardHeader
        title={<Typography variant="subtitle1">{PERSIAN_MONTHS[month - 1]}</Typography>}
        sx={{ pb: 1 }}
      />
      {Object.values(eventsByDay).flat().length > 0 && (
        <Badge badgeContent={toPersianNumbers(Object.values(eventsByDay).flat().length.toString())} color="primary" />
      )}

      <Grid container spacing={0.5} justifyContent="center" sx={{ direction: "rtl" }}>
        {PERSIAN_WEEKDAYS.map((wd) => (
          <Grid  key={wd}>
            <Typography variant="caption">{wd.slice(0, 1)}</Typography>
          </Grid>
        ))}

        {Array.from({ length: firstDayWeekday }).map((_, i) => (
          <Grid  key={`empty-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const dayDate: PersianDate = { year, month, day }
          const jsDate = persianToJsDate(dayDate)
          const isSelected =
            selectedPersianDate.year === year &&
            selectedPersianDate.month === month &&
            selectedPersianDate.day === day
          const isToday =
            today.year === year && today.month === month && today.day === day
          const dayEvents = eventsByDay[day] || []

          return (
            <Grid  key={day}>
              <Button
                size="small"
                variant={isSelected ? "contained" : "outlined"}
                color={isToday ? "secondary" : "primary"}
                onClick={() => onDateSelect(jsDate)}
                onDoubleClick={() => onCreateEvent(jsDate)}
                sx={{ minWidth: 28, minHeight: 28, p: 0.5, position: "relative" }}
              >
                {toPersianNumbers(day.toString())}
                {dayEvents.length > 0 && (
                  <Badge
                    variant="dot"
                    color="primary"
                    sx={{ position: "absolute", top: 0, right: 0 }}
                  />
                )}
              </Button>
            </Grid>
          )
        })}
      </Grid>
    </Card>
  )
}

export function YearView({ selectedDate, events, onDateSelect, onCreateEvent }: YearViewProps) {
  const selectedPersianDate = jsDateToPersian(selectedDate)
  const currentYear = selectedPersianDate.year

  const yearStats = useMemo(() => {
    const yearEvents = events.filter((e) => e.persianDate.year === currentYear)
    const eventsByMonth = PERSIAN_MONTHS.map((_, i) => {
      const month = i + 1
      return yearEvents.filter((e) => e.persianDate.month === month).length
    })
    return {
      totalEvents: yearEvents.length,
      eventsByMonth,
      busiestMonth: eventsByMonth.indexOf(Math.max(...eventsByMonth)) + 1,
    }
  }, [events, currentYear])

  return (
    <Stack spacing={2} sx={{ direction: "rtl" }}>
      <Card variant="outlined" sx={{ p: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <div>
            <Typography variant="h5">سال {toPersianNumbers(currentYear.toString())}</Typography>
            <Typography variant="body2">{toPersianNumbers(yearStats.totalEvents.toString())} رویداد در کل سال</Typography>
          </div>
          {yearStats.eventsByMonth[yearStats.busiestMonth - 1] > 0 && (
            <div>
              <Typography variant="body2">پرترافیک‌ترین ماه:</Typography>
              <Typography variant="subtitle1" color="primary">
                {PERSIAN_MONTHS[yearStats.busiestMonth - 1]}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {toPersianNumbers(yearStats.eventsByMonth[yearStats.busiestMonth - 1].toString())} رویداد
              </Typography>
            </div>
          )}
        </Stack>
      </Card>

      <Grid container spacing={2}>
        {PERSIAN_MONTHS.map((_, i) => (
          <Grid size={{xs:12 , sm : 6 , md:4 , lg:3 }} key={i}>
            <MonthCalendar
              year={currentYear}
              month={i + 1}
              events={events}
              selectedDate={selectedDate}
              onDateSelect={onDateSelect}
              onCreateEvent={onCreateEvent}
            />
          </Grid>
        ))}
      </Grid>
    </Stack>
  )
}
