import { CATALOGO } from '../data/catalog.js'

// Motor de recomendação por afinidade temática.
//
// Regra do produto: recomendar obras de temas parecidos, cruzando formatos.
//   - Lendo um livro de época  -> sugere séries de época.
//   - Lendo ficção científica  -> sugere ficção científica com história parecida.
//
// A pontuação é a similaridade de Jaccard entre os conjuntos de temas
// (interseção / união), o que valoriza obras que compartilham muitos temas e
// penaliza combinações rasas. Pesamos um pouco a mais os temas em comum para
// que "de época + romance" case melhor com outra obra "de época + romance"
// do que com uma obra que só divide um tema.

function similaridade(temasA, temasB) {
  const a = new Set(temasA)
  const b = new Set(temasB)
  let intersecao = 0
  for (const tema of a) {
    if (b.has(tema)) intersecao += 1
  }
  if (intersecao === 0) return 0
  const uniao = new Set([...a, ...b]).size
  const jaccard = intersecao / uniao
  // Bônus proporcional à quantidade absoluta de temas em comum.
  const bonus = intersecao / Math.max(a.size, b.size)
  return jaccard * 0.7 + bonus * 0.3
}

export function temasEmComum(itemA, itemB) {
  const b = new Set(itemB.temas)
  return itemA.temas.filter((tema) => b.has(tema))
}

/**
 * Recomenda obras parecidas com o item de referência.
 * @param {object} referencia - livro ou série que a pessoa está consumindo.
 * @param {object} [opcoes]
 * @param {'livro'|'serie'|'ambos'} [opcoes.tipoAlvo='oposto'] - formato desejado.
 *        Por padrão recomenda o formato OPOSTO (lendo livro -> sugere série).
 * @param {number} [opcoes.limite=6]
 */
export function recomendar(referencia, opcoes = {}) {
  const { tipoAlvo = 'oposto', limite = 6 } = opcoes

  const alvo =
    tipoAlvo === 'oposto'
      ? referencia.tipo === 'livro'
        ? 'serie'
        : 'livro'
      : tipoAlvo

  return CATALOGO.filter((item) => {
    if (item.id === referencia.id) return false
    if (alvo !== 'ambos' && item.tipo !== alvo) return false
    return true
  })
    .map((item) => ({
      item,
      score: similaridade(referencia.temas, item.temas),
      comum: temasEmComum(referencia, item),
    }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limite)
}

/**
 * A partir de tudo que a pessoa está lendo/assistindo, produz um feed de
 * recomendações cruzadas, sem repetir itens já em progresso.
 */
export function feedRecomendacoes(itensEmProgresso, limite = 8) {
  const idsEmProgresso = new Set(itensEmProgresso.map((i) => i.id))
  const acumulado = new Map()

  for (const referencia of itensEmProgresso) {
    for (const rec of recomendar(referencia, { limite: 12 })) {
      if (idsEmProgresso.has(rec.item.id)) continue
      const atual = acumulado.get(rec.item.id)
      if (!atual || rec.score > atual.score) {
        acumulado.set(rec.item.id, { ...rec, origem: referencia })
      }
    }
  }

  return [...acumulado.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, limite)
}
