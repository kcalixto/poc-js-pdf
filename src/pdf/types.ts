export interface ObraEnd {
  rua: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
}

export interface Item {
  codigo: string;
  descricao: string;
  quant: number;
  un: string;
  valor: number;
}

export interface PdfData {
  id: string;
  obraNome: string;
  obraEnd: ObraEnd;
  engenhariaNome: string;
  nomeSolicitante: string;
  contatoObra: string;
  emailObra: string;
  vendedorNome: string;
  vendedorEmail: string;
  telVendedor: string;
  prazoEntrega: string;
  prazoInstalacao: string;
  prazoValidade: string;
  condicaoProd: string;
  condicaoServ: string;
  freteTipo: string;
  observacoes: string;
  itens: Item[];
  totalGeralBruto: number;
  totalProdutos: number;
  totalServicos: number;
  totalComDesconto: number;
  dataAtual: string;
  dataAtualizacao: string;
}
