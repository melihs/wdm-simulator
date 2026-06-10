"use client";

import dynamic from "next/dynamic";
import type { Data, Layout, Config } from "plotly.js";

const ReactPlotly = dynamic(() => import("react-plotly.js"), { ssr: false });

const BASE_LAYOUT: Partial<Layout> = {
  paper_bgcolor: "rgba(0,0,0,0)",
  plot_bgcolor: "rgba(255,255,255,1)",
  font: { family: "Inter, Arial, sans-serif", size: 12, color: "#1e293b" },
  margin: { l: 60, r: 20, t: 36, b: 48 },
  showlegend: false,
};

const BASE_CONFIG: Partial<Config> = {
  displayModeBar: false,
  responsive: true,
};

interface PlotProps {
  data: Data[];
  layout?: Partial<Layout>;
  height?: number;
}

export default function Plot({ data, layout, height = 320 }: PlotProps) {
  return (
    <div style={{ width: "100%", height }}>
      <ReactPlotly
        data={data}
        layout={{ ...BASE_LAYOUT, ...layout, autosize: true }}
        config={BASE_CONFIG}
        useResizeHandler
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
