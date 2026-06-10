"use client";

import type { Data } from "plotly.js";
import Plot from "./Plot";
import { Spectrum, WdmChannel } from "@/lib/wdm";

interface Props {
  spectrum: Spectrum;
  channels: WdmChannel[];
}

export default function SpectrumView({ spectrum, channels }: Props) {
  const data: Data[] = [
    {
      x: spectrum.freqTHz,
      y: spectrum.compositeDb,
      type: "scatter",
      mode: "lines",
      line: { color: "#0891b2", width: 2 },
      fill: "tozeroy",
      fillcolor: "rgba(8,145,178,0.08)",
      name: "Bileşik spektrum",
    },
  ];

  // Kanal merkez işaretleri
  const annotations = channels.map((ch) => ({
    x: ch.freqTHz,
    y: 2,
    text: ch.label,
    showarrow: false,
    font: { size: 9, color: "#0e7490" },
    textangle: "-90",
  }));

  return (
    <div>
      <Plot
        data={data}
        height={300}
        layout={{
          xaxis: { title: { text: "Frekans (THz)" } },
          yaxis: { title: { text: "Güç (dB)" }, range: [-46, 8] },
          annotations,
        }}
      />
      <p className="mt-2 text-center text-xs text-slate-500">
        {channels.length} kanal · {channels[0]?.wavelengthNm}–
        {channels[channels.length - 1]?.wavelengthNm} nm aralığı
      </p>
    </div>
  );
}
