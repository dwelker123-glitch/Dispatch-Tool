import { useState } from "react";
import { AppShell } from "./components/layout/AppShell";
import { DashboardPage } from "./components/tabs/DashboardPage";
import { DispatchToolPage } from "./components/tabs/DispatchToolPage";
import { ExceptionsPage } from "./components/tabs/ExceptionsPage";
import { FleetPage } from "./components/tabs/FleetPage";
import { PlanningToolPage } from "./components/tabs/PlanningToolPage";
import { StaffingPage } from "./components/tabs/StaffingPage";
import { ThumbRulesPage } from "./components/tabs/ThumbRulesPage";
import { TourSheetPage } from "./components/tabs/TourSheetPage";
import { DispatcherTimeline } from "./components/timeline/DispatcherTimeline";
import { mockFlights } from "./data/mockFlights";
import type { AirportCode, AppTab, FlightAssignment } from "./types/dispatch";

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>("planning");
  const [activeAirport, setActiveAirport] = useState<AirportCode>("ORD");
  const [scheduleFlights, setScheduleFlights] = useState<FlightAssignment[]>(mockFlights);
  const [importedFileName, setImportedFileName] = useState<string>();
  const visibleFlights = scheduleFlights.filter((flight) => (flight.originAirport ?? "ORD") === activeAirport);

  function handleScheduleImport(flights: FlightAssignment[], fileName: string) {
    setScheduleFlights(flights);
    setImportedFileName(fileName);
    const firstImportedAirport = flights.find((flight) => flight.originAirport)?.originAirport;
    if (firstImportedAirport) setActiveAirport(firstImportedAirport);
    setActiveTab("planning");
  }

  return (
    <AppShell
      activeTab={activeTab}
      activeAirport={activeAirport}
      importedFileName={importedFileName}
      importedFlightCount={scheduleFlights.length}
      visibleFlightCount={visibleFlights.length}
      onAirportChange={setActiveAirport}
      onScheduleImport={handleScheduleImport}
      onTabChange={setActiveTab}
    >
      {activeTab === "planning" && <PlanningToolPage flights={visibleFlights} />}
      {activeTab === "dispatch" && <DispatchToolPage flights={visibleFlights} />}
      {activeTab === "timeline" && <DispatcherTimeline flights={visibleFlights} />}
      {activeTab === "staffing" && <StaffingPage />}
      {activeTab === "fleet" && <FleetPage />}
      {activeTab === "exceptions" && <ExceptionsPage />}
      {activeTab === "tour-sheet" && <TourSheetPage />}
      {activeTab === "dashboard" && <DashboardPage />}
      {activeTab === "thumb-rules" && <ThumbRulesPage />}
    </AppShell>
  );
}
