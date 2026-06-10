export type Lang = "tr" | "en";

const tr = {
  appTitle: "WDM Optik Haberleşme Sistemi — İnteraktif Simülasyon",

  // Sections
  blockDiagramTitle: "Sistem Blok Şeması",
  blockDiagramSubtitle: "Verici → WDM MUX → Fiber → EDFA → DEMUX → Alıcı",
  badgeDesign: "Tasarım",
  badgePrimary: "Ana yapı",
  sec1Title: "1 · Modülasyon",
  sec2Title: "2 · WDM Çoğullama",
  sec3Title: "3 · Kuvvetlendirme (EDFA)",
  sec3Subtitle: "Güç bütçesi ve OSNR analizi",
  sec4Title: "4 · Filtreleme (DEMUX)",
  sec4Subtitle: (bw: number) => `Süper-Gauss optik filtre · ${bw} GHz`,
  sec5Title: "5 · Performans Analizi",
  sec5Subtitle: "OSNR → Q-faktör → BER",
  sec1Subtitle: (mod: string, rb: number) => `${mod} · ${rb} Gb/s — dalga formu ve göz diyagramı`,
  sec2Subtitle: (n: number, sp: number) => `${n} kanal · ${sp} GHz aralık — bileşik spektrum`,

  // ParameterPanel
  systemParams: "Sistem Parametreleri",
  reset: "Sıfırla",
  modulationSection: "Modülasyon",
  modulationType: "Modülasyon tipi",
  bitRate: "Bit hızı (kanal başı)",
  txPower: "Verici gücü",
  wdmSection: "WDM Çoğullama",
  numChannels: "Kanal sayısı",
  channelSpacing: "Kanal aralığı",
  selectedChannel: "DEMUX seçili kanal",
  fiberEdfaSection: "Fiber & EDFA",
  fiberLength: "Fiber uzunluğu",
  dispersion: "Dispersiyon",
  edfaGain: "EDFA kazancı",
  edfaNf: "EDFA gürültü figürü",
  demuxSection: "DEMUX Filtre",
  filterBw: "Filtre bant genişliği",
  filterOrder: "Filtre derecesi (süper-Gauss)",

  // BlockDiagram
  transmitters: "Vericiler",
  modulationNCh: (n: number) => `Modülasyon · ${n} kanal`,
  receivers: "Alıcılar",
  receiverSubtitle: "Fotodedektör",
  opticalFilter: "Optik filtre",

  // ModulationView
  timeDomainWaveform: "Zaman bölgesi dalga formu",
  eyeDiagram: "Göz diyagramı",
  timeAxis: "Zaman (ns)",
  amplitude: "Genlik",
  bitPeriod: "Bit periyodu",
  idealTrace: "İdeal",
  receivedTrace: "Alınan (bant sınırlı)",

  // SpectrumView
  compositeSpectrum: "Bileşik spektrum",
  freqAxis: "Frekans (THz)",
  powerAxis: "Güç (dB)",
  spectrumFooter: (n: number, lo: number, hi: number) => `${n} kanal · ${lo}–${hi} nm aralığı`,

  // EdfaLinkView
  powerBudgetProfile: "Güç bütçesi profili",
  colStage: "Aşama",
  colPower: "Güç (dBm)",
  colDesc: "Açıklama",
  stageTx: "Verici (kanal başı)",
  stageFiber: (km: number) => `Fiber çıkışı (${km} km)`,
  stageEdfa: "EDFA çıkışı",
  noteTx: "TX çıkışı",
  noteFiber: (loss: number) => `−${loss} dB zayıflama`,
  noteEdfa: (gain: number, nf: number) => `+${gain} dB kazanç, NF=${nf} dB`,
  osnrAfterEdfa: "EDFA sonrası OSNR",
  netLinkBalance: "Net link dengesi",

  // FilterView
  demuxFilterTrace: "DEMUX filtre yanıtı",
  filterFooter: (label: string, sup: number) =>
    `Seçili kanal ${label} · komşu kanal bastırması ${sup} dB`,

  // PerformanceView
  berCurve: "BER eğrisi",
  operatingPoint: "Çalışma noktası",
  fecThreshold: "FEC eşiği 1e-9",
  metricOsnr: "OSNR (link)",
  metricPenalty: "Dispersiyon cezası",
  metricQ: "Q-faktör",
  metricBer: "BER (çalışma)",
};

const en: typeof tr = {
  appTitle: "WDM Optical Communication System — Interactive Simulation",

  blockDiagramTitle: "System Block Diagram",
  blockDiagramSubtitle: "Transmitter → WDM MUX → Fibre → EDFA → DEMUX → Receiver",
  badgeDesign: "Design",
  badgePrimary: "Primary",
  sec1Title: "1 · Modulation",
  sec2Title: "2 · WDM Multiplexing",
  sec3Title: "3 · Amplification (EDFA)",
  sec3Subtitle: "Power budget and OSNR analysis",
  sec4Title: "4 · Filtering (DEMUX)",
  sec4Subtitle: (bw: number) => `Super-Gaussian optical filter · ${bw} GHz`,
  sec5Title: "5 · Performance Analysis",
  sec5Subtitle: "OSNR → Q-factor → BER",
  sec1Subtitle: (mod: string, rb: number) => `${mod} · ${rb} Gb/s — waveform and eye diagram`,
  sec2Subtitle: (n: number, sp: number) => `${n} channels · ${sp} GHz spacing — composite spectrum`,

  systemParams: "System Parameters",
  reset: "Reset",
  modulationSection: "Modulation",
  modulationType: "Modulation type",
  bitRate: "Bit rate (per channel)",
  txPower: "Transmit power",
  wdmSection: "WDM Multiplexing",
  numChannels: "Number of channels",
  channelSpacing: "Channel spacing",
  selectedChannel: "DEMUX selected channel",
  fiberEdfaSection: "Fibre & EDFA",
  fiberLength: "Fibre length",
  dispersion: "Dispersion",
  edfaGain: "EDFA gain",
  edfaNf: "EDFA noise figure",
  demuxSection: "DEMUX Filter",
  filterBw: "Filter bandwidth",
  filterOrder: "Filter order (super-Gaussian)",

  transmitters: "Transmitters",
  modulationNCh: (n: number) => `Modulation · ${n} ch`,
  receivers: "Receivers",
  receiverSubtitle: "Photodetector",
  opticalFilter: "Optical filter",

  timeDomainWaveform: "Time-domain waveform",
  eyeDiagram: "Eye diagram",
  timeAxis: "Time (ns)",
  amplitude: "Amplitude",
  bitPeriod: "Bit period",
  idealTrace: "Ideal",
  receivedTrace: "Received (band-limited)",

  compositeSpectrum: "Composite spectrum",
  freqAxis: "Frequency (THz)",
  powerAxis: "Power (dB)",
  spectrumFooter: (n: number, lo: number, hi: number) => `${n} channels · ${lo}–${hi} nm range`,

  powerBudgetProfile: "Power budget profile",
  colStage: "Stage",
  colPower: "Power (dBm)",
  colDesc: "Description",
  stageTx: "Transmitter (per channel)",
  stageFiber: (km: number) => `Fibre output (${km} km)`,
  stageEdfa: "EDFA output",
  noteTx: "TX output",
  noteFiber: (loss: number) => `−${loss} dB attenuation`,
  noteEdfa: (gain: number, nf: number) => `+${gain} dB gain, NF=${nf} dB`,
  osnrAfterEdfa: "OSNR after EDFA",
  netLinkBalance: "Net link balance",

  demuxFilterTrace: "DEMUX filter response",
  filterFooter: (label: string, sup: number) =>
    `Selected channel ${label} · adjacent channel suppression ${sup} dB`,

  berCurve: "BER curve",
  operatingPoint: "Operating point",
  fecThreshold: "FEC threshold 1e-9",
  metricOsnr: "OSNR (link)",
  metricPenalty: "Dispersion penalty",
  metricQ: "Q-factor",
  metricBer: "BER (operating)",
};

export const translations: Record<Lang, typeof tr> = { tr, en };
export type T = typeof tr;
