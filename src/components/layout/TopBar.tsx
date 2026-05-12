import { Users, Truck, Activity } from "lucide-react";
import { airportOptions } from "../../data/airports";
import { ScheduleImporter } from "../import/ScheduleImporter";
import { KpiCard } from "../ui/KpiCard";
import type { AirportCode, FlightAssignment } from "../../types/dispatch";

type TopBarProps = {
  activeAirport: AirportCode;
  importedFileName?: string;
  importedFlightCount?: number;
  visibleFlightCount: number;
  onAirportChange: (airport: AirportCode) => void;
  onScheduleImport: (flights: FlightAssignment[], fileName: string) => void;
};

export function TopBar({ activeAirport, importedFileName, importedFlightCount, visibleFlightCount, onAirportChange, onScheduleImport }: TopBarProps) {
  const scheduleLabel = importedFileName
    ? `Active Schedule: ${importedFileName} · ${visibleFlightCount} ${activeAirport} flights shown of ${importedFlightCount} loaded`
    : `Active Schedule: Sample ${activeAirport} flight schedule`;

  return (
    <header className="no-print border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur">
      <div className="mb-4 flex items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-ink">Driver Pairing Planner</h1>
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-sm font-medium text-slate-500">{activeAirport}</span>
          </div>
          <p className="mt-1 text-sm text-slate-500">{scheduleLabel}</p>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <KpiCard label="Drivers Required" value="24" icon={<Users size={19} />} />
          <KpiCard label="Max Trucks Needed" value="18" icon={<Truck size={19} />} />
          <KpiCard label="Flights Covered" value="156" icon={<Activity size={19} />} />
          <KpiCard label="Avg Utilization" value="71%" icon={<Activity size={19} />} />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm">
          Airport
          <select
            value={activeAirport}
            onChange={(event) => onAirportChange(event.target.value as AirportCode)}
            className="bg-transparent text-sm font-semibold text-ink outline-none"
          >
            {airportOptions.map((airport) => <option key={airport} value={airport}>{airport}</option>)}
          </select>
        </label>
        <ScheduleImporter onImport={onScheduleImport} />
      </div>
    </header>
  );
}
