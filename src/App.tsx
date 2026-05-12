import { useState } from "react";
import { AppShell } from "./components/layout/AppShell";
import { DashboardPage } from "./components/tabs/DashboardPage";
import { ExceptionsPage } from "./components/tabs/ExceptionsPage";
import { ThumbRulesPage } from "./components/tabs/ThumbRulesPage";
import { TourSheetPage } from "./components/tabs/TourSheetPage";
import { DispatcherTimeline } from "./components/timeline/DispatcherTimeline";
import type { AppTab } from "./types/dispatch";

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>("timeline");

  return (
    <AppShell activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "timeline" && <DispatcherTimeline />}
      {activeTab === "exceptions" && <ExceptionsPage />}
      {activeTab === "tour-sheet" && <TourSheetPage />}
      {activeTab === "dashboard" && <DashboardPage />}
      {activeTab === "thumb-rules" && <ThumbRulesPage />}
    </AppShell>
  );
}
