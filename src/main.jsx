import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles.css'

// HashRouter (URLs com #) para funcionar em hospedagem estática como o
// GitHub Pages, que não faz o fallback de SPA que o BrowserRouter exige —
// assim links diretos (ex.: /#/obra/l-duna) não dão 404.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)
