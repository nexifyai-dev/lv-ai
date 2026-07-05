import { describe, expect, it } from "vitest";
import type { GaebPosition } from "./parser";
import {
  type BieterAngebot,
  createPreisspiegel,
  parseX84Angebot,
} from "./preisspiegel";

// ─── Fixtures ────────────────────────────────────────────────────────────────

const sampleX84BieterA = `<?xml version="1.0" encoding="UTF-8"?>
<GAEB xmlns="http://www.gaeb.de/GAEB_DA_XML/DA84/3.3">
  <PrjInfo>
    <PrjName>KiTa Liebigstraße</PrjName>
    <Prt>
      <PrtInfo>
        <PrtType>BI</PrtType>
        <PrtName>Bauunternehmen Schmidt GmbH</PrtName>
      </PrtInfo>
    </Prt>
  </PrjInfo>
  <Award>
    <Lot>
      <BoQ>
        <BoQBody>
          <Itemlist>
            <Item>
              <IDno>1.6.10</IDno>
              <Description><ShortDesc>Wellrohr M25</ShortDesc></Description>
              <QU>800.000</QU><QUDesc>m</QUDesc>
              <UP>12.50</UP><TP>10000.00</TP>
            </Item>
            <Item>
              <IDno>4.1.50</IDno>
              <Description><ShortDesc>Stahlbeton C20/25</ShortDesc></Description>
              <QU>12.000</QU><QUDesc>m3</QUDesc>
              <UP>120.00</UP><TP>1440.00</TP>
            </Item>
          </Itemlist>
        </BoQBody>
      </BoQ>
    </Lot>
  </Award>
  <Offer>
    <OfferInfo>
      <OfferTotal>11440.00</OfferTotal>
    </OfferInfo>
  </Offer>
</GAEB>`;

const sampleX84BieterB = `<?xml version="1.0" encoding="UTF-8"?>
<GAEB xmlns="http://www.gaeb.de/GAEB_DA_XML/DA84/3.3">
  <PrjInfo>
    <PrjName>KiTa Liebigstraße</PrjName>
    <Prt>
      <PrtInfo>
        <PrtType>BI</PrtType>
        <PrtName>Tiefbau Müller KG</PrtName>
      </PrtInfo>
    </Prt>
  </PrjInfo>
  <Award>
    <Lot>
      <BoQ>
        <BoQBody>
          <Itemlist>
            <Item>
              <IDno>1.6.10</IDno>
              <Description><ShortDesc>Wellrohr M25</ShortDesc></Description>
              <QU>800.000</QU><QUDesc>m</QUDesc>
              <UP>9.00</UP><TP>7200.00</TP>
            </Item>
            <Item>
              <IDno>4.1.50</IDno>
              <Description><ShortDesc>Stahlbeton C20/25</ShortDesc></Description>
              <QU>12.000</QU><QUDesc>m3</QUDesc>
              <UP>130.00</UP><TP>1560.00</TP>
            </Item>
          </Itemlist>
        </BoQBody>
      </BoQ>
    </Lot>
  </Award>
  <Offer>
    <OfferInfo>
      <OfferTotal>8760.00</OfferTotal>
    </OfferInfo>
  </Offer>
</GAEB>`;

const sampleX84BieterC = `<?xml version="1.0" encoding="UTF-8"?>
<GAEB xmlns="http://www.gaeb.de/GAEB_DA_XML/DA84/3.3">
  <PrjInfo>
    <PrjName>KiTa Liebigstraße</PrjName>
    <Prt>
      <PrtInfo>
        <PrtType>BI</PrtType>
        <PrtName>Discounter Bau GmbH</PrtName>
      </PrtInfo>
    </Prt>
  </PrjInfo>
  <Award>
    <Lot>
      <BoQ>
        <BoQBody>
          <Itemlist>
            <Item>
              <IDno>1.6.10</IDno>
              <Description><ShortDesc>Wellrohr M25</ShortDesc></Description>
              <QU>800.000</QU><QUDesc>m</QUDesc>
              <UP>5.00</UP><TP>4000.00</TP>
            </Item>
            <Item>
              <IDno>4.1.50</IDno>
              <Description><ShortDesc>Stahlbeton C20/25</ShortDesc></Description>
              <QU>12.000</QU><QUDesc>m3</QUDesc>
              <UP>125.00</UP><TP>1500.00</TP>
            </Item>
          </Itemlist>
        </BoQBody>
      </BoQ>
    </Lot>
  </Award>
  <Offer>
    <OfferInfo>
      <OfferTotal>5500.00</OfferTotal>
    </OfferInfo>
  </Offer>
</GAEB>`;

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("parseX84Angebot", () => {
  it("extrahiert Bieter-Namen aus X84 XML", () => {
    const angebot = parseX84Angebot(sampleX84BieterA);
    expect(angebot).not.toBeNull();
    expect(angebot?.bieterName).toBe("Bauunternehmen Schmidt GmbH");
  });

  it("extrahiert Gesamtsumme", () => {
    const angebot = parseX84Angebot(sampleX84BieterA);
    expect(angebot?.gesamtsumme).toBe(11_440);
  });

  it("extrahiert Positionen mit Preisen", () => {
    const angebot = parseX84Angebot(sampleX84BieterA);
    expect(angebot?.positions.length).toBe(2);
    expect(angebot?.positions[0].oz).toBe("1.6.10");
    expect(angebot?.positions[0].einheitspreis).toBe("12.50");
    expect(angebot?.positions[0].gesamtpreis).toBe("10000.00");
  });

  it("gibt null bei ungültigem XML", () => {
    expect(parseX84Angebot("not xml")).toBeNull();
  });

  it("gibt null bei leerem Angebot", () => {
    const empty = `<?xml version="1.0"?><GAEB xmlns="http://www.gaeb.de/GAEB_DA_XML/DA84/3.2"><PrjInfo><PrjName>Test</PrjName></PrjInfo></GAEB>`;
    expect(parseX84Angebot(empty)).toBeNull();
  });

  it("verwendet 'Unbekannter Bieter' wenn PrtType BI fehlt", () => {
    const noBieter = `<?xml version="1.0"?><GAEB xmlns="http://www.gaeb.de/GAEB_DA_XML/DA84/3.2"><PrjInfo><PrjName>T</PrjName></PrjInfo><Award><Lot><BoQ><BoQBody><Itemlist><Item><IDno>1.1</IDno><Description><ShortDesc>T</ShortDesc></Description><UP>10</UP><TP>100</TP></Item></Itemlist></BoQBody></BoQ></Lot></Award></GAEB>`;
    const angebot = parseX84Angebot(noBieter);
    expect(angebot?.bieterName).toBe("Unbekannter Bieter");
  });
});

describe("createPreisspiegel", () => {
  const angebote: BieterAngebot[] = [
    {
      bieterName: "Schmidt",
      gesamtsumme: 11_440,
      positions: [
        {
          oz: "1.6.10",
          kurztext: "Wellrohr",
          einheitspreis: "12.50",
          gesamtpreis: "10000.00",
        },
        {
          oz: "4.1.50",
          kurztext: "Beton",
          einheitspreis: "120.00",
          gesamtpreis: "1440.00",
        },
      ] as GaebPosition[],
    },
    {
      bieterName: "Müller",
      gesamtsumme: 8760,
      positions: [
        {
          oz: "1.6.10",
          kurztext: "Wellrohr",
          einheitspreis: "9.00",
          gesamtpreis: "7200.00",
        },
        {
          oz: "4.1.50",
          kurztext: "Beton",
          einheitspreis: "130.00",
          gesamtpreis: "1560.00",
        },
      ] as GaebPosition[],
    },
    {
      bieterName: "Discounter",
      gesamtsumme: 5500,
      positions: [
        {
          oz: "1.6.10",
          kurztext: "Wellrohr",
          einheitspreis: "5.00",
          gesamtpreis: "4000.00",
        },
        {
          oz: "4.1.50",
          kurztext: "Beton",
          einheitspreis: "125.00",
          gesamtpreis: "1500.00",
        },
      ] as GaebPosition[],
    },
  ];

  it("gibt leeres Resultat bei 0 Angeboten", () => {
    const result = createPreisspiegel([]);
    expect(result.bieterCount).toBe(0);
    expect(result.positions).toHaveLength(0);
  });

  it("zählt Bieter und Positionen korrekt", () => {
    const result = createPreisspiegel(angebote);
    expect(result.bieterCount).toBe(3);
    expect(result.positionCount).toBe(2);
  });

  it("erstellt Preisspiegel-Positionen mit allen Bieter-Preisen", () => {
    const result = createPreisspiegel(angebote);
    const pos = result.positions.find((p) => p.oz === "1.6.10");
    expect(pos).toBeDefined();
    expect(pos?.preise.Schmidt.gp).toBe(10_000);
    expect(pos?.preise.Müller.gp).toBe(7200);
    expect(pos?.preise.Discounter.gp).toBe(4000);
  });

  it("identifiziert Tiefstpreis und Höchstpreis", () => {
    const result = createPreisspiegel(angebote);
    const pos = result.positions.find((p) => p.oz === "1.6.10");
    expect(pos?.tiefstpreis?.bieter).toBe("Discounter");
    expect(pos?.tiefstpreis?.gp).toBe(4000);
    expect(pos?.hoechstpreis?.bieter).toBe("Schmidt");
    expect(pos?.hoechstpreis?.gp).toBe(10_000);
  });

  it("berechnet Durchschnitt korrekt", () => {
    const result = createPreisspiegel(angebote);
    const pos = result.positions.find((p) => p.oz === "1.6.10");
    // (10000 + 7200 + 4000) / 3 = 7066.67
    expect(pos?.durchschnitt).toBeCloseTo(7066.67, 1);
  });

  it("erstellt Bieter-Ranking (Rang 1 = günstigster)", () => {
    const result = createPreisspiegel(angebote);
    expect(result.bieter[0].name).toBe("Discounter");
    expect(result.bieter[0].rang).toBe(1);
    expect(result.bieter[1].name).toBe("Müller");
    expect(result.bieter[1].rang).toBe(2);
    expect(result.bieter[2].name).toBe("Schmidt");
    expect(result.bieter[2].rang).toBe(3);
  });

  it("erkennt Unterkostenangebot (VOB/A § 16)", () => {
    // Discounter: 4000 vs Durchschnitt 7066.67 → -43.4% → Unterkosten
    const result = createPreisspiegel(angebote);
    const unterkosten = result.ausreisser.filter(
      (a) => a.verdacht === "unterkosten"
    );
    expect(unterkosten.length).toBeGreaterThan(0);
    const discounter = unterkosten.find((a) => a.bieter === "Discounter");
    expect(discounter).toBeDefined();
    expect(discounter?.abweichungProzent).toBeLessThan(-20);
    expect(discounter?.hinweis).toContain("§ 16 VOB/A");
  });

  it("erkennt Überteuerte Positionen (>30% über Durchschnitt)", () => {
    const result = createPreisspiegel(angebote);
    const ueberkosten = result.ausreisser.filter(
      (a) => a.verdacht === "ueberkosten"
    );
    // Schmidt Wellrohr: 10000 vs 7066.67 = +41.5% → Überteuert
    const schmidt = ueberkosten.find(
      (a) => a.bieter === "Schmidt" && a.oz === "1.6.10"
    );
    expect(schmidt).toBeDefined();
    expect(schmidt?.abweichungProzent).toBeGreaterThan(30);
  });

  it("markiert normale Positionen nicht als Ausreißer", () => {
    const result = createPreisspiegel(angebote);
    // Position 4.1.50: 1440, 1560, 1500 → Durchschnitt 1500, Abweichungen alle < 20%
    const pos450 = result.ausreisser.filter((a) => a.oz === "4.1.50");
    expect(pos450).toHaveLength(0);
  });

  it("berechnet gesamtsumme aus Positionen wenn OfferTotal fehlt", () => {
    const angebotOhneTotal: BieterAngebot = {
      bieterName: "Test",
      positions: [
        { oz: "1.1", kurztext: "A", gesamtpreis: "500.00" },
        { oz: "1.2", kurztext: "B", gesamtpreis: "300.00" },
      ] as GaebPosition[],
    };
    const result = createPreisspiegel([angebotOhneTotal]);
    expect(result.bieter[0].gesamtsumme).toBe(800);
  });

  it("parst deutsche Zahlen (1.234,56)", () => {
    const angebotDe: BieterAngebot = {
      bieterName: "DE-Bieter",
      positions: [
        { oz: "1.1", kurztext: "Test", gesamtpreis: "1.234,56" },
      ] as GaebPosition[],
    };
    const result = createPreisspiegel([angebotDe]);
    expect(result.positions[0].preise["DE-Bieter"].gp).toBeCloseTo(1234.56, 2);
  });

  it("zählt Positionen mit/ohne Preis", () => {
    const angebot: BieterAngebot = {
      bieterName: "Test",
      positions: [
        { oz: "1.1", kurztext: "Mit", gesamtpreis: "100" },
        { oz: "1.2", kurztext: "Ohne" },
      ] as GaebPosition[],
    };
    const result = createPreisspiegel([angebot]);
    expect(result.bieter[0].positionenMitPreis).toBe(1);
    expect(result.bieter[0].positionenOhnePreis).toBe(1);
  });
});

describe("createPreisspiegel — Integration mit parseX84Angebot", () => {
  it("parst 3 X84-XMLs und generiert vollständigen Preisspiegel", () => {
    const a = parseX84Angebot(sampleX84BieterA);
    const b = parseX84Angebot(sampleX84BieterB);
    const c = parseX84Angebot(sampleX84BieterC);
    expect(a).not.toBeNull();
    expect(b).not.toBeNull();
    expect(c).not.toBeNull();

    const result = createPreisspiegel([a, b, c].filter(Boolean) as BieterAngebot[]);

    expect(result.bieterCount).toBe(3);
    expect(result.positionCount).toBe(2);
    expect(result.bieter[0].name).toBe("Discounter Bau GmbH");
    expect(result.ausreisser.length).toBeGreaterThan(0);
  });
});
