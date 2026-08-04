import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CATALOGO, buscarPorId } from '../data/catalog.js'
import { useBiblioteca } from '../lib/storage.js'
import Estrelas from '../components/Estrelas.jsx'

// Tela 2 de apoio: avaliações. A pessoa dá nota (estrelas) e escreve uma
// resenha para livros e séries. Um mesmo lugar mostra tudo já avaliado e
// permite avaliar qualquer obra do catálogo.
export default function Avaliacoes() {
  const { avaliacoes, salvarAvaliacao, removerAvaliacao } = useBiblioteca()
  const [filtro, setFiltro] = useState('todos')

  const avaliadas = useMemo(
    () =>
      Object.keys(avaliacoes)
        .map((id) => ({ item: buscarPorId(id), av: avaliacoes[id] }))
        .filter((x) => x.item && x.av?.nota)
        .sort((a, b) => (b.av.atualizadoEm || '').localeCompare(a.av.atualizadoEm || '')),
    [avaliacoes],
  )

  const mediaLivros = media(avaliadas.filter((x) => x.item.tipo === 'livro'))
  const mediaSeries = media(avaliadas.filter((x) => x.item.tipo === 'serie'))

  const catalogoFiltrado = CATALOGO.filter((i) => filtro === 'todos' || i.tipo === filtro)

  return (
    <>
      <div className="page-head">
        <h1>Avaliações</h1>
        <p>
          Dê a sua nota e registre uma resenha para cada livro e cada série. As médias ajudam a lembrar o
          que valeu a pena — e o que recomendar para outras pessoas.
        </p>
      </div>

      <div className="row">
        <div className="stat">
          <b>{avaliadas.length}</b>
          <span>obras avaliadas</span>
        </div>
        <div className="stat">
          <b>{mediaLivros ? `${mediaLivros} ★` : '—'}</b>
          <span>média dos livros</span>
        </div>
        <div className="stat">
          <b>{mediaSeries ? `${mediaSeries} ★` : '—'}</b>
          <span>média das séries</span>
        </div>
      </div>

      {avaliadas.length > 0 && (
        <>
          <div className="section-title">
            <h2>Suas avaliações</h2>
          </div>
          {avaliadas.map(({ item, av }) => (
            <CartaoAvaliacao
              key={item.id}
              item={item}
              av={av}
              onSalvar={salvarAvaliacao}
              onRemover={removerAvaliacao}
              editando={false}
            />
          ))}
        </>
      )}

      <div className="section-title">
        <h2>Avaliar do catálogo</h2>
        <div className="btn-row">
          <button className={`btn sm ${filtro === 'todos' ? 'primary' : ''}`} onClick={() => setFiltro('todos')}>
            Todos
          </button>
          <button className={`btn sm ${filtro === 'livro' ? 'primary' : ''}`} onClick={() => setFiltro('livro')}>
            📖 Livros
          </button>
          <button className={`btn sm ${filtro === 'serie' ? 'primary' : ''}`} onClick={() => setFiltro('serie')}>
            📺 Séries
          </button>
        </div>
      </div>
      {catalogoFiltrado.map((item) => (
        <CartaoAvaliacao
          key={item.id}
          item={item}
          av={avaliacoes[item.id]}
          onSalvar={salvarAvaliacao}
          onRemover={removerAvaliacao}
          editando
        />
      ))}
    </>
  )
}

// Cartão de avaliação com estrelas + resenha. Funciona tanto para exibir
// avaliações existentes quanto para criar/editar novas.
function CartaoAvaliacao({ item, av, onSalvar, onRemover, editando }) {
  const [resenha, setResenha] = useState(av?.resenha || '')
  const [aberto, setAberto] = useState(editando && !av?.nota ? false : true)

  return (
    <div className="panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div>
          <Link to={`/obra/${item.id}`}>
            <h3 style={{ margin: 0 }}>
              {item.tipo === 'livro' ? '📖' : '📺'} {item.titulo}
            </h3>
          </Link>
          <div className="meta" style={{ color: 'var(--muted)', fontSize: 13 }}>
            {item.tipo === 'livro' ? item.autor : item.criador} · {item.ano}
          </div>
        </div>
        <Estrelas valor={av?.nota || 0} onChange={(n) => onSalvar(item.id, { nota: n })} />
      </div>

      {aberto && (
        <div style={{ marginTop: 14 }}>
          <label className="field">Sua resenha</label>
          <textarea
            value={resenha}
            placeholder={`O que você achou de ${item.titulo}?`}
            onChange={(e) => setResenha(e.target.value)}
            onBlur={() => resenha !== (av?.resenha || '') && onSalvar(item.id, { resenha })}
          />
          <div className="btn-row" style={{ marginTop: 10 }}>
            <button className="btn sm primary" onClick={() => onSalvar(item.id, { resenha })}>
              Salvar resenha
            </button>
            {av?.nota ? (
              <button
                className="btn sm ghost"
                onClick={() => {
                  onRemover(item.id)
                  setResenha('')
                }}
              >
                Remover avaliação
              </button>
            ) : null}
            {av?.atualizadoEm && (
              <span className="meta" style={{ color: 'var(--muted)', fontSize: 12 }}>
                atualizado em {new Date(av.atualizadoEm).toLocaleDateString('pt-BR')}
              </span>
            )}
          </div>
        </div>
      )}

      {!aberto && (
        <button className="btn sm ghost" style={{ marginTop: 12 }} onClick={() => setAberto(true)}>
          + escrever resenha
        </button>
      )}
    </div>
  )
}

function media(lista) {
  if (!lista.length) return null
  const soma = lista.reduce((acc, x) => acc + (x.av.nota || 0), 0)
  return (soma / lista.length).toFixed(1)
}
