export function formatDateBR(iso: string): string {
  if (!iso) return "---";
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

export function formatBRL(value: number): string {
  return `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
}
