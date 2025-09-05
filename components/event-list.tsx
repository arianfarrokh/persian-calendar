"use client";

import { Card, Stack, Typography, Chip, IconButton, Box } from "@mui/material";
import { Calendar, Clock, Edit, Trash2 } from "lucide-react";
import type { CalendarEvent } from "@/lib/event-types";
import { formatPersianDate } from "@/lib/solar-hijri";

interface EventListProps {
  events: CalendarEvent[];
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (eventId: string) => void;
  selectedDate?: Date;
}

const EVENT_CATEGORY_LABELS: Record<string, string> = {
  work: "کاری",
  personal: "شخصی",
  holiday: "تعطیلات",
  reminder: "یادآوری",
};

export function EventList({
  events,
  onEditEvent,
  onDeleteEvent,
  selectedDate,
}: EventListProps) {
  const filteredEvents = selectedDate
    ? events.filter(
        (event) =>
          new Date(event.startDate).toDateString() === selectedDate.toDateString()
      )
    : events;

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (a.isAllDay && !b.isAllDay) return -1;
    if (!a.isAllDay && b.isAllDay) return 1;
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  if (sortedEvents.length === 0) {
    return (
      <Card sx={{ p: 4, textAlign: "center" }}>
        <Calendar size={48} style={{ margin: "0 auto 16px", opacity: 0.5 }} />
        <Typography dir="rtl">هیچ رویدادی برای این تاریخ وجود ندارد</Typography>
        <Typography variant="body2" dir="rtl" sx={{ mt: 1 }}>
          برای ایجاد رویداد جدید روی دکمه "رویداد جدید" کلیک کنید
        </Typography>
      </Card>
    );
  }

  return (
    <Stack spacing={2}>
      {sortedEvents.map((event) => (
        <Card
          key={event.id}
          sx={{
            p: 2,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 2,
            "&:hover": { boxShadow: 3 },
          }}
        >
          <Stack spacing={1} flex={1} minWidth={0}>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  bgcolor: event.color || "success.main",
                  flexShrink: 0,
                }}
              />
              <Typography
                variant="subtitle1"
                noWrap
                sx={{ flex: 1 }}
                dir="rtl"
              >
                {event.title}
              </Typography>
              <Chip
                label={EVENT_CATEGORY_LABELS[event.category || "personal"]}
                size="small"
              />
            </Stack>

            {event.description && (
              <Typography
                variant="body2"
                color="text.secondary"
                noWrap
                sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
                dir="rtl"
              >
                {event.description}
              </Typography>
            )}

            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Calendar size={14} />
                <Typography variant="caption" color="text.secondary" dir="rtl">
                  {formatPersianDate(event.persianDate)}
                </Typography>
              </Stack>

              {!event.isAllDay && event.startTime && event.endTime && (
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Clock size={14} />
                  <Typography variant="caption">
                    {event.startTime} - {event.endTime}
                  </Typography>
                </Stack>
              )}

              {event.isAllDay && <Chip label="تمام روز" size="small" />}
            </Stack>
          </Stack>

          <Stack direction="row" spacing={0.5} flexShrink={0}>
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
        </Card>
      ))}
    </Stack>
  );
}
