"use client";

import { SystemConfig, ModulationType } from "@/lib/config";
import { useLang } from "@/lib/langContext";

interface Props {
  cfg: SystemConfig;
  onChange: (patch: Partial<SystemConfig>) => void;
  onReset: () => void;
}

function Slider({
  label, value, min, max, step, unit, onChange,
}: {
  label: string; value: number; min: number; max: number; step: number; unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-slate-600">{label}</span>
        <span className="font-medium text-slate-900">
          {value} <span className="text-slate-400">{unit}</span>
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-sky-600"
      />
    </label>
  );
}

export default function ParameterPanel({ cfg, onChange, onReset }: Props) {
  const { t } = useLang();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          {t.systemParams}
        </h2>
        <button
          onClick={onReset}
          className="cursor-pointer rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-500 hover:bg-slate-100"
        >
          {t.reset}
        </button>
      </div>

      <div className="space-y-4">
        <div className="text-xs font-semibold uppercase text-sky-600">{t.modulationSection}</div>
        <label className="block">
          <span className="mb-1 block text-sm text-slate-600">{t.modulationType}</span>
          <select
            value={cfg.modulation}
            onChange={(e) => onChange({ modulation: e.target.value as ModulationType })}
            className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm text-slate-500"
          >
            <option value="NRZ-OOK">NRZ-OOK</option>
            <option value="RZ-OOK">RZ-OOK</option>
          </select>
        </label>
        <Slider label={t.bitRate} value={cfg.bitRateGbps} min={2.5} max={40} step={2.5} unit="Gb/s" onChange={(v) => onChange({ bitRateGbps: v })} />
        <Slider label={t.txPower} value={cfg.txPowerDbm} min={-6} max={6} step={1} unit="dBm" onChange={(v) => onChange({ txPowerDbm: v })} />
      </div>

      <div className="space-y-4 border-t border-slate-100 pt-4">
        <div className="text-xs font-semibold uppercase text-cyan-600">{t.wdmSection}</div>
        <Slider label={t.numChannels} value={cfg.numChannels} min={2} max={16} step={1} unit="" onChange={(v) => onChange({ numChannels: v, selectedChannel: Math.min(cfg.selectedChannel, v - 1) })} />
        <Slider label={t.channelSpacing} value={cfg.channelSpacingGHz} min={25} max={200} step={25} unit="GHz" onChange={(v) => onChange({ channelSpacingGHz: v })} />
        <Slider label={t.selectedChannel} value={cfg.selectedChannel} min={0} max={cfg.numChannels - 1} step={1} unit="" onChange={(v) => onChange({ selectedChannel: v })} />
      </div>

      <div className="space-y-4 border-t border-slate-100 pt-4">
        <div className="text-xs font-semibold uppercase text-green-600">{t.fiberEdfaSection}</div>
        <Slider label={t.fiberLength} value={cfg.fiberLengthKm} min={10} max={200} step={10} unit="km" onChange={(v) => onChange({ fiberLengthKm: v })} />
        <Slider label={t.dispersion} value={cfg.dispersionPsNmKm} min={0} max={20} step={1} unit="ps/nm·km" onChange={(v) => onChange({ dispersionPsNmKm: v })} />
        <Slider label={t.edfaGain} value={cfg.edfaGainDb} min={0} max={30} step={1} unit="dB" onChange={(v) => onChange({ edfaGainDb: v })} />
        <Slider label={t.edfaNf} value={cfg.edfaNfDb} min={3} max={9} step={0.5} unit="dB" onChange={(v) => onChange({ edfaNfDb: v })} />
      </div>

      <div className="space-y-4 border-t border-slate-100 pt-4">
        <div className="text-xs font-semibold uppercase text-purple-600">{t.demuxSection}</div>
        <Slider label={t.filterBw} value={cfg.filterBandwidthGHz} min={10} max={100} step={5} unit="GHz" onChange={(v) => onChange({ filterBandwidthGHz: v })} />
        <Slider label={t.filterOrder} value={cfg.filterOrder} min={1} max={6} step={1} unit="" onChange={(v) => onChange({ filterOrder: v })} />
      </div>
    </div>
  );
}
