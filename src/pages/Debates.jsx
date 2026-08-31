import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { LIVROS, buscarPorId, autoria } from '../data/catalog.js'
import { useBiblioteca } from '../lib/storage.js'
import PerfilNome from '../components/PerfilNome.jsx'

// Tela nova: Clube de Leitura. Poste um trecho favorito de um livro e debata
// com outras pessoas sobre o trecho e sobre a obra como um todo.
export default function Debates() {
  const { debates, perfil, salvarPerfil, criarDebate, comentarDebate, removerDebate } = useBiblioteca()
  const [livroId, setLivroId] = useState(LIVROS[0].id)
  const [titulo, setTitulo] = useState('')
  const [trecho, setTrecho] = useState('')
  const [filtroLivro, setFiltroLivro] = useState('todos')

  function publicar(e) {
    e.preventDefault()
    if (!titulo.trim() || !trecho.trim()) return
    criarDebate({ livroId, titulo: titulo.trim(), trecho: trecho.trim() })
    setTitulo('')
    setTrecho('')
  }

  const debatesFiltrados = useMemo(
    () => (filtroLivro === 'todos' ? debates : debates.filter((d) => d.livroId === filtroLivro)),
    [debates, filtroLivro],
  )

  const totalComentarios = debates.reduce((acc, d) => acc + d.comentarios.length, 0)

  // Livros que já têm debate, para o filtro.
  const livrosComDebate = [...new Set(debates.map((d) => d.livroId))]
    .map(buscarPorId)
    .filter(Boolean)

  return (
    <>
      <div className="page-head">
        <h1>Clube de Leitura ✦</h1>
        <p>
          A biblioteca de Velaris tem um salão só para conversas. Compartilhe o trecho que mais te marcou,
          conte por quê e debata com outras leitoras sobre a passagem e sobre o livro inteiro.
        </p>
      </div>

      <PerfilNome perfil={perfil} onSalvar={salvarPerfil} />

      <div className="row" style={{ marginTop: 4 }}>
        <div className="stat">
          <b>{debates.length}</b>
          <span>trechos em debate</span>
        </div>
        <div className="stat">
          <b>{totalComentarios}</b>
          <span>comentários na roda</span>
        </div>
        <div className="stat">
          <b>{livrosComDebate.length}</b>
          <span>livros comentados</span>
        </div>
      </div>

      {/* Novo trecho */}
      <form className="panel" onSubmit={publicar}>
        <h3>Compartilhar um trecho</h3>
        <div className="row" style={{ marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <label className="field" htmlFor="livro">
              Livro
            </label>
            <select id="livro" value={livroId} onChange={(e) => setLivroId(e.target.value)}>
              {LIVROS.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.titulo} — {l.autor}
                </option>
              ))}
            </select>
          </div>
          <div style={{ flex: 2 }}>
            <label className="field" htmlFor="titulo">
              Tema do debate
            </label>
            <input
              id="titulo"
              type="text"
              value={titulo}
              maxLength={90}
              placeholder="Ex.: O momento que mudou tudo para a personagem"
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>
        </div>
        <label className="field" htmlFor="trecho">
          O trecho (e, se quiser, por que ele te marcou)
        </label>
        <textarea
          id="trecho"
          value={trecho}
          placeholder="“Cole aqui a passagem favorita...” — e comente o que ela significou para você."
          onChange={(e) => setTrecho(e.target.value)}
        />
        <div className="btn-row" style={{ marginTop: 12 }}>
          <button className="btn primary" type="submit" disabled={!titulo.trim() || !trecho.trim()}>
            Publicar no clube
          </button>
        </div>
      </form>

      <div className="section-title">
        <h2>Rodas de conversa</h2>
        <select value={filtroLivro} onChange={(e) => setFiltroLivro(e.target.value)} style={{ width: 'auto' }}>
          <option value="todos">Todos os livros</option>
          {livrosComDebate.map((l) => (
            <option key={l.id} value={l.id}>
              {l.titulo}
            </option>
          ))}
        </select>
      </div>

      {debatesFiltrados.length ? (
        debatesFiltrados.map((d) => (
          <Debate
            key={d.id}
            debate={d}
            livro={buscarPorId(d.livroId)}
            perfil={perfil}
            onComentar={comentarDebate}
            onRemover={removerDebate}
          />
        ))
      ) : (
        <div className="empty">
          <h3>Nenhuma conversa ainda</h3>
          <p>Seja a primeira pessoa a compartilhar um trecho deste livro.</p>
        </div>
      )}
    </>
  )
}

function Debate({ debate, livro, perfil, onComentar, onRemover }) {
  const [texto, setTexto] = useState('')
  const meu = debate.autor === perfil?.nome

  function enviar(e) {
    e.preventDefault()
    if (!texto.trim()) return
    onComentar(debate.id, texto.trim())
    setTexto('')
  }

  return (
    <div className="panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h3 style={{ margin: 0 }}>{debate.titulo}</h3>
          <div className="meta" style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>
            {livro ? (
              <>
                sobre{' '}
                <Link to={`/obra/${livro.id}`} style={{ color: 'var(--accent-2)' }}>
                  {livro.titulo}
                </Link>{' '}
                · {autoria(livro)}
              </>
            ) : (
              'livro removido do acervo'
            )}
          </div>
        </div>
        <span className="meta" style={{ color: 'var(--muted)', fontSize: 12 }}>
          por {debate.autor} · {formatarData(debate.criadoEm)}
        </span>
      </div>

      <blockquote className="trecho">{debate.trecho}</blockquote>

      <div className="comentarios">
        {debate.comentarios.length === 0 && (
          <p className="meta" style={{ color: 'var(--muted)', fontSize: 13 }}>
            Ainda sem comentários — puxe a conversa.
          </p>
        )}
        {debate.comentarios.map((com) => (
          <div key={com.id} className="comentario">
            <div className="avatar" aria-hidden="true">
              {inicial(com.autor)}
            </div>
            <div>
              <div className="comentario-cab">
                <b>{com.autor}</b>
                <span>{formatarData(com.criadoEm)}</span>
              </div>
              <p>{com.texto}</p>
            </div>
          </div>
        ))}
      </div>

      <form className="responder" onSubmit={enviar}>
        <input
          type="text"
          value={texto}
          placeholder={`Comentar como ${perfil?.nome || 'você'}...`}
          onChange={(e) => setTexto(e.target.value)}
        />
        <button className="btn primary sm" type="submit" disabled={!texto.trim()}>
          Responder
        </button>
      </form>

      {meu && (
        <div className="btn-row" style={{ marginTop: 10 }}>
          <button className="btn sm ghost" onClick={() => onRemover(debate.id)}>
            Apagar meu tópico
          </button>
        </div>
      )}
    </div>
  )
}

function inicial(nome) {
  return (nome || '?').trim().charAt(0).toUpperCase()
}

function formatarData(iso) {
  try {
    return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
  } catch {
    return ''
  }
}
