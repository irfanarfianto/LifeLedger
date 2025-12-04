"use client";

import { CalendarEvent } from "@/lib/actions/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState } from "react";
import { formatRupiah } from "@/lib/utils/currency";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, CreditCard, UserMinus } from "lucide-react";
import { id } from "date-fns/locale";

interface CalendarViewProps {
  events: CalendarEvent[];
}

export function CalendarView({ events }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Map events to FullCalendar format
  const calendarEvents = events.map(event => {
    // Create a new date object to avoid mutating the original
    const date = new Date(event.date);
    // Adjust for timezone offset to ensure the date string is correct in local time
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
    
    return {
      id: event.id,
      title: event.title,
      date: adjustedDate.toISOString().split('T')[0], // Format YYYY-MM-DD
      extendedProps: {
        amount: event.amount,
        type: event.type,
        isPaid: event.isPaid
      },
      backgroundColor: event.type === 'subscription' ? '#3b82f6' : '#ef4444', // Blue for sub, Red for debt
      borderColor: event.type === 'subscription' ? '#2563eb' : '#dc2626',
    };
  });

  // Filter events for the selected date (for the agenda view below)
  const selectedDateEvents = events.filter(event => 
    event.date.getDate() === selectedDate.getDate() &&
    event.date.getMonth() === selectedDate.getMonth() &&
    event.date.getFullYear() === selectedDate.getFullYear()
  );

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardContent className="pt-6">
          <div className="calendar-container">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              locale="id"
              headerToolbar={{
                left: 'prev,next',
                center: 'title',
                right: 'today'
              }}
              events={calendarEvents}
              dateClick={(info) => setSelectedDate(info.date)}
              eventClick={(info) => setSelectedDate(info.event.start!)}
              height="auto"
              contentHeight="auto"
              aspectRatio={1.5}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle>
            Agenda: {selectedDate.toLocaleDateString("id-ID", { dateStyle: "full" })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDateEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground text-center">
              <p>Tidak ada agenda keuangan pada tanggal ini.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedDateEvents.map((event) => (
                <div key={event.id} className="flex flex-col gap-3 p-4 border rounded-lg shadow-sm bg-card">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full shrink-0 ${event.type === 'subscription' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                      {event.type === 'subscription' ? <CreditCard className="h-5 w-5" /> : <UserMinus className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-medium leading-tight">{event.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {event.type === 'subscription' ? 'Langganan' : 'Jatuh Tempo Hutang'}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-end border-t pt-3">
                    <Badge variant="outline" className="text-[10px]">
                      {event.isPaid ? "Lunas" : "Belum Bayar"}
                    </Badge>
                    <p className="font-bold">{formatRupiah(event.amount)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <style jsx global>{`
        .fc {
          --fc-border-color: hsl(var(--border));
          --fc-button-bg-color: transparent;
          --fc-button-border-color: hsl(var(--border));
          --fc-button-text-color: hsl(var(--foreground));
          --fc-button-hover-bg-color: hsl(var(--accent));
          --fc-button-hover-border-color: hsl(var(--border));
          --fc-button-active-bg-color: hsl(var(--accent));
          --fc-button-active-border-color: hsl(var(--border));
          --fc-today-bg-color: hsl(var(--accent) / 0.3);
          --fc-neutral-bg-color: hsl(var(--background));
          --fc-list-event-hover-bg-color: hsl(var(--accent));
          font-size: 0.875rem;
        }
        .fc-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem !important;
        }
        .fc-toolbar-title {
          font-size: 1rem !important;
          font-weight: 600;
        }
        .fc-button {
          font-size: 0.75rem !important;
          padding: 0.25rem 0.5rem !important;
          height: 2rem;
          min-width: 2rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 500;
          text-transform: capitalize;
          border-radius: var(--radius) !important;
          box-shadow: none !important;
        }
        .fc-button-primary:not(:disabled):active, 
        .fc-button-primary:not(:disabled).fc-button-active {
          background-color: hsl(var(--primary)) !important;
          border-color: hsl(var(--primary)) !important;
          color: hsl(var(--primary-foreground)) !important;
        }
        .fc-daygrid-day-number {
          padding: 4px 8px !important;
          font-size: 0.8rem;
        }
        .fc-col-header-cell-cushion {
          font-size: 0.75rem;
          font-weight: 500;
          padding: 8px 0 !important;
        }
        @media (max-width: 640px) {
          .fc-toolbar-title {
            font-size: 0.875rem !important;
          }
          .fc-button {
            padding: 0.25rem 0.4rem !important;
            font-size: 0.7rem !important;
            height: 1.75rem;
            min-width: 1.75rem;
          }
        }
      `}</style>
    </div>
  );
}
