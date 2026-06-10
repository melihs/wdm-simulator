// DEMUX optik filtre: süper-Gauss transfer fonksiyonu ve kanal seçiciliği

import { SystemConfig } from "./config";
import { buildChannelPlan } from "./wdm";
import { freqThzToWavelengthNm, linspace } from "./math";

/** Süper-Gauss |H(f)|² (dB): H = exp(-ln2 · (2(f-fc)/BW)^(2n)) */
function superGaussianDb(
  fThz: number,
  fcThz: number,
  bwGHz: number,
  order: number
): number {
  const bwTHz = bwGHz / 1000;
  const arg = (2 * (fThz - fcThz)) / bwTHz;
  const h = Math.exp(-Math.LN2 * Math.pow(arg * arg, order));
  return 10 * Math.log10(Math.max(h, 1e-9));
}

export interface FilterResult {
  freqTHz: number[];
  wavelengthNm: number[];
  /** DEMUX filtre yanıtı (dB) */
  responseDb: number[];
  /** referans için kanal spektrumları üst üste (dB) */
  centerFreqTHz: number;
  /** komşu kanal bastırması (dB, pozitif = bastırma miktarı) */
  adjacentSuppressionDb: number;
  /** seçili kanal etiketi */
  selectedLabel: string;
}

export function analyzeFilter(cfg: SystemConfig, points = 1200): FilterResult {
  const channels = buildChannelPlan(cfg);
  const sel = Math.min(cfg.selectedChannel, channels.length - 1);
  const fc = channels[sel].freqTHz;
  const spacingTHz = cfg.channelSpacingGHz / 1000;

  const fMin = fc - spacingTHz * 2;
  const fMax = fc + spacingTHz * 2;
  const freqTHz = linspace(fMin, fMax, points);
  const wavelengthNm = freqTHz.map(freqThzToWavelengthNm);
  const responseDb = freqTHz.map((f) =>
    superGaussianDb(f, fc, cfg.filterBandwidthGHz, cfg.filterOrder)
  );

  // Komşu kanal (bir spacing ötede) bastırması
  const adjacentSuppressionDb = -superGaussianDb(
    fc + spacingTHz,
    fc,
    cfg.filterBandwidthGHz,
    cfg.filterOrder
  );

  return {
    freqTHz,
    wavelengthNm,
    responseDb,
    centerFreqTHz: fc,
    adjacentSuppressionDb: +adjacentSuppressionDb.toFixed(1),
    selectedLabel: channels[sel].label,
  };
}
