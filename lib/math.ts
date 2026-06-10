// Genel matematik ve birim dönüşüm yardımcıları

export const C_LIGHT = 2.99792458e8; // m/s, ışık hızı

/** Tamamlayıcı hata fonksiyonu (Abramowitz & Stegun 7.1.26 yaklaşımı). */
export function erfc(x: number): number {
  const z = Math.abs(x);
  const t = 1 / (1 + 0.5 * z);
  // Horner formunda polinom katsayıları (yüksekten düşüğe)
  const c = [
    0.17087277, -0.82215223, 1.48851587, -1.13520398, 0.27886807,
    -0.18628806, 0.09678418, 0.37409196, 1.00002368, -1.26551223,
  ];
  let poly = 0;
  for (const ck of c) poly = poly * t + ck;
  const tau = t * Math.exp(-z * z + poly);
  return x >= 0 ? tau : 2 - tau;
}

/** dBm -> mW */
export function dbmToMw(dbm: number): number {
  return Math.pow(10, dbm / 10);
}

/** mW -> dBm */
export function mwToDbm(mw: number): number {
  return 10 * Math.log10(mw);
}

/** dB lineer oran -> kat */
export function dbToLinear(db: number): number {
  return Math.pow(10, db / 10);
}

export function linearToDb(lin: number): number {
  return 10 * Math.log10(lin);
}

/** [start, stop] aralığında n eşit noktalı dizi */
export function linspace(start: number, stop: number, n: number): number[] {
  if (n <= 1) return [start];
  const step = (stop - start) / (n - 1);
  return Array.from({ length: n }, (_, i) => start + i * step);
}

/** Normalize edilmemiş Gauss zarfı */
export function gaussian(x: number, mu: number, sigma: number): number {
  const d = (x - mu) / sigma;
  return Math.exp(-0.5 * d * d);
}

/** Frekans (THz) -> dalga boyu (nm) */
export function freqThzToWavelengthNm(fThz: number): number {
  return (C_LIGHT / (fThz * 1e12)) * 1e9;
}

export function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}
