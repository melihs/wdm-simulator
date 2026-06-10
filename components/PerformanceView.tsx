"use client";

import type { Data } from "plotly.js";
import Plot from "./Plot";
import { PerformanceResult, formatBer } from "@/lib/ber";

interface Props {
  perf: PerformanceResult;
}

export default function PerformanceView({ perf }: Props) {
  const data: Data[] = [
    {
      x: perf.sweepOsnrDb,
      y: perf.sweepBer,
      type: "scatter",
      mode: "lines",
      line: { color: "#dc2626", width: 2 },
      name: "BER eğrisi",
    },
    {
      x: [perf.effectiveOsnrDb],
      y: [Math.max(perf.ber, 1e-30)],
      type: "scatter",
      mode: "markers",
      marker: { color: "#1d4ed8", size: 11, symbol: "circle" },
      name: "Çalışma noktası",
    },
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Plot
          data={data}
          height={300}
          layout={{
            xaxis: { title: { text: "OSNR (dB)" } },
            yaxis: {
              title: { text: "BER" },
              type: "log",
              range: [-15, 0],
              exponentformat: "power",
            },
            shapes: [
              {
                type: "line",
                x0: 6,
                x1: 30,
                y0: Math.log10(1e-9),
                y1: Math.log10(1e-9),
                line: { color: "#16a34a", width: 1, dash: "dash" },
              },
            ],
            annotations: [
              {
                x: 28,
                y: Math.log10(1e-9),
                text: "FEC eşiği 1e-9",
                showarrow: false,
                yshift: 10,
                font: { size: 10, color: "#16a34a" },
              },
            ],
            showlegend: true,
            legend: { orientation: "h", y: -0.28 },
          }}
        />
      </div>
      <div className="grid grid-cols-2 gap-3 self-center lg:grid-cols-1">
        <Metric label="OSNR (link)" value={`${perf.osnrDb} dB`} />
        <Metric label="Dispersiyon cezası" value={`${perf.penaltyDb} dB`} />
        <Metric label="Q-faktör" value={`${perf.qFactor} (${perf.qDb} dB)`} />
        <Metric
          label="BER (çalışma)"
          value={formatBer(perf.ber)}
          accent={perf.ber < 1e-9}
        />
      </div>
    </div>
  );
}

function Metric({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div
      className={`rounded-lg border p-3 ${
        accent ? "border-green-200 bg-green-50" : "border-slate-200 bg-slate-50"
      }`}
    >
      <div className="text-xs text-slate-500">{label}</div>
      <div className={`mt-0.5 text-base font-semibold ${accent ? "text-green-700" : "text-slate-800"}`}>
        {value}
      </div>
    </div>
  );
}
