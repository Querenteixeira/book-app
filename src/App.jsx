import { NavLink, Route, Routes } from 'react-router-dom'
import Descobrir from './pages/Descobrir.jsx'
import Progresso from './pages/Progresso.jsx'
import Avaliacoes from './pages/Avaliacoes.jsx'
import Detalhe from './pages/Detalhe.jsx'
import Starfield, { TresEstrelas } from './components/Starfield.jsx'

export default function App() {
  return (
    <div className="app">
      <Starfield />

      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">
            <TresEstrelas tamanho={30} />
          </span>
          <span className="brand-text">
            Velaris
            <small>a cidade da luz estelar</small>
          </span>
        </div>
        <nav className="nav">
          <NavLink to="/" end>
            Descobrir
          </NavLink>
          <NavLink to="/progresso">Meu progresso</NavLink>
          <NavLink to="/avaliacoes">Avaliações</NavLink>
        </nav>
      </header>

      <main className="content">
        <Routes>
          <Route path="/" element={<Descobrir />} />
          <Route path="/progresso" element={<Progresso />} />
          <Route path="/avaliacoes" element={<Avaliacoes />} />
          <Route path="/obra/:id" element={<Detalhe />} />
        </Routes>
      </main>

      <footer className="rodape">
        <TresEstrelas tamanho={18} />
        <span>Velaris · onde cada livro e cada tela vira uma estrela na sua coleção</span>
      </footer>
    </div>
  )
}
