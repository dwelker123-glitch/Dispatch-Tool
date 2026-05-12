import { useState } from "react";
import { AppShell } from "./components/layout/AppShell";
import { DashboardPage } from "./components/tabs/DashboardPage";
import { DispatchToolPage } from "./components/tabs/DispatchToolPage";
import { ExceptionsPage } from "./components/tabs/ExceptionsPage";
import { PlanningToolPage } from "./components/tabs/PlanningToolPage";
import { ThumbRulesPage } from "./components/tabs/ThumbRulesPage";
import { TourSheetPage } from "./components/tabs/TourSheetPage";
import { DispatcherTimeline } from "./components/timeline/DispatcherTimeline";
import type { AppTab } from "./types/dispatch";

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>("planning");

  return (
    <AppShell activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "planning" && <PlanningToolPage />}
      {activeTab === "dispatch" && <DispatchToolPage />}
      {activeTab === "timeline" && <DispatcherTimeline />}
      {activeTab === "exceptions" && <ExceptionsPage />}
      {activeTab === "tour-sheet" && <TourSheetPage />}
      {activeTab === "dashboard" && <DashboardPage />}
      {activeTab === "thumb-rules" && <ThumbRulesPage />}
    </AppShell>
  );
}
