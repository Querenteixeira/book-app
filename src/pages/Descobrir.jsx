import { useMemo, useState } from 'react'
import { CATALOGO, LIVROS, SERIES, FILMES, TEMAS, buscarPorId, nomeTema } from '../data/catalog.js'
import { recomendar, feedRecomendacoes, rotuloOposto } from '../lib/recommend.js'
import { useBiblioteca } from '../lib/storage.js'
import ObraCard from '../components/ObraCard.jsx'

// Tela principal: descoberta por afinidade temática.
// A pessoa escolhe uma obra de referência (ou o app usa o que ela consome)
// e recebe recomendações do formato oposto (livro <-> telas) e do mesmo grupo.
export default function Descobrir() {
  const { progresso } = useBiblioteca()

  const emProgresso = useMemo(
    () =>
      Object.keys(progresso)
        .map((id) => buscarPorId(id))
        .filter(Boolean)
        .filter((i) => progresso[i.id]?.status !== 'concluido'),
    [progresso],
  )

  // Referência padrão: primeira obra em andamento; senão, a joia da corte.
  const [refId, setRefId] = useState(null)
  const referencia = refId ? buscarPorId(refId) : emProgresso[0] || LIVROS[0]

  // Filtros do catálogo (novo): por formato e por tema.
  const [formato, setFormato] = useState('todos')
  const [temaFiltro, setTemaFiltro] = useState('todos')

  const recsOpostas = useMemo(() => recomendar(referencia, { grupo: 'oposto', limite: 6 }), [referencia])
  const recsMesmo = useMemo(() => recomendar(referencia, { grupo: 'mesma', limite: 6 }), [referencia])
  const feed = useMemo(() => feedRecomendacoes(emProgresso, 8), [emProgresso])

  const formatoOposto = rotuloOposto(referencia)

  const catalogoFiltrado = CATALOGO.filter((i) => {
    const okFormato = formato === 'todos' || i.tipo === formato
    const okTema = temaFiltro === 'todos' || i.temas.includes(temaFiltro)
    return okFormato && okTema
  })

  // Temas presentes no catálogo, para o seletor.
  const temasDisponiveis = Object.keys(TEMAS).filter((t) => CATALOGO.some((i) => i.temas.includes(t)))

  return (
    <>
      <div className="page-head">
        <h1>Bem-vinda a Velaris ✦</h1>
        <p>
          Na cidade da luz estelar, cada obra é uma estrela. Escolha algo que você está lendo ou assistindo
          e Velaris recomenda histórias de temas parecidos — cruzando formatos. Lendo um livro de época?
          Receba séries e filmes de época. Encantada por uma romantasy? Encontre histórias irmãs no outro
          formato.
        </p>
      </div>

      <div className="panel">
        <label className="field" htmlFor="ref">
          A estrela que guia suas recomendações
        </label>
        <div className="row" style={{ alignItems: 'center' }}>
          <select id="ref" value={referencia.id} onChange={(e) => setRefId(e.target.value)}>
            <optgroup label="📖 Livros">
              {LIVROS.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.titulo} — {l.autor}
                </option>
              ))}
            </optgroup>
            <optgroup label="📺 Séries">
              {SERIES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.titulo} — {s.criador}
                </option>
              ))}
            </optgroup>
            <optgroup label="🎬 Filmes">
              {FILMES.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.titulo} — {f.diretor}
                </option>
              ))}
            </optgroup>
          </select>
          <div className="tags" style={{ flex: 2 }}>
            {referencia.temas.map((t) => (
              <span key={t} className="tag match">
                {nomeTema(t)}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="section-title">
        <h2>
          Porque você curte <em>{referencia.titulo}</em>, veja estas {formatoOposto}
        </h2>
        <span>temas em comum destacados</span>
      </div>
      {recsOpostas.length ? (
        <div className="grid">
          {recsOpostas.map((r) => (
            <ObraCard key={r.item.id} item={r.item} temasDestaque={r.comum} />
          ))}
        </div>
      ) : (
        <div className="empty">Sem recomendações no formato oposto para estes temas.</div>
      )}

      <div className="section-title">
        <h2>Também parecidos ({referencia.tipo === 'livro' ? 'livros' : 'telas'})</h2>
      </div>
      {recsMesmo.length ? (
        <div className="grid">
          {recsMesmo.map((r) => (
            <ObraCard key={r.item.id} item={r.item} temasDestaque={r.comum} />
          ))}
        </div>
      ) : (
        <div className="empty">Nada parecido no mesmo grupo ainda.</div>
      )}

      {feed.length > 0 && (
        <>
          <div className="section-title">
            <h2>Constelação da sua biblioteca</h2>
            <span>com base em tudo que você acompanha</span>
          </div>
          <div className="grid">
            {feed.map((r) => (
              <ObraCard
                key={r.item.id}
                item={r.item}
                temasDestaque={r.comum}
                rodape={
                  <div className="meta" style={{ fontSize: 12 }}>
                    porque você acompanha <b>{r.origem.titulo}</b>
                  </div>
                }
              />
            ))}
          </div>
        </>
      )}

      <div className="section-title">
        <h2>Acervo da corte</h2>
        <span>
          {catalogoFiltrado.length} de {CATALOGO.length} obras
        </span>
      </div>

      <div className="panel" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: 1, minWidth: 180 }}>
          <label className="field">Formato</label>
          <div className="filtros">
            {[
              ['todos', 'Todos'],
              ['livro', '📖 Livros'],
              ['serie', '📺 Séries'],
              ['filme', '🎬 Filmes'],
            ].map(([valor, rotulo]) => (
              <button
                key={valor}
                className={`btn sm ${formato === valor ? 'primary' : ''}`}
                onClick={() => setFormato(valor)}
              >
                {rotulo}
              </button>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 180 }}>
          <label className="field" htmlFor="tema">
            Tema
          </label>
          <select id="tema" value={temaFiltro} onChange={(e) => setTemaFiltro(e.target.value)}>
            <option value="todos">Todos os temas</option>
            {temasDisponiveis.map((t) => (
              <option key={t} value={t}>
                {nomeTema(t)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {catalogoFiltrado.length ? (
        <div className="grid">
          {catalogoFiltrado.map((item) => (
            <ObraCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="empty">Nenhuma obra com esse filtro. Tente outra combinação.</div>
      )}
    </>
  )
}
