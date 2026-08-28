import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { buscarPorId, nomeTema, autoria, TIPOS } from '../data/catalog.js'
import { recomendar, rotuloOposto } from '../lib/recommend.js'
import { useBiblioteca, percentualConcluido } from '../lib/storage.js'
import ObraCard from '../components/ObraCard.jsx'
import Estrelas from '../components/Estrelas.jsx'

// Página de detalhe de uma obra: sinopse, recomendações de temas parecidos
// (no formato oposto e no mesmo grupo), atalho de progresso e de avaliação.
export default function Detalhe() {
  const { id } = useParams()
  const navigate = useNavigate()
  const item = buscarPorId(id)
  const { progresso, avaliacoes, salvarProgresso, salvarAvaliacao } = useBiblioteca()

  const recsOpostas = useMemo(
    () => (item ? recomendar(item, { grupo: 'oposto', limite: 4 }) : []),
    [item],
  )
  const recsMesmo = useMemo(() => (item ? recomendar(item, { grupo: 'mesma', limite: 4 }) : []), [item])

  if (!item) {
    return (
      <div className="empty">
        <h3>Obra não encontrada nesta corte</h3>
        <Link className="btn primary" to="/">
          Voltar a Velaris
        </Link>
      </div>
    )
  }

  const prog = progresso[item.id]
  const av = avaliacoes[item.id]
  const pct = percentualConcluido(item, prog)
  const tipo = TIPOS[item.tipo]
  const formatoOposto = rotuloOposto(item)

  return (
    <>
      <span className="back" onClick={() => navigate(-1)} style={{ cursor: 'pointer' }}>
        ← Voltar
      </span>

      <div className="detail-hero">
        <div className="cover" style={{ background: `linear-gradient(150deg, ${item.capa}, #0b0a1c)` }}>
          <span className="tipo">
            {tipo.emoji} {tipo.rotulo}
          </span>
        </div>
        <div>
          <h1>{item.titulo}</h1>
          <div className="meta" style={{ color: 'var(--muted)' }}>
            {fichaTecnica(item)}
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
          {av?.resenha && (
            <p className="sinopse" style={{ fontStyle: 'italic', fontSize: 14, marginTop: 10 }}>
              “{av.resenha}”
            </p>
          )}
        </div>
      </div>

      {/* Atalho de progresso */}
      <div className="panel">
        <h3>Acompanhar progresso</h3>
        {prog ? (
          <>
            <div className="progress-label">
              <span>{pct}% concluído</span>
              <span>{legenda(item, prog)}</span>
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
              Ainda não está na sua coleção.
            </span>
            <button
              className="btn sm primary"
              onClick={() =>
                salvarProgresso(item.id, {
                  status: 'lendo',
                  paginaAtual: 0,
                  episodioAtual: 0,
                  minutoAtual: 0,
                  temporadaAtual: 1,
                })
              }
            >
              {textoComecar(item)}
            </button>
          </div>
        )}
      </div>

      <div className="section-title">
        <h2>{capitalizar(formatoOposto)} de temas parecidos</h2>
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
            <h2>Também parecidos ({item.tipo === 'livro' ? 'livros' : 'telas'})</h2>
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

function fichaTecnica(item) {
  if (item.tipo === 'livro') return `${autoria(item)} · ${item.ano} · ${item.paginas} páginas`
  if (item.tipo === 'filme') return `${autoria(item)} · ${item.ano} · ${item.duracao} min`
  return `${autoria(item)} · ${item.ano} · ${item.temporadas} temporadas · ${item.episodios} episódios`
}

function legenda(item, prog) {
  if (item.tipo === 'livro') return `pág. ${prog.paginaAtual || 0} de ${item.paginas}`
  if (item.tipo === 'filme') return `${prog.minutoAtual || 0} de ${item.duracao} min`
  return `ep. ${prog.episodioAtual || 0} de ${item.episodios}`
}

function textoComecar(item) {
  if (item.tipo === 'livro') return 'Começar a ler'
  return 'Começar a assistir'
}

function capitalizar(t) {
  return t.charAt(0).toUpperCase() + t.slice(1)
}
