import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { buscarPorId, nomeTema } from '../data/catalog.js'
import { recomendar } from '../lib/recommend.js'
import { useBiblioteca, percentualConcluido } from '../lib/storage.js'
import ObraCard from '../components/ObraCard.jsx'
import Estrelas from '../components/Estrelas.jsx'

// Página de detalhe de uma obra: sinopse, recomendações de temas parecidos
// (no formato oposto e no mesmo formato), atalho de progresso e de avaliação.
export default function Detalhe() {
  const { id } = useParams()
  const navigate = useNavigate()
  const item = buscarPorId(id)
  const { progresso, avaliacoes, salvarProgresso, salvarAvaliacao } = useBiblioteca()

  const recsOpostas = useMemo(
    () => (item ? recomendar(item, { tipoAlvo: 'oposto', limite: 4 }) : []),
    [item],
  )
  const recsMesmo = useMemo(
    () => (item ? recomendar(item, { tipoAlvo: item.tipo, limite: 4 }) : []),
    [item],
  )

  if (!item) {
    return (
      <div className="empty">
        <h3>Obra não encontrada</h3>
        <Link className="btn primary" to="/">
          Voltar para Descobrir
        </Link>
      </div>
    )
  }

  const prog = progresso[item.id]
  const av = avaliacoes[item.id]
  const pct = percentualConcluido(item, prog)
  const formatoOposto = item.tipo === 'livro' ? 'Séries' : 'Livros'

  return (
    <>
      <span className="back" onClick={() => navigate(-1)} style={{ cursor: 'pointer' }}>
        ← Voltar
      </span>

      <div className="detail-hero">
        <div className="cover" style={{ background: `linear-gradient(135deg, ${item.capa}, #12132a)` }}>
          <span className="tipo">{item.tipo === 'livro' ? '📖 Livro' : '📺 Série'}</span>
        </div>
        <div>
          <h1>{item.titulo}</h1>
          <div className="meta" style={{ color: 'var(--muted)' }}>
            {item.tipo === 'livro'
              ? `${item.autor} · ${item.ano} · ${item.paginas} páginas`
              : `${item.criador} · ${item.ano} · ${item.temporadas} temporadas · ${item.episodios} episódios`}
          </div>
          <div className="tags" style={{ marginTop: 12 }}>
            {item.temas.map((t) => (
              <span key={t} className="tag match">
                {nomeTema(t)}
              </span>
            ))}
          </div>
          <p className="sinopse">{item.sinopse}</p>
          <div className="btn-row">
            <Estrelas valor={av?.nota || 0} onChange={(n) => salvarAvaliacao(item.id, { nota: n })} />
            <Link className="btn sm" to="/avaliacoes">
              Escrever resenha
            </Link>
          </div>
        </div>
      </div>

      {/* Atalho de progresso */}
      <div className="panel">
        <h3>Acompanhar progresso</h3>
        {prog ? (
          <>
            <div className="progress-label">
              <span>{pct}% concluído</span>
              <span>
                {item.tipo === 'livro'
                  ? `pág. ${prog.paginaAtual || 0} de ${item.paginas}`
                  : `ep. ${prog.episodioAtual || 0} de ${item.episodios}`}
              </span>
            </div>
            <div className="progress">
              <i style={{ width: `${pct}%` }} />
            </div>
            <div className="btn-row" style={{ marginTop: 12 }}>
              <Link className="btn sm primary" to="/progresso">
                Atualizar na tela de progresso
              </Link>
            </div>
          </>
        ) : (
          <div className="btn-row">
            <span className="meta" style={{ color: 'var(--muted)' }}>
              Ainda não está na sua lista.
            </span>
            <button
              className="btn sm primary"
              onClick={() =>
                salvarProgresso(item.id, {
                  status: 'lendo',
                  paginaAtual: 0,
                  episodioAtual: 0,
                  temporadaAtual: 1,
                })
              }
            >
              {item.tipo === 'livro' ? 'Começar a ler' : 'Começar a assistir'}
            </button>
          </div>
        )}
      </div>

      <div className="section-title">
        <h2>{formatoOposto} de temas parecidos</h2>
        <span>a ponte entre os formatos</span>
      </div>
      {recsOpostas.length ? (
        <div className="grid">
          {recsOpostas.map((r) => (
            <ObraCard key={r.item.id} item={r.item} temasDestaque={r.comum} />
          ))}
        </div>
      ) : (
        <div className="empty">Sem recomendações no formato oposto.</div>
      )}

      {recsMesmo.length > 0 && (
        <>
          <div className="section-title">
            <h2>Também parecidos ({item.tipo === 'livro' ? 'livros' : 'séries'})</h2>
          </div>
          <div className="grid">
            {recsMesmo.map((r) => (
              <ObraCard key={r.item.id} item={r.item} temasDestaque={r.comum} />
            ))}
          </div>
        </>
      )}
    </>
  )
}
