"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch as MuiSwitch,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Box,
  Stack,
} from "@mui/material";
import { Calendar, Clock } from "lucide-react";
import type { CalendarEvent } from "@/lib/event-types";
import { jsDateToPersian, formatPersianDate } from "@/lib/solar-hijri";
import { format } from "date-fns-jalali";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, "id">) => void;
  selectedDate: Date;
  editingEvent?: CalendarEvent;
  selectedTimeSlot?: string;
}

const EVENT_CATEGORIES = [
  { value: "work", label: "کاری", color: "#059669" },
  { value: "personal", label: "شخصی", color: "#10b981" },
  { value: "holiday", label: "تعطیلات", color: "#dc2626" },
  { value: "reminder", label: "یادآوری", color: "#f59e0b" },
] as const;

export function EventModal({
  isOpen,
  onClose,
  onSave,
  selectedDate,
  editingEvent,
  selectedTimeSlot,
}: EventModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [isAllDay, setIsAllDay] = useState(false);
  const [category, setCategory] = useState<
    "work" | "personal" | "holiday" | "reminder" | "health" | "other"
  >("personal");

  const persianDate = jsDateToPersian(selectedDate);

  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title);
      setDescription(editingEvent.description || "");
      setStartTime(editingEvent.startTime || "09:00");
      setEndTime(editingEvent.endTime || "10:00");
      setIsAllDay(editingEvent.isAllDay);
      setCategory(editingEvent.category || "personal");
    } else {
      setTitle("");
      setDescription("");
      if (selectedTimeSlot) {
        setStartTime(selectedTimeSlot);
        const [hour, minute] = selectedTimeSlot.split(":").map(Number);
        const endHour = hour + 1;
        setEndTime(
          `${endHour.toString().padStart(2, "0")}:${minute
            .toString()
            .padStart(2, "0")}`
        );
      } else {
        setStartTime("09:00");
        setEndTime("10:00");
      }
      setIsAllDay(false);
      setCategory("personal");
    }
  }, [editingEvent, isOpen, selectedTimeSlot]);

  const handleSave = () => {
    if (!title.trim()) return;

    const startDate = new Date(selectedDate);
    const endDate = new Date(selectedDate);

    if (!isAllDay) {
      const [startHour, startMinute] = startTime.split(":").map(Number);
      const [endHour, endMinute] = endTime.split(":").map(Number);

      startDate.setHours(startHour, startMinute, 0, 0);
      endDate.setHours(endHour, endMinute, 0, 0);
    } else {
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
    }

    const selectedCategory = EVENT_CATEGORIES.find(
      (cat) => cat.value === category
    );

    const eventData: Omit<CalendarEvent, "id"> = {
      title: title.trim(),
      description: description.trim() || undefined,
      startDate,
      endDate,
      startTime: isAllDay ? undefined : startTime,
      endTime: isAllDay ? undefined : endTime,
      isAllDay,
      category,
      color: selectedCategory?.color,
      persianDate: {
        year: persianDate.year,
        month: persianDate.month,
        day: persianDate.day,
      },
    };

    onSave(eventData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Calendar size={20} />
          <Typography>
            {editingEvent ? "ویرایش رویداد" : "رویداد جدید"}
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3} dir="rtl">
          {/* Date */}
          <Box bgcolor="background.paper" p={2} borderRadius={1}>
            <Typography variant="body2" color="text.secondary">
              تاریخ انتخابی:
            </Typography>
            <Typography fontWeight="medium">
              {format(selectedDate, "PPP")}
            </Typography>
            {selectedTimeSlot && !editingEvent && (
              <Typography variant="body2" color="text.secondary" mt={0.5}>
                زمان انتخابی: {selectedTimeSlot}
              </Typography>
            )}
          </Box>

          {/* Title */}
          <TextField
            label="عنوان رویداد *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />

          {/* Description */}
          <TextField
            label="توضیحات"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            minRows={3}
          />

          {/* All-day */}
          <FormControlLabel
            control={
              <MuiSwitch
                checked={isAllDay}
                onChange={(e) => setIsAllDay(e.target.checked)}
              />
            }
            label="تمام روز"
          />

          {/* Time selection */}
          {!isAllDay && (
            <Stack direction="row" spacing={2}>
              <TextField
                label="زمان شروع"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <Clock size={16} style={{ marginRight: 8 }} />
                  ),
                }}
                fullWidth
              />
              <TextField
                label="زمان پایان"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <Clock size={16} style={{ marginRight: 8 }} />
                  ),
                }}
                fullWidth
              />
            </Stack>
          )}

          {/* Category */}
          <FormControl fullWidth>
            <InputLabel>دسته‌بندی</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value as typeof category)}
              label="دسته‌بندی"
            >
              {EVENT_CATEGORIES.map((cat) => (
                <MenuItem key={cat.value} value={cat.value}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box
                      width={12}
                      height={12}
                      borderRadius="50%"
                      bgcolor={cat.color}
                    />
                    <Typography pr={0.5}>{cat.label}</Typography>
                  </Stack>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          لغو
        </Button>
        <Button
          onClick={handleSave}
          disabled={!title.trim()}
          variant="contained"
          color="primary"
        >
          {editingEvent ? "ذخیره تغییرات" : "ایجاد رویداد"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
