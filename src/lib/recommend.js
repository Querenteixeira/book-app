import { CATALOGO } from '../data/catalog.js'

// Motor de recomendação por afinidade temática.
//
// Regra do produto: recomendar obras de temas parecidos, cruzando formatos.
//   - Lendo um livro de época  -> sugere telas (séries/filmes) de época.
//   - Assistindo ficção científica -> sugere livros de ficção científica.
//
// Tratamos "livro" de um lado e "telas" (série + filme) do outro. O formato
// oposto de um livro são as telas; o de uma tela são os livros.
//
// A pontuação é a similaridade de Jaccard entre os conjuntos de temas
// (interseção / união), com um bônus proporcional à quantidade de temas em
// comum, para que "época + romance" case melhor com outra obra "época +
// romance" do que com algo que divide um único tema.

function categoria(tipo) {
  return tipo === 'livro' ? 'livro' : 'tela'
}

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
  const bonus = intersecao / Math.max(a.size, b.size)
  return jaccard * 0.7 + bonus * 0.3
}

export function temasEmComum(itemA, itemB) {
  const b = new Set(itemB.temas)
  return itemA.temas.filter((tema) => b.has(tema))
}

/**
 * Recomenda obras parecidas com o item de referência.
 * @param {object} referencia - livro, série ou filme que a pessoa consome.
 * @param {object} [opcoes]
 * @param {'oposto'|'mesma'|'ambos'} [opcoes.grupo='oposto'] - grupo alvo.
 *        'oposto' = formato oposto (livro -> telas; tela -> livros);
 *        'mesma'  = mesma categoria da referência;
 *        'ambos'  = todo o catálogo.
 * @param {number} [opcoes.limite=6]
 */
export function recomendar(referencia, opcoes = {}) {
  const { grupo = 'oposto', limite = 6 } = opcoes
  const catRef = categoria(referencia.tipo)

  return CATALOGO.filter((item) => {
    if (item.id === referencia.id) return false
    if (grupo === 'ambos') return true
    const cat = categoria(item.tipo)
    return grupo === 'oposto' ? cat !== catRef : cat === catRef
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

// Rótulo do formato oposto, para textos da interface.
export function rotuloOposto(referencia) {
  return categoria(referencia.tipo) === 'livro' ? 'telas' : 'livros'
}
