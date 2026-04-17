import type { ReactNode } from "react";
import {
  PAGE_WIDTH_PX,
  PAGE_HEIGHT_PX,
  MARGIN_LEFT_PX,
  MARGIN_TOP_PX,
  FOOTER_HEIGHT_PX,
} from "./constants";
import { FooterBar } from "./FooterBar";

interface PdfPageProps {
  children: ReactNode;
}

export function PdfPage({ children }: PdfPageProps) {
  return (
    <div
      className="pdf-page"
      style={{
        width: PAGE_WIDTH_PX,
        height: PAGE_HEIGHT_PX,
        position: "relative",
        overflow: "hidden",
        background: "#fff",
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: MARGIN_TOP_PX,
          left: MARGIN_LEFT_PX,
          right: MARGIN_LEFT_PX,
          bottom: FOOTER_HEIGHT_PX,
          overflow: "hidden",
        }}
      >
        {children}
      </div>
      <FooterBar />
    </div>
  );
}
