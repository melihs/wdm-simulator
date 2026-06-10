"use client";

import type { Data } from "plotly.js";
import Plot from "./Plot";
import { EdfaResult, LinkBudgetRow } from "@/lib/edfa";

interface Props {
  linkBudget: LinkBudgetRow[];
  edfa: EdfaResult;
}

export default function EdfaLinkView({ linkBudget, edfa }: Props) {
  const data: Data[] = [
    {
      x: linkBudget.map((r) => r.stage),
      y: linkBudget.map((r) => r.powerDbm),
      type: "scatter",
      mode: "lines+markers",
      line: { color: "#f59e0b", width: 2, shape: "hv" },
      marker: { size: 9, color: "#d97706" },
      name: "Güç (dBm)",
    },
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div>
        <p className="mb-1 text-sm font-medium text-slate-600">Güç bütçesi profili</p>
        <Plot
          data={data}
          height={260}
          layout={{
            xaxis: { automargin: true },
            yaxis: { title: { text: "Güç (dBm)" } },
          }}
        />
      </div>
      <div className="self-center">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="py-2">Aşama</th>
              <th className="py-2 text-right">Güç (dBm)</th>
              <th className="py-2">Açıklama</th>
            </tr>
          </thead>
          <tbody>
            {linkBudget.map((r) => (
              <tr key={r.stage} className="border-b border-slate-100">
                <td className="py-2 text-slate-700">{r.stage}</td>
                <td className="py-2 text-right font-medium text-slate-900">{r.powerDbm}</td>
                <td className="py-2 text-xs text-slate-500">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
            <div className="text-xs text-slate-500">EDFA sonrası OSNR</div>
            <div className="mt-0.5 text-base font-semibold text-amber-700">{edfa.osnrDb} dB</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="text-xs text-slate-500">Net link dengesi</div>
            <div className="mt-0.5 text-base font-semibold text-slate-800">{edfa.netLinkDb} dB</div>
          </div>
        </div>
      </div>
    </div>
  );
}
