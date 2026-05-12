import { useState } from "react";
import { mockDrivers } from "../../data/mockDrivers";
import { mockFlights } from "../../data/mockFlights";
import type { FlightAssignment, ServiceType } from "../../types/dispatch";
import { Panel } from "../ui/Panel";

const startTime = "06:30";
const endTime = "12:30";
const pxPerMinute = 3.2;
const rowHeight = 44;

function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function leftFor(time: string) {
  return (toMinutes(time) - toMinutes(startTime)) * pxPerMinute;
}

function widthFor(start: string, end: string) {
  return Math.max(28, (toMinutes(end) - toMinutes(start)) * pxPerMinute);
}

function colorFor(type: ServiceType) {
  return {
    "load-ua": "border-blue-300 bg-blue-200 text-blue-950",
    "load-other": "border-violet-300 bg-violet-200 text-violet-950",
    positioning: "border-teal-300 bg-teal-200 text-teal-950",
    "other-work": "border-amber-300 bg-amber-200 text-amber-950",
    break: "border-red-400 bg-white text-red-600",
    unplanned: "border-red-400 bg-white text-red-700",
  }[type];
}

function FlightPuck({ flight }: { flight: FlightAssignment }) {
  const isBreak = flight.serviceType === "break";
  return (
    <div
      className={`group absolute top-2 flex h-7 items-center justify-between rounded-lg border px-2 text-[12px] font-medium shadow-sm ${colorFor(flight.serviceType)} ${flight.edited ? "ring-2 ring-blue-500 ring-offset-1" : ""}`}
      style={{ left: leftFor(flight.start), width: isBreak ? 34 : widthFor(flight.start, flight.end) }}
    >
      <span className="truncate">{isBreak ? "L" : `${flight.flightNumber} ${flight.gate}`}</span>
      <div className="pointer-events-none absolute bottom-full left-1/2 z-40 mb-3 hidden w-72 -translate-x-1/2 rounded-xl border border-slate-200 bg-white p-3 text-left text-xs text-slate-600 shadow-xl group-hover:block">
        <p className="text-sm font-semibold text-ink">{flight.flightNumber}</p>
        <div className="mt-2 grid grid-cols-2 gap-y-1">
          <span>Gate</span><b className="text-right">{flight.gate}</b>
          <span>ETD</span><b className="text-right">{flight.etd}</b>
          <span>ETA</span><b className="text-right">{flight.eta}</b>
          <span>Inbound ETA</span><b className="text-right">{flight.inboundEta}</b>
          <span>Aircraft</span><b className="text-right">{flight.aircraft}</b>
        </div>
        <p className="mt-3 rounded-lg bg-slate-50 p-2">{flight.notes}</p>
      </div>
    </div>
  );
}

export function DispatcherTimeline() {
  const [flights] = useState(mockFlights);
  const hours = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00"];
  const timelineWidth = (toMinutes(endTime) - toMinutes(startTime)) * pxPerMinute;

  return (
    <Panel className="overflow-hidden">
      <div className="overflow-auto">
        <div style={{ minWidth: 380 + timelineWidth }}>
          <div className="sticky top-0 z-20 flex h-[54px] border-b border-slate-200 bg-white">
            <div className="grid w-[380px] shrink-0 grid-cols-[1.4fr_0.65fr_0.65fr_0.8fr_0.8fr] items-end gap-2 border-r border-slate-200 px-4 pb-3 text-xs font-semibold text-slate-500">
              <span>Driver</span><span>Truck</span><span>Radio</span><span>Start</span><span>End</span>
            </div>
            <div className="relative h-full" style={{ width: timelineWidth }}>
              <div className="absolute left-0 top-2 w-full text-center text-xs font-medium text-slate-500">Fri, Jan 23, 2026</div>
              {hours.map((hour) => <div key={hour} className="absolute bottom-3 -translate-x-1/2 text-sm font-semibold text-slate-700" style={{ left: leftFor(hour) }}>{hour}</div>)}
            </div>
          </div>
          <div className="flex">
            <div className="w-[380px] shrink-0 border-r border-slate-200 bg-white">
              {mockDrivers.map((driver) => <div key={driver.id} className="grid grid-cols-[1.4fr_0.65fr_0.65fr_0.8fr_0.8fr] items-center gap-2 border-b border-slate-100 px-4 text-xs" style={{ height: rowHeight }}><span className="truncate font-semibold text-ink">{driver.name}</span><span>{driver.truck}</span><span>{driver.radio}</span><span>{driver.shiftStart}</span><span>{driver.shiftEnd}</span></div>)}
            </div>
            <div style={{ width: timelineWidth }}>
              {mockDrivers.map((driver) => <div key={driver.id} className="relative border-b border-slate-100 bg-emerald-50/50" style={{ height: rowHeight, width: timelineWidth }}>{Array.from({ length: 13 }).map((_, i) => <div key={i} className="absolute inset-y-0 border-l border-dashed border-slate-300/70" style={{ left: i * 30 * pxPerMinute }} />)}{flights.filter((flight) => flight.driverId === driver.id).map((flight) => <FlightPuck key={flight.id} flight={flight} />)}</div>)}
            </div>
          </div>
          <div className="flex border-t border-slate-200 bg-white">
            <div className="flex w-[380px] shrink-0 items-center border-r border-slate-200 px-6 text-sm font-semibold text-ink">Unplanned / Open</div>
            <div className="relative bg-slate-50" style={{ height: 84, width: timelineWidth }}>{flights.filter((flight) => !flight.driverId).map((flight, index) => <div key={flight.id} style={{ position: "absolute", top: index * 28 + 12 }}><FlightPuck flight={flight} /></div>)}</div>
          </div>
          <div className="flex gap-4 border-t border-slate-200 bg-white px-6 py-3 text-xs font-medium text-slate-600"><span>Load (UA)</span><span>Load (Other)</span><span>Positioning / Drive</span><span>Other Work</span><span>Lunch</span><span>Unplanned</span></div>
        </div>
      </div>
    </Panel>
  );
}
