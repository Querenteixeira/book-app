// Catálogo de livros e séries.
// Cada item recebe "temas" (tags) que o motor de recomendação usa para cruzar
// obras parecidas entre os dois formatos. A ideia central: se você lê um livro
// de época, o app sugere séries de época; se lê ficção científica, sugere
// séries de ficção científica com histórias parecidas, e vice-versa.

// Temas usados no catálogo (rótulos amigáveis exibidos na interface).
export const TEMAS = {
  epoca: 'Época / Histórico',
  ficcao_cientifica: 'Ficção científica',
  fantasia: 'Fantasia',
  misterio: 'Mistério / Crime',
  romance: 'Romance',
  distopia: 'Distopia',
  drama: 'Drama',
  aventura: 'Aventura',
  suspense: 'Suspense / Thriller',
  guerra: 'Guerra',
  politica: 'Política / Poder',
  sobrenatural: 'Sobrenatural',
  familia: 'Família / Saga',
  crescimento: 'Amadurecimento',
}

export const LIVROS = [
  {
    id: 'l-orgulho',
    tipo: 'livro',
    titulo: 'Orgulho e Preconceito',
    autor: 'Jane Austen',
    ano: 1813,
    paginas: 432,
    capa: '#c98a63',
    temas: ['epoca', 'romance', 'drama', 'familia'],
    sinopse:
      'Na Inglaterra rural do século XIX, Elizabeth Bennet enfrenta as convenções sociais, o casamento por conveniência e o orgulhoso Sr. Darcy.',
  },
  {
    id: 'l-guerra-paz',
    tipo: 'livro',
    titulo: 'Guerra e Paz',
    autor: 'Liev Tolstói',
    ano: 1869,
    paginas: 1225,
    capa: '#8a6d5e',
    temas: ['epoca', 'guerra', 'drama', 'romance', 'familia', 'politica'],
    sinopse:
      'A aristocracia russa vive amores, perdas e transformações durante as invasões napoleônicas do início do século XIX.',
  },
  {
    id: 'l-1984',
    tipo: 'livro',
    titulo: '1984',
    autor: 'George Orwell',
    ano: 1949,
    paginas: 328,
    capa: '#5e6d8a',
    temas: ['distopia', 'ficcao_cientifica', 'politica', 'suspense'],
    sinopse:
      'Em um regime totalitário que tudo vigia, Winston Smith arrisca tudo em busca de liberdade e verdade.',
  },
  {
    id: 'l-duna',
    tipo: 'livro',
    titulo: 'Duna',
    autor: 'Frank Herbert',
    ano: 1965,
    paginas: 688,
    capa: '#c9a24b',
    temas: ['ficcao_cientifica', 'aventura', 'politica', 'guerra'],
    sinopse:
      'No planeta desértico Arrakis, o jovem Paul Atreides é lançado em uma disputa por poder, profecia e a especiaria mais valiosa do universo.',
  },
  {
    id: 'l-senhor-aneis',
    tipo: 'livro',
    titulo: 'O Senhor dos Anéis',
    autor: 'J.R.R. Tolkien',
    ano: 1954,
    paginas: 1216,
    capa: '#4b7a5e',
    temas: ['fantasia', 'aventura', 'guerra', 'sobrenatural'],
    sinopse:
      'Uma jornada épica pela Terra-média para destruir um anel capaz de submeter todo o mundo às trevas.',
  },
  {
    id: 'l-nome-vento',
    tipo: 'livro',
    titulo: 'O Nome do Vento',
    autor: 'Patrick Rothfuss',
    ano: 2007,
    paginas: 656,
    capa: '#7a4b6d',
    temas: ['fantasia', 'aventura', 'crescimento', 'sobrenatural'],
    sinopse:
      'Kvothe relata sua trajetória de menino órfão a lendário arcanista, entre música, magia e mistérios.',
  },
  {
    id: 'l-garota-trem',
    tipo: 'livro',
    titulo: 'A Garota no Trem',
    autor: 'Paula Hawkins',
    ano: 2015,
    paginas: 336,
    capa: '#5e5e5e',
    temas: ['misterio', 'suspense', 'drama'],
    sinopse:
      'Rachel observa um casal da janela do trem todos os dias — até que uma testemunha some e ela se vê no centro da investigação.',
  },
  {
    id: 'l-sherlock',
    tipo: 'livro',
    titulo: 'Um Estudo em Vermelho',
    autor: 'Arthur Conan Doyle',
    ano: 1887,
    paginas: 176,
    capa: '#6d5e4b',
    temas: ['misterio', 'epoca', 'suspense'],
    sinopse:
      'A primeira aventura de Sherlock Holmes e Dr. Watson, desvendando um assassinato na Londres vitoriana.',
  },
  {
    id: 'l-conto-aia',
    tipo: 'livro',
    titulo: 'O Conto da Aia',
    autor: 'Margaret Atwood',
    ano: 1985,
    paginas: 368,
    capa: '#b23a48',
    temas: ['distopia', 'drama', 'politica', 'suspense'],
    sinopse:
      'Em Gilead, uma teocracia opressora, mulheres férteis são reduzidas a servas reprodutoras. Offred luta para sobreviver e resistir.',
  },
  {
    id: 'l-cem-anos',
    tipo: 'livro',
    titulo: 'Cem Anos de Solidão',
    autor: 'Gabriel García Márquez',
    ano: 1967,
    paginas: 448,
    capa: '#c96d3a',
    temas: ['familia', 'drama', 'sobrenatural', 'romance'],
    sinopse:
      'A saga de várias gerações da família Buendía na mítica Macondo, entre o real e o fantástico.',
  },
]

export const SERIES = [
  {
    id: 's-bridgerton',
    tipo: 'serie',
    titulo: 'Bridgerton',
    criador: 'Chris Van Dusen',
    ano: 2020,
    temporadas: 3,
    episodios: 24,
    capa: '#c98a9e',
    temas: ['epoca', 'romance', 'drama', 'familia'],
    sinopse:
      'A alta sociedade londrina do início do século XIX vive intrigas, bailes e romances sob o olhar da misteriosa Lady Whistledown.',
  },
  {
    id: 's-downton',
    tipo: 'serie',
    titulo: 'Downton Abbey',
    criador: 'Julian Fellowes',
    ano: 2010,
    temporadas: 6,
    episodios: 52,
    capa: '#8a7a5e',
    temas: ['epoca', 'drama', 'familia', 'politica'],
    sinopse:
      'A aristocrática família Crawley e seus criados atravessam as transformações sociais da Inglaterra do início do século XX.',
  },
  {
    id: 's-the-crown',
    tipo: 'serie',
    titulo: 'The Crown',
    criador: 'Peter Morgan',
    ano: 2016,
    temporadas: 6,
    episodios: 60,
    capa: '#5e6d7a',
    temas: ['epoca', 'politica', 'drama', 'familia'],
    sinopse:
      'A vida e o reinado da Rainha Elizabeth II, entre deveres de Estado, crises políticas e dramas familiares.',
  },
  {
    id: 's-expanse',
    tipo: 'serie',
    titulo: 'The Expanse',
    criador: 'Mark Fergus & Hawk Ostby',
    ano: 2015,
    temporadas: 6,
    episodios: 62,
    capa: '#4b5e8a',
    temas: ['ficcao_cientifica', 'aventura', 'politica', 'guerra'],
    sinopse:
      'Num futuro em que a humanidade colonizou o Sistema Solar, tensões entre Terra, Marte e o Cinturão beiram uma guerra total.',
  },
  {
    id: 's-black-mirror',
    tipo: 'serie',
    titulo: 'Black Mirror',
    criador: 'Charlie Brooker',
    ano: 2011,
    temporadas: 6,
    episodios: 33,
    capa: '#2e2e3a',
    temas: ['ficcao_cientifica', 'distopia', 'suspense', 'drama'],
    sinopse:
      'Histórias independentes que exploram o lado sombrio da tecnologia e seus efeitos sobre a sociedade.',
  },
  {
    id: 's-got',
    tipo: 'serie',
    titulo: 'Game of Thrones',
    criador: 'David Benioff & D.B. Weiss',
    ano: 2011,
    temporadas: 8,
    episodios: 73,
    capa: '#4b5e5e',
    temas: ['fantasia', 'aventura', 'guerra', 'politica', 'sobrenatural'],
    sinopse:
      'Famílias nobres disputam o Trono de Ferro de Westeros enquanto uma ameaça sobrenatural cresce no Norte.',
  },
  {
    id: 's-witcher',
    tipo: 'serie',
    titulo: 'The Witcher',
    criador: 'Lauren Schmidt Hissrich',
    ano: 2019,
    temporadas: 3,
    episodios: 24,
    capa: '#6d6d4b',
    temas: ['fantasia', 'aventura', 'sobrenatural', 'crescimento'],
    sinopse:
      'O caçador de monstros Geralt de Rívia cruza destinos com uma feiticeira e uma princesa em um continente em guerra.',
  },
  {
    id: 's-true-detective',
    tipo: 'serie',
    titulo: 'True Detective',
    criador: 'Nic Pizzolatto',
    ano: 2014,
    temporadas: 4,
    episodios: 30,
    capa: '#5e4b3a',
    temas: ['misterio', 'suspense', 'drama'],
    sinopse:
      'Detetives investigam crimes perturbadores que revelam tanto sobre os culpados quanto sobre si mesmos.',
  },
  {
    id: 's-sherlock-bbc',
    tipo: 'serie',
    titulo: 'Sherlock',
    criador: 'Mark Gatiss & Steven Moffat',
    ano: 2010,
    temporadas: 4,
    episodios: 13,
    capa: '#4b5e6d',
    temas: ['misterio', 'suspense', 'drama'],
    sinopse:
      'Uma releitura moderna de Sherlock Holmes, que usa métodos brilhantes para resolver crimes na Londres atual.',
  },
  {
    id: 's-handmaids',
    tipo: 'serie',
    titulo: "The Handmaid's Tale",
    criador: 'Bruce Miller',
    ano: 2017,
    temporadas: 6,
    episodios: 56,
    capa: '#b23a48',
    temas: ['distopia', 'drama', 'politica', 'suspense'],
    sinopse:
      'Na teocracia de Gilead, June luta para sobreviver como aia e reencontrar a filha, resistindo a um regime brutal.',
  },
  {
    id: 's-outlander',
    tipo: 'serie',
    titulo: 'Outlander',
    criador: 'Ronald D. Moore',
    ano: 2014,
    temporadas: 7,
    episodios: 101,
    capa: '#4b6d5e',
    temas: ['epoca', 'romance', 'aventura', 'drama'],
    sinopse:
      'Uma enfermeira dos anos 1940 é transportada para a Escócia do século XVIII, onde vive amor e perigo em meio a conflitos históricos.',
  },
  {
    id: 's-vikings',
    tipo: 'serie',
    titulo: 'Vikings',
    criador: 'Michael Hirst',
    ano: 2013,
    temporadas: 6,
    episodios: 89,
    capa: '#5e5e4b',
    temas: ['epoca', 'aventura', 'guerra', 'drama'],
    sinopse:
      'A ascensão do lendário guerreiro Ragnar Lothbrok e suas incursões pela Europa medieval.',
  },
]

export const CATALOGO = [...LIVROS, ...SERIES]

export function buscarPorId(id) {
  return CATALOGO.find((item) => item.id === id)
}

export function nomeTema(chave) {
  return TEMAS[chave] || chave
}
