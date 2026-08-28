import { useMemo } from 'react'

// Céu estrelado de fundo — a "cidade da luz estelar" de Velaris.
// Gera estrelas em posições aleatórias (mas estáveis entre renders) com
// tamanhos e tempos de cintilação variados. Puramente decorativo.
export default function Starfield({ quantidade = 90 }) {
  const estrelas = useMemo(
    () =>
      Array.from({ length: quantidade }, (_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        tamanho: Math.random() * 2 + 1,
        atraso: Math.random() * 4,
        duracao: Math.random() * 3 + 2,
        brilho: Math.random() * 0.5 + 0.4,
      })),
    [quantidade],
  )

  return (
    <div className="starfield" aria-hidden="true">
      {estrelas.map((e) => (
        <span
          key={e.id}
          className="star"
          style={{
            top: `${e.top}%`,
            left: `${e.left}%`,
            width: `${e.tamanho}px`,
            height: `${e.tamanho}px`,
            opacity: e.brilho,
            animationDelay: `${e.atraso}s`,
            animationDuration: `${e.duracao}s`,
          }}
        />
      ))}
    </div>
  )
}

// Símbolo das três estrelas da Corte Noturna.
export function TresEstrelas({ tamanho = 26 }) {
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className="tres-estrelas"
    >
      <path
        d="M24 4l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6zM11 26l1.5 4.5L17 32l-4.5 1.5L11 38l-1.5-4.5L5 32l4.5-1.5L11 26zm26 0l1.5 4.5L43 32l-4.5 1.5L37 38l-1.5-4.5L32 32l4.5-1.5L37 26z"
        fill="currentColor"
      />
    </svg>
  )
}
