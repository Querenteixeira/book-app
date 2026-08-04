import { useState } from 'react'

// Seletor de nota por estrelas (1 a 5). Se `onChange` não for passado,
// funciona apenas como exibição (somente leitura).
export default function Estrelas({ valor = 0, onChange, tamanho = 18, somenteLeitura = false }) {
  const [hover, setHover] = useState(0)
  const ativo = hover || valor

  return (
    <span className="stars" style={{ fontSize: tamanho }} aria-label={`Nota ${valor} de 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          className={n <= ativo ? 'on' : ''}
          disabled={somenteLeitura}
          onMouseEnter={() => !somenteLeitura && setHover(n)}
          onMouseLeave={() => !somenteLeitura && setHover(0)}
          onClick={() => onChange && onChange(n === valor ? 0 : n)}
          aria-label={`${n} estrela${n > 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </span>
  )
}
