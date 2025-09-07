"use client";

import { useMemo } from "react";
import { Card, Stack, Typography, Box, IconButton, Chip } from "@mui/material";
import { Clock, Edit, Trash2 } from "lucide-react";
import type { CalendarEvent } from "@/lib/event-types";
import { jsDateToPersian, formatPersianDate } from "@/lib/solar-hijri";

interface DayViewProps {
  selectedDate: Date;
  events: CalendarEvent[];
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (eventId: string) => void;
}

const PERSIAN_NUMBERS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
const toPersianNumbers = (str: string) =>
  str.replace(/\d/g, (digit) => PERSIAN_NUMBERS[Number(digit)]);

export function DayView({
  selectedDate,
  events,
  onEditEvent,
  onDeleteEvent,
}: DayViewProps) {
  const persianDate = jsDateToPersian(selectedDate);
  const hourHeight = 60; // ارتفاع هر ساعت بر حسب px
  const dayEvents = useMemo(
    () =>
      events.filter(
        (event) =>
          new Date(event.startDate).toDateString() === selectedDate.toDateString()
      ),
    [events, selectedDate]
  );

  const allDayEvents = dayEvents.filter((e) => e.isAllDay);
  const hourlyEvents = dayEvents.filter((e) => !e.isAllDay);

  // تابع محاسبه موقعیت event
  const getEventPosition = (event: CalendarEvent) => {
    if (!event.startTime || !event.endTime) return { top: 0, height: hourHeight };
    const [startH, startM] = event.startTime.split(":").map(Number);
    const [endH, endM] = event.endTime.split(":").map(Number);
    const top = startH * hourHeight + (startM / 60) * hourHeight;
    const height = (endH + endM / 60 - startH - startM / 60) * hourHeight;
    return { top, height };
  };

  // محاسبه عرض و موقعیت افقی event ها برای همپوشانی
  const positionedEvents = useMemo(() => {
    const positions: {
      event: CalendarEvent;
      top: number;
      height: number;
      left: number;
      width: number;
    }[] = [];

    const sorted = [...hourlyEvents].sort((a, b) =>
      a.startTime!.localeCompare(b.startTime!)
    );

    for (let i = 0; i < sorted.length; i++) {
      const event = sorted[i];
      const { top, height } = getEventPosition(event);
      let col = 0;

      // پیدا کردن ستون مناسب بدون تداخل
      while (
        positions.some(
          (p) =>
            p.left === col && // همان ستون
            Math.max(p.top, top) < Math.min(p.top + p.height, top + height)
        )
      ) {
        col++;
      }

      positions.push({
        event,
        top,
        height,
        left: col,
        width: 1, // موقت، بعداً بر اساس تعداد ستون‌ها تقسیم می‌کنیم
      });
    }

    // محاسبه عرض نهایی برای هر ستون
    const colCount = Math.max(...positions.map((p) => p.left)) + 1;
    return positions.map((p) => ({
      ...p,
      width: 100 / colCount,
      left: (p.left * 100) / colCount,
    }));
  }, [hourlyEvents]);

  return (
    <Stack spacing={2}>
      {/* تاریخ */}
      <Card sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary" dir="rtl">
          {dayEvents.length} رویداد برای این روز
        </Typography>
      </Card>

      {/* رویدادهای تمام روز */}
      {allDayEvents.length > 0 && (
        <Card sx={{ p: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            رویدادهای تمام روز
          </Typography>
          <Stack spacing={1}>
            {allDayEvents.map((event) => (
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

      {/* رویدادهای ساعتی */}
      <Card sx={{ position: "relative", height: 24 * hourHeight, border: "1px solid", borderColor: "divider" }}>
        {/* خطوط ساعت‌ها */}
        {Array.from({ length: 25 }, (_, i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              top: i * hourHeight,
              left: 0,
              right: 0,
              borderTop: 1,
              borderColor: "divider",
              height: 0,
            }}
          />
        ))}

        {/* label ساعت */}
        {Array.from({ length: 24 }, (_, i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              top: i * hourHeight,
              left: 0,
              width: 50,
              height: hourHeight,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              pt: 0.5,
            }}
          >
            <Typography variant="caption" color="text.secondary" dir="rtl">
              {toPersianNumbers(i.toString().padStart(2, "0"))}:۰۰
            </Typography>
          </Box>
        ))}

        {/* رویدادها */}
        {positionedEvents.map(({ event, top, height, left, width }) => (
          <Box
            key={event.id}
            sx={{
              position: "absolute",
              zIndex:3,
              opacity:0.8,
              top,
              left: `${left}%`,
              width: `${width}%`,
              height,
              bgcolor: event.color || "primary.main",
              color: "common.white",
              p: 0.5,
              borderRadius: 1,
              boxShadow: 1,
              overflow: "hidden",
            }}
          >
            <Typography variant="body2" noWrap>
              {event.title}
            </Typography>
            {event.startTime && event.endTime && (
              <Typography variant="caption">
                {toPersianNumbers(event.startTime)} - {toPersianNumbers(event.endTime)}
              </Typography>
            )}
          </Box>
        ))}
      </Card>
    </Stack>
  );
}
