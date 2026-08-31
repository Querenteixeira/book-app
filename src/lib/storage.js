import { useCallback, useEffect, useState } from 'react'

// Persistência simples em localStorage. Guardamos o "estado da corte":
// progresso de leitura/episódios, avaliações, debates do clube de leitura,
// fanarts do ateliê e um perfil com o nome de exibição. Não há backend — os
// dados ficam no navegador da pessoa.

const CHAVE = 'velaris:corte:v2'

function novoId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

// Debates iniciais (sementes) para o clube não nascer vazio — simulam outras
// leitoras conversando. A pessoa pode responder e criar novos tópicos.
function debatesIniciais() {
  return [
    {
      id: 'seed-1',
      livroId: 'l-acomaf',
      titulo: 'A cidade que me devolveu a vida',
      trecho:
        '“Ela olhou para o céu de Velaris e, pela primeira vez em muito tempo, permitiu-se respirar. As estrelas não a julgavam.”',
      autor: 'Aisling',
      criadoEm: '2026-08-20T18:30:00.000Z',
      comentarios: [
        {
          id: 'seed-1-c1',
          autor: 'Morrigan_23',
          texto:
            'Esse trecho me quebrou. É o momento em que ela entende que sobreviver e viver não são a mesma coisa. Chorei litros. 😭',
          criadoEm: '2026-08-20T19:10:00.000Z',
        },
        {
          id: 'seed-1-c2',
          autor: 'leitora_da_corte',
          texto:
            'Concordo! E acho que Velaris funciona quase como uma personagem: ela cura a Feyre aos poucos. Alguém mais sentiu isso?',
          criadoEm: '2026-08-21T09:02:00.000Z',
        },
      ],
    },
    {
      id: 'seed-2',
      livroId: 'l-gone-girl',
      titulo: 'A narradora em quem não dá para confiar (sem spoiler pesado)',
      trecho:
        '“Toda história de amor tem dois lados. O problema é quando os dois lados estão mentindo.”',
      autor: 'Rhysand_fan',
      criadoEm: '2026-08-25T14:00:00.000Z',
      comentarios: [
        {
          id: 'seed-2-c1',
          autor: 'clube_meia_noite',
          texto:
            'O jogo de narradores não confiáveis aqui é magistral. Quando a perspectiva vira, você precisa reler tudo com outros olhos.',
          criadoEm: '2026-08-25T15:20:00.000Z',
        },
      ],
    },
  ]
}

// Fanart inicial (exemplo criado no próprio ateliê) para a galeria não nascer
// vazia. Usa a configuração do designer de personagem em SVG.
function fanartsIniciais() {
  return [
    {
      id: 'seed-fa-1',
      tipo: 'designer',
      livroId: 'l-acomaf',
      personagem: 'Dama da Corte Noturna',
      descricao:
        'Inspirada em Velaris: vestido violeta com fio de estrelas, asas de fae e uma tatuagem que sobe pela mão.',
      autor: 'Aisling',
      criadoEm: '2026-08-22T20:00:00.000Z',
      config: {
        corte: 'noturna',
        pele: '#e8c9a8',
        cabeloCor: '#2b2b3a',
        cabeloEstilo: 'longo',
        roupaTipo: 'vestido',
        roupaCor: '#6d3f8a',
        asas: true,
        mascara: false,
        coroa: true,
        tatuagem: true,
      },
    },
  ]
}

const ESTADO_INICIAL = {
  progresso: {}, // progresso[id] = { status, paginaAtual, temporadaAtual, episodioAtual, minutoAtual, atualizadoEm }
  avaliacoes: {}, // avaliacoes[id] = { nota, resenha, atualizadoEm }
  debates: debatesIniciais(), // lista de tópicos com comentários
  fanarts: fanartsIniciais(), // lista de artes (designer ou upload)
  perfil: { nome: 'Viajante de Velaris' },
}

function carregar() {
  try {
    const bruto = localStorage.getItem(CHAVE)
    if (!bruto) return ESTADO_INICIAL
    const dados = JSON.parse(bruto)
    return {
      progresso: dados.progresso || {},
      avaliacoes: dados.avaliacoes || {},
      debates: dados.debates || debatesIniciais(),
      fanarts: dados.fanarts || fanartsIniciais(),
      perfil: dados.perfil || { nome: 'Viajante de Velaris' },
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
    // Ignora falhas de escrita (ex.: quota cheia por fanarts grandes).
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

  // ----- Progresso -----
  const salvarProgresso = useCallback((id, dados) => {
    memoria = {
      ...memoria,
      progresso: {
        ...memoria.progresso,
        [id]: { ...(memoria.progresso[id] || {}), ...dados, atualizadoEm: new Date().toISOString() },
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

  // ----- Avaliações -----
  const salvarAvaliacao = useCallback((id, dados) => {
    memoria = {
      ...memoria,
      avaliacoes: {
        ...memoria.avaliacoes,
        [id]: { ...(memoria.avaliacoes[id] || {}), ...dados, atualizadoEm: new Date().toISOString() },
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

  // ----- Perfil -----
  const salvarPerfil = useCallback((dados) => {
    memoria = { ...memoria, perfil: { ...memoria.perfil, ...dados } }
    notificar()
  }, [])

  // ----- Debates (clube de leitura) -----
  const criarDebate = useCallback(({ livroId, titulo, trecho }) => {
    const novo = {
      id: novoId(),
      livroId,
      titulo,
      trecho,
      autor: memoria.perfil?.nome || 'Anônimo',
      criadoEm: new Date().toISOString(),
      comentarios: [],
    }
    memoria = { ...memoria, debates: [novo, ...memoria.debates] }
    notificar()
    return novo.id
  }, [])

  const comentarDebate = useCallback((debateId, texto) => {
    memoria = {
      ...memoria,
      debates: memoria.debates.map((d) =>
        d.id === debateId
          ? {
              ...d,
              comentarios: [
                ...d.comentarios,
                {
                  id: novoId(),
                  autor: memoria.perfil?.nome || 'Anônimo',
                  texto,
                  criadoEm: new Date().toISOString(),
                },
              ],
            }
          : d,
      ),
    }
    notificar()
  }, [])

  const removerDebate = useCallback((debateId) => {
    memoria = { ...memoria, debates: memoria.debates.filter((d) => d.id !== debateId) }
    notificar()
  }, [])

  // ----- Fanarts (ateliê) -----
  const salvarFanart = useCallback((dados) => {
    const nova = {
      id: novoId(),
      autor: memoria.perfil?.nome || 'Anônimo',
      criadoEm: new Date().toISOString(),
      ...dados,
    }
    memoria = { ...memoria, fanarts: [nova, ...memoria.fanarts] }
    notificar()
    return nova.id
  }, [])

  const removerFanart = useCallback((id) => {
    memoria = { ...memoria, fanarts: memoria.fanarts.filter((f) => f.id !== id) }
    notificar()
  }, [])

  return {
    progresso: estado.progresso,
    avaliacoes: estado.avaliacoes,
    debates: estado.debates,
    fanarts: estado.fanarts,
    perfil: estado.perfil,
    salvarProgresso,
    removerProgresso,
    salvarAvaliacao,
    removerAvaliacao,
    salvarPerfil,
    criarDebate,
    comentarDebate,
    removerDebate,
    salvarFanart,
    removerFanart,
  }
}

// Calcula o percentual concluído de um item a partir do seu progresso.
export function percentualConcluido(item, prog) {
  if (!prog) return 0
  if (item.tipo === 'livro') {
    if (!item.paginas) return 0
    return Math.min(100, Math.round(((prog.paginaAtual || 0) / item.paginas) * 100))
  }
  if (item.tipo === 'filme') {
    if (!item.duracao) return 0
    return Math.min(100, Math.round(((prog.minutoAtual || 0) / item.duracao) * 100))
  }
  if (!item.episodios) return 0
  return Math.min(100, Math.round(((prog.episodioAtual || 0) / item.episodios) * 100))
}
