"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  Chip,
  IconButton,
  Box,
} from "@mui/material";
import { Clock, Plus, Edit, Trash2 } from "lucide-react";
import type { CalendarEvent } from "@/lib/event-types";
import { jsDateToPersian, formatPersianDate } from "@/lib/solar-hijri";

interface DayViewProps {
  selectedDate: Date;
  events: CalendarEvent[];
  onCreateEvent: (date: Date, time?: string) => void;
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (eventId: string) => void;
}

interface TimeSlot {
  hour: number;
  time: string;
  displayTime: string;
}

const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  for (let hour = 0; hour < 24; hour++) {
    const time = `${hour.toString().padStart(2, "0")}:00`;
    const displayTime =
      hour === 0
        ? "۱۲:۰۰ ص"
        : hour < 12
        ? `${hour}:۰۰ ص`
        : hour === 12
        ? "۱۲:۰۰ ظ"
        : `${hour - 12}:۰۰ ظ`;
    slots.push({ hour, time, displayTime });
  }
  return slots;
};

const PERSIAN_NUMBERS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

const toPersianNumbers = (str: string) =>
  str.replace(/\d/g, (digit) => PERSIAN_NUMBERS[Number(digit)]);

export function DayView({
  selectedDate,
  events,
  onCreateEvent,
  onEditEvent,
  onDeleteEvent,
}: DayViewProps) {
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);

  const timeSlots = useMemo(() => generateTimeSlots(), []);
  const persianDate = jsDateToPersian(selectedDate);

  const dayEvents = useMemo(
    () =>
      events.filter(
        (event) =>
          new Date(event.startDate).toDateString() === selectedDate.toDateString()
      ),
    [events, selectedDate]
  );

  const eventsByHour = useMemo(() => {
    const grouped: { [hour: number]: CalendarEvent[] } = {};
    dayEvents.forEach((event) => {
      const startHour = event.isAllDay
        ? -1
        : new Date(event.startDate).getHours();
      if (!grouped[startHour]) grouped[startHour] = [];
      grouped[startHour].push(event);
    });
    return grouped;
  }, [dayEvents]);

  const handleTimeSlotClick = (hour: number) => {
    const time = `${hour.toString().padStart(2, "0")}:00`;
    onCreateEvent(selectedDate, time);
  };

  const formatEventTime = (event: CalendarEvent) =>
    event.isAllDay
      ? "تمام روز"
      : `${toPersianNumbers(event.startTime || "00:00")} - ${toPersianNumbers(
          event.endTime || "23:59"
        )}`;

  return (
    <Stack spacing={2}>
      {/* Date Header */}
      <Card sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight={600} dir="rtl">
          {formatPersianDate(persianDate, true)}
        </Typography>
        <Typography variant="body2" color="text.secondary" dir="rtl">
          {dayEvents.length} رویداد برای این روز
        </Typography>
      </Card>

      {/* All-day Events */}
      {eventsByHour[-1] && (
        <Card sx={{ p: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            رویدادهای تمام روز
          </Typography>
          <Stack spacing={1}>
            {eventsByHour[-1].map((event) => (
              <Stack
                key={event.id}
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  p: 1,
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "primary.light",
                  bgcolor: "primary.lighter",
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center" flex={1}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      bgcolor: event.color || "success.main",
                      flexShrink: 0,
                    }}
                  />
                  <Stack spacing={0} flex={1} minWidth={0}>
                    <Typography variant="body2" noWrap>
                      {event.title}
                    </Typography>
                    {event.description && (
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {event.description}
                      </Typography>
                    )}
                  </Stack>
                  <Chip label="تمام روز" size="small" />
                </Stack>
                <Stack direction="row" spacing={0.5}>
                  <IconButton size="small" onClick={() => onEditEvent(event)}>
                    <Edit size={16} />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => onDeleteEvent(event.id)}
                    sx={{ color: "error.main" }}
                  >
                    <Trash2 size={16} />
                  </IconButton>
                </Stack>
              </Stack>
            ))}
          </Stack>
        </Card>
      )}

      {/* Hourly Slots */}
      <Card sx={{ overflow: "hidden" }}>
        <Stack sx={{ maxHeight: 600, overflowY: "auto" }}>
          {timeSlots.map((slot) => {
            const slotEvents = eventsByHour[slot.hour] || [];
            const isHovered = hoveredSlot === slot.hour;

            return (
              <Box
                key={slot.hour}
                sx={{
                  display: "flex",
                  borderBottom: 1,
                  borderColor: "divider",
                  bgcolor: isHovered ? "action.hover" : "inherit",
                  "&:last-of-type": { borderBottom: 0 },
                }}
                onMouseEnter={() => setHoveredSlot(slot.hour)}
                onMouseLeave={() => setHoveredSlot(null)}
              >
                {/* Time Label */}
                <Box
                  sx={{
                    width: 80,
                    p: 1,
                    borderLeft: 1,
                    borderColor: "divider",
                    bgcolor: "grey.100",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {toPersianNumbers(slot.displayTime)}
                  </Typography>
                </Box>

                {/* Event Area */}
                <Box sx={{ flex: 1, position: "relative" }}>
                  {slotEvents.length > 0 ? (
                    <Stack spacing={1} p={1}>
                      {slotEvents.map((event) => (
                        <Stack
                          key={event.id}
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          justifyContent="space-between"
                          sx={{
                            p: 1,
                            borderLeft: 4,
                            borderColor: event.color || "success.main",
                            borderRadius: 1,
                            bgcolor: "background.paper",
                            boxShadow: 1,
                            "&:hover": { boxShadow: 3 },
                          }}
                        >
                          <Stack spacing={0.5} flex={1} minWidth={0}>
                            <Typography variant="body2" noWrap>
                              {event.title}
                            </Typography>
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                              <Clock size={14} />
                              <Typography variant="caption" color="text.secondary">
                                {formatEventTime(event)}
                              </Typography>
                            </Stack>
                            {event.description && (
                              <Typography variant="caption" color="text.secondary" noWrap>
                                {event.description}
                              </Typography>
                            )}
                          </Stack>
                          <Stack direction="row" spacing={0.5}>
                            <IconButton size="small" onClick={() => onEditEvent(event)}>
                              <Edit size={14} />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => onDeleteEvent(event.id)}
                              sx={{ color: "error.main" }}
                            >
                              <Trash2 size={14} />
                            </IconButton>
                          </Stack>
                        </Stack>
                      ))}
                    </Stack>
                  ) : (
                    <Button
                      fullWidth
                      variant="text"
                      onClick={() => handleTimeSlotClick(slot.hour)}
                      sx={{
                        p: 1,
                        color: "text.secondary",
                        "&:hover": { bgcolor: "action.hover" },
                        display: "flex",
                        justifyContent: "center",
                      }}
                      startIcon={<Plus size={16} />}
                    >
                      رویداد جدید
                    </Button>
                  )}
                </Box>
              </Box>
            );
          })}
        </Stack>
      </Card>
    </Stack>
  );
}
