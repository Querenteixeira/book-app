import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LIVROS, buscarPorId, autoria } from '../data/catalog.js'
import { useBiblioteca } from '../lib/storage.js'
import PerfilNome from '../components/PerfilNome.jsx'
import PersonagemArt, {
  CORTES,
  PELES,
  CABELOS,
  ESTILOS_CABELO,
  ROUPAS,
  CORES_ROUPA,
  CONFIG_PADRAO,
} from '../components/PersonagemArt.jsx'

// Tela nova: Ateliê de Fanart. Interatividade para "montar" a personagem do
// livro — aparência, roupas, corte, asas, máscara, coroa e tatuagem — gerando
// um retrato em SVG. Também aceita subir a sua própria arte. Tudo vira uma
// galeria da comunidade (salva localmente).
export default function Atelie() {
  const { fanarts, perfil, salvarPerfil, salvarFanart, removerFanart } = useBiblioteca()
  const [config, setConfig] = useState(CONFIG_PADRAO)
  const [livroId, setLivroId] = useState(LIVROS[0].id)
  const [personagem, setPersonagem] = useState('')
  const [descricao, setDescricao] = useState('')
  const [aviso, setAviso] = useState('')

  function set(campo, valor) {
    setConfig((c) => ({ ...c, [campo]: valor }))
  }

  function salvarDesigner() {
    if (!personagem.trim()) {
      setAviso('Dê um nome à personagem antes de guardar na galeria.')
      return
    }
    salvarFanart({
      tipo: 'designer',
      livroId,
      personagem: personagem.trim(),
      descricao: descricao.trim(),
      config,
    })
    setPersonagem('')
    setDescricao('')
    setAviso('')
  }

  function aoSubirArquivo(e) {
    const arquivo = e.target.files?.[0]
    if (!arquivo) return
    if (!arquivo.type.startsWith('image/')) {
      setAviso('Envie um arquivo de imagem (PNG, JPG, WEBP...).')
      return
    }
    if (arquivo.size > 1.5 * 1024 * 1024) {
      setAviso('Imagem muito grande (máx. 1,5 MB). Reduza e tente de novo.')
      return
    }
    const leitor = new FileReader()
    leitor.onload = () => {
      salvarFanart({
        tipo: 'upload',
        livroId,
        personagem: personagem.trim() || 'Fanart enviada',
        descricao: descricao.trim(),
        imagem: leitor.result,
      })
      setPersonagem('')
      setDescricao('')
      setAviso('')
    }
    leitor.readAsDataURL(arquivo)
    e.target.value = ''
  }

  return (
    <>
      <div className="page-head">
        <h1>Ateliê de Fanart ✦</h1>
        <p>
          Como você imagina a personagem? Monte o retrato dela — pele, cabelo, a corte a que pertence, as
          roupas, asas de fae, máscara de baile, coroa e tatuagem — ou envie a sua própria arte. Cada criação
          entra na galeria da corte.
        </p>
      </div>

      <PerfilNome perfil={perfil} onSalvar={salvarPerfil} />

      <div className="atelie">
        {/* Pré-visualização ao vivo */}
        <div className="atelie-preview">
          <PersonagemArt config={config} tamanho={300} />
          <div className="btn-row" style={{ marginTop: 14, justifyContent: 'center' }}>
            <button className="btn ghost sm" onClick={() => setConfig(CONFIG_PADRAO)}>
              Restaurar
            </button>
            <button className="btn ghost sm" onClick={() => setConfig(aleatorio())}>
              🎲 Surpreenda-me
            </button>
          </div>
        </div>

        {/* Controles */}
        <div className="atelie-controles">
          <div className="panel">
            <h3>Traços da personagem</h3>

            <label className="field">Corte</label>
            <select value={config.corte} onChange={(e) => set('corte', e.target.value)}>
              {Object.entries(CORTES).map(([key, v]) => (
                <option key={key} value={key}>
                  {v.nome}
                </option>
              ))}
            </select>

            <label className="field" style={{ marginTop: 14 }}>
              Tom de pele
            </label>
            <Swatches valores={PELES} atual={config.pele} onPick={(v) => set('pele', v)} />

            <label className="field" style={{ marginTop: 14 }}>
              Cor do cabelo
            </label>
            <Swatches valores={CABELOS} atual={config.cabeloCor} onPick={(v) => set('cabeloCor', v)} />

            <label className="field" style={{ marginTop: 14 }}>
              Estilo do cabelo
            </label>
            <div className="filtros">
              {ESTILOS_CABELO.map((e) => (
                <button
                  key={e.key}
                  className={`btn sm ${config.cabeloEstilo === e.key ? 'primary' : ''}`}
                  onClick={() => set('cabeloEstilo', e.key)}
                >
                  {e.nome}
                </button>
              ))}
            </div>

            <label className="field" style={{ marginTop: 14 }}>
              Roupa
            </label>
            <div className="filtros">
              {ROUPAS.map((r) => (
                <button
                  key={r.key}
                  className={`btn sm ${config.roupaTipo === r.key ? 'primary' : ''}`}
                  onClick={() => set('roupaTipo', r.key)}
                >
                  {r.nome}
                </button>
              ))}
            </div>
            <div style={{ marginTop: 10 }}>
              <Swatches valores={CORES_ROUPA} atual={config.roupaCor} onPick={(v) => set('roupaCor', v)} />
            </div>

            <label className="field" style={{ marginTop: 14 }}>
              Detalhes
            </label>
            <div className="filtros">
              {[
                ['asas', '🪽 Asas de fae'],
                ['mascara', '🎭 Máscara'],
                ['coroa', '👑 Coroa'],
                ['tatuagem', '✦ Tatuagem'],
              ].map(([campo, rotulo]) => (
                <button
                  key={campo}
                  className={`btn sm ${config[campo] ? 'primary' : ''}`}
                  onClick={() => set(campo, !config[campo])}
                >
                  {rotulo}
                </button>
              ))}
            </div>
          </div>

          <div className="panel">
            <h3>Guardar na galeria</h3>
            <div className="row">
              <div style={{ flex: 1 }}>
                <label className="field">Livro / personagem de</label>
                <select value={livroId} onChange={(e) => setLivroId(e.target.value)}>
                  {LIVROS.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.titulo}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label className="field">Nome da personagem</label>
                <input
                  type="text"
                  value={personagem}
                  maxLength={40}
                  placeholder="Ex.: Feyre, Nesta, Bryce..."
                  onChange={(e) => setPersonagem(e.target.value)}
                />
              </div>
            </div>
            <label className="field" style={{ marginTop: 12 }}>
              Como você a imagina (roupas, aparência, atmosfera)
            </label>
            <textarea
              value={descricao}
              placeholder="Descreva as roupas, os detalhes e o clima da personagem."
              onChange={(e) => setDescricao(e.target.value)}
            />
            {aviso && (
              <p className="meta" style={{ color: '#ff9db1', fontSize: 13, marginTop: 8 }}>
                {aviso}
              </p>
            )}
            <div className="btn-row" style={{ marginTop: 12 }}>
              <button className="btn primary" onClick={salvarDesigner}>
                Guardar retrato
              </button>
              <label className="btn ghost" style={{ cursor: 'pointer' }}>
                📤 Enviar minha arte
                <input type="file" accept="image/*" hidden onChange={aoSubirArquivo} />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="section-title">
        <h2>Galeria da corte</h2>
        <span>{fanarts.length} criações</span>
      </div>
      {fanarts.length ? (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
          {fanarts.map((fa) => (
            <FanartCard key={fa.id} fanart={fa} onRemover={removerFanart} podeApagar={fa.autor === perfil?.nome} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h3>A galeria está esperando por você</h3>
          <p>Monte um retrato ou envie sua arte para inaugurar a coleção.</p>
        </div>
      )}
    </>
  )
}

function Swatches({ valores, atual, onPick }) {
  return (
    <div className="swatches">
      {valores.map((v) => (
        <button
          key={v}
          className={`swatch ${atual === v ? 'sel' : ''}`}
          style={{ background: v }}
          onClick={() => onPick(v)}
          aria-label={`cor ${v}`}
        />
      ))}
    </div>
  )
}

function FanartCard({ fanart, onRemover, podeApagar }) {
  const livro = buscarPorId(fanart.livroId)
  return (
    <div className="card">
      <div className="fanart-img">
        {fanart.tipo === 'designer' ? (
          <PersonagemArt config={fanart.config} tamanho={220} />
        ) : (
          <img src={fanart.imagem} alt={fanart.personagem} />
        )}
      </div>
      <div className="card-body">
        <h3>{fanart.personagem}</h3>
        {livro && (
          <div className="meta">
            <Link to={`/obra/${livro.id}`} style={{ color: 'var(--accent-2)' }}>
              {livro.titulo}
            </Link>
          </div>
        )}
        {fanart.descricao && (
          <p className="meta" style={{ fontSize: 13, lineHeight: 1.5 }}>
            {fanart.descricao}
          </p>
        )}
        <div className="tags">
          <span className="tag">por {fanart.autor}</span>
          <span className="tag">{fanart.tipo === 'designer' ? '🎨 designer' : '📷 enviada'}</span>
        </div>
        {podeApagar && (
          <button className="btn sm ghost" style={{ marginTop: 8 }} onClick={() => onRemover(fanart.id)}>
            Apagar
          </button>
        )}
      </div>
    </div>
  )
}

// Gera uma configuração aleatória para o botão "Surpreenda-me".
function aleatorio() {
  const pega = (arr) => arr[Math.floor(Math.random() * arr.length)]
  return {
    corte: pega(Object.keys(CORTES)),
    pele: pega(PELES),
    cabeloCor: pega(CABELOS),
    cabeloEstilo: pega(ESTILOS_CABELO).key,
    roupaTipo: pega(ROUPAS).key,
    roupaCor: pega(CORES_ROUPA),
    asas: Math.random() > 0.4,
    mascara: Math.random() > 0.6,
    coroa: Math.random() > 0.6,
    tatuagem: Math.random() > 0.4,
  }
}
