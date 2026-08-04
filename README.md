# 📚 Enredo — Livros & Séries

Aplicativo que **recomenda livros e séries de temas parecidos, cruzando os dois formatos**.
A ideia é simples: o que você lê conversa com o que você assiste.

> Está lendo um livro **de época**? O Enredo sugere **séries de época**.
> Curtindo uma história de **ficção científica**? Ele encontra outra ficção científica com um enredo parecido — no outro formato.

Além das recomendações, o app traz telas de apoio para **acompanhar seu progresso** (páginas e episódios) e **avaliar** cada obra.

---

## ✨ Funcionalidades

### 1. Descobrir por afinidade (tela principal)
- Escolha uma obra de referência (ou o app usa o que você está acompanhando).
- Receba recomendações **do formato oposto** (livro → série e série → livro) e **do mesmo formato**.
- Cada card destaca os **temas em comum**, deixando claro *por que* aquela obra foi recomendada.
- Um feed adicional "para a sua biblioteca" combina tudo o que você acompanha.

### 2. Meu progresso (tela de apoio nº 1)
- **Livros:** acompanhamento por **páginas lidas**, com barra de progresso e botões rápidos (±1 / ±10 / marcar como lido).
- **Séries:** acompanhamento por **temporada e episódio**, com contagem de episódios assistidos.
- Resumo geral: livros e séries acompanhados, páginas lidas, episódios vistos e obras concluídas.
- O que você marca aqui alimenta as recomendações da tela Descobrir.

### 3. Avaliações (tela de apoio nº 2)
- Dê uma **nota de 1 a 5 estrelas** para livros e séries.
- Escreva uma **resenha** para cada obra.
- Veja a **média das suas notas** separada por livros e por séries.
- Avalie qualquer título direto do catálogo, com filtro por formato.

### 4. Detalhe da obra
- Sinopse, ficha técnica e temas.
- Atalhos para começar a acompanhar o progresso e para avaliar.
- Recomendações de temas parecidos no formato oposto e no mesmo formato.

Todos os dados (progresso e avaliações) ficam salvos localmente no navegador (`localStorage`) — sem necessidade de cadastro ou backend.

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

Por padrão, a recomendação busca o **formato oposto** ao da obra de referência — é isso que cria a ponte "livro ↔ série". Também é possível pedir recomendações do mesmo formato ou de ambos.

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
    ├── App.jsx                 # layout, navegação e rotas
    ├── styles.css              # estilos (tema escuro)
    ├── data/
    │   └── catalog.js          # catálogo de livros e séries + temas
    ├── lib/
    │   ├── recommend.js        # motor de recomendação por afinidade temática
    │   └── storage.js          # estado da biblioteca (progresso + avaliações)
    ├── components/
    │   ├── ObraCard.jsx        # card reutilizável de uma obra
    │   └── Estrelas.jsx        # seletor de nota por estrelas
    └── pages/
        ├── Descobrir.jsx       # tela principal de recomendações
        ├── Progresso.jsx       # acompanhamento de leitura e episódios
        ├── Avaliacoes.jsx      # notas e resenhas
        └── Detalhe.jsx         # página de detalhe da obra
```

---

## 🧩 Como adicionar novas obras

Basta editar `src/data/catalog.js` e incluir um item nas listas `LIVROS` ou `SERIES`, informando os `temas`.
As recomendações se ajustam automaticamente — não é preciso mexer no motor.

```js
{
  id: 's-nova-serie',
  tipo: 'serie',
  titulo: 'Nome da Série',
  criador: 'Fulano',
  ano: 2024,
  temporadas: 2,
  episodios: 16,
  capa: '#4b5e8a',
  temas: ['ficcao_cientifica', 'suspense'],
  sinopse: 'Uma frase que resume a história.',
}
```

Os rótulos amigáveis dos temas ficam no objeto `TEMAS`, no topo do mesmo arquivo.

---

## 🗺️ Ideias de evolução

- Integração com uma API real de livros/séries (Google Books, TMDB).
- Sincronização entre dispositivos (backend + login).
- Recomendações também por **autor**, **elenco** e **época histórica** específica.
- Listas personalizadas ("quero ler/assistir") e metas de leitura.

---

Feito com ❤️ para quem gosta de emendar um bom livro numa boa série.
