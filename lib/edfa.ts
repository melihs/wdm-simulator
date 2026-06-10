// EDFA kuvvetlendirme: kazanç, çıkış gücü ve OSNR

import { SystemConfig } from "./config";
import { FiberResult } from "./fiber";

export interface EdfaResult {
  /** EDFA giriş gücü (dBm) = fiber çıkışı */
  inputPowerDbm: number;
  /** EDFA çıkış gücü (dBm) */
  outputPowerDbm: number;
  /** Tek aşama EDFA sonrası OSNR (dB), 0.1 nm referans */
  osnrDb: number;
  /** Toplam link kazancı dengesi (dB) */
  netLinkDb: number;
}

/**
 * Tek aşama EDFA OSNR yaklaşımı:
 *   OSNR(dB) ≈ 58 + P_in(dBm) − NF(dB)
 * 58 dB, 1550 nm'de 0.1 nm (12.5 GHz) referans bant için −10log10(h·ν·Δf) sabitidir.
 */
export function analyzeEdfa(cfg: SystemConfig, fiber: FiberResult): EdfaResult {
  const inputPowerDbm = fiber.outputPowerDbm;
  const outputPowerDbm = inputPowerDbm + cfg.edfaGainDb;
  const osnrDb = 58 + inputPowerDbm - cfg.edfaNfDb;
  const netLinkDb = cfg.edfaGainDb - fiber.totalLossDb;

  return {
    inputPowerDbm: +inputPowerDbm.toFixed(2),
    outputPowerDbm: +outputPowerDbm.toFixed(2),
    osnrDb: +osnrDb.toFixed(2),
    netLinkDb: +netLinkDb.toFixed(2),
  };
}

export type LinkBudgetKey = "tx" | "fiber_out" | "edfa_out";

export interface LinkBudgetRow {
  key: LinkBudgetKey;
  powerDbm: number;
  fiberLengthKm: number;
  lossDb: number;
  gainDb: number;
  nfDb: number;
}

/** Verici -> fiber -> EDFA boyunca güç bütçesi (string'siz; bileşen çevirir). */
export function buildLinkBudget(
  cfg: SystemConfig,
  fiber: FiberResult,
  edfa: EdfaResult
): LinkBudgetRow[] {
  return [
    { key: "tx",        powerDbm: cfg.txPowerDbm,       fiberLengthKm: cfg.fiberLengthKm, lossDb: fiber.totalLossDb, gainDb: cfg.edfaGainDb, nfDb: cfg.edfaNfDb },
    { key: "fiber_out", powerDbm: fiber.outputPowerDbm,  fiberLengthKm: cfg.fiberLengthKm, lossDb: fiber.totalLossDb, gainDb: cfg.edfaGainDb, nfDb: cfg.edfaNfDb },
    { key: "edfa_out",  powerDbm: edfa.outputPowerDbm,   fiberLengthKm: cfg.fiberLengthKm, lossDb: fiber.totalLossDb, gainDb: cfg.edfaGainDb, nfDb: cfg.edfaNfDb },
  ];
}
