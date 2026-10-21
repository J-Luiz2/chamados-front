import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../services/api"
import "./components.css"

export default function Cabecalho() {
  const [dono, setDono] = useState(null)

  useEffect(() => {
    async function carregar() {
      try {
        const { data } = await api.get("/eu")
        setDono(data)
      } catch (e) {
        setDono(null)
      }
    }
    carregar()
  }, [])

  return (
    <header>
      <Link id="paginainicial" to="/">
        Manutenção IFRN
        </Link>
      <span id="nome">Olá, {dono ? dono.nome : "..."}</span>
    </header>
  )
}