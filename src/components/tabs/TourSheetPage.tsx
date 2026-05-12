import { mockDrivers } from "../../data/mockDrivers";
import { mockFlights } from "../../data/mockFlights";
import { Panel } from "../ui/Panel";

export function TourSheetPage() {
  const rows = mockDrivers.slice(0, 10).map((driver) => ({ driver, flights: mockFlights.filter((flight) => flight.driverId === driver.id && flight.serviceType !== "break") }));
  return (
    <div className="space-y-5">
      <div className="no-print"><h2 className="text-2xl font-semibold tracking-tight text-ink">Tour Sheet</h2><p className="mt-1 text-sm text-slate-500">Printable-looking operational dispatch sheet using mock assignments.</p></div>
      <Panel className="print-surface overflow-hidden bg-white">
        <div className="border-b border-slate-200 px-6 py-5"><h2 className="text-xl font-bold tracking-tight text-ink">ORD Catering Dispatch Tour Sheet</h2><p className="mt-1 text-sm text-slate-500">Friday, Jan 23, 2026 · Morning bank</p></div>
        <table className="w-full border-collapse text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="border-b border-slate-200 px-4 py-3">Driver</th><th className="border-b border-slate-200 px-4 py-3">Truck</th><th className="border-b border-slate-200 px-4 py-3">Radio</th><th className="border-b border-slate-200 px-4 py-3">Leave</th><th className="border-b border-slate-200 px-4 py-3">Flights Assigned</th><th className="border-b border-slate-200 px-4 py-3">Gate</th><th className="border-b border-slate-200 px-4 py-3">Return</th></tr></thead><tbody>{rows.map(({ driver, flights }) => <tr key={driver.id} className="align-top odd:bg-white even:bg-slate-50/60"><td className="border-b border-slate-100 px-4 py-3 font-semibold text-ink">{driver.name}</td><td className="border-b border-slate-100 px-4 py-3">{driver.truck}</td><td className="border-b border-slate-100 px-4 py-3">{driver.radio}</td><td className="border-b border-slate-100 px-4 py-3">{flights[0]?.start ?? driver.shiftStart}</td><td className="border-b border-slate-100 px-4 py-3 text-slate-700">{flights.map((flight) => flight.flightNumber).join(", ") || "Open"}</td><td className="border-b border-slate-100 px-4 py-3 text-slate-700">{flights.map((flight) => flight.gate).join(", ") || "-"}</td><td className="border-b border-slate-100 px-4 py-3">{flights.length > 0 ? flights[flights.length - 1].end : driver.shiftEnd}</td></tr>)}</tbody></table>
      </Panel>
    </div>
  );
}
