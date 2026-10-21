export function classeStatus(chamado) {
  if (chamado.status === "aberto") return "aberto"
  if (chamado.status === "resolvido") return "resolvido"
  const prioridade = { alta: "alta", "média": "media", baixa: "baixa" }
  return `em-andamento-${prioridade[chamado.prioridade]}`
}