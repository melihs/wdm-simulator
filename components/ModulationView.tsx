"use client";

import type { Data } from "plotly.js";
import Plot from "./Plot";
import { ModulationResult, EyeDiagram } from "@/lib/modulation";
import { useLang } from "@/lib/langContext";

interface Props {
  mod: ModulationResult;
  eye: EyeDiagram;
}

export default function ModulationView({ mod, eye }: Props) {
  const { t } = useLang();

  const waveData: Data[] = [
    {
      x: mod.time,
      y: mod.ideal,
      type: "scatter",
      mode: "lines",
      line: { color: "#cbd5e1", width: 1.5, shape: "hv" },
      name: t.idealTrace,
    },
    {
      x: mod.time,
      y: mod.received,
      type: "scatter",
      mode: "lines",
      line: { color: "#2563eb", width: 2 },
      name: t.receivedTrace,
    },
  ];

  const annotations = mod.bits.map((b, i) => ({
    x: (i + 0.5) * mod.bitPeriodNs,
    y: 1.12,
    text: String(b),
    showarrow: false,
    font: { size: 10, color: "#64748b" },
  }));

  const eyeData: Data[] = eye.segments.map((seg, i) => ({
    x: eye.x,
    y: seg,
    type: "scatter",
    mode: "lines",
    line: { color: "rgba(37,99,235,0.35)", width: 1 },
    hoverinfo: "skip" as const,
    showlegend: false,
    name: `seg${i}`,
  }));

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div>
        <p className="mb-1 text-sm font-medium text-slate-600">{t.timeDomainWaveform}</p>
        <Plot
          data={waveData}
          height={260}
          layout={{
            xaxis: { title: { text: t.timeAxis } },
            yaxis: { title: { text: t.amplitude }, range: [-0.15, 1.25] },
            annotations,
            showlegend: true,
            legend: { orientation: "h", y: -0.3 },
          }}
        />
      </div>
      <div>
        <p className="mb-1 text-sm font-medium text-slate-600">{t.eyeDiagram}</p>
        <Plot
          data={eyeData}
          height={260}
          layout={{
            xaxis: { title: { text: t.bitPeriod }, range: [0, 2] },
            yaxis: { title: { text: t.amplitude }, range: [-0.2, 1.3] },
          }}
        />
      </div>
    </div>
  );
}
