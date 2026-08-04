import { Link } from 'react-router-dom'
import { nomeTema } from '../data/catalog.js'

// Card reutilizável de uma obra (livro ou série).
// `temasDestaque` marca as tags que coincidem com a obra de referência,
// deixando visível "por que" a recomendação foi feita.
export default function ObraCard({ item, temasDestaque = [], rodape = null }) {
  const destaque = new Set(temasDestaque)

  return (
    <div className="card">
      <Link to={`/obra/${item.id}`}>
        <div className="cover" style={{ background: `linear-gradient(135deg, ${item.capa}, #12132a)` }}>
          <span className="tipo">{item.tipo === 'livro' ? '📖 Livro' : '📺 Série'}</span>
        </div>
      </Link>
      <div className="card-body">
        <Link to={`/obra/${item.id}`}>
          <h3>{item.titulo}</h3>
        </Link>
        <div className="meta">
          {item.tipo === 'livro' ? item.autor : item.criador} · {item.ano}
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
