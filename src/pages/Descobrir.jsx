import { useMemo, useState } from 'react'
import { CATALOGO, LIVROS, SERIES, buscarPorId } from '../data/catalog.js'
import { recomendar, feedRecomendacoes } from '../lib/recommend.js'
import { useBiblioteca } from '../lib/storage.js'
import ObraCard from '../components/ObraCard.jsx'

// Tela principal: descoberta por afinidade temática.
// A pessoa escolhe uma obra de referência (ou o app usa o que ela está lendo)
// e recebe recomendações do formato oposto — e também do mesmo formato.
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

  // Referência padrão: primeira obra em andamento; senão, um livro do catálogo.
  const [refId, setRefId] = useState(null)
  const referencia = refId ? buscarPorId(refId) : emProgresso[0] || LIVROS[0]

  const recsOpostas = useMemo(() => recomendar(referencia, { tipoAlvo: 'oposto', limite: 6 }), [referencia])
  const recsMesmoTipo = useMemo(
    () => recomendar(referencia, { tipoAlvo: referencia.tipo, limite: 6 }),
    [referencia],
  )
  const feed = useMemo(() => feedRecomendacoes(emProgresso, 8), [emProgresso])

  const formatoOposto = referencia.tipo === 'livro' ? 'séries' : 'livros'

  return (
    <>
      <div className="page-head">
        <h1>Descobrir por afinidade</h1>
        <p>
          Escolha algo que você está lendo ou assistindo e o Enredo recomenda obras de temas parecidos —
          cruzando formatos. Lendo um livro de época? Receba séries de época. Curtindo ficção científica?
          Encontre histórias parecidas no outro formato.
        </p>
      </div>

      <div className="panel">
        <label className="field" htmlFor="ref">
          Base da recomendação
        </label>
        <div className="row" style={{ alignItems: 'center' }}>
          <select
            id="ref"
            value={referencia.id}
            onChange={(e) => setRefId(e.target.value)}
          >
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
          </select>
          <div className="tags" style={{ flex: 2 }}>
            {referencia.temas.map((t) => (
              <span key={t} className="tag match">
                {t}
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
        <h2>Mais {referencia.tipo === 'livro' ? 'livros' : 'séries'} parecidos</h2>
      </div>
      {recsMesmoTipo.length ? (
        <div className="grid">
          {recsMesmoTipo.map((r) => (
            <ObraCard key={r.item.id} item={r.item} temasDestaque={r.comum} />
          ))}
        </div>
      ) : (
        <div className="empty">Nada parecido no mesmo formato ainda.</div>
      )}

      {feed.length > 0 && (
        <>
          <div className="section-title">
            <h2>Sugestões para a sua biblioteca</h2>
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
        <h2>Catálogo completo</h2>
        <span>{CATALOGO.length} obras</span>
      </div>
      <div className="grid">
        {CATALOGO.map((item) => (
          <ObraCard key={item.id} item={item} />
        ))}
      </div>
    </>
  )
}
