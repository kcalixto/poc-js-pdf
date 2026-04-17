export const OBSERVATION_TEXT =
  "OBSERVAÇÃO IMPORTANTE: NÃO ESTÁ INCLUÍDO NESTE NENHUMA FORMA DE REGULARIZAÇÃO DE CONTRAPISO, APLICAÇÃO DE PVA E/OU MASSA AUTO NIVELANTE OU AINDA MATERIAIS QUE GARANTAM A IMPERMEABILIZAÇÃO DO MESMO. ESTE ESCOPO DE PRODUTOS & SERVIÇOS É EXCLUSIVO DE FORNECIMENTO DA CONSTRUTORA, PODENDO TAMBÉM SER FORNECIDO PELA FORT CORPORATIVO, APÓS VISITA TÉCNICA, EXPLANADO EM RELATÓRIO ESPECÍFICO E DEVIDAMENTE ACORDADO COM A MESMA.";

export interface TermsSection {
  title: string;
  items: string[];
}

export const TERMS: TermsSection[] = [
  {
    title: "1. CONDIÇÕES DE VENDA:",
    items: [
      "1.1 As medidas foram calculadas de acordo com as plantas fornecidas pelo cliente, havendo a necessidade de confirmação das medidas reais no local. Caso haja alteração no projeto e ocorra alteração nos quantitativos de materiais após a aprovação da proposta, deverá ser feito um novo orçamento seguindo as alterações para uma nova análise e aprovação, salvo exceções em que seja possível a revisão do projeto com a metragem original.",
      "1.2 A FORT CORPORATIVO não efetua trocas de cores de produtos especiais após a aprovação do cliente no fechamento do pedido.",
      "1.3 Qualquer alteração no projeto calculado, só poderá ser executada mediante autorização por escrito do cliente.",
      "1.4 A FORT CORPORATIVO declara que no valor acima descrito estão inclusos todos os tributos a eles decorrentes.",
      "1.5 As condições de venda assim como prazos de pagamento, entrega, instalação e frete estão descritas acima, assim como os produtos e serviços incluídos neste orçamento.",
    ],
  },
  {
    title: "2. INSTALAÇÃO, ARMAZENAMENTO DO MATERIAL E ACESSÓRIOS:",
    items: [
      "2.1 Persianas, Papeis de parede, Revestimento Vinilico: Os peças deverão permanecer devidamente embaladas na posição horizontal, em local fechado, completamente seco e ventilado, sem a incidência direta de luz solar. Não colocar nenhum objeto sobre as peças para evitar que se formem vincos ou amassamento das telas;",
      "2.1 Carpetes em manta, Placas, Pisos de Madeira, laminados & Vinilicos: Os rolos assim como as caixas deverão permanecer na posição horizontal, em local fechado, completamente seco e ventilado, sem a incidência direta de luz solar, não colocar nenhum objeto sobre eles para evitar que se formem vincos ou amassamento das mantas ou caixas.",
      "2.2 Quando a obra for executada em mais de uma etapa, o armazenamento do material para as demais etapas é de inteira responsabilidade do cliente.",
      "2.3 Não nos responsabilizamos pelo descarte de embalagens. É necessário a contratação e indicação de local de descarte pelo cliente.",
      "2.4 Contra-piso de cimento: deve ser firme, nivelado, regularizado e isento de umidade, indicamos o traço de 3/1, caso o contra piso não se apresente nas condições citadas, o resultado da instalação do piso poderá ficar comprometido estética e tecnicamente.",
      "2.5 A Fort Corporativo dispõem de uma equipe profissional para efetuar medições e validar as condições de instalação. É necessário o aceite do TERMO DE RESPONSABILIDADE da obra pelo cliente.",
    ],
  },
  {
    title: "3. CONDIÇÕES GERAIS:",
    items: [
      "3.1 Não fazemos remoção de entulhos do local da obra. O cliente deve informar em qual local na obra nossa equipe de serviços deve concentrá-lo.",
      "3.2 Caso haja necessidade da continuidade de outros serviços após a instalação do carpete, é obrigatória a proteção do piso para que o mesmo não seja danificado.",
      "3.3 Mobiliários e equipamentos: não realizamos a movimentação de mobiliários e demais equipamentos, para isso solicitamos que o local da instalação esteja totalmente liberado.",
      '3.4 Não trabalhamos no sistema de "medição", as condições comerciais são formatadas na emissão do pedido. Quando necessária a "retenção" para entrega da obra, autorizamos no máximo 10% do valor total do pedido onde a NF de serviços será emitida de forma separada dos produtos.',
      "3.5 A FORT CORPORATIVO se compromete a afastar dos serviços qualquer funcionário cuja permanência seja considerada inconveniente pelo cliente, devendo substituí-lo no prazo máximo definido pelo cliente.",
    ],
  },
];
