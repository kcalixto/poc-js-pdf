/**
 * Content brick system.
 *
 * A "brick" is the smallest independent unit of PDF content that can be
 * individually measured and placed onto a page. The pagination algorithm packs
 * bricks greedily into pages; the page renderer then reconstructs the visual
 * structure (e.g. wrapping consecutive table-row bricks into a single <table>).
 */
import type { ReactNode } from "react";
import type { Item, PdfData } from "./types";
import {
  CONTENT_WIDTH_PX,
  COLOR_YELLOW,
  COLOR_ORANGE,
  COLOR_DARK_GRAY,
} from "./constants";
import { OBSERVATION_TEXT, TERMS } from "./content";
import { formatBRL } from "./format";

// ─── Brick type ───────────────────────────────────────────────────────────────

export type ContentBrick =
  | { kind: "client-info" }
  | { kind: "table-label" }
  | { kind: "table-col-headers" }
  | { kind: "table-row"; item: Item; rowIndex: number }
  | { kind: "table-footer"; totalGeralBruto: number }
  | { kind: "payment-summary" }
  | { kind: "seller-signature" }
  // terms sections are atomic: the whole section (title + items) moves together
  | { kind: "terms-section"; title: string; items: string[] }
  | { kind: "section-spacer" };

// ─── Builder ─────────────────────────────────────────────────────────────────

/** Produces the ordered flat list of bricks for a given PDF data set. */
export function buildContentBricks(dados: PdfData): ContentBrick[] {
  const bricks: ContentBrick[] = [
    { kind: "client-info" },
    { kind: "section-spacer" },

    { kind: "table-label" },
    { kind: "table-col-headers" },
    ...dados.itens.map((item, rowIndex): ContentBrick => ({ kind: "table-row", item, rowIndex })),
    { kind: "table-footer", totalGeralBruto: dados.totalGeralBruto },
    { kind: "section-spacer" },

    { kind: "payment-summary" },
    { kind: "section-spacer" },

    { kind: "seller-signature" },
    { kind: "section-spacer" },
  ];

  for (const section of TERMS) {
    bricks.push({ kind: "terms-section", title: section.title, items: section.items });
    bricks.push({ kind: "section-spacer" });
  }

  return bricks;
}

// ─── Shared table structure ───────────────────────────────────────────────────

const TABLE_HEADERS = [
  "CÓDIGO",
  "DESCRIÇÃO PRODUTO",
  "QUANT.",
  "UN",
  "VALOR UNIT.",
  "TOTAL",
] as const;

function TableColGroup() {
  return (
    <colgroup>
      <col style={{ width: 76 }} />
      <col />
      <col style={{ width: 52 }} />
      <col style={{ width: 36 }} />
      <col style={{ width: 75 }} />
      <col style={{ width: 75 }} />
    </colgroup>
  );
}

function TableColHeadersRow() {
  return (
    <tr style={{ background: COLOR_YELLOW }}>
      {TABLE_HEADERS.map((header, index) => (
        <th
          key={header}
          className="text-[8px] font-bold p-[3px_5px] text-[#111]"
          style={{ textAlign: index < 2 ? "left" : "center" }}
        >
          {header}
        </th>
      ))}
    </tr>
  );
}

function TableBodyRow({ item, rowIndex }: { item: Item; rowIndex: number }) {
  return (
    <tr style={{ background: rowIndex % 2 ? "#f5f5f5" : "#fff" }}>
      <td className="text-[7.5px] p-[3px_5px] text-[#444] text-left">{item.codigo}</td>
      <td className="text-[7.5px] p-[3px_5px] text-[#444] text-left">{item.descricao.toUpperCase()}</td>
      <td className="text-[7.5px] p-[3px_5px] text-[#444] text-center">{item.quant}</td>
      <td className="text-[7.5px] p-[3px_5px] text-[#444] text-center">{item.un.replace("^2", "²")}</td>
      <td className="text-[7.5px] p-[3px_5px] text-[#444] text-center">{formatBRL(item.valor)}</td>
      <td className="text-[7.5px] p-[3px_5px] text-[#444] text-center font-bold">
        {formatBRL(item.quant * item.valor)}
      </td>
    </tr>
  );
}

// ─── Individual brick components ──────────────────────────────────────────────

function ClientInfoBrick({ dados }: { dados: PdfData }) {
  const address = `${dados.obraEnd.rua}, ${dados.obraEnd.bairro} – ${dados.obraEnd.cidade}/${dados.obraEnd.uf} – CEP ${dados.obraEnd.cep}`;
  const rows: [string, string][] = [
    ["OBRA:", dados.obraNome],
    ["ENDEREÇO:", address],
    ["ENGENHARIA:", dados.engenhariaNome],
    ["CONTATO:", dados.contatoObra || dados.nomeSolicitante],
    ["EMAIL:", dados.emailObra || "---"],
  ];
  return (
    <div>
      {rows.map(([label, value]) => (
        <div key={label} className="flex text-[8.5px] mb-[3px] text-[#222]">
          <span className="font-bold min-w-[82px] shrink-0">{label}</span>
          <span>{value}</span>
        </div>
      ))}
    </div>
  );
}

function TableLabelBrick() {
  return (
    <div
      className="flex items-center justify-center font-bold text-[9px] text-[#111] h-[22px]"
      style={{ background: COLOR_YELLOW }}
    >
      PRODUTOS/SERVIÇOS
    </div>
  );
}

function TableFooterBrick({ totalGeralBruto }: { totalGeralBruto: number }) {
  return (
    <div>
      <div
        className="flex justify-between items-center text-[9px] text-[#111] p-[4px_6px]"
        style={{
          width: CONTENT_WIDTH_PX,
          boxSizing: "border-box",
          background: "#ebebeb",
          borderTop: "1.5px solid #000",
        }}
      >
        <span>VALOR TOTAL BRUTO DA PROPOSTA</span>
        <span>{formatBRL(totalGeralBruto)}</span>
      </div>
      <p
        className="m-0 mt-1.5 text-[7px] text-[#888] leading-[1.45]"
        style={{ width: CONTENT_WIDTH_PX }}
      >
        {OBSERVATION_TEXT}
      </p>
    </div>
  );
}

function PaymentSummaryBrick({ dados }: { dados: PdfData }) {
  const discount = dados.totalGeralBruto - dados.totalComDesconto;
  return (
    <div>
      <div className="flex gap-[3px]" style={{ width: CONTENT_WIDTH_PX }}>
        {(
          [
            ["PRODUTOS & SERVIÇOS", "0 0 227px"],
            ["FORMA DE PAGAMENTO", "0 0 227px"],
            ["VALOR TOTAL FINAL DA TRANSAÇÃO", "1"],
          ] as [string, string][]
        ).map(([label, flex]) => (
          <div
            key={label}
            className="flex items-center font-bold text-[#fff] text-[7px] h-[22px] px-2"
            style={{ flex, background: COLOR_ORANGE }}
          >
            {label}
          </div>
        ))}
      </div>
      <div className="flex gap-[3px] mt-2" style={{ width: CONTENT_WIDTH_PX }}>
        <div style={{ flex: "0 0 227px" }}>
          {dados.totalProdutos > 0 && (
            <div className="text-[8px] text-[#222] mb-1.5">Faturamento dos Produtos</div>
          )}
          {dados.totalServicos > 0 && (
            <div className="text-[8px] text-[#222]">Serviços</div>
          )}
        </div>
        <div style={{ flex: "0 0 227px" }}>
          {dados.totalProdutos > 0 && (
            <div className="text-[8px] text-[#222] mb-1.5">{dados.condicaoProd}</div>
          )}
          {dados.totalServicos > 0 && (
            <div className="text-[8px] text-[#222] leading-[1.3]">{dados.condicaoServ}</div>
          )}
        </div>
        <div style={{ flex: 1 }}>
          {dados.totalProdutos > 0 && (
            <div className="text-[8px] text-[#222] text-right mb-1.5">
              {formatBRL(dados.totalProdutos)}
            </div>
          )}
          {dados.totalServicos > 0 && (
            <div className="text-[8px] text-[#222] text-right mb-1.5">
              {formatBRL(dados.totalServicos)}
            </div>
          )}
          <div className="text-[#fff] text-[8px] p-[7px_8px]" style={{ background: COLOR_DARK_GRAY }}>
            <div className="flex justify-between mb-1">
              <span>TOTAL DA TRANSAÇÃO</span>
              <span>{formatBRL(dados.totalGeralBruto)}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>DESCONTO</span>
              <span>{formatBRL(discount)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>TOTAL FINAL</span>
              <span>{formatBRL(dados.totalComDesconto)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const SELLER_ROWS: [string, keyof PdfData, boolean][] = [
  ["Vendedor:", "vendedorNome", true],
  ["Email:", "vendedorEmail", false],
  ["Celular:", "telVendedor", false],
  ["Prazo de Entrega:", "prazoEntrega", false],
  ["Prazo de Instalação:", "prazoInstalacao", false],
  ["Prazo de Validade:", "prazoValidade", false],
  ["Frete:", "freteTipo", false],
  ["Obs:", "observacoes", false],
];

function SellerSignatureBrick({ dados }: { dados: PdfData }) {
  return (
    <div className="flex" style={{ width: CONTENT_WIDTH_PX }}>
      <div className="shrink-0 p-[9px_10px]" style={{ width: 283, background: COLOR_YELLOW }}>
        {SELLER_ROWS.map(([label, field, lowercase]) => {
          const value = String(dados[field] ?? "");
          return (
            <div key={label} className="flex text-[7px] mb-[2.5px] text-[#222]">
              <span className="font-bold shrink-0 min-w-[90px]">{label}</span>
              <span className="text-[6.5px] break-words">
                {lowercase ? value.toLowerCase() : value}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex-1" />
      <div className="shrink-0 flex flex-col justify-end pb-1" style={{ width: 231 }}>
        <div style={{ borderTop: "0.5px solid #888", marginBottom: 3 }} />
        <div className="text-center text-[7px] text-[#555] mb-[5px]">
          Carimbo e Assinatura do Cliente
        </div>
        <div
          className="flex items-center pl-2 text-[7.5px] text-[#111] h-[22px]"
          style={{ background: COLOR_YELLOW }}
        >
          Aprovação do Orçamento: ____/____/____
        </div>
      </div>
    </div>
  );
}

// ─── Measurement renderer ─────────────────────────────────────────────────────

/**
 * Renders a single brick so its height can be measured.
 * Table row bricks are wrapped in a full table structure for accurate layout.
 */
export function MeasureBrick({ brick, dados }: { brick: ContentBrick; dados: PdfData }) {
  switch (brick.kind) {
    case "client-info":
      return <ClientInfoBrick dados={dados} />;

    case "table-label":
      return <TableLabelBrick />;

    case "table-col-headers":
      return (
        <table className="border-collapse" style={{ width: CONTENT_WIDTH_PX, tableLayout: "fixed" }}>
          <TableColGroup />
          <thead>
            <TableColHeadersRow />
          </thead>
        </table>
      );

    case "table-row":
      return (
        <table className="border-collapse" style={{ width: CONTENT_WIDTH_PX, tableLayout: "fixed" }}>
          <TableColGroup />
          <tbody>
            <TableBodyRow item={brick.item} rowIndex={brick.rowIndex} />
          </tbody>
        </table>
      );

    case "table-footer":
      return <TableFooterBrick totalGeralBruto={brick.totalGeralBruto} />;

    case "payment-summary":
      return <PaymentSummaryBrick dados={dados} />;

    case "seller-signature":
      return <SellerSignatureBrick dados={dados} />;

    case "terms-section":
      return (
        <div style={{ width: CONTENT_WIDTH_PX }}>
          <p className="m-0 mb-1 font-bold text-[9.5px] text-[#222]">{brick.title}</p>
          {brick.items.map((text, i) => (
            <p key={i} className="m-0 mb-[3px] text-[7.5px] text-[#555] leading-[1.5]">{text}</p>
          ))}
        </div>
      );

    case "section-spacer":
      return <div style={{ height: 14 }} />;
  }
}

// ─── Page renderer ────────────────────────────────────────────────────────────

/**
 * Renders the bricks assigned to a single page.
 *
 * Consecutive table-col-headers + table-row bricks are collapsed into one
 * <table> element. All other bricks render as individual block elements.
 *
 * If a continuation page begins mid-table (no table-col-headers brick present),
 * the column headers are injected automatically so every page is readable.
 */
export function renderPageBricks(bricks: ContentBrick[], dados: PdfData): ReactNode {
  const output: ReactNode[] = [];
  let i = 0;

  while (i < bricks.length) {
    const brick = bricks[i];

    if (brick.kind === "table-col-headers" || brick.kind === "table-row") {
      const hasExplicitColHeaders = brick.kind === "table-col-headers";
      if (hasExplicitColHeaders) i++;

      const rowNodes: ReactNode[] = [];
      while (i < bricks.length && bricks[i].kind === "table-row") {
        const b = bricks[i] as Extract<ContentBrick, { kind: "table-row" }>;
        rowNodes.push(<TableBodyRow key={b.rowIndex} item={b.item} rowIndex={b.rowIndex} />);
        i++;
      }

      // Always show column headers — either explicit or auto-injected on continuation pages.
      output.push(
        <table
          key={`table-block-${i}`}
          className="border-collapse"
          style={{ width: CONTENT_WIDTH_PX, tableLayout: "fixed" }}
        >
          <TableColGroup />
          <thead>
            <TableColHeadersRow />
          </thead>
          <tbody>{rowNodes}</tbody>
        </table>
      );
    } else {
      output.push(
        <div key={`brick-${i}`}>
          <MeasureBrick brick={brick} dados={dados} />
        </div>
      );
      i++;
    }
  }

  return <>{output}</>;
}
