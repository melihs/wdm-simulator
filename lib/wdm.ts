// WDM çoğullama: ITU-T grid kanal planı ve bileşik optik spektrum

import { SystemConfig } from "./config";
import { freqThzToWavelengthNm, gaussian, linspace } from "./math";

export interface WdmChannel {
  index: number;
  freqTHz: number;
  wavelengthNm: number;
  label: string; // ITU-T kanal etiketi (yaklaşık)
}

/** Merkez frekans etrafında simetrik kanal planı üretir. */
export function buildChannelPlan(cfg: SystemConfig): WdmChannel[] {
  const spacingTHz = cfg.channelSpacingGHz / 1000;
  const channels: WdmChannel[] = [];
  // Kanalları merkeze göre simetrik yerleştir
  const offset = (cfg.numChannels - 1) / 2;
  for (let i = 0; i < cfg.numChannels; i++) {
    const freqTHz = cfg.centerFreqTHz + (i - offset) * spacingTHz;
    const wavelengthNm = freqThzToWavelengthNm(freqTHz);
    // ITU-T C-bant kanal numarası: C = (f - 190.0 THz)/0.1 THz * ... yaklaşık
    const ituCh = Math.round((freqTHz - 190.0) / 0.1);
    channels.push({
      index: i,
      freqTHz: +freqTHz.toFixed(4),
      wavelengthNm: +wavelengthNm.toFixed(3),
      label: `C${ituCh}`,
    });
  }
  return channels;
}

export interface Spectrum {
  freqTHz: number[];
  wavelengthNm: number[];
  /** her kanalın ayrı spektrumu (dB) — üst üste çizim için */
  channelDb: number[][];
  /** bileşik (toplam) spektrum (dB) */
  compositeDb: number[];
}

/**
 * Her kanalı modülasyon bant genişliğine göre Gauss zarflı modeller,
 * bileşik spektrumu kanalların güç toplamı olarak verir.
 */
export function buildSpectrum(cfg: SystemConfig, points = 1200): Spectrum {
  const channels = buildChannelPlan(cfg);
  const spacingTHz = cfg.channelSpacingGHz / 1000;
  const margin = spacingTHz * 1.5;
  const fMin = channels[0].freqTHz - margin;
  const fMax = channels[channels.length - 1].freqTHz + margin;
  const freqTHz = linspace(fMin, fMax, points);
  const wavelengthNm = freqTHz.map(freqThzToWavelengthNm);

  // NRZ ana lob genişliği ~ 2·Rb ; sigma'yı bunun bir kısmı al
  const rbTHz = cfg.bitRateGbps / 1000;
  const sigma = (cfg.modulation === "RZ-OOK" ? 1.4 : 1.0) * rbTHz * 0.6;
  const floorDb = -45;

  const channelDb: number[][] = [];
  const compositeLin = new Array(points).fill(0);

  for (const ch of channels) {
    const lin = freqTHz.map((f) => gaussian(f, ch.freqTHz, sigma));
    channelDb.push(lin.map((v) => Math.max(floorDb, 10 * Math.log10(v + 1e-6))));
    for (let i = 0; i < points; i++) compositeLin[i] += lin[i];
  }
  const compositeDb = compositeLin.map((v) =>
    Math.max(floorDb, 10 * Math.log10(v + 1e-6))
  );

  return { freqTHz, wavelengthNm, channelDb, compositeDb };
}
