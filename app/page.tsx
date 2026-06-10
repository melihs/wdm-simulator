"use client";

import { useMemo, useState } from "react";
import { DEFAULT_CONFIG, SystemConfig } from "@/lib/config";
import { runSimulation } from "@/lib/simulation";
import { LangProvider, useLang } from "@/lib/langContext";
import ParameterPanel from "@/components/ParameterPanel";
import Section from "@/components/Section";
import BlockDiagram from "@/components/BlockDiagram";
import ModulationView from "@/components/ModulationView";
import SpectrumView from "@/components/SpectrumView";
import EdfaLinkView from "@/components/EdfaLinkView";
import FilterView from "@/components/FilterView";
import PerformanceView from "@/components/PerformanceView";

function AppContent() {
  const { lang, setLang, t } = useLang();
  const [cfg, setCfg] = useState<SystemConfig>(DEFAULT_CONFIG);
  const sim = useMemo(() => runSimulation(cfg), [cfg]);

  const onChange = (patch: Partial<SystemConfig>) =>
    setCfg((c) => ({ ...c, ...patch }));

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 lg:px-8">
      <header className="mb-6 flex items-center justify-between rounded-xl bg-gradient-to-r from-slate-800 to-sky-900 px-6 py-5 text-white shadow">
        <h1 className="text-xl font-bold lg:text-2xl">{t.appTitle}</h1>
        <button
          onClick={() => setLang(lang === "tr" ? "en" : "tr")}
          className="shrink-0 rounded-lg border border-white/30 px-3 py-1.5 text-sm font-medium text-white/90 transition hover:bg-white/10"
        >
          {lang === "tr" ? "🇬🇧 EN" : "🇹🇷 TR"}
        </button>
      </header>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <ParameterPanel
              cfg={cfg}
              onChange={onChange}
              onReset={() => setCfg(DEFAULT_CONFIG)}
            />
          </div>
        </aside>

        <main className="space-y-6">
          <Section title={t.blockDiagramTitle} subtitle={t.blockDiagramSubtitle} badge={t.badgeDesign}>
            <BlockDiagram numChannels={cfg.numChannels} fiberLengthKm={cfg.fiberLengthKm} />
          </Section>

          <Section title={t.sec1Title} subtitle={t.sec1Subtitle(cfg.modulation, cfg.bitRateGbps)} badge={t.badgePrimary}>
            <ModulationView mod={sim.modulation} eye={sim.eye} />
          </Section>

          <Section title={t.sec2Title} subtitle={t.sec2Subtitle(cfg.numChannels, cfg.channelSpacingGHz)} badge={t.badgePrimary}>
            <SpectrumView spectrum={sim.spectrum} channels={sim.channels} />
          </Section>

          <Section title={t.sec3Title} subtitle={t.sec3Subtitle}>
            <EdfaLinkView linkBudget={sim.linkBudget} edfa={sim.edfa} />
          </Section>

          <Section title={t.sec4Title} subtitle={t.sec4Subtitle(cfg.filterBandwidthGHz)}>
            <FilterView filter={sim.filter} />
          </Section>

          <Section title={t.sec5Title} subtitle={t.sec5Subtitle}>
            <PerformanceView perf={sim.performance} />
          </Section>
        </main>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <LangProvider>
      <AppContent />
    </LangProvider>
  );
}
