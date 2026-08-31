import { useState } from 'react'

// Pequeno controle para definir o nome de exibição na corte, usado no clube
// de leitura e no ateliê para assinar comentários e fanarts.
export default function PerfilNome({ perfil, onSalvar }) {
  const [editando, setEditando] = useState(false)
  const [nome, setNome] = useState(perfil?.nome || '')

  function salvar() {
    const limpo = nome.trim()
    if (limpo) onSalvar({ nome: limpo })
    setEditando(false)
  }

  return (
    <div className="perfil-nome">
      <span className="avatar" aria-hidden="true">
        {(perfil?.nome || '?').charAt(0).toUpperCase()}
      </span>
      {editando ? (
        <>
          <input
            type="text"
            value={nome}
            maxLength={30}
            autoFocus
            onChange={(e) => setNome(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && salvar()}
          />
          <button className="btn sm primary" onClick={salvar}>
            Salvar
          </button>
        </>
      ) : (
        <>
          <span className="meta" style={{ color: 'var(--muted)' }}>
            Na corte você é <b style={{ color: 'var(--text)' }}>{perfil?.nome}</b>
          </span>
          <button className="btn sm ghost" onClick={() => setEditando(true)}>
            trocar nome
          </button>
        </>
      )}
    </div>
  )
}
