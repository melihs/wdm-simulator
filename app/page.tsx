"use client";

import { useMemo, useState } from "react";
import { DEFAULT_CONFIG, SystemConfig } from "@/lib/config";
import { runSimulation } from "@/lib/simulation";
import ParameterPanel from "@/components/ParameterPanel";
import Section from "@/components/Section";
import BlockDiagram from "@/components/BlockDiagram";
import ModulationView from "@/components/ModulationView";
import SpectrumView from "@/components/SpectrumView";
import EdfaLinkView from "@/components/EdfaLinkView";
import FilterView from "@/components/FilterView";
import PerformanceView from "@/components/PerformanceView";

export default function Page() {
  const [cfg, setCfg] = useState<SystemConfig>(DEFAULT_CONFIG);
  const sim = useMemo(() => runSimulation(cfg), [cfg]);

  const onChange = (patch: Partial<SystemConfig>) =>
    setCfg((c) => ({ ...c, ...patch }));

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 lg:px-8">
      {/* Başlık */}
      <header className="mb-6 rounded-xl bg-gradient-to-r from-slate-800 to-sky-900 px-6 py-5 text-white shadow">
        <h1 className="text-xl font-bold lg:text-2xl">
          WDM Optik Haberleşme Sistemi — İnteraktif Simülasyon
        </h1>
      </header>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* Sol panel: parametreler */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <ParameterPanel
              cfg={cfg}
              onChange={onChange}
              onReset={() => setCfg(DEFAULT_CONFIG)}
            />
          </div>
        </aside>

        {/* Sağ içerik */}
        <main className="space-y-6">
          <Section
            title="Sistem Blok Şeması"
            subtitle="Verici → WDM MUX → Fiber → EDFA → DEMUX → Alıcı"
            badge="Tasarım"
          >
            <BlockDiagram numChannels={cfg.numChannels} fiberLengthKm={cfg.fiberLengthKm} />
          </Section>

          <Section
            title="1 · Modülasyon"
            subtitle={`${cfg.modulation} · ${cfg.bitRateGbps} Gb/s — dalga formu ve göz diyagramı`}
            badge="Ana yapı"
          >
            <ModulationView mod={sim.modulation} eye={sim.eye} />
          </Section>

          <Section
            title="2 · WDM Çoğullama"
            subtitle={`${cfg.numChannels} kanal · ${cfg.channelSpacingGHz} GHz aralık — bileşik spektrum`}
            badge="Ana yapı"
          >
            <SpectrumView spectrum={sim.spectrum} channels={sim.channels} />
          </Section>

          <Section
            title="3 · Kuvvetlendirme (EDFA)"
            subtitle="Güç bütçesi ve OSNR analizi"
          >
            <EdfaLinkView linkBudget={sim.linkBudget} edfa={sim.edfa} />
          </Section>

          <Section
            title="4 · Filtreleme (DEMUX)"
            subtitle={`Süper-Gauss optik filtre · ${cfg.filterBandwidthGHz} GHz`}
          >
            <FilterView filter={sim.filter} />
          </Section>

          <Section
            title="5 · Performans Analizi"
            subtitle="OSNR → Q-faktör → BER"
          >
            <PerformanceView perf={sim.performance} />
          </Section>
        </main>
      </div>
    </div>
  );
}
