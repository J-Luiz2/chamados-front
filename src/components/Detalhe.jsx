import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import api from "../services/api"
import { mensagemErro } from "../services/erros"
import "./components.css"
import { classeStatus } from "../services/status"

export default function Detalhe() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [chamado, setChamado] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")
  const [responsavel, setResponsavel] = useState("")
  const [solucao, setSolucao] = useState("")
  const [confirmando, setConfirmando] = useState(false)

  async function carregar() {
    setCarregando(true)
    setErro("")
    try {
      const { data } = await api.get(`/chamados/${id}`)
      setChamado(data)
    } catch (e) {
      setErro(mensagemErro(e))
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregar()
  }, [id])

  async function iniciar(e) {
    e.preventDefault()
    setErro("")
    try {
      await api.patch(`/chamados/${id}/iniciar`, { responsavel })
      setResponsavel("")
      await carregar()
    } catch (err) {
      setErro(mensagemErro(err))
    }
  }

  async function resolver(e) {
    e.preventDefault()
    setErro("")
    try {
      await api.patch(`/chamados/${id}/resolver`, { solucao })
      setSolucao("")
      await carregar()
    } catch (err) {
      setErro(mensagemErro(err))
    }
  }

  async function excluir() {
    setErro("")
    try {
      await api.delete(`/chamados/${id}`)
      navigate("/")
    } catch (err) {
      setErro(mensagemErro(err))
      setConfirmando(false)
    }
  }


  if (carregando) return <p>Carregando chamado...</p>
  if (!chamado) return <><p>{erro}</p><Link to="/">← Voltar</Link></>

  return (
    <section className="detalhe">
      <Link to="/" className="botao">
        ← Voltar
      </Link>
      <h1 id="detalheh1">{chamado.titulo}</h1>
      <div className={`card-status detalhe-descricao ${classeStatus(chamado)}`}>
        <p>{chamado.status} · {chamado.prioridade}</p>
        <p>Descrição: {chamado.descricao}</p>
        <p>Tipo: {chamado.tipo}</p>
        <p>Local: {chamado.local}</p>
        <p>Aberto em: {chamado.data_abertura}</p>
        <p>Responsável: {chamado.responsavel || "—"}</p>
        <p>Solução: {chamado.solucao || "—"}</p>
      </div>
      {chamado.data_resolucao && <p>Resolvido em: {chamado.data_resolucao}</p>}

      {erro && <p>{erro}</p>}

    <div className="acoes">
      {chamado.status !== "resolvido" && (
        <Link to={`/editar/${id}`} className="botao">Editar</Link>
      )}
      <button className="botao-secundario" onClick={() => setConfirmando(true)}>
        Excluir
      </button>
    </div>

      {chamado.status === "aberto" && (
        <form className="acao" onSubmit={iniciar}>
          <label htmlFor="responsavel">Responsável</label>
          <input
            id="responsavel"
            value={responsavel}
            onChange={(e) => setResponsavel(e.target.value)}
            required
          />
          <button type="submit" className="botao">Iniciar</button>
        </form>
      )}

      {chamado.status === "em andamento" && (
        <form className="acao" onSubmit={resolver}>
          <label htmlFor="solucao">Solução</label>
          <textarea
            id="solucao"
            placeholder="Descreva como o problema foi resolvido"
            value={solucao}
            onChange={(e) => setSolucao(e.target.value)}
            maxLength={500}
            required
          />
          <span className="contador">{solucao.length}/500</span>
          <button type="submit" className="botao">Resolver</button>
        </form>
      )}
    </section>
  )
}