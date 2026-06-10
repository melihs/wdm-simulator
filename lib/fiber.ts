// Fiber linki: zayıflama ve kromatik dispersiyon kaynaklı darbe genişlemesi

import { C_LIGHT } from "./math";
import { SystemConfig } from "./config";

export interface FiberResult {
  /** Toplam zayıflama (dB) */
  totalLossDb: number;
  /** Fiber çıkış gücü (dBm), EDFA öncesi */
  outputPowerDbm: number;
  /** Sinyalin spektral genişliği (nm) */
  spectralWidthNm: number;
  /** Dispersiyon kaynaklı darbe genişlemesi (ps) */
  broadeningPs: number;
  /** Genişlemenin bit periyoduna oranı (göz kapanma göstergesi) */
  broadeningFracBit: number;
}

export function analyzeFiber(cfg: SystemConfig): FiberResult {
  const totalLossDb = cfg.attenuationDbPerKm * cfg.fiberLengthKm;
  const outputPowerDbm = cfg.txPowerDbm - totalLossDb;

  const lambdaM = 1550e-9;
  // Δλ ≈ λ²/c · Δf,  Δf ≈ Rb
  const spectralWidthNm =
    ((lambdaM ** 2 / C_LIGHT) * (cfg.bitRateGbps * 1e9)) * 1e9;

  const broadeningPs =
    cfg.dispersionPsNmKm * cfg.fiberLengthKm * spectralWidthNm;
  const bitPeriodPs = (1 / cfg.bitRateGbps) * 1000;
  const broadeningFracBit = broadeningPs / bitPeriodPs;

  return {
    totalLossDb: +totalLossDb.toFixed(2),
    outputPowerDbm: +outputPowerDbm.toFixed(2),
    spectralWidthNm: +spectralWidthNm.toFixed(4),
    broadeningPs: +broadeningPs.toFixed(2),
    broadeningFracBit: +broadeningFracBit.toFixed(3),
  };
}
