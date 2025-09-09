"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Calendar, CalendarRange, Plus } from "lucide-react";
import { getCurrentPersianDate, formatPersianDate } from "@/lib/solar-hijri";
import type { ViewMode, CalendarEvent } from "@/lib/event-types";
import { CalendarNavigation } from "@/components/calendar-navigation";
import { MiniCalendar } from "@/components/mini-calendar";
import { EventModal } from "@/components/event-modal";
import { EventList } from "@/components/event-list";
import { DayView } from "@/components/day-view";
import { WeekView } from "@/components/week-view";
import { YearView } from "@/components/year-view";
import { useEvents } from "@/hooks/use-events";
import { format } from "date-fns-jalali";
import { Tab, Tabs } from "@mui/material";

export default function PersianScheduler() {
  // const [viewMode, setViewMode] = useState<ViewMode>("day");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | undefined>();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<
    string | undefined
  >();
  const [viewMode, setViewMode] = useState<"day" | "week" | "year">("day");

  const { events, addEvent, updateEvent, deleteEvent, getEventsForDate } =
    useEvents();
  // const currentPersianDate = getCurrentPersianDate()

  const handleCreateEvent = (date?: Date, time?: string) => {
    setEditingEvent(undefined);
    setSelectedTimeSlot(time);
    if (date) {
      setCurrentDate(date);
    }
    setIsEventModalOpen(true);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setSelectedTimeSlot(undefined);
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = (eventData: Omit<CalendarEvent, "id">) => {
    if (editingEvent) {
      updateEvent(editingEvent.id, eventData);
    } else {
      addEvent(eventData);
    }
    setIsEventModalOpen(false);
    setEditingEvent(undefined);
    setSelectedTimeSlot(undefined);
  };

  const handleDeleteEvent = (eventId: string) => {
    if (confirm("آیا از حذف این رویداد اطمینان دارید؟")) {
      deleteEvent(eventId);
    }
  };

  const handleViewChange = (event: React.SyntheticEvent, newValue: string) => {
    setViewMode(newValue as "day" | "week" | "year");
  };


  const todayEvents = getEventsForDate(currentDate);

  const renderCalendarView = () => {
    switch (viewMode) {
      case "day":
        return (
          <DayView
            selectedDate={currentDate}
            events={events}
            // onCreateEvent={handleCreateEvent}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        );
      case "week":
        return (
          <WeekView
            selectedDate={currentDate}
            events={events}
            onCreateEvent={handleCreateEvent}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        );
      case "year":
        return (
          <YearView
            selectedDate={currentDate}
            events={events}
            onDateSelect={setCurrentDate}
            onCreateEvent={handleCreateEvent}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">تقویم شمسی</h1>
              <p className="text-sm text-muted-foreground" dir="rtl">
                {/* {formatPersianDate(currentPersianDate, true)} */}
                {format(currentDate, "EEEE d MMMM yyyy")}
              </p>
            </div>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => handleCreateEvent()}
            >
              <Plus className="w-4 h-4 ml-2" />
              رویداد جدید
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* View Mode Selector */}
            <Card className="p-4 bg-card border-border">
              <h2
                className="text-lg font-semibold mb-4 text-card-foreground"
              >
                نمایش
              </h2>
              <div>
                <Tabs
                  value={viewMode}
                  // orientation="vertical"
                  onChange={handleViewChange}
                  variant="fullWidth"
                  textColor="primary"
                  indicatorColor="primary"
                >
                  <Tab
                    value="day"
                    icon={<CalendarDays size={16} />}
                    iconPosition="start"
                    label="روزانه"
                  />
                  <Tab
                    value="week"
                    icon={<Calendar size={16} />}
                    iconPosition="start"
                    label="هفتگی"
                  />
                  <Tab
                    value="year"
                    icon={<CalendarRange size={16} />}
                    iconPosition="start"
                    label="سالانه"
                  />
                </Tabs>
              </div>
            </Card>

            <MiniCalendar
              selectedDate={currentDate}
              onDateSelect={setCurrentDate}
            />

            <Card className="p-4 bg-card border-border">
              <h3
                className="text-lg font-semibold mb-4 text-card-foreground"
                dir="rtl"
              >
                رویدادهای امروز ({todayEvents.length})
              </h3>
              <EventList
                events={todayEvents}
                onEditEvent={handleEditEvent}
                onDeleteEvent={handleDeleteEvent}
                selectedDate={currentDate}
              />
            </Card>
          </div>

          {/* Main Calendar Area */}
          <div className="lg:col-span-3">
            <Card className="p-6 bg-card border-border">
              <CalendarNavigation
                currentDate={currentDate}
                viewMode={viewMode}
                onDateChange={setCurrentDate}
                onViewModeChange={setViewMode}
              />

              {renderCalendarView()}
            </Card>
          </div>
        </div>
      </div>

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setEditingEvent(undefined);
          setSelectedTimeSlot(undefined);
        }}
        onSave={handleSaveEvent}
        selectedDate={currentDate}
        editingEvent={editingEvent}
      />
    </div>
  );
}
