import { AlertTriangle, Clock, Truck } from "lucide-react";
import { mockExceptions } from "../../data/mockExceptions";
import { Badge } from "../ui/Badge";
import { Panel } from "../ui/Panel";

function severityTone(severity: string) {
  if (severity === "High") return "red";
  if (severity === "Medium") return "orange";
  return "blue";
}

export function ExceptionsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-ink">Exceptions</h2>
        <p className="mt-1 text-sm text-slate-500">Mock operational issues for dispatcher review.</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Panel className="p-4"><div className="flex items-center gap-3"><AlertTriangle className="text-red-500" size={21} /><div><p className="text-sm text-slate-500">High priority</p><p className="text-2xl font-semibold text-ink">2</p></div></div></Panel>
        <Panel className="p-4"><div className="flex items-center gap-3"><Clock className="text-amber-500" size={21} /><div><p className="text-sm text-slate-500">Late load risk</p><p className="text-2xl font-semibold text-ink">1</p></div></div></Panel>
        <Panel className="p-4"><div className="flex items-center gap-3"><Truck className="text-blue-500" size={21} /><div><p className="text-sm text-slate-500">Truck conflicts</p><p className="text-2xl font-semibold text-ink">1</p></div></div></Panel>
      </div>
      <Panel className="overflow-hidden">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Type</th><th className="px-5 py-3">Severity</th><th className="px-5 py-3">Owner</th><th className="px-5 py-3">Time</th><th className="px-5 py-3">Detail</th></tr></thead>
          <tbody className="divide-y divide-slate-100">{mockExceptions.map((item) => <tr key={item.id} className="bg-white"><td className="px-5 py-4 font-semibold text-ink">{item.type}</td><td className="px-5 py-4"><Badge tone={severityTone(item.severity)}>{item.severity}</Badge></td><td className="px-5 py-4 text-slate-700">{item.owner}</td><td className="px-5 py-4 text-slate-700">{item.time}</td><td className="px-5 py-4 text-slate-600">{item.detail}</td></tr>)}</tbody>
        </table>
      </Panel>
    </div>
  );
}
