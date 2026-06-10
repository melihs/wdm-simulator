// Tüm alt analizleri tek konfigürasyondan toplayan üst seviye simülasyon

import { SystemConfig } from "./config";
import { buildChannelPlan, buildSpectrum, WdmChannel, Spectrum } from "./wdm";
import { analyzeFiber, FiberResult } from "./fiber";
import { analyzeEdfa, buildLinkBudget, EdfaResult, LinkBudgetRow } from "./edfa";
import { analyzeFilter, FilterResult } from "./filter";
import { analyzePerformance, PerformanceResult } from "./ber";
import {
  buildModulation,
  buildEyeDiagram,
  ModulationResult,
  EyeDiagram,
} from "./modulation";

export interface Simulation {
  channels: WdmChannel[];
  spectrum: Spectrum;
  fiber: FiberResult;
  edfa: EdfaResult;
  linkBudget: LinkBudgetRow[];
  filter: FilterResult;
  performance: PerformanceResult;
  modulation: ModulationResult;
  eye: EyeDiagram;
}

export function runSimulation(cfg: SystemConfig): Simulation {
  const channels = buildChannelPlan(cfg);
  const spectrum = buildSpectrum(cfg);
  const fiber = analyzeFiber(cfg);
  const edfa = analyzeEdfa(cfg, fiber);
  const linkBudget = buildLinkBudget(cfg, fiber, edfa);
  const filter = analyzeFilter(cfg);
  const performance = analyzePerformance(cfg, fiber, edfa);
  const modulation = buildModulation(cfg);
  const eye = buildEyeDiagram(modulation);

  return {
    channels,
    spectrum,
    fiber,
    edfa,
    linkBudget,
    filter,
    performance,
    modulation,
    eye,
  };
}
