"use client";

import { useState } from "react";
import {
  Card,
  Button,
  Typography,
  Box,
  Stack,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  format as formatJalali,
  getYear,
  getMonth,
  startOfMonth,
  getDay,
  getDaysInMonth,
  addMonths,
  subMonths,
  set,
  isSameDay,
} from "date-fns-jalali";

const PERSIAN_MONTHS = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
];

const PERSIAN_WEEKDAYS = [
  "شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"
];

interface MiniCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  className?: string;
}

export function MiniCalendar({ selectedDate, onDateSelect, className }: MiniCalendarProps) {
  const [viewDate, setViewDate] = useState<Date>(selectedDate);
  const today = new Date();

  // تغییر ماه
  const navigateMonth = (direction: "prev" | "next") => {
    setViewDate(direction === "next" ? addMonths(viewDate, 1) : subMonths(viewDate, 1));
  };

  const daysInCurrentMonth = getDaysInMonth(viewDate);
  const firstDayIndex = getDay(startOfMonth(viewDate)); // ۰=شنبه

  const renderCalendarDays = () => {
    const days: JSX.Element[] = [];

    // خانه‌های خالی قبل از شروع ماه
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<Box key={`empty-${i}`} />);
    }

    // روزهای ماه
    for (let day = 1; day <= daysInCurrentMonth; day++) {
      const currentDate = set(viewDate, { date: day });
      const isSelected = isSameDay(currentDate, selectedDate);
      const isToday = isSameDay(currentDate, today);

      days.push(
        <Button
          key={day}
          variant={isSelected ? "contained" : "outlined"}
          color={isSelected ? "primary" : isToday ? "secondary" : "inherit"}
          onClick={() => onDateSelect(currentDate)}
          size="small"
          sx={{
            minWidth: 0,
            width: 36,
            height: 36,
            padding: 0,
            fontSize: 12,
            borderRadius: 1,
          }}
        >
          {day}
        </Button>
      );
    }

    return days;
  };

  return (
    <Card sx={{ p: 2 }} className={className}>
      <Stack spacing={2} dir="rtl">
        {/* هدر ماه */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Button size="small" onClick={() => navigateMonth("prev")}>
            <ChevronRight fontSize="small" />
          </Button>
          <Typography variant="body2" fontWeight="medium">
            {PERSIAN_MONTHS[getMonth(viewDate)]} {getYear(viewDate)}
          </Typography>
          <Button size="small" onClick={() => navigateMonth("next")}>
            <ChevronLeft fontSize="small" />
          </Button>
        </Stack>

        {/* روزهای هفته */}
        <Box display="grid" gridTemplateColumns="repeat(7,1fr)" gap={1}>
          {PERSIAN_WEEKDAYS.map((weekday) => (
            <Box key={weekday} sx={{ textAlign: "center" }}>
              <Typography
                variant="caption"
                align="center"
                color="text.secondary"
                display="block"
              >
                {weekday.slice(0, 2)}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* روزهای ماه */}
        <Box display="grid" gridTemplateColumns="repeat(7,1fr)" gap={1}>
          {renderCalendarDays().map((day, index) => (
            <Box sx={{ textAlign: "center" }} key={index}>
              {day}
            </Box>
          ))}
        </Box>
      </Stack>
    </Card>
  );
}
