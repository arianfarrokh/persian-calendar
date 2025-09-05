"use client";

import * as React from "react";
import { Button, Stack, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatPersianDate, jsDateToPersian, PERSIAN_MONTHS } from "@/lib/solar-hijri";
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
  onViewModeChange,
}: CalendarNavigationProps) {
  const currentPersianDate = jsDateToPersian(currentDate);

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);

    switch (viewMode) {
      case "day":
        newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
        break;
      case "week":
        newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
        break;
      case "year":
        newDate.setFullYear(newDate.getFullYear() + (direction === "next" ? 1 : -1));
        break;
    }

    onDateChange(newDate);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  const getNavigationTitle = () => {
    const pDate = jsDateToPersian(currentDate);

    switch (viewMode) {
      case "day":
        return formatPersianDate(pDate, true);
      case "week":
        return `هفته ${PERSIAN_MONTHS[pDate.month - 1]} ${pDate.year}`;
      case "year":
        return `سال ${pDate.year}`;
      default:
        return formatPersianDate(pDate);
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

      <Stack direction="row" spacing={1}>
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
