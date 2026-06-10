// WDM link blok şeması (SVG): TX(mod) -> MUX -> Fiber -> EDFA -> DEMUX(filtre) -> RX

interface BlockDiagramProps {
  numChannels: number;
  fiberLengthKm: number;
}

export default function BlockDiagram({ numChannels, fiberLengthKm }: BlockDiagramProps) {
  return (
    <svg viewBox="0 0 920 240" className="w-full" role="img" aria-label="WDM sistem blok şeması">
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#475569" />
        </marker>
      </defs>

      {/* Verici / modülatör grubu */}
      {[0, 1, 2].map((i) => {
        const y = 40 + i * 50;
        const isDots = i === 2;
        return (
          <g key={i}>
            {isDots ? (
              <text x="60" y={y + 5} textAnchor="middle" className="fill-slate-400" fontSize="22">
                ⋮
              </text>
            ) : (
              <>
                <rect x="20" y={y - 16} width="90" height="32" rx="5" fill="#eff6ff" stroke="#3b82f6" />
                <text x="65" y={y - 2} textAnchor="middle" fontSize="10" fill="#1e3a8a">
                  λ{i + 1} Mod.
                </text>
                <text x="65" y={y + 10} textAnchor="middle" fontSize="9" fill="#64748b">
                  OOK
                </text>
                <line x1="110" y1={y} x2="180" y2="120" stroke="#94a3b8" strokeWidth="1.2" />
              </>
            )}
          </g>
        );
      })}
      <text x="65" y="213" textAnchor="middle" fontSize="11" fontWeight="500" fill="#334155">Vericiler</text>
      <text x="65" y="228" textAnchor="middle" fontSize="10" fill="#64748b">Modülasyon · {numChannels} kanal</text>

      {/* MUX */}
      <Block x={180} y={104} w={70} h={48} fill="#ecfeff" stroke="#06b6d4" l1="WDM" l2="MUX" />
      <line x1="250" y1="128" x2="300" y2="128" stroke="#475569" strokeWidth="1.5" markerEnd="url(#arrow)" />

      {/* Fiber */}
      <Block x={300} y={104} w={110} h={48} fill="#f0fdf4" stroke="#22c55e" l1="SMF Fiber" l2={`${fiberLengthKm} km`} />
      <line x1="410" y1="128" x2="460" y2="128" stroke="#475569" strokeWidth="1.5" markerEnd="url(#arrow)" />

      {/* EDFA (üçgen) */}
      <g>
        <polygon points="460,104 460,152 515,128" fill="#fef3c7" stroke="#f59e0b" />
        <text x="478" y="132" fontSize="10" fill="#92400e">EDFA</text>
      </g>
      <line x1="515" y1="128" x2="565" y2="128" stroke="#475569" strokeWidth="1.5" markerEnd="url(#arrow)" />

      {/* DEMUX / filtre */}
      <Block x={565} y={104} w={80} h={48} fill="#faf5ff" stroke="#a855f7" l1="DEMUX" l2="Optik filtre" />

      {/* Alıcılar */}
      {[0, 1, 2].map((i) => {
        const y = 40 + i * 50;
        const isDots = i === 2;
        return (
          <g key={`rx-${i}`}>
            {!isDots && (
              <>
                <line x1="645" y1="128" x2="720" y2={y} stroke="#94a3b8" strokeWidth="1.2" />
                <rect x="720" y={y - 16} width="80" height="32" rx="5" fill="#fef2f2" stroke="#ef4444" />
                <text x="760" y={y + 4} textAnchor="middle" fontSize="10" fill="#991b1b">
                  RX λ{i + 1}
                </text>
              </>
            )}
            {isDots && (
              <text x="760" y={y + 5} textAnchor="middle" className="fill-slate-400" fontSize="22">
                ⋮
              </text>
            )}
          </g>
        );
      })}
      <text x="760" y="220" textAnchor="middle" fontSize="11" fill="#334155">
        Alıcılar · Fotodedektör
      </text>
    </svg>
  );
}

function Block({
  x, y, w, h, fill, stroke, l1, l2,
}: {
  x: number; y: number; w: number; h: number; fill: string; stroke: string; l1: string; l2: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="6" fill={fill} stroke={stroke} strokeWidth="1.4" />
      <text x={x + w / 2} y={y + h / 2 - 2} textAnchor="middle" fontSize="11" fontWeight="600" fill="#0f172a">
        {l1}
      </text>
      <text x={x + w / 2} y={y + h / 2 + 12} textAnchor="middle" fontSize="9" fill="#64748b">
        {l2}
      </text>
    </g>
  );
}
