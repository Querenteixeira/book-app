import { useCallback, useEffect, useState } from 'react'

// Persistência simples em localStorage. Guardamos o "estado da biblioteca":
// progresso de leitura/episódios e avaliações. Não há backend — os dados
// ficam no navegador da pessoa.

const CHAVE = 'enredo:biblioteca:v1'

const ESTADO_INICIAL = {
  // progresso[id] = { status, paginaAtual, temporadaAtual, episodioAtual, atualizadoEm }
  progresso: {},
  // avaliacoes[id] = { nota, resenha, atualizadoEm }
  avaliacoes: {},
}

function carregar() {
  try {
    const bruto = localStorage.getItem(CHAVE)
    if (!bruto) return ESTADO_INICIAL
    const dados = JSON.parse(bruto)
    return {
      progresso: dados.progresso || {},
      avaliacoes: dados.avaliacoes || {},
    }
  } catch {
    return ESTADO_INICIAL
  }
}

let memoria = carregar()
const ouvintes = new Set()

function notificar() {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(memoria))
  } catch {
    // Ignora falhas de escrita (ex.: modo privado com quota cheia).
  }
  for (const ouvinte of ouvintes) ouvinte(memoria)
}

// Hook que reexpõe o estado global e reage a mudanças de qualquer tela.
export function useBiblioteca() {
  const [estado, setEstado] = useState(memoria)

  useEffect(() => {
    ouvintes.add(setEstado)
    setEstado(memoria)
    return () => ouvintes.delete(setEstado)
  }, [])

  const salvarProgresso = useCallback((id, dados) => {
    memoria = {
      ...memoria,
      progresso: {
        ...memoria.progresso,
        [id]: {
          ...(memoria.progresso[id] || {}),
          ...dados,
          atualizadoEm: new Date().toISOString(),
        },
      },
    }
    notificar()
  }, [])

  const removerProgresso = useCallback((id) => {
    const copia = { ...memoria.progresso }
    delete copia[id]
    memoria = { ...memoria, progresso: copia }
    notificar()
  }, [])

  const salvarAvaliacao = useCallback((id, dados) => {
    memoria = {
      ...memoria,
      avaliacoes: {
        ...memoria.avaliacoes,
        [id]: {
          ...(memoria.avaliacoes[id] || {}),
          ...dados,
          atualizadoEm: new Date().toISOString(),
        },
      },
    }
    notificar()
  }, [])

  const removerAvaliacao = useCallback((id) => {
    const copia = { ...memoria.avaliacoes }
    delete copia[id]
    memoria = { ...memoria, avaliacoes: copia }
    notificar()
  }, [])

  return {
    progresso: estado.progresso,
    avaliacoes: estado.avaliacoes,
    salvarProgresso,
    removerProgresso,
    salvarAvaliacao,
    removerAvaliacao,
  }
}

// Calcula o percentual concluído de um item a partir do seu progresso.
export function percentualConcluido(item, prog) {
  if (!prog) return 0
  if (item.tipo === 'livro') {
    if (!item.paginas) return 0
    return Math.min(100, Math.round(((prog.paginaAtual || 0) / item.paginas) * 100))
  }
  if (!item.episodios) return 0
  return Math.min(100, Math.round(((prog.episodioAtual || 0) / item.episodios) * 100))
}
