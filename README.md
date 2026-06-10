# WDM Optik Haberleşme Sistemi — İnteraktif Simülasyon

Dalga boyu bölmeli çoğullama (WDM) temelli bir optik haberleşme linki tasarlar, parametreleri
interaktif olarak değiştirip çıktıları anlık analiz eder.

## İçerdiği yapılar
- **Modülasyon** (verici, NRZ/RZ-OOK) — *ana yapı*
- **Çoğullama** (WDM MUX, ITU-T grid) — *ana yapı*
- **Kuvvetlendirme** (EDFA, OSNR/güç bütçesi) — destekleyici
- **Filtreleme** (DEMUX süper-Gauss optik filtre) — destekleyici

## Çalıştırma
```bash
npm install        # bağımlılıklar (kurulu)
npm run dev        # http://localhost:3000
npm run build      # production derleme
```

## Kullanım
Sol paneldeki sliderlarla parametreleri değiştirin (bit hızı, kanal sayısı, fiber uzunluğu,
EDFA kazancı, filtre bant genişliği vb.). Tüm grafikler anlık güncellenir.

Header'daki **🇬🇧 EN / 🇹🇷 TR** butonuyla arayüz dili anında değiştirilebilir.

## Mimari
- `lib/i18n.ts` — Türkçe/İngilizce çeviri stringleri
- `lib/langContext.tsx` — `LangProvider` ve `useLang()` hook'u
- `lib/` — saf TypeScript fizik/DSP modülleri (modülasyon, WDM, fiber, EDFA, filtre, BER) ve
  `simulation.ts` üst seviye toplayıcı.
- `components/` — parametre paneli, blok şeması (SVG) ve Plotly tabanlı grafik görünümleri.

> Not: Modeller mühendislik düzeyinde yaklaşımlardır (örn. tek aşama EDFA OSNR ≈ 58 + Pin − NF;
> BER = ½·erfc(Q/√2)) ve eğitim amaçlıdır.

---

# WDM Optical Communication System — Interactive Simulation

A WDM (Wavelength Division Multiplexing) based optical communication link simulator. Change parameters interactively and analyse the outputs in real time.

## Included building blocks
- **Modulation** (transmitter, NRZ/RZ-OOK) — *primary*
- **Multiplexing** (WDM MUX, ITU-T grid) — *primary*
- **Amplification** (EDFA, OSNR / power budget) — supporting
- **Filtering** (DEMUX super-Gaussian optical filter) — supporting

## Getting started
```bash
npm install        # install dependencies
npm run dev        # http://localhost:3000
npm run build      # production build
```

## Usage
Adjust the sliders in the left panel (bit rate, number of channels, fibre length, EDFA gain, filter bandwidth, etc.). All charts update instantly.

Use the **🇬🇧 EN / 🇹🇷 TR** button in the header to switch the interface language instantly.

## Architecture
- `lib/i18n.ts` — Turkish/English translation strings
- `lib/langContext.tsx` — `LangProvider` and `useLang()` hook
- `lib/` — pure TypeScript physics/DSP modules (modulation, WDM, fibre, EDFA, filter, BER) and `simulation.ts` top-level aggregator.
- `components/` — parameter panel, SVG block diagram, and Plotly-based chart views.

> Note: Models are engineering-level approximations (e.g. single-stage EDFA OSNR ≈ 58 + P_in − NF; BER = ½·erfc(Q/√2)) and are intended for educational use.
