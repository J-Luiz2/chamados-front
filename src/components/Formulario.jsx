import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import api from "../services/api"
import { mensagemErro } from "../services/erros"
import "./components.css"

function hoje() {
  return new Date().toLocaleDateString("en-CA") // AAAA-MM-DD
}

export default function Formulario() {
  const { id } = useParams()
  const editando = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    titulo: "", descricao: "", tipo: "", local: "", prioridade: "",
    data_abertura: hoje()
  })
  const [opcoes, setOpcoes] = useState({ tipos: [], locais: [], prioridades: [] })
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [bloqueado, setBloqueado] = useState(false)
  const [erro, setErro] = useState("")

  useEffect(() => {
    async function carregar() {
      try {
        const [t, l, p] = await Promise.all([
          api.get("/tipos"), api.get("/locais"), api.get("/prioridades")
        ])
        setOpcoes({ tipos: t.data, locais: l.data, prioridades: p.data })

        if (editando) {
          const { data } = await api.get(`/chamados/${id}`)
          if (data.status === "resolvido") {
            setBloqueado(true)
          } else {
            setForm({
              titulo: data.titulo,
              descricao: data.descricao,
              tipo: data.tipo,
              local: data.local,
              prioridade: data.prioridade,
              data_abertura: data.data_abertura
            })
          }
        }
      } catch (e) {
        setErro(mensagemErro(e))
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [id])

  function alterar(campo, valor) {
    setForm({ ...form, [campo]: valor })
  }

  async function salvar(e) {
    e.preventDefault()
    setErro("")
    setSalvando(true)
    try {
      if (editando) {
        await api.put(`/chamados/${id}`, form)
        navigate(`/chamado/${id}`)
      } else {
        const { data } = await api.post("/chamados", form)
        navigate(`/chamado/${data.id}`)
      }
    } catch (err) {
      setErro(mensagemErro(err))
    } finally {
      setSalvando(false)
    }
  }

  if (carregando) return <p>Carregando...</p>

  if (bloqueado) {
    return (
      <section className="pagina">
        <p>Chamados resolvidos não podem ser editados.</p>
        <Link to={`/chamado/${id}`} className="botao">← Voltar</Link>
      </section>
    )
  }

  return (
    <section className="pagina">
      <h1>{editando ? "Editar chamado" : "Abrir chamado"}</h1>

      <form className="acao formulario" onSubmit={salvar}>
        <label>
          Título
          <input
            value={form.titulo}
            onChange={(e) => alterar("titulo", e.target.value)}
            required
          />
        </label>

        <label>
          Descrição
          <textarea
            value={form.descricao}
            onChange={(e) => alterar("descricao", e.target.value)}
            required
          />
        </label>

        <label>
          Tipo
          <select
            value={form.tipo}
            onChange={(e) => alterar("tipo", e.target.value)}
            required
          >
            <option value="">Selecione</option>
            {opcoes.tipos.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>

        <label>
          Local
          <select
            value={form.local}
            onChange={(e) => alterar("local", e.target.value)}
            required
          >
            <option value="">Selecione</option>
            {opcoes.locais.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </label>

        <label>
          Prioridade
          <select
            value={form.prioridade}
            onChange={(e) => alterar("prioridade", e.target.value)}
            required
          >
            <option value="">Selecione</option>
            {opcoes.prioridades.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </label>

        <label>
          Data de abertura
          <input
            type="date"
            value={form.data_abertura}
            onChange={(e) => alterar("data_abertura", e.target.value)}
            required
          />
        </label>

        {erro && <p className="erro">{erro}</p>}

        <div className="acoes">
          <button type="submit" className="botao" disabled={salvando}>
            {salvando ? "Salvando..." : "Salvar"}
          </button>
          <Link
            to={editando ? `/chamado/${id}` : "/"}
            className="botao-secundario"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </section>
  )
}