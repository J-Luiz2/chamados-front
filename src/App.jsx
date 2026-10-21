import { Routes, Route } from "react-router-dom"
import Cabecalho from "./components/Cabecalho.jsx"
import Lista from "./components/Lista.jsx"
import Detalhe from "./components/Detalhe.jsx"
import Formulario from "./components/Formulario.jsx"

export default function App() {
  return (
    <>
      <Cabecalho />
      <main>
        <Routes>
          <Route path="/" element={<Lista />} />
          <Route path="/chamado/:id" element={<Detalhe />} />
          <Route path="/novo" element={<Formulario />} />
          <Route path="/editar/:id" element={<Formulario />} />
        </Routes>
      </main>
    </>
  )
}