import { useState } from "react";
import { Plus } from "lucide-react";
import PageTitle from "../components/PageTitle.jsx";
import Modal from "../components/Modal.jsx";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const initialEvents = [
  { id: 1, day: 2, title: "Mock interview with mentor", time: "10:00 AM" },
  { id: 2, day: 4, title: "Acme Corp final round", time: "2:00 PM" },
  { id: 3, day: 6, title: "Resume review session", time: "4:30 PM" },
];

function buildMonthGrid(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(day);
  return cells;
}

function AddEventModal({ day, monthLabel, onClose, onAdd }) {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ day, title: title.trim(), time: time.trim() || "All day" });
    onClose();
  }

  return (
    <Modal title={`Add event — ${monthLabel} ${day}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-xs text-text-secondary">Event title</label>
          <input
            autoFocus
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Interview with Nova Labs"
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs text-text-secondary">Time (optional)</label>
          <input
            type="text"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="e.g. 3:00 PM"
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
          />
        </div>

        <div className="mt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary transition-colors duration-150 hover:bg-surface-hover"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-accent-hover"
          >
            Add event
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function Calendar() {
  const today = new Date();
  const cells = buildMonthGrid(today.getFullYear(), today.getMonth());
  const monthLabel = today.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const [events, setEvents] = useState(initialEvents);
  const [activeDay, setActiveDay] = useState(null);

  function addEvent(newEvent) {
    setEvents((prev) => [...prev, { id: Date.now(), ...newEvent }]);
  }

  const sortedEvents = [...events].sort((a, b) => a.day - b.day);

  return (
    <div>
      <PageTitle title="Calendar" subtitle={`${monthLabel} — click a date to add an event`} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-5 xl:col-span-2">
          <div className="grid grid-cols-7 gap-2 text-center text-xs text-text-muted">
            {weekdays.map((day) => (
              <div key={day} className="py-2 font-medium">
                {day}
              </div>
            ))}

            {cells.map((day, index) => {
              const dayEvents = day ? events.filter((e) => e.day === day) : [];
              const isToday = day === today.getDate();

              return (
                <button
                  key={index}
                  disabled={!day}
                  onClick={() => setActiveDay(day)}
                  className={`relative flex aspect-square flex-col items-center justify-center gap-1 rounded-lg text-sm transition-colors duration-150 ${
                    isToday
                      ? "bg-accent text-white"
                      : day
                      ? "text-text-primary hover:bg-surface-hover"
                      : "cursor-default"
                  }`}
                >
                  {day}
                  {dayEvents.length > 0 && (
                    <span
                      className={`h-1 w-1 rounded-full ${isToday ? "bg-white" : "bg-accent"}`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-primary">Upcoming Events</h3>
            <button
              onClick={() => setActiveDay(today.getDate())}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-accent transition-colors duration-150 hover:bg-accent-soft"
            >
              <Plus size={14} />
              Add
            </button>
          </div>

          {sortedEvents.length === 0 ? (
            <p className="mt-4 text-sm text-text-muted">No events yet — click a date to add one.</p>
          ) : (
            <ul className="mt-4 flex flex-col gap-3">
              {sortedEvents.map((event) => (
                <li
                  key={event.id}
                  className="rounded-lg border border-border p-3 transition-colors duration-150 hover:bg-surface-hover"
                >
                  <p className="text-sm text-text-primary">{event.title}</p>
                  <p className="mt-1 text-xs text-text-muted">
                    {monthLabel.split(" ")[0]} {event.day} · {event.time}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {activeDay && (
        <AddEventModal
          day={activeDay}
          monthLabel={monthLabel.split(" ")[0]}
          onClose={() => setActiveDay(null)}
          onAdd={addEvent}
        />
      )}
    </div>
  );
}
