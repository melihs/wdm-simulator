"use client";

import type { Data } from "plotly.js";
import Plot from "./Plot";
import { EdfaResult, LinkBudgetRow } from "@/lib/edfa";
import { useLang } from "@/lib/langContext";

interface Props {
  linkBudget: LinkBudgetRow[];
  edfa: EdfaResult;
}

export default function EdfaLinkView({ linkBudget, edfa }: Props) {
  const { t } = useLang();

  function stageLabel(r: LinkBudgetRow): string {
    if (r.key === "tx") return t.stageTx;
    if (r.key === "fiber_out") return t.stageFiber(r.fiberLengthKm);
    return t.stageEdfa;
  }

  function noteLabel(r: LinkBudgetRow): string {
    if (r.key === "tx") return t.noteTx;
    if (r.key === "fiber_out") return t.noteFiber(r.lossDb);
    return t.noteEdfa(r.gainDb, r.nfDb);
  }

  const data: Data[] = [
    {
      x: linkBudget.map(stageLabel),
      y: linkBudget.map((r) => r.powerDbm),
      type: "scatter",
      mode: "lines+markers",
      line: { color: "#f59e0b", width: 2, shape: "hv" },
      marker: { size: 9, color: "#d97706" },
      name: t.colPower,
    },
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div>
        <p className="mb-1 text-sm font-medium text-slate-600">{t.powerBudgetProfile}</p>
        <Plot
          data={data}
          height={260}
          layout={{
            xaxis: { automargin: true },
            yaxis: { title: { text: t.colPower } },
          }}
        />
      </div>
      <div className="self-center">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="py-2">{t.colStage}</th>
              <th className="py-2 text-right">{t.colPower}</th>
              <th className="py-2">{t.colDesc}</th>
            </tr>
          </thead>
          <tbody>
            {linkBudget.map((r) => (
              <tr key={r.key} className="border-b border-slate-100">
                <td className="py-2 text-slate-700">{stageLabel(r)}</td>
                <td className="py-2 text-right font-medium text-slate-900">{r.powerDbm}</td>
                <td className="py-2 text-xs text-slate-500">{noteLabel(r)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
            <div className="text-xs text-slate-500">{t.osnrAfterEdfa}</div>
            <div className="mt-0.5 text-base font-semibold text-amber-700">{edfa.osnrDb} dB</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="text-xs text-slate-500">{t.netLinkBalance}</div>
            <div className="mt-0.5 text-base font-semibold text-slate-800">{edfa.netLinkDb} dB</div>
          </div>
        </div>
      </div>
    </div>
  );
}
