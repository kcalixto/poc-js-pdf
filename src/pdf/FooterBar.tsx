import { MARGIN_LEFT_PX, COLOR_YELLOW } from "./constants";

export function FooterBar() {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        background: "#fff",
        padding: `5px ${MARGIN_LEFT_PX}px 0`,
      }}
    >
      <div style={{ height: 1, background: COLOR_YELLOW, marginBottom: 4 }} />
      <p className="m-0 text-center font-bold text-[8px]">
        FORT CORPORATIVO COMERCIAL LTDA
      </p>
      <p className="m-0 mt-0.5 text-center text-[7px]">
        CNPJ: 26.399.236/0001-36 | IE: 118.491.744.118
      </p>
      <p className="m-0 mt-0.5 text-center text-[6.5px]">
        Avenida Santo Amaro, 3432 Conj. 32,35 e 36, Brooklin Paulista, Cep:
        04.556-300 – São Paulo – SP – Tel: 11 3818-6830
      </p>
    </div>
  );
}
