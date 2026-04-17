import { forwardRef, useMemo } from "react";
import type React from "react";
import logoFort from "../assets/logo_fort.png";
import { COLOR_YELLOW, CONTENT_WIDTH_PX } from "./constants";
import { formatDateBR } from "./format";
import { PdfPage } from "./PdfPage";
import { usePdfPagination } from "./usePdfPagination";
import { buildContentBricks, MeasureBrick, renderPageBricks } from "./bricks";
import type { PdfData } from "./types";

function PageHeader({ dados }: { dados: PdfData }) {
  return (
    <div style={{ position: "relative", height: 66, marginBottom: 16 }}>
      <img
        src={logoFort}
        alt="Fort"
        style={{ position: "absolute", left: 0, top: 3, height: 50 }}
      />
      <div
        className="flex items-center px-3"
        style={{
          position: "absolute",
          left: 163,
          right: 0,
          top: 0,
          height: 53,
          background: COLOR_YELLOW,
        }}
      >
        <span className="font-bold text-[11px]">ORÇAMENTO:</span>
        <span className="text-[11px] ml-2">{String(dados.id).toUpperCase()}</span>
        <div className="ml-auto text-right text-[8px] leading-[14px]">
          <div>
            <strong>EMISSÃO:</strong>&nbsp;{formatDateBR(dados.dataAtual)}
          </div>
          <div>
            <strong>ATUALIZAÇÃO:</strong>&nbsp;{formatDateBR(dados.dataAtualizacao)}
          </div>
        </div>
      </div>
    </div>
  );
}

export const PdfTemplate = forwardRef<HTMLDivElement, { dados: PdfData }>(
  ({ dados }, ref) => {
    const bricks = useMemo(() => buildContentBricks(dados), [dados]);
    const { measureRef, pages } = usePdfPagination(bricks);

    const offscreenStyle: React.CSSProperties = {
      position: "absolute",
      left: -9999,
      top: 0,
    };

    // Measurement pass: render each brick in isolation (hidden) to capture its height.
    if (!pages.length) {
      return (
        <div ref={ref} style={offscreenStyle}>
          <div
            ref={measureRef}
            style={{ position: "absolute", visibility: "hidden", width: CONTENT_WIDTH_PX }}
          >
            {bricks.map((brick, index) => (
              <div key={index}>
                <MeasureBrick brick={brick} dados={dados} />
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div ref={ref} style={offscreenStyle}>
        {pages.map((pageBricks, pageIndex) => (
          <PdfPage key={pageIndex}>
            {pageIndex === 0 && <PageHeader dados={dados} />}
            {renderPageBricks(pageBricks, dados)}
          </PdfPage>
        ))}
      </div>
    );
  },
);

PdfTemplate.displayName = "PdfTemplate";
