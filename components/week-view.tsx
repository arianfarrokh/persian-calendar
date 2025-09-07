"use client";

import { Card, Button, Typography, Stack, Box } from "@mui/material";
import { Trash2, Edit } from "lucide-react";
import { format, getDay } from "date-fns-jalali";
import type { CalendarEvent } from "@/lib/event-types";

interface WeekViewProps {
  selectedDate: Date;
  events: CalendarEvent[];
  onCreateEvent: (date: Date) => void;
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (eventId: string) => void;
}

export function WeekView({
  selectedDate,
  events,
  onCreateEvent,
  onEditEvent,
  onDeleteEvent,
}: WeekViewProps) {
  const getWeekStart = (date: Date) => {
    const dayOfWeek = getDay(date); // 0 = یکشنبه، 6 = شنبه
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

  const today = new Date();

  const getEventsForDay = (day: Date) => {
    return events.filter(
      (event) =>
        format(new Date(event.startDate), "yyyy-MM-dd") ===
        format(day, "yyyy-MM-dd")
    );
  };

  return (
    <Stack spacing={2}>
      {/* Weekday Header */}
      <Stack direction="row" spacing={1}>
        {weekDays.map((day, index) => {
          const isToday =
            format(day, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
          const isSelected =
            format(day, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");

          return (
            <Stack key={index} sx={{ flex: 1 }}>
              <Card
                variant="outlined"
                sx={{
                  p: 1,
                  textAlign: "center",
                  bgcolor: isSelected
                    ? "success.light"
                    : isToday
                    ? "info.light"
                    : "background.paper",
                }}
              >
                <Typography variant="caption">{format(day, "EEEE")}</Typography>
                <Typography variant="body1" fontWeight="bold">
                  {format(day, "d")}
                </Typography>
              </Card>

              {/* Eventهای روز */}
              <Stack spacing={1} mt={1}>
                {getEventsForDay(day).length > 0 ? (
                  getEventsForDay(day).map((event) => (
                    <Card
                      key={event.id}
                      sx={{
                        p: 1,
                        bgcolor:
                          event.category === "work"
                            ? "primary.main"
                            : event.category === "personal"
                            ? "success.main"
                            : event.category === "health"
                            ? "error.main"
                            : "grey.500",
                        color: "common.white",
                        position: "relative",
                      }}
                    >
                      <Typography variant="body2" noWrap>
                        {event.title}
                      </Typography>
                      <Box
                        sx={{
                          position: "absolute",
                          top: 2,
                          right: 2,
                          display: "flex",
                          gap: 0.5,
                          opacity: 0,
                          ":hover": { opacity: 1 },
                        }}
                      >
                        <Button
                          size="small"
                          variant="contained"
                          color="inherit"
                          onClick={() => onEditEvent(event)}
                        >
                          <Edit fontSize="small" />
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          color="inherit"
                          onClick={() => onDeleteEvent(event.id)}
                        >
                          <Trash2 fontSize="small" />
                        </Button>
                      </Box>
                    </Card>
                  ))
                ) : (
                  <Button
                    size="small"
                    variant="outlined"
                    fullWidth
                    onClick={() => onCreateEvent(day)}
                  >
                    افزودن
                  </Button>
                )}
              </Stack>
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
}
