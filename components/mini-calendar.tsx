"use client";

import { useState } from "react";
import {
  Card,
  Button,
  Typography,
  Grid,
  Box,
  Stack,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  jsDateToPersian,
  persianToJsDate,
  getPersianMonthDays,
  PERSIAN_MONTHS,
  PERSIAN_WEEKDAYS,
  type PersianDate,
} from "@/lib/solar-hijri";

interface MiniCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  className?: string;
}

export function MiniCalendar({ selectedDate, onDateSelect, className }: MiniCalendarProps) {
  const [viewDate, setViewDate] = useState(jsDateToPersian(selectedDate));
  const selectedPersianDate = jsDateToPersian(selectedDate);
  const today = jsDateToPersian(new Date());

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = { ...viewDate };
    if (direction === "next") {
      if (newDate.month === 12) {
        newDate.month = 1;
        newDate.year += 1;
      } else {
        newDate.month += 1;
      }
    } else {
      if (newDate.month === 1) {
        newDate.month = 12;
        newDate.year -= 1;
      } else {
        newDate.month -= 1;
      }
    }
    setViewDate(newDate);
  };

  const getDaysInMonth = () => getPersianMonthDays(viewDate.year, viewDate.month);

  const getFirstDayOfMonth = () => {
    const firstDay = persianToJsDate({ ...viewDate, day: 1 });
    return (firstDay.getDay() + 1) % 7; // Persian week starts on Saturday
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth();
    const firstDay = getFirstDayOfMonth();
    const days: JSX.Element[] = [];

    // Empty cells
    for (let i = 0; i < firstDay; i++) {
      days.push(<Box key={`empty-${i}`} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate: PersianDate = { ...viewDate, day };
      const jsDate = persianToJsDate(dayDate);

      const isSelected =
        selectedPersianDate.year === dayDate.year &&
        selectedPersianDate.month === dayDate.month &&
        selectedPersianDate.day === dayDate.day;

      const isToday =
        today.year === dayDate.year &&
        today.month === dayDate.month &&
        today.day === dayDate.day;

      days.push(
        <Button
          key={day}
          variant={isSelected ? "contained" : "outlined"}
          color={isToday && !isSelected ? "secondary" : "primary"}
          onClick={() => onDateSelect(jsDate)}
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
    <Card sx={{ p: 2, ...(className ? { className } : {}) }}>
      <Stack spacing={2} dir="rtl">
        {/* Month Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Button size="small" onClick={() => navigateMonth("prev")}>
            <ChevronRight fontSize="small" />
          </Button>
          <Typography variant="body2" fontWeight="medium">
            {PERSIAN_MONTHS[viewDate.month - 1]} {viewDate.year}
          </Typography>
          <Button size="small" onClick={() => navigateMonth("next")}>
            <ChevronLeft fontSize="small" />
          </Button>
        </Stack>

        {/* Weekday Headers */}
        <Grid container spacing={0.5}>
          {PERSIAN_WEEKDAYS.map((weekday) => (
            <Grid size={{xs:12 , sm: 6 , md : 4, lg:3}}  key={weekday}>
              <Typography variant="caption" align="center" color="text.secondary">
                {weekday.slice(0, 2)}
              </Typography>
            </Grid>
          ))}
        </Grid>

        {/* Calendar Days */}
        <Grid container spacing={0.5}>
          {renderCalendarDays().map((day, index) => (
            <Grid size={{xs:12 , sm: 6 , md : 4, lg:3}}  key={index}>
              {day}
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Card>
  );
}
