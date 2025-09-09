"use client";

import React from "react";
import { Button, Stack, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addDays, addWeeks, addYears, format } from "date-fns-jalali";
import type { ViewMode } from "@/lib/event-types";

interface CalendarNavigationProps {
  currentDate: Date;
  viewMode: ViewMode;
  onDateChange: (date: Date) => void;
  onViewModeChange: (mode: ViewMode) => void;
}

export function CalendarNavigation({
  currentDate,
  viewMode,
  onDateChange,
}: CalendarNavigationProps) {
  const navigateDate = (direction: "prev" | "next") => {
    let newDate = currentDate;

    switch (viewMode) {
      case "day":
        newDate = addDays(currentDate, direction === "next" ? 1 : -1);
        break;
      case "week":
        newDate = addWeeks(currentDate, direction === "next" ? 1 : -1);
        break;
      case "year":
        newDate = addYears(currentDate, direction === "next" ? 1 : -1);
        break;
    }

    onDateChange(newDate);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  const getNavigationTitle = () => {
    switch (viewMode) {
      case "day":
        return format(currentDate, "EEEE d MMMM yyyy"); // مثلا: دوشنبه ۱۲ شهریور ۱۴۰۴
      case "week":
        return `هفته ${format(currentDate, "MMMM yyyy")}`; // مثلا: هفته شهریور ۱۴۰۴
      case "year":
        return `سال ${format(currentDate, "yyyy")}`;
      default:
        return format(currentDate, "MMMM yyyy");
    }
  };

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
      <Stack direction="column" spacing={0.5}>
        <Typography variant="h6" fontWeight={600} dir="rtl">
          {viewMode === "day" && "نمای روزانه"}
          {viewMode === "week" && "نمای هفتگی"}
          {viewMode === "year" && "نمای سالانه"}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" dir="rtl">
          {getNavigationTitle()}
        </Typography>
      </Stack>

      <Stack direction="row">
        <Button
          variant="outlined"
          size="small"
          endIcon={<ChevronRight />}
          onClick={() => navigateDate("prev")}
        >
          قبلی
        </Button>

        <Button variant="outlined" size="small" onClick={goToToday}>
          امروز
        </Button>

        <Button
          variant="outlined"
          size="small"
          startIcon={<ChevronLeft />}
          onClick={() => navigateDate("next")}
        >
          بعدی
        </Button>
      </Stack>
    </Stack>
  );
}
