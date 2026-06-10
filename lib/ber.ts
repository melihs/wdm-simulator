// Performans: OSNR -> Q-faktör -> BER ve OSNR taraması

import { dbToLinear, erfc, linspace } from "./math";
import { SystemConfig } from "./config";
import { FiberResult } from "./fiber";
import { EdfaResult } from "./edfa";

const B_REF_GHZ = 12.5; // 0.1 nm optik referans bant genişliği

/**
 * OOK için OSNR -> Q yaklaşımı:
 *   Q ≈ (2·OSNR·(Bo/Br)) / (1 + √(1 + 4·OSNR))
 * Bo: optik referans bant, Br: bit hızı (elektriksel bant).
 */
export function qFromOsnr(osnrDb: number, bitRateGbps: number): number {
  const osnr = dbToLinear(osnrDb);
  const ratio = B_REF_GHZ / bitRateGbps;
  return (2 * osnr * ratio) / (1 + Math.sqrt(1 + 4 * osnr));
}

/** Q-faktör -> BER (OOK, Gauss gürültü): BER = 0.5·erfc(Q/√2) */
export function berFromQ(q: number): number {
  return 0.5 * erfc(q / Math.SQRT2);
}

/** Dispersiyon kaynaklı göz kapanma cezası (dB) */
export function dispersionPenaltyDb(fiber: FiberResult): number {
  // basit ampirik: genişleme bit periyodunun yarısına ulaşınca ~2 dB
  const f = fiber.broadeningFracBit;
  return Math.min(6, 4 * f * f + 1.5 * f);
}

export interface PerformanceResult {
  /** çalışma noktası OSNR (dB) */
  osnrDb: number;
  /** etkin OSNR (ceza sonrası, dB) */
  effectiveOsnrDb: number;
  qFactor: number;
  qDb: number;
  ber: number;
  penaltyDb: number;
  /** BER vs OSNR eğrisi */
  sweepOsnrDb: number[];
  sweepBer: number[];
}

export function analyzePerformance(
  cfg: SystemConfig,
  fiber: FiberResult,
  edfa: EdfaResult
): PerformanceResult {
  const penaltyDb = dispersionPenaltyDb(fiber);
  const effectiveOsnrDb = edfa.osnrDb - penaltyDb;
  const q = qFromOsnr(effectiveOsnrDb, cfg.bitRateGbps);
  const ber = berFromQ(q);

  const sweepOsnrDb = linspace(6, 30, 80);
  const sweepBer = sweepOsnrDb.map((o) =>
    berFromQ(qFromOsnr(o - penaltyDb, cfg.bitRateGbps))
  );

  return {
    osnrDb: edfa.osnrDb,
    effectiveOsnrDb: +effectiveOsnrDb.toFixed(2),
    qFactor: +q.toFixed(3),
    qDb: +(20 * Math.log10(Math.max(q, 1e-3))).toFixed(2),
    ber,
    penaltyDb: +penaltyDb.toFixed(2),
    sweepOsnrDb,
    sweepBer,
  };
}

/** BER'i okunur biçimde formatlar (örn. 3.2e-12) */
export function formatBer(ber: number): string {
  if (ber < 1e-30) return "< 1e-30";
  return ber.toExponential(2);
}
