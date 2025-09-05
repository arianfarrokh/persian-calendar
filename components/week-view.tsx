"use client";

import { useState } from "react";
import { Card, Button, Typography, Grid, Stack, Box } from "@mui/material";
import { Trash2, Edit } from "lucide-react";
import { jsDateToPersian, formatPersianNumber, PERSIAN_WEEKDAYS } from "@/lib/solar-hijri";
import type { CalendarEvent } from "@/lib/event-types";

interface WeekViewProps {
  selectedDate: Date;
  events: CalendarEvent[];
  onCreateEvent: (date: Date, time?: string) => void;
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (eventId: string) => void;
}

export function WeekView({ selectedDate, events, onCreateEvent, onEditEvent, onDeleteEvent }: WeekViewProps) {
  const getWeekStart = (date: Date) => {
    const dayOfWeek = date.getDay();
    const diff = dayOfWeek === 6 ? 0 : dayOfWeek + 1;
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - diff);
    return weekStart;
  };

  const weekStart = getWeekStart(selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    return day;
  });

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const today = new Date();

  const getEventsForDayAndHour = (day: Date, hour: number) => {
    return events.filter((event) => {
      const eventDate = new Date(event.startDate);
      const isSameDay = eventDate.toDateString() === day.toDateString();
      if (!isSameDay || event.isAllDay) return false;
      const eventHour = Number.parseInt(event.startTime?.split(":")[0] || "0");
      return eventHour === hour;
    });
  };

  const getAllDayEvents = (day: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.startDate);
      return eventDate.toDateString() === day.toDateString() && event.isAllDay;
    });
  };

  return (
    <Stack spacing={2} dir="rtl">
      {/* Weekday Header */}
      <Grid container spacing={1}>
        <Grid size={{xs:1}}><Box /></Grid>
        {weekDays.map((day, index) => {
          const persianDay = jsDateToPersian(day);
          const isToday = day.toDateString() === today.toDateString();
          const isSelected = day.toDateString() === selectedDate.toDateString();

          return (
            <Grid key={index}>
              <Card
                variant="outlined"
                sx={{
                  p: 1,
                  textAlign: "center",
                  bgcolor: isSelected ? "success.light" : isToday ? "info.light" : "background.paper",
                }}
              >
                <Typography variant="caption">{PERSIAN_WEEKDAYS[index]}</Typography>
                <Typography variant="body1" fontWeight="bold">
                  {formatPersianNumber(persianDay.day)}
                </Typography>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* All-day events */}
      <Grid container spacing={1}>
        <Grid size={{xs:1}}>
          <Typography variant="body2" align="center">تمام روز</Typography>
        </Grid>
        {weekDays.map((day, index) => {
          const allDayEvents = getAllDayEvents(day);
          return (
            <Grid  key={index}>
              <Stack spacing={0.5}>
                {allDayEvents.map((event) => (
                  <Card
                    key={event.id}
                    sx={{
                      p: 0.5,
                      bgcolor:
                        event.category === "work" ? "primary.main" :
                        event.category === "personal" ? "success.main" :
                        event.category === "health" ? "error.main" : "grey.500",
                      color: "common.white",
                      position: "relative",
                    }}
                  >
                    <Typography variant="caption" noWrap>{event.title}</Typography>
                    <Box sx={{ position: "absolute", top: 0, right: 0, display: "flex", gap: 0.5, opacity: 0, ":hover": { opacity: 1 } }}>
                      <Button size="small" variant="contained" color="inherit" onClick={() => onEditEvent(event)}><Edit fontSize="small" /></Button>
                      <Button size="small" variant="contained" color="inherit" onClick={() => onDeleteEvent(event.id)}><Trash2 fontSize="small" /></Button>
                    </Box>
                  </Card>
                ))}
                {allDayEvents.length === 0 && (
                  <Button size="small" variant="outlined" fullWidth onClick={() => onCreateEvent(day)}>افزودن</Button>
                )}
              </Stack>
            </Grid>
          );
        })}
      </Grid>

      {/* Hourly events */}
      <Stack spacing={0.5} sx={{ maxHeight: 600, overflowY: "auto" }}>
        {hours.map((hour) => (
          <Grid container spacing={1} key={hour}>
            <Grid size={{xs:1}}>
              <Typography variant="caption" align="center">{formatPersianNumber(hour)}:۰۰</Typography>
            </Grid>
            {weekDays.map((day, index) => {
              const eventsInHour = getEventsForDayAndHour(day, hour);
              return (
                <Grid  key={index}>
                  <Stack spacing={0.5}>
                    {eventsInHour.map((event) => (
                      <Card key={event.id} sx={{
                        p: 0.5,
                        bgcolor:
                          event.category === "work" ? "primary.main" :
                          event.category === "personal" ? "success.main" :
                          event.category === "health" ? "error.main" : "grey.500",
                        color: "common.white",
                        position: "relative",
                        cursor: "pointer",
                      }}>
                        <Typography variant="caption" noWrap>{event.title}</Typography>
                        {event.startTime && event.endTime && (
                          <Typography variant="caption" sx={{ opacity: 0.8 }}>{event.startTime} - {event.endTime}</Typography>
                        )}
                        <Box sx={{ position: "absolute", top: 0, right: 0, display: "flex", gap: 0.5, opacity: 0, ":hover": { opacity: 1 } }}>
                          <Button size="small" variant="contained" color="inherit" onClick={() => onEditEvent(event)}><Edit fontSize="small" /></Button>
                          <Button size="small" variant="contained" color="inherit" onClick={() => onDeleteEvent(event.id)}><Trash2 fontSize="small" /></Button>
                        </Box>
                      </Card>
                    ))}
                    {eventsInHour.length === 0 && (
                      <Button size="small" variant="outlined" fullWidth onClick={() => onCreateEvent(day, `${hour.toString().padStart(2,"0")}:00`)}>+</Button>
                    )}
                  </Stack>
                </Grid>
              );
            })}
          </Grid>
        ))}
      </Stack>
    </Stack>
  );
}
