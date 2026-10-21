import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../services/api"
import { mensagemErro } from "../services/erros"
import "./components.css"
import { classeStatus } from "../services/status"

const STATUS = ["aberto", "em andamento", "resolvido"]

export default function Lista() {
  const [chamados, setChamados] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")
  const [filtros, setFiltros] = useState({
    busca: "", status: "", tipo: "", local: "", prioridade: ""
  })
  const [opcoes, setOpcoes] = useState({ tipos: [], locais: [], prioridades: [] })

  useEffect(() => {
    async function carregarOpcoes() {
      try {
        const [t, l, p] = await Promise.all([
          api.get("/tipos"), api.get("/locais"), api.get("/prioridades")
        ])
        setOpcoes({ tipos: t.data, locais: l.data, prioridades: p.data })
      } catch (e) {
        setErro(mensagemErro(e))
      }
    }
    carregarOpcoes()
  }, [])

  useEffect(() => {
    async function carregar() {
      setCarregando(true)
      setErro("")
      try {
        const params = {}
        for (const chave in filtros) {
          if (filtros[chave]) params[chave] = filtros[chave]
        }
        const { data } = await api.get("/chamados", { params })
        setChamados(data)
      } catch (e) {
        setErro(mensagemErro(e))
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [filtros])

  function alterar(campo, valor) {
    setFiltros({ ...filtros, [campo]: valor })
  }

  return (
  <section className="pagina">
    <div className="topo-lista">
      <h1>Chamados</h1>
      <Link to="/novo" className="botao">+ Abrir chamado</Link>
    </div>

    <div className="filtros">
      <input
        type="text"
        placeholder="Buscar por título ou descrição..."
        value={filtros.busca}
        onChange={(e) => alterar("busca", e.target.value)}
      />
      {/* os 4 <select> continuam iguais */}
    </div>

    {carregando && <p>Carregando chamados...</p>}
    {erro && <p className="erro">{erro}</p>}
    {!carregando && !erro && chamados.length === 0 && (
      <p>Nenhum chamado encontrado.</p>
    )}

    <ul className="lista">
      {chamados.map((c) => (
        <li key={c.id}>
          <Link
            to={`/chamado/${c.id}`}
            className={`card-status item ${classeStatus(c)}`}
          >
            <strong>{c.titulo}</strong>
            <span>{c.status} · {c.prioridade}</span>
            <span>{c.local}</span>
          </Link>
        </li>
      ))}
    </ul>
  </section>
)}