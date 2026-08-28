import { Link } from 'react-router-dom'
import { nomeTema, TIPOS, autoria } from '../data/catalog.js'

// Card reutilizável de uma obra (livro, série ou filme).
// `temasDestaque` marca as tags que coincidem com a obra de referência,
// deixando visível "por que" a recomendação foi feita.
export default function ObraCard({ item, temasDestaque = [], rodape = null }) {
  const destaque = new Set(temasDestaque)
  const tipo = TIPOS[item.tipo]

  return (
    <div className="card">
      <Link to={`/obra/${item.id}`}>
        <div className="cover" style={{ background: `linear-gradient(150deg, ${item.capa}, #0b0a1c)` }}>
          <span className="tipo">
            {tipo.emoji} {tipo.rotulo}
          </span>
        </div>
      </Link>
      <div className="card-body">
        <Link to={`/obra/${item.id}`}>
          <h3>{item.titulo}</h3>
        </Link>
        <div className="meta">
          {autoria(item)} · {item.ano}
        </div>
        <div className="tags">
          {item.temas.slice(0, 4).map((t) => (
            <span key={t} className={`tag ${destaque.has(t) ? 'match' : ''}`}>
              {nomeTema(t)}
            </span>
          ))}
        </div>
        {rodape}
      </div>
    </div>
  )
}
