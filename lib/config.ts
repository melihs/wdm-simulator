// Sistem yapılandırma tipi ve varsayılan parametreler

export type ModulationType = "NRZ-OOK" | "RZ-OOK";

export interface SystemConfig {
  /** Kanal başına bit hızı (Gb/s) */
  bitRateGbps: number;
  /** WDM kanal sayısı */
  numChannels: number;
  /** Kanal aralığı (GHz) — ITU-T grid (örn. 50 / 100) */
  channelSpacingGHz: number;
  /** Referans (merkez) frekans (THz) — ITU-T anchor 193.1 THz */
  centerFreqTHz: number;
  /** Modülasyon tipi */
  modulation: ModulationType;
  /** Kanal başına verici çıkış gücü (dBm) */
  txPowerDbm: number;
  /** Fiber uzunluğu (km) */
  fiberLengthKm: number;
  /** Fiber zayıflaması (dB/km) — SMF tipik 0.2 */
  attenuationDbPerKm: number;
  /** Kromatik dispersiyon (ps/(nm·km)) — SMF tipik 17 */
  dispersionPsNmKm: number;
  /** EDFA kazancı (dB) */
  edfaGainDb: number;
  /** EDFA gürültü figürü (dB) */
  edfaNfDb: number;
  /** DEMUX optik filtre 3-dB bant genişliği (GHz) */
  filterBandwidthGHz: number;
  /** Süper-Gauss filtre derecesi (1 = Gauss) */
  filterOrder: number;
  /** DEMUX ile seçilen kanal indeksi (0 tabanlı) */
  selectedChannel: number;
}

export const DEFAULT_CONFIG: SystemConfig = {
  bitRateGbps: 10,
  numChannels: 8,
  channelSpacingGHz: 100,
  centerFreqTHz: 193.1,
  modulation: "NRZ-OOK",
  txPowerDbm: 0,
  fiberLengthKm: 80,
  attenuationDbPerKm: 0.2,
  dispersionPsNmKm: 17,
  edfaGainDb: 16,
  edfaNfDb: 5,
  filterBandwidthGHz: 50,
  filterOrder: 2,
  selectedChannel: 4,
};
