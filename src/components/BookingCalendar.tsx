"use client";

import { useMemo, useState } from "react";
import { services, formatDuration } from "@/data/services";

const OPEN_HOUR = 10;
const OPEN_MIN = 30;
const CLOSE_HOUR = 19;
const SLOT_MIN = 30;

type Booking = {
  dateISO: string;
  time: string;
  serviceId: string;
  client: string;
};

// Seed bookings so the calendar shows realistic availability.
// Keyed off the current week — regenerated on load.
function seedBookings(): Booking[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const bookings: Booking[] = [];
  const template: Array<[number, string, string, string]> = [
    [0, "11:00", "knotless-medium", "Jada R."],
    [0, "15:30", "passion-twists", "Simone T."],
    [1, "10:30", "boho-knotless", "Nia B."],
    [1, "16:00", "silk-press", "Aaliyah K."],
    [2, "12:00", "soft-locs", "Imani D."],
    [3, "10:30", "knotless-small", "Kali M."],
    [3, "17:00", "stitch-braids", "Zora P."],
    [4, "13:30", "butterfly-locs", "Maya L."],
    [5, "11:30", "box-medium", "Amara S."],
    [5, "18:00", "wash-blowout", "Erykah C."],
    [6, "14:00", "tribal-braids", "Brianna H."],
  ];
  for (const [offset, time, serviceId, client] of template) {
    const d = new Date(today);
    d.setDate(d.getDate() + offset);
    bookings.push({
      dateISO: d.toISOString().slice(0, 10),
      time,
      serviceId,
      client,
    });
  }
  return bookings;
}

function generateSlots() {
  const slots: string[] = [];
  let h = OPEN_HOUR;
  let m = OPEN_MIN;
  while (h < CLOSE_HOUR || (h === CLOSE_HOUR && m === 0)) {
    slots.push(
      `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
    );
    m += SLOT_MIN;
    if (m >= 60) {
      m -= 60;
      h += 1;
    }
  }
  return slots;
}

function formatTimeLabel(t: string) {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hh = ((h + 11) % 12) + 1;
  return `${hh}:${String(m).padStart(2, "0")} ${period}`;
}

function weekDays(anchor: Date) {
  const days: Date[] = [];
  for (let i = 0; i < 7; i += 1) {
    const d = new Date(anchor);
    d.setDate(anchor.getDate() + i);
    days.push(d);
  }
  return days;
}

export default function BookingCalendar({
  initialServiceId,
}: {
  initialServiceId?: string;
}) {
  const [anchor, setAnchor] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [selected, setSelected] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [serviceId, setServiceId] = useState<string>(
    initialServiceId ?? services[0].id,
  );
  const [pickedSlot, setPickedSlot] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>(() => seedBookings());

  const slots = useMemo(generateSlots, []);
  const days = useMemo(() => weekDays(anchor), [anchor]);
  const selectedISO = selected.toISOString().slice(0, 10);
  const service = services.find((s) => s.id === serviceId)!;

  const bookedTimes = useMemo(
    () =>
      new Set(
        bookings
          .filter((b) => b.dateISO === selectedISO)
          .map((b) => b.time),
      ),
    [bookings, selectedISO],
  );

  function confirm() {
    if (!pickedSlot) return;
    setBookings((prev) => [
      ...prev,
      {
        dateISO: selectedISO,
        time: pickedSlot,
        serviceId,
        client: "You",
      },
    ]);
    setPickedSlot(null);
  }

  const dayBookings = bookings.filter((b) => b.dateISO === selectedISO);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.3fr,1fr]">
      {/* LEFT: Calendar */}
      <div className="rounded-2xl bg-cream p-6 shadow-soft ring-1 ring-espresso/5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl">Pick a date</h2>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const d = new Date(anchor);
                d.setDate(d.getDate() - 7);
                setAnchor(d);
              }}
              className="rounded-full border border-espresso/20 px-3 py-1 text-sm hover:bg-espresso hover:text-cream"
              aria-label="Previous week"
            >
              ←
            </button>
            <button
              onClick={() => {
                const d = new Date(anchor);
                d.setDate(d.getDate() + 7);
                setAnchor(d);
              }}
              className="rounded-full border border-espresso/20 px-3 py-1 text-sm hover:bg-espresso hover:text-cream"
              aria-label="Next week"
            >
              →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((d) => {
            const iso = d.toISOString().slice(0, 10);
            const isSelected = iso === selectedISO;
            const dayBookCount = bookings.filter(
              (b) => b.dateISO === iso,
            ).length;
            return (
              <button
                key={iso}
                onClick={() => {
                  setSelected(d);
                  setPickedSlot(null);
                }}
                className={`flex flex-col items-center rounded-xl border px-2 py-3 text-sm transition ${
                  isSelected
                    ? "border-espresso bg-espresso text-cream"
                    : "border-espresso/15 bg-cream hover:border-espresso/40"
                }`}
              >
                <span className="text-xs uppercase tracking-widest opacity-70">
                  {d.toLocaleDateString(undefined, { weekday: "short" })}
                </span>
                <span className="mt-1 font-display text-xl">{d.getDate()}</span>
                <span className="mt-1 text-[10px] uppercase opacity-70">
                  {dayBookCount > 0 ? `${dayBookCount} booked` : "open"}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-xl">
              Time slots ·{" "}
              {selected.toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </h3>
            <div className="flex items-center gap-3 text-xs text-espresso/60">
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-caramel" />
                Available
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-espresso/30" />
                Booked
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
            {slots.map((t) => {
              const isBooked = bookedTimes.has(t);
              const isPicked = pickedSlot === t;
              return (
                <button
                  key={t}
                  disabled={isBooked}
                  onClick={() => setPickedSlot(t)}
                  className={`rounded-lg border px-3 py-2 text-sm transition ${
                    isBooked
                      ? "cursor-not-allowed border-espresso/10 bg-espresso/5 text-espresso/40 line-through"
                      : isPicked
                        ? "border-espresso bg-espresso text-cream"
                        : "border-espresso/20 bg-cream hover:border-caramel hover:text-caramel"
                  }`}
                >
                  {formatTimeLabel(t)}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT: Appointment summary + day's bookings */}
      <div className="space-y-6">
        <div className="rounded-2xl bg-cream p-6 shadow-soft ring-1 ring-espresso/5">
          <h3 className="font-display text-xl">Your appointment</h3>
          <label className="mt-4 block text-xs uppercase tracking-widest text-espresso/60">
            Service
          </label>
          <select
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            className="mt-1 w-full rounded-lg border border-espresso/20 bg-cream px-3 py-2 text-sm"
          >
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <div className="mt-5 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-espresso/60">Duration</span>
              <span>{formatDuration(service.durationMin)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-espresso/60">Date</span>
              <span>
                {selected.toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-espresso/60">Time</span>
              <span>{pickedSlot ? formatTimeLabel(pickedSlot) : "—"}</span>
            </div>
          </div>

          <button
            disabled={!pickedSlot}
            onClick={confirm}
            className="btn btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pickedSlot ? "Confirm booking" : "Select a time"}
          </button>
          <p className="mt-3 text-center text-xs text-espresso/50">
            Ashbraids works 10:30 AM – 7:00 PM, every day.
          </p>
        </div>

        <div className="rounded-2xl bg-cream p-6 shadow-soft ring-1 ring-espresso/5">
          <h3 className="font-display text-xl">
            Bookings on{" "}
            {selected.toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </h3>
          {dayBookings.length === 0 ? (
            <p className="mt-3 text-sm text-espresso/60">
              No appointments yet — the whole day is open.
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-espresso/10">
              {dayBookings
                .slice()
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((b, i) => {
                  const svc = services.find((s) => s.id === b.serviceId);
                  return (
                    <li
                      key={`${b.time}-${i}`}
                      className="flex items-center justify-between py-3 text-sm"
                    >
                      <div>
                        <div className="font-medium">
                          {formatTimeLabel(b.time)}
                        </div>
                        <div className="text-xs text-espresso/60">
                          {svc?.name ?? "Appointment"}
                        </div>
                      </div>
                      <span className="rounded-full bg-sand px-3 py-1 text-xs">
                        {b.client}
                      </span>
                    </li>
                  );
                })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
