// Designer de personagem em SVG. A partir de uma configuração de traços
// (corte, pele, cabelo, roupa, asas, máscara, coroa, tatuagem), desenha um
// retrato estilizado — uma forma de "ver" a personagem do livro, suas roupas
// e afins, sem depender de geração de imagem externa.

// Cortes inspiradas no universo da saga, cada uma com sua paleta.
export const CORTES = {
  noturna: { nome: 'Corte Noturna', bg: ['#140d33', '#3a1f6d'], glow: '#8b6df0', estrelas: true },
  amanhecer: { nome: 'Corte do Amanhecer', bg: ['#2a1a3a', '#a86d9e'], glow: '#f0a6c8', estrelas: true },
  primavera: { nome: 'Corte da Primavera', bg: ['#123322', '#3f8a5e'], glow: '#7be0a0', estrelas: false },
  verao: { nome: 'Corte do Verão', bg: ['#123a3f', '#3f9ea8'], glow: '#5fe0d6', estrelas: false },
  outono: { nome: 'Corte do Outono', bg: ['#3a1f12', '#b8663f'], glow: '#ffb06b', estrelas: false },
  inverno: { nome: 'Corte do Inverno', bg: ['#12233a', '#6d9ec9'], glow: '#bfe6ff', estrelas: true },
  dia: { nome: 'Corte do Dia', bg: ['#3a3312', '#c9b04b'], glow: '#ffe9a6', estrelas: false },
}

export const PELES = ['#f6dcc0', '#e8c9a8', '#d9ab82', '#b9835e', '#8a5a3c', '#5e3a25']
export const CABELOS = ['#2b2b3a', '#5e3a25', '#8a5a2f', '#c9a24b', '#d9d9e6', '#8b6df0', '#b23a5e', '#4b7a8a']
export const ESTILOS_CABELO = [
  { key: 'longo', nome: 'Solto e longo' },
  { key: 'preso', nome: 'Preso / coque' },
  { key: 'curto', nome: 'Curto' },
]
export const ROUPAS = [
  { key: 'vestido', nome: 'Vestido de gala' },
  { key: 'armadura', nome: 'Armadura' },
  { key: 'tunica', nome: 'Túnica' },
  { key: 'capa', nome: 'Capa com gola' },
]
export const CORES_ROUPA = ['#6d3f8a', '#2f3f7a', '#7a2f4b', '#2f5e4b', '#8a3f2f', '#1f1740', '#c9a24b', '#3a3f4b']

export const CONFIG_PADRAO = {
  corte: 'noturna',
  pele: '#e8c9a8',
  cabeloCor: '#2b2b3a',
  cabeloEstilo: 'longo',
  roupaTipo: 'vestido',
  roupaCor: '#6d3f8a',
  asas: true,
  mascara: false,
  coroa: false,
  tatuagem: true,
}

// Escurece/clareia uma cor hex por um fator (-1 a 1) para dar sombreamento.
function ajustar(hex, fator) {
  const n = parseInt(hex.slice(1), 16)
  let r = (n >> 16) & 255
  let g = (n >> 8) & 255
  let b = n & 255
  const d = Math.round(255 * fator)
  r = Math.max(0, Math.min(255, r + d))
  g = Math.max(0, Math.min(255, g + d))
  b = Math.max(0, Math.min(255, b + d))
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

export default function PersonagemArt({ config = CONFIG_PADRAO, tamanho = 300 }) {
  const c = { ...CONFIG_PADRAO, ...config }
  const corte = CORTES[c.corte] || CORTES.noturna
  const uid = `${c.corte}-${c.roupaCor}`.replace(/[^a-z0-9]/gi, '')

  const peleSombra = ajustar(c.pele, -0.12)
  const roupaClara = ajustar(c.roupaCor, 0.14)
  const roupaEscura = ajustar(c.roupaCor, -0.16)
  const cabeloBrilho = ajustar(c.cabeloCor, 0.18)

  const estrelas = corte.estrelas
    ? Array.from({ length: 14 }, (_, i) => ({
        cx: 20 + ((i * 53) % 260),
        cy: 18 + ((i * 37) % 150),
        r: (i % 3) * 0.6 + 0.8,
      }))
    : []

  return (
    <svg viewBox="0 0 300 340" width={tamanho} height={tamanho} role="img" aria-label="Retrato da personagem">
      <defs>
        <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={corte.bg[0]} />
          <stop offset="1" stopColor={corte.bg[1]} />
        </linearGradient>
        <radialGradient id={`glow-${uid}`} cx="0.5" cy="0.35" r="0.6">
          <stop offset="0" stopColor={corte.glow} stopOpacity="0.55" />
          <stop offset="1" stopColor={corte.glow} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Fundo da corte */}
      <rect x="0" y="0" width="300" height="340" rx="18" fill={`url(#bg-${uid})`} />
      <rect x="0" y="0" width="300" height="340" rx="18" fill={`url(#glow-${uid})`} />
      {estrelas.map((s, i) => (
        <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="#eef0ff" opacity="0.85" />
      ))}

      {/* Asas (atrás) */}
      {c.asas && (
        <g opacity="0.9">
          <path
            d="M150 210 C 80 150, 30 170, 20 250 C 60 235, 95 240, 150 270 Z"
            fill={ajustar(corte.glow, -0.35)}
            opacity="0.55"
          />
          <path
            d="M150 210 C 220 150, 270 170, 280 250 C 240 235, 205 240, 150 270 Z"
            fill={ajustar(corte.glow, -0.35)}
            opacity="0.55"
          />
          <path d="M150 214 C 95 160, 55 178, 40 244" stroke={corte.glow} strokeWidth="2" fill="none" opacity="0.7" />
          <path d="M150 214 C 205 160, 245 178, 260 244" stroke={corte.glow} strokeWidth="2" fill="none" opacity="0.7" />
        </g>
      )}

      {/* Cabelo de trás (para estilos longos/presos) */}
      {c.cabeloEstilo !== 'curto' && (
        <path d="M92 120 C 78 200, 88 290, 110 330 L 190 330 C 212 290, 222 200, 208 120 Z" fill={c.cabeloCor} />
      )}

      {/* Ombros / roupa */}
      <g>
        <path d="M60 340 C 66 268, 104 232, 150 232 C 196 232, 234 268, 240 340 Z" fill={c.roupaCor} />
        <path d="M150 232 C 128 232, 110 244, 100 264 L 150 300 L 200 264 C 190 244, 172 232, 150 232 Z" fill={roupaEscura} opacity="0.6" />
        {c.roupaTipo === 'armadura' && (
          <>
            <ellipse cx="92" cy="268" rx="26" ry="20" fill={roupaClara} />
            <ellipse cx="208" cy="268" rx="26" ry="20" fill={roupaClara} />
            <path d="M150 236 L150 320" stroke={roupaEscura} strokeWidth="3" opacity="0.7" />
          </>
        )}
        {c.roupaTipo === 'capa' && (
          <path d="M104 262 C 130 250, 170 250, 196 262 L 188 300 C 170 292, 130 292, 112 300 Z" fill={roupaClara} />
        )}
        {c.roupaTipo === 'vestido' && (
          <path d="M126 250 C 140 300, 160 300, 174 250" stroke={roupaClara} strokeWidth="3" fill="none" opacity="0.8" />
        )}
        {c.roupaTipo === 'tunica' && (
          <path d="M132 240 L150 262 L168 240" stroke={roupaClara} strokeWidth="4" fill="none" opacity="0.8" />
        )}
      </g>

      {/* Pescoço */}
      <path d="M132 196 L132 226 C 132 236, 168 236, 168 226 L168 196 Z" fill={peleSombra} />

      {/* Cabeça */}
      <ellipse cx="150" cy="146" rx="48" ry="56" fill={c.pele} />
      <ellipse cx="150" cy="146" rx="48" ry="56" fill={peleSombra} opacity="0.18" />

      {/* Orelhas de fae (pontudas) */}
      <path d="M104 146 l -12 -10 l 8 20 Z" fill={c.pele} />
      <path d="M196 146 l 12 -10 l -8 20 Z" fill={c.pele} />

      {/* Olhos */}
      <g>
        <ellipse cx="132" cy="142" rx="9" ry="6" fill="#fff" />
        <ellipse cx="168" cy="142" rx="9" ry="6" fill="#fff" />
        <circle cx="133" cy="142" r="3.4" fill={ajustar(corte.glow, -0.15)} />
        <circle cx="167" cy="142" r="3.4" fill={ajustar(corte.glow, -0.15)} />
        <circle cx="134" cy="141" r="1" fill="#fff" />
        <circle cx="168" cy="141" r="1" fill="#fff" />
        <path d="M123 134 q 9 -6 18 0" stroke={ajustar(c.cabeloCor, -0.1)} strokeWidth="2" fill="none" />
        <path d="M159 134 q 9 -6 18 0" stroke={ajustar(c.cabeloCor, -0.1)} strokeWidth="2" fill="none" />
      </g>

      {/* Nariz e boca */}
      <path d="M150 148 l -4 12 q 4 3 8 0 Z" fill={peleSombra} opacity="0.5" />
      <path d="M140 172 q 10 8 20 0 q -10 4 -20 0 Z" fill="#a34b5e" />

      {/* Cabelo da frente / topo */}
      {c.cabeloEstilo === 'curto' && (
        <path d="M104 138 C 104 96, 196 96, 196 138 C 186 116, 114 116, 104 138 Z" fill={c.cabeloCor} />
      )}
      {c.cabeloEstilo === 'longo' && (
        <path d="M100 150 C 96 100, 204 100, 200 150 C 196 122, 172 108, 150 108 C 128 108, 104 122, 100 150 Z" fill={c.cabeloCor} />
      )}
      {c.cabeloEstilo === 'preso' && (
        <>
          <path d="M104 140 C 106 104, 194 104, 196 140 C 188 118, 112 118, 104 140 Z" fill={c.cabeloCor} />
          <circle cx="150" cy="90" r="16" fill={c.cabeloCor} />
          <circle cx="150" cy="90" r="16" fill={cabeloBrilho} opacity="0.25" />
        </>
      )}
      <path d="M120 116 q 30 -14 60 0" stroke={cabeloBrilho} strokeWidth="2.5" fill="none" opacity="0.5" />

      {/* Tatuagem da corte (no pescoço/rosto) */}
      {c.tatuagem && (
        <path
          d="M176 176 q 14 6 10 24 q -2 10 -14 12 q 10 -8 6 -18 q -4 -10 -12 -10"
          stroke={corte.glow}
          strokeWidth="2"
          fill="none"
          opacity="0.85"
        />
      )}

      {/* Máscara (baile da corte) */}
      {c.mascara && (
        <g>
          <path
            d="M108 138 C 118 126, 142 126, 150 134 C 158 126, 182 126, 192 138 C 190 156, 172 160, 168 148 C 160 154, 140 154, 132 148 C 128 160, 110 156, 108 138 Z"
            fill={ajustar(corte.glow, -0.2)}
            opacity="0.92"
          />
          <circle cx="132" cy="142" r="6" fill="#0b0a1c" />
          <circle cx="168" cy="142" r="6" fill="#0b0a1c" />
          <path d="M150 132 l 0 -8 m -6 4 l 12 0" stroke={corte.glow} strokeWidth="2" />
        </g>
      )}

      {/* Coroa / tiara */}
      {c.coroa && (
        <path
          d="M118 96 L128 78 L140 92 L150 72 L160 92 L172 78 L182 96 Z"
          fill="#ffd36b"
          stroke={ajustar('#ffd36b', -0.25)}
          strokeWidth="1.5"
        />
      )}
    </svg>
  )
}
