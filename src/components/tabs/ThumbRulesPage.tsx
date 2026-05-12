import { mockRules } from "../../data/mockRules";
import { Badge } from "../ui/Badge";
import { Panel } from "../ui/Panel";

export function ThumbRulesPage() {
  return (
    <div className="space-y-5">
      <div><h2 className="text-2xl font-semibold tracking-tight text-ink">Thumb Rules</h2><p className="mt-1 text-sm text-slate-500">Fake admin controls for the planning assumptions dispatchers review.</p></div>
      <div className="grid grid-cols-[1fr_360px] gap-5">
        <Panel className="overflow-hidden"><table className="w-full border-collapse text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Category</th><th className="px-5 py-3">Setting</th><th className="px-5 py-3">Value</th><th className="px-5 py-3">Control</th></tr></thead><tbody className="divide-y divide-slate-100">{mockRules.map((rule) => <tr key={rule.id}><td className="px-5 py-4"><Badge tone="blue">{rule.category}</Badge></td><td className="px-5 py-4 font-semibold text-ink">{rule.setting}</td><td className="px-5 py-4 text-slate-700">{rule.value}</td><td className="px-5 py-4"><input className="w-28 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm" defaultValue={rule.value} /></td></tr>)}</tbody></table></Panel>
        <Panel className="p-5"><h3 className="text-base font-semibold text-ink">Rule set status</h3><div className="mt-4 space-y-4"><label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"><span className="font-medium text-slate-700">Protect lunch windows</span><input type="checkbox" defaultChecked className="h-4 w-4 accent-blue-600" /></label><label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"><span className="font-medium text-slate-700">Warn on overtime</span><input type="checkbox" defaultChecked className="h-4 w-4 accent-blue-600" /></label></div></Panel>
      </div>
    </div>
  );
}
