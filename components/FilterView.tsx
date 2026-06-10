"use client";

import type { Data } from "plotly.js";
import Plot from "./Plot";
import { FilterResult } from "@/lib/filter";
import { useLang } from "@/lib/langContext";

interface Props {
  filter: FilterResult;
}

export default function FilterView({ filter }: Props) {
  const { t } = useLang();

  const data: Data[] = [
    {
      x: filter.freqTHz,
      y: filter.responseDb,
      type: "scatter",
      mode: "lines",
      line: { color: "#9333ea", width: 2 },
      fill: "tozeroy",
      fillcolor: "rgba(147,51,234,0.07)",
      name: t.demuxFilterTrace,
    },
  ];

  return (
    <div>
      <Plot
        data={data}
        height={280}
        layout={{
          xaxis: { title: { text: t.freqAxis } },
          yaxis: { title: { text: "|H(f)|² (dB)" }, range: [-50, 3] },
          shapes: [
            {
              type: "line",
              x0: filter.freqTHz[0],
              x1: filter.freqTHz[filter.freqTHz.length - 1],
              y0: -3,
              y1: -3,
              line: { color: "#f43f5e", width: 1, dash: "dot" },
            },
          ],
          annotations: [
            {
              x: filter.centerFreqTHz,
              y: -3,
              text: "−3 dB",
              showarrow: false,
              yshift: 10,
              font: { size: 10, color: "#f43f5e" },
            },
          ],
        }}
      />
      <p className="mt-2 text-center text-xs text-slate-500">
        {t.filterFooter(filter.selectedLabel, filter.adjacentSuppressionDb)}
      </p>
    </div>
  );
}
