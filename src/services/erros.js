export function mensagemErro(erro) {
  const detail = erro.response?.data?.detail
  if (Array.isArray(detail)) return detail.map((d) => d.msg).join("; ")
  if (typeof detail === "string") return detail
  if (erro.response?.status === 401) return "Chave inválida. Verifique sua chave."
  return "Não foi possível conectar à API."
}