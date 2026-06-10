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

export interface LinkBudgetRow {
  stage: string;
  powerDbm: number;
  note: string;
}

/** Verici -> fiber -> EDFA boyunca güç bütçesi tablosu */
export function buildLinkBudget(
  cfg: SystemConfig,
  fiber: FiberResult,
  edfa: EdfaResult
): LinkBudgetRow[] {
  return [
    { stage: "Verici (kanal başı)", powerDbm: cfg.txPowerDbm, note: "TX çıkışı" },
    {
      stage: `Fiber çıkışı (${cfg.fiberLengthKm} km)`,
      powerDbm: fiber.outputPowerDbm,
      note: `−${fiber.totalLossDb} dB zayıflama`,
    },
    {
      stage: "EDFA çıkışı",
      powerDbm: edfa.outputPowerDbm,
      note: `+${cfg.edfaGainDb} dB kazanç, NF=${cfg.edfaNfDb} dB`,
    },
  ];
}
