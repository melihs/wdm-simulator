// Modülasyon: PRBS üretimi, NRZ/RZ-OOK dalga formu, bant sınırlama ve göz diyagramı

import { SystemConfig } from "./config";

/** Doğrusal geri beslemeli kaydırma yazmacı tabanlı PRBS (yinelenebilir). */
export function generateBits(length: number, seed = 0x1f3): number[] {
  let lfsr = seed & 0x7fff || 0x1f3;
  const bits: number[] = [];
  for (let i = 0; i < length; i++) {
    // 15-bit LFSR, kutuplar x^15 + x^14 + 1
    const bit = ((lfsr >> 0) ^ (lfsr >> 1)) & 1;
    lfsr = (lfsr >> 1) | (bit << 14);
    bits.push(lfsr & 1);
  }
  return bits;
}

/** İdeal OOK seviye dizisini örnekleyerek dalga formu üretir (bant sınırlaması öncesi). */
function idealWaveform(
  bits: number[],
  samplesPerBit: number,
  type: SystemConfig["modulation"]
): number[] {
  const wave: number[] = [];
  for (const b of bits) {
    for (let s = 0; s < samplesPerBit; s++) {
      if (type === "RZ-OOK") {
        // RZ: bit periyodunun ilk yarısında darbe
        const inPulse = s < samplesPerBit / 2;
        wave.push(b === 1 && inPulse ? 1 : 0);
      } else {
        wave.push(b);
      }
    }
  }
  return wave;
}

/** Gauss çekirdekli alçak geçiren filtre — bant sınırlama / ISI etkisini modeller. */
function gaussianLowpass(signal: number[], sigmaSamples: number): number[] {
  if (sigmaSamples < 0.4) return signal.slice();
  const radius = Math.max(1, Math.ceil(sigmaSamples * 3));
  const kernel: number[] = [];
  let sum = 0;
  for (let k = -radius; k <= radius; k++) {
    const w = Math.exp(-0.5 * (k / sigmaSamples) ** 2);
    kernel.push(w);
    sum += w;
  }
  const n = signal.length;
  const out = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    let acc = 0;
    for (let k = -radius; k <= radius; k++) {
      const idx = Math.min(n - 1, Math.max(0, i + k));
      acc += signal[idx] * kernel[k + radius];
    }
    out[i] = acc / sum;
  }
  return out;
}

export interface ModulationResult {
  bits: number[];
  time: number[]; // ns
  ideal: number[];
  received: number[]; // bant sınırlı + gürültülü
  samplesPerBit: number;
  bitPeriodNs: number;
}

/**
 * Verilen konfigürasyondan modüleli dalga formunu üretir.
 * Dispersiyon ve sonlu bant genişliği, Gauss alçak geçiren ile ISI olarak modellenir.
 */
export function buildModulation(
  cfg: SystemConfig,
  numBits = 16,
  samplesPerBit = 64
): ModulationResult {
  const bits = generateBits(numBits);
  const ideal = idealWaveform(bits, samplesPerBit, cfg.modulation);

  // Bit periyodu (ns)
  const bitPeriodNs = 1 / cfg.bitRateGbps;

  // Dispersiyon kaynaklı genişleme -> sigma (örnek cinsinden).
  // Δλ ≈ λ²/c · Rb ; broadening_ps = D·L·Δλ ; bit periyoduna oranla normalize.
  const lambdaNm = 1550;
  const dLambdaNm =
    ((lambdaNm * 1e-9) ** 2 / 2.99792458e8) *
    (cfg.bitRateGbps * 1e9) *
    1e9;
  const broadeningPs = cfg.dispersionPsNmKm * cfg.fiberLengthKm * dLambdaNm;
  const broadeningFracBit = broadeningPs / (bitPeriodNs * 1000);
  // Temel verici bant sınırı (~0.35/Rb yükselme zamanı) + dispersiyon
  const sigmaSamples = (0.25 + broadeningFracBit) * samplesPerBit * 0.5;

  const filtered = gaussianLowpass(ideal, sigmaSamples);

  // Hafif AWGN (görsel gerçekçilik) — OSNR ile ölçeklenmez, sadece eser miktar
  const noiseStd = 0.025;
  const received = filtered.map(
    (v) => v + noiseStd * gaussianNoise()
  );

  const time = ideal.map((_, i) => (i / samplesPerBit) * bitPeriodNs);

  return { bits, time, ideal, received, samplesPerBit, bitPeriodNs };
}

/** Box-Muller ile standart normal örnek */
function gaussianNoise(): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export interface EyeDiagram {
  /** her segment 2 bit periyodu uzunluğunda; x ekseni UI (0..2) */
  segments: number[][];
  x: number[];
}

/** Dalga formunu 2-bit pencerelere bölerek göz diyagramı segmentleri üretir. */
export function buildEyeDiagram(res: ModulationResult): EyeDiagram {
  const span = 2 * res.samplesPerBit;
  const x = Array.from({ length: span }, (_, i) => i / res.samplesPerBit);
  const segments: number[][] = [];
  for (let start = 0; start + span <= res.received.length; start += res.samplesPerBit) {
    segments.push(res.received.slice(start, start + span));
  }
  return { segments, x };
}
