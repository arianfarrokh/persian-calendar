"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import type { CalendarEvent } from "@/lib/event-types"
import { jsDateToPersian, formatPersianDate } from "@/lib/solar-hijri"
import { Calendar, Clock } from "lucide-react"

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (event: Omit<CalendarEvent, "id">) => void
  selectedDate: Date
  editingEvent?: CalendarEvent
  selectedTimeSlot?: string // Added selectedTimeSlot prop
}

const EVENT_CATEGORIES = [
  { value: "work", label: "کاری", color: "#059669" },
  { value: "personal", label: "شخصی", color: "#10b981" },
  { value: "holiday", label: "تعطیلات", color: "#dc2626" },
  { value: "reminder", label: "یادآوری", color: "#f59e0b" },
] as const

export function EventModal({ isOpen, onClose, onSave, selectedDate, editingEvent, selectedTimeSlot }: EventModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("10:00")
  const [isAllDay, setIsAllDay] = useState(false)
  const [category, setCategory] = useState<"work" | "personal" | "holiday" | "reminder">("personal")

  const persianDate = jsDateToPersian(selectedDate)

  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title)
      setDescription(editingEvent.description || "")
      setStartTime(editingEvent.startTime || "09:00")
      setEndTime(editingEvent.endTime || "10:00")
      setIsAllDay(editingEvent.isAllDay)
      setCategory(editingEvent.category || "personal")
    } else {
      // Reset form for new event
      setTitle("")
      setDescription("")
      if (selectedTimeSlot) {
        setStartTime(selectedTimeSlot)
        const [hour, minute] = selectedTimeSlot.split(":").map(Number)
        const endHour = hour + 1
        setEndTime(`${endHour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`)
      } else {
        setStartTime("09:00")
        setEndTime("10:00")
      }
      setIsAllDay(false)
      setCategory("personal")
    }
  }, [editingEvent, isOpen, selectedTimeSlot])

  const handleSave = () => {
    if (!title.trim()) return

    const startDate = new Date(selectedDate)
    const endDate = new Date(selectedDate)

    if (!isAllDay) {
      const [startHour, startMinute] = startTime.split(":").map(Number)
      const [endHour, endMinute] = endTime.split(":").map(Number)

      startDate.setHours(startHour, startMinute, 0, 0)
      endDate.setHours(endHour, endMinute, 0, 0)
    } else {
      startDate.setHours(0, 0, 0, 0)
      endDate.setHours(23, 59, 59, 999)
    }

    const selectedCategory = EVENT_CATEGORIES.find((cat) => cat.value === category)

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
    }

    onSave(eventData)
    onClose()
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {editingEvent ? "ویرایش رویداد" : "رویداد جدید"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Date Display */}
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">تاریخ انتخابی:</p>
            <p className="font-medium">{formatPersianDate(persianDate, true)}</p>
            {selectedTimeSlot && !editingEvent && (
              <p className="text-sm text-muted-foreground mt-1">زمان انتخابی: {selectedTimeSlot}</p>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">عنوان رویداد *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="عنوان رویداد را وارد کنید"
              dir="rtl"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">توضیحات</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="توضیحات اضافی (اختیاری)"
              rows={3}
              dir="rtl"
            />
          </div>

          {/* All Day Toggle */}
          <div className="flex items-center justify-between">
            <Label htmlFor="all-day">تمام روز</Label>
            <Switch id="all-day" checked={isAllDay} onCheckedChange={setIsAllDay} />
          </div>

          {/* Time Selection */}
          {!isAllDay && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-time">زمان شروع</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="start-time"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-time">زمان پایان</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="end-time"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Category */}
          <div className="space-y-2">
            <Label>دسته‌بندی</Label>
            <Select value={category} onValueChange={(value: any) => setCategory(value)}>
              <SelectTrigger dir="rtl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EVENT_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                      {cat.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            لغو
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()} className="bg-primary hover:bg-primary/90">
            {editingEvent ? "ذخیره تغییرات" : "ایجاد رویداد"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
