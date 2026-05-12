import type { ScheduleException, ScheduleResult } from "../../types/dispatch";
import { Badge } from "../ui/Badge";
import { KpiCard } from "../ui/KpiCard";
import { Panel } from "../ui/Panel";

export function ScheduleSummaryCards({ result }: { result: ScheduleResult }) {
  const summary = result.summary;

  return (
    <div className="grid grid-cols-7 gap-3">
      <KpiCard label="Flights" value={String(summary.totalFlights)} />
      <KpiCard label="Pushes" value={String(summary.totalPushes)} />
      <KpiCard label="Drivers" value={String(summary.driversRequired)} />
      <KpiCard label="Helpers" value={String(summary.helpersRequired)} />
      <KpiCard label="Peak Trucks" value={String(summary.maxTrucksRequired)} />
      <KpiCard label="Normal" value={String(summary.flightsScheduledNormally)} />
      <KpiCard label="Exceptions" value={String(summary.flightsWithExceptions)} />
    </div>
  );
}

export function PushTable({ result }: { result: ScheduleResult }) {
  return (
    <Panel className="overflow-hidden">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Push</th>
            <th className="px-4 py-3">Flights</th>
            <th className="px-4 py-3">Depart</th>
            <th className="px-4 py-3">Service</th>
            <th className="px-4 py-3">Return</th>
            <th className="px-4 py-3">Driver</th>
            <th className="px-4 py-3">Helper</th>
            <th className="px-4 py-3">Truck</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {result.pushes.map((push) => (
            <tr key={push.id} className="bg-white align-top">
              <td className="px-4 py-3 font-semibold text-ink">{push.id}</td>
              <td className="px-4 py-3 text-slate-700">{push.flights.map((flight) => `${flight.flightNumber} ${flight.gate}`).join(", ")}</td>
              <td className="px-4 py-3 text-slate-700">{push.kitchenDepartureTime}</td>
              <td className="px-4 py-3 text-slate-700">{push.gateServiceTime}</td>
              <td className="px-4 py-3 text-slate-700">{push.returnTime}</td>
              <td className="px-4 py-3 text-slate-700">{push.driverId ?? "Open"}</td>
              <td className="px-4 py-3 text-slate-700">{push.helperId ?? "-"}</td>
              <td className="px-4 py-3 text-slate-700">{push.truckId ?? "Open"}</td>
              <td className="px-4 py-3">{push.exceptionFlags.length === 0 ? <Badge tone="green">Normal</Badge> : <Badge tone="red">{push.exceptionFlags.length} issue</Badge>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}

export function ExceptionTable({ exceptions }: { exceptions: ScheduleException[] }) {
  return (
    <Panel className="overflow-hidden">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">Flight</th><th className="px-4 py-3">Issue</th><th className="px-4 py-3">Cause</th><th className="px-4 py-3">Recommended Action</th></tr></thead>
        <tbody className="divide-y divide-slate-100">
          {exceptions.length === 0 ? <tr><td colSpan={4} className="px-4 py-5 text-sm text-slate-500">No exceptions for this run.</td></tr> : exceptions.map((item) => (
            <tr key={item.id} className="bg-white align-top"><td className="px-4 py-3 font-semibold text-ink">{item.flightNumber}</td><td className="px-4 py-3 text-slate-700">{item.issue}</td><td className="px-4 py-3"><Badge tone="orange">{item.cause.split("-").join(" ")}</Badge></td><td className="px-4 py-3 text-slate-600">{item.recommendedAction}</td></tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}
