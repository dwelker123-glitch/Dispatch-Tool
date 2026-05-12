import { mockDrivers } from "../../data/mockDrivers";
import { mockFlights } from "../../data/mockFlights";
import { mockHelpers, mockTrucks } from "../../data/mockResources";
import { createPlanningSchedule } from "../../engine/scheduler";
import { Panel } from "../ui/Panel";
import { ExceptionTable, PushTable, ScheduleSummaryCards } from "./scheduleUi";

export function PlanningToolPage() {
  const result = createPlanningSchedule(mockFlights, mockDrivers, mockHelpers, mockTrucks);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-ink">Planning Tool</h2>
        <p className="mt-1 text-sm text-slate-500">Pre-day recommended push plan using deterministic 5-minute scheduling rules.</p>
      </div>
      <ScheduleSummaryCards result={result} />
      <Panel className="p-5">
        <h3 className="text-base font-semibold text-ink">Planning Assumption</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">This run assumes enough drivers, helpers, and trucks are available. Flights are grouped when their load windows are close enough and workload stays within a simple push threshold.</p>
      </Panel>
      <PushTable result={result} />
      <ExceptionTable exceptions={result.exceptions} />
    </div>
  );
}
