"use client";

import { useMemo } from "react";
import {
  Card,
  CardHeader,
  Button,
  Stack,
  Grid,
  Typography,
  Badge,
  Box,
} from "@mui/material";
import type { CalendarEvent } from "@/lib/event-types";
import {
  getYear,
  getMonth,
  getDate,
  startOfMonth,
  endOfMonth,
  getDay,
  parse,
} from "date-fns-jalali";

interface YearViewProps {
  selectedDate: Date;
  events: CalendarEvent[];
  onDateSelect: (date: Date) => void;
  onCreateEvent: (date: Date) => void;
}

interface MonthCalendarProps {
  year: number;
  month: number;
  events: CalendarEvent[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onCreateEvent: (date: Date) => void;
}

// اعداد فارسی
const PERSIAN_NUMBERS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
const toPersianNumbers = (str: string) =>
  str.replace(/\d/g, (digit) => PERSIAN_NUMBERS[Number(digit)]);

// روزهای هفته فارسی
const PERSIAN_WEEKDAYS = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

// ماه‌های شمسی
const PERSIAN_MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

// ---------- کامپوننت ماه ----------
function MonthCalendar({
  year,
  month,
  events,
  selectedDate,
  onDateSelect,
  onCreateEvent,
}: MonthCalendarProps) {
  // شروع و پایان ماه شمسی
  const monthStart = parse(`${year}/${month}/1`, "yyyy/M/d", new Date());
  const monthEnd = endOfMonth(monthStart);
  const daysInMonth = getDate(monthEnd);

  const firstDayWeekday = getDay(monthStart); // 0=شنبه ... 6=جمعه

  // انتخاب شده
  const selectedDay = getDate(selectedDate);
  const selectedMonth = getMonth(selectedDate) + 1;
  const selectedYear = getYear(selectedDate);

  // امروز
  const today = new Date();
  const todayDay = getDate(today);
  const todayMonth = getMonth(today) + 1;
  const todayYear = getYear(today);

  // گروه‌بندی رویدادها
  const eventsByDay = useMemo(() => {
    const grouped: { [day: number]: CalendarEvent[] } = {};
    events.forEach((event) => {
      const eDate = event.startDate;
      const eDay = getDate(eDate);
      const eMonth = getMonth(eDate) + 1;
      const eYear = getYear(eDate);
      if (eYear === year && eMonth === month) {
        if (!grouped[eDay]) grouped[eDay] = [];
        grouped[eDay].push(event);
      }
    });
    return grouped;
  }, [events, year, month]);

  // سلول‌های ماه
  const dayCells = [
    ...Array.from({ length: firstDayWeekday }).map((_, i) => (
      <Box key={`empty-${i}`} />
    )),
    ...Array.from({ length: daysInMonth }).map((_, i) => {
      const day = i + 1;
      const dayEvents = eventsByDay[day] || [];
      const isSelected =
        day === selectedDay && month === selectedMonth && year === selectedYear;
      const isToday =
        day === todayDay && month === todayMonth && year === todayYear;

      // ساخت تاریخ جلالی
      const jsDate = parse(`${year}/${month}/${day}`, "yyyy/M/d", new Date());

      return (
        <Box key={day} textAlign="center">
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
        </Box>
      );
    }),
  ];

  return (
    <Card variant="outlined" sx={{ p: 1, textAlign: "center" }}>
      <CardHeader
        title={
          <Typography variant="subtitle1">
            {PERSIAN_MONTHS[month - 1]}
          </Typography>
        }
        sx={{ pb: 1 }}
      />
      <Box
        display="grid"
        gridTemplateColumns="repeat(7,1fr)"
        justifyContent="center"
      >
        {PERSIAN_WEEKDAYS.map((wd) => (
          <Box textAlign="center" key={wd}>
            <Typography variant="caption">{wd}</Typography>
          </Box>
        ))}
        {dayCells}
      </Box>
    </Card>
  );
}

// ---------- کامپوننت سال ----------
export function YearView({
  selectedDate,
  events,
  onDateSelect,
  onCreateEvent,
}: YearViewProps) {
  const year = getYear(selectedDate);

  // آمار رویدادهای سال
  const yearStats = useMemo(() => {
    const yearEvents = events.filter((e) => getYear(e.startDate) === year);
    const eventsByMonth = PERSIAN_MONTHS.map((_, i) => {
      const month = i + 1;
      return yearEvents.filter((e) => getMonth(e.startDate) + 1 === month)
        .length;
    });
    return {
      totalEvents: yearEvents.length,
      eventsByMonth,
      busiestMonth: eventsByMonth.indexOf(Math.max(...eventsByMonth)) + 1,
    };
  }, [events, year]);

  return (
    <Stack spacing={2}>
      {/* کارت آمار */}
      <Card variant="outlined" sx={{ p: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography variant="h5">
              سال {toPersianNumbers(year.toString())}
            </Typography>
            <Typography variant="body2">
              {toPersianNumbers(yearStats.totalEvents.toString())} رویداد در کل
              سال
            </Typography>
          </Box>
          {yearStats.eventsByMonth[yearStats.busiestMonth - 1] > 0 && (
            <Box>
              <Typography variant="body2">پرترافیک‌ترین ماه:</Typography>
              <Typography variant="subtitle1" color="primary">
                {PERSIAN_MONTHS[yearStats.busiestMonth - 1]}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {toPersianNumbers(
                  yearStats.eventsByMonth[yearStats.busiestMonth - 1].toString()
                )}{" "}
                رویداد
              </Typography>
            </Box>
          )}
        </Stack>
      </Card>

      {/* تقویم کل سال */}
      <Grid container spacing={2}>
        {PERSIAN_MONTHS.map((_, i) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={i}>
            <MonthCalendar
              year={year}
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
  );
}
