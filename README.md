# ✦ Velaris — Livros, Séries & Filmes

Aplicativo que **recomenda livros, séries e filmes de temas parecidos, cruzando formatos**.
A ideia é simples: o que você lê conversa com o que você assiste.

Ambientado em **Velaris, a cidade da luz estelar** (a Corte Noturna da saga *Corte de Espinhos e Rosas*, de Sarah J. Maas), o app tem um céu estrelado vivo, o símbolo das três estrelas e uma paleta violeta/prata. Cada obra que você conclui vira mais uma **estrela na sua constelação**.

> Está lendo um livro **de época**? Velaris sugere **séries e filmes de época**.
> Encantada por uma **romantasy**? Ele encontra histórias irmãs no outro formato.

Além das recomendações, o app traz telas de apoio para **acompanhar seu progresso** (páginas, episódios e minutos) e **avaliar** cada obra.

---

## ✨ Funcionalidades

### 1. Descobrir por afinidade (tela principal)
- Escolha uma obra de referência (ou o app usa o que você está acompanhando).
- Receba recomendações **do formato oposto** (livro ↔ telas, ou seja, séries e filmes) e **do mesmo grupo**.
- Cada card destaca os **temas em comum**, deixando claro *por que* aquela obra foi recomendada.
- Feed **"Constelação da sua biblioteca"** combina tudo o que você acompanha.
- **Filtros de acervo** por formato (livro / série / filme) e por tema.

### 2. Meu progresso (tela de apoio nº 1)
- **Livros:** por **páginas lidas**, com barra de progresso e botões rápidos (±1 / ±10 / marcar como lido).
- **Séries:** por **temporada e episódio**, com contagem de episódios assistidos.
- **Filmes:** por **minutos assistidos** (±15 min) ou "marcar como assistido".
- Resumo geral: páginas lidas, episódios vistos, filmes acompanhados, obras na coleção e **estrelas conquistadas**.
- O que você marca aqui alimenta as recomendações da tela Descobrir.

### 3. Avaliações (tela de apoio nº 2)
- Dê uma **nota de 1 a 5 estrelas** para livros, séries e filmes.
- Escreva uma **resenha** para cada obra.
- Veja a **média das suas notas** separada por livros, séries e filmes.
- Avalie qualquer título direto do acervo, com filtro por formato.

### 4. Detalhe da obra
- Sinopse, ficha técnica e temas.
- Sua nota e resenha exibidas ali mesmo.
- Atalhos para começar a acompanhar o progresso e para avaliar.
- Recomendações de temas parecidos no formato oposto e no mesmo grupo.

Todos os dados (progresso e avaliações) ficam salvos localmente no navegador (`localStorage`) — sem necessidade de cadastro ou backend.

O acervo já vem com **livros, séries e filmes** (dezenas de títulos), incluindo obras da própria saga que inspira o tema.

---

## 🧠 Como funciona a recomendação

Cada obra do catálogo recebe um conjunto de **temas** (ex.: `época`, `ficção científica`, `mistério`, `romance`, `distopia`, `fantasia`…).

O motor de recomendação (`src/lib/recommend.js`) mede a **afinidade temática** entre duas obras usando uma variação da **similaridade de Jaccard**:

```
score = 0.7 × (temas em comum ÷ união dos temas)
      + 0.3 × (temas em comum ÷ maior conjunto de temas)
```

- O primeiro termo valoriza obras que compartilham *proporcionalmente* muitos temas.
- O segundo dá um empurrão a quem tem *bastante* tema em comum no valor absoluto.

Por padrão, a recomendação busca o **formato oposto** ao da obra de referência: os títulos são agrupados em **livros** de um lado e **telas** (séries + filmes) do outro. É isso que cria a ponte "livro ↔ tela". Também é possível pedir recomendações do mesmo grupo ou de todo o acervo.

---

## 🛠️ Tecnologias

- [React 18](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [Vite](https://vitejs.dev/) (build e dev server)
- `localStorage` para persistência local

---

## 🚀 Como rodar

Pré-requisitos: **Node.js 18+**.

```bash
# instalar dependências
npm install

# ambiente de desenvolvimento (http://localhost:5173)
npm run dev

# build de produção
npm run build

# pré-visualizar o build (http://localhost:4173)
npm run preview
```

---

## 🌐 Publicação no GitHub Pages

O projeto já vem pronto para o GitHub Pages:

- `vite.config.js` define `base: '/book-app/'` (o site fica em `https://<usuário>.github.io/book-app/`).
- O roteamento usa `HashRouter` (URLs com `#`), então links diretos **não dão 404** em hospedagem estática.
- O workflow `.github/workflows/deploy.yml` faz `npm ci` + `npm run build` e publica a pasta `dist` automaticamente.

**Para ativar (uma única vez):** em **Settings → Pages**, no campo **Source**, selecione **GitHub Actions**.
Depois, cada push dispara o build e o deploy. O endereço final aparece na aba **Actions**, no job de deploy.

> Se você renomear o repositório, ajuste o `base` no `vite.config.js` para `'/<novo-nome>/'`.

---

## 📁 Estrutura do projeto

```
book-app/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx                # ponto de entrada + roteamento
    ├── App.jsx                 # layout, navegação, céu estrelado e rodapé
    ├── styles.css              # tema Velaris (céu noturno, violeta/prata)
    ├── data/
    │   └── catalog.js          # catálogo de livros, séries e filmes + temas
    ├── lib/
    │   ├── recommend.js        # motor de recomendação por afinidade temática
    │   └── storage.js          # estado da biblioteca (progresso + avaliações)
    ├── components/
    │   ├── ObraCard.jsx        # card reutilizável de uma obra
    │   ├── Estrelas.jsx        # seletor de nota por estrelas
    │   └── Starfield.jsx       # céu estrelado + símbolo das três estrelas
    └── pages/
        ├── Descobrir.jsx       # tela principal de recomendações + filtros
        ├── Progresso.jsx       # progresso de páginas, episódios e minutos
        ├── Avaliacoes.jsx      # notas e resenhas
        └── Detalhe.jsx         # página de detalhe da obra
```

---

## 🧩 Como adicionar novas obras

Basta editar `src/data/catalog.js` e incluir um item nas listas `LIVROS`, `SERIES` ou `FILMES`, informando os `temas`.
As recomendações e os filtros se ajustam automaticamente — não é preciso mexer no motor.

```js
// série
{ id: 's-nova', tipo: 'serie', titulo: 'Nome', criador: 'Fulano',
  ano: 2024, temporadas: 2, episodios: 16, capa: '#4b5e8a',
  temas: ['ficcao_cientifica', 'suspense'], sinopse: 'Uma frase.' }

// filme
{ id: 'f-novo', tipo: 'filme', titulo: 'Nome', diretor: 'Fulana',
  ano: 2024, duracao: 128, capa: '#6d3f8a',
  temas: ['romantasy', 'fantasia'], sinopse: 'Uma frase.' }
```

Os rótulos amigáveis dos temas ficam no objeto `TEMAS`, no topo do mesmo arquivo. Para criar um tema novo, adicione uma entrada em `TEMAS` e use a chave nos `temas` das obras.

---

## 🗺️ Ideias de evolução

- Integração com uma API real de livros/séries (Google Books, TMDB).
- Sincronização entre dispositivos (backend + login).
- Recomendações também por **autor**, **elenco** e **época histórica** específica.
- Listas personalizadas ("quero ler/assistir") e metas de leitura.

---

Feito com ✦ em Velaris, para quem gosta de emendar um bom livro numa boa tela.
