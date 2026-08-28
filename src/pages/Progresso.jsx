import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { buscarPorId, autoria, TIPOS } from '../data/catalog.js'
import { useBiblioteca, percentualConcluido } from '../lib/storage.js'

// Tela de apoio nº 1: acompanhamento de progressão.
//   - Livros: por páginas lidas.
//   - Séries: por temporada e episódio.
//   - Filmes: por minutos assistidos (ou marcar como assistido).
export default function Progresso() {
  const { progresso, salvarProgresso, removerProgresso } = useBiblioteca()

  const itens = useMemo(
    () =>
      Object.keys(progresso)
        .map((id) => ({ item: buscarPorId(id), prog: progresso[id] }))
        .filter((x) => x.item)
        .sort((a, b) => (b.prog.atualizadoEm || '').localeCompare(a.prog.atualizadoEm || '')),
    [progresso],
  )

  const lendo = itens.filter((x) => x.prog.status !== 'concluido')
  const concluidos = itens.filter((x) => x.prog.status === 'concluido')

  return (
    <>
      <div className="page-head">
        <h1>Meu progresso</h1>
        <p>
          Acompanhe onde você parou: páginas nos livros, temporada e episódio nas séries e minutos nos
          filmes. Cada obra que você conclui vira mais uma estrela na sua constelação — e o que você marca
          aqui também alimenta as recomendações de Velaris.
        </p>
      </div>

      <ResumoProgresso itens={itens} />

      <div className="section-title">
        <h2>Em andamento</h2>
        <span>{lendo.length} item(ns)</span>
      </div>
      {lendo.length ? (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
          {lendo.map(({ item, prog }) => (
            <ItemProgresso
              key={item.id}
              item={item}
              prog={prog}
              onSalvar={salvarProgresso}
              onRemover={removerProgresso}
            />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h3>Sua constelação ainda está vazia</h3>
          <p>Abra uma obra no acervo e toque em "Começar" para acompanhar o progresso.</p>
          <Link className="btn primary" to="/">
            Explorar Velaris
          </Link>
        </div>
      )}

      {concluidos.length > 0 && (
        <>
          <div className="section-title">
            <h2>Concluídos</h2>
            <span>{concluidos.length} item(ns)</span>
          </div>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
            {concluidos.map(({ item, prog }) => (
              <ItemProgresso
                key={item.id}
                item={item}
                prog={prog}
                onSalvar={salvarProgresso}
                onRemover={removerProgresso}
              />
            ))}
          </div>
        </>
      )}
    </>
  )
}

function ResumoProgresso({ itens }) {
  const livros = itens.filter((x) => x.item.tipo === 'livro')
  const series = itens.filter((x) => x.item.tipo === 'serie')
  const filmes = itens.filter((x) => x.item.tipo === 'filme')
  const paginas = livros.reduce((acc, x) => acc + (x.prog.paginaAtual || 0), 0)
  const episodios = series.reduce((acc, x) => acc + (x.prog.episodioAtual || 0), 0)
  const concluidos = itens.filter((x) => x.prog.status === 'concluido').length

  return (
    <div className="row">
      <div className="stat">
        <b>{paginas}</b>
        <span>páginas lidas</span>
      </div>
      <div className="stat">
        <b>{episodios}</b>
        <span>episódios vistos</span>
      </div>
      <div className="stat">
        <b>{filmes.length}</b>
        <span>filmes acompanhados</span>
      </div>
      <div className="stat">
        <b>{itens.length}</b>
        <span>obras na coleção</span>
      </div>
      <div className="stat">
        <b>{concluidos} ✦</b>
        <span>estrelas conquistadas</span>
      </div>
    </div>
  )
}

// Controle de progressão individual, por tipo de obra.
function ItemProgresso({ item, prog, onSalvar, onRemover }) {
  const pct = percentualConcluido(item, prog)

  function ajustarPagina(delta) {
    const nova = Math.max(0, Math.min(item.paginas, (prog.paginaAtual || 0) + delta))
    onSalvar(item.id, { paginaAtual: nova, status: nova >= item.paginas ? 'concluido' : 'lendo' })
  }

  function ajustarEpisodio(delta) {
    const novo = Math.max(0, Math.min(item.episodios, (prog.episodioAtual || 0) + delta))
    onSalvar(item.id, { episodioAtual: novo, status: novo >= item.episodios ? 'concluido' : 'lendo' })
  }

  function ajustarMinuto(delta) {
    const novo = Math.max(0, Math.min(item.duracao, (prog.minutoAtual || 0) + delta))
    onSalvar(item.id, { minutoAtual: novo, status: novo >= item.duracao ? 'concluido' : 'lendo' })
  }

  return (
    <div className="panel" style={{ marginBottom: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Link to={`/obra/${item.id}`}>
            <h3 style={{ marginBottom: 4 }}>
              {TIPOS[item.tipo].emoji} {item.titulo}
            </h3>
          </Link>
          <div className="meta" style={{ color: 'var(--muted)', fontSize: 13 }}>
            {autoria(item)}
          </div>
        </div>
        <span className={`chip ${prog.status === 'concluido' ? 'concluido' : 'lendo'}`}>
          {prog.status === 'concluido' ? 'Concluído' : 'Em andamento'}
        </span>
      </div>

      <div style={{ margin: '14px 0' }}>
        <div className="progress-label">
          <span>{pct}% concluído</span>
          <span>{legendaProgresso(item, prog)}</span>
        </div>
        <div className="progress">
          <i style={{ width: `${pct}%` }} />
        </div>
      </div>

      {item.tipo === 'livro' && (
        <div className="btn-row">
          <div className="stepper">
            <button className="btn sm" onClick={() => ajustarPagina(-10)}>
              −10
            </button>
            <button className="btn sm" onClick={() => ajustarPagina(-1)}>
              −1
            </button>
            <span className="val">{prog.paginaAtual || 0}</span>
            <button className="btn sm" onClick={() => ajustarPagina(1)}>
              +1
            </button>
            <button className="btn sm" onClick={() => ajustarPagina(10)}>
              +10
            </button>
          </div>
          <button className="btn sm primary" onClick={() => ajustarPagina(item.paginas)}>
            Marcar como lido
          </button>
        </div>
      )}

      {item.tipo === 'serie' && (
        <div className="btn-row">
          <div className="stepper">
            <button className="btn sm" onClick={() => ajustarEpisodio(-1)}>
              − ep.
            </button>
            <span className="val">
              ep. {prog.episodioAtual || 0}/{item.episodios}
            </span>
            <button className="btn sm primary" onClick={() => ajustarEpisodio(1)}>
              + ep. assistido
            </button>
          </div>
          <select
            value={prog.temporadaAtual || 1}
            onChange={(e) => onSalvar(item.id, { temporadaAtual: Number(e.target.value) })}
            style={{ width: 'auto' }}
          >
            {Array.from({ length: item.temporadas }, (_, i) => i + 1).map((t) => (
              <option key={t} value={t}>
                Temporada {t}
              </option>
            ))}
          </select>
        </div>
      )}

      {item.tipo === 'filme' && (
        <div className="btn-row">
          <div className="stepper">
            <button className="btn sm" onClick={() => ajustarMinuto(-15)}>
              −15min
            </button>
            <span className="val">{prog.minutoAtual || 0}min</span>
            <button className="btn sm" onClick={() => ajustarMinuto(15)}>
              +15min
            </button>
          </div>
          <button className="btn sm primary" onClick={() => ajustarMinuto(item.duracao)}>
            Marcar como assistido
          </button>
        </div>
      )}

      <div className="btn-row" style={{ marginTop: 12 }}>
        <button className="btn sm ghost" onClick={() => onRemover(item.id)}>
          Remover da coleção
        </button>
      </div>
    </div>
  )
}

function legendaProgresso(item, prog) {
  if (item.tipo === 'livro') return `pág. ${prog.paginaAtual || 0} de ${item.paginas}`
  if (item.tipo === 'filme') return `${prog.minutoAtual || 0} de ${item.duracao} min`
  return `ep. ${prog.episodioAtual || 0} de ${item.episodios}`
}
