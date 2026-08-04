import { NavLink, Route, Routes } from 'react-router-dom'
import Descobrir from './pages/Descobrir.jsx'
import Progresso from './pages/Progresso.jsx'
import Avaliacoes from './pages/Avaliacoes.jsx'
import Detalhe from './pages/Detalhe.jsx'

export default function App() {
  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <img className="logo" src="/favicon.svg" alt="" />
          <span>Enredo</span>
        </div>
        <nav className="nav">
          <NavLink to="/" end>
            Descobrir
          </NavLink>
          <NavLink to="/progresso">Meu progresso</NavLink>
          <NavLink to="/avaliacoes">Avaliações</NavLink>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Descobrir />} />
        <Route path="/progresso" element={<Progresso />} />
        <Route path="/avaliacoes" element={<Avaliacoes />} />
        <Route path="/obra/:id" element={<Detalhe />} />
      </Routes>
    </div>
  )
}
