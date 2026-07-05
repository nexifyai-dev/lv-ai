# Leistungsverzeichnis — Deep Dive Praxiswissen
> **Ergänzung zu:** EXPERT_KNOWLEDGE_BASE.md
> **Erstellt:** 2026-07-04 | **Status:** Lückenlose Praxisvertiefung

---

## INHALTSVERZEICHNIS

A. [Gewerke-Reihenfolge nach Bauablauf](#a-gewerke-reihenfolge-nach-bauablauf)
B. [Konkrete Positionstexte pro Gewerk](#b-konkrete-positionstexte-pro-gewerk)
C. [Bodengruppen DIN 18300 — Vollständige Tabelle](#c-bodengruppen-din-18300--vollständige-tabelle)
D. [Beton- und Stahlbetonarbeiten — Detailwissen](#d-beton--und-stahlbetonarbeiten--detailwissen)
E. [DIN 276 — Kosten im Bauwesen](#e-din-276--kosten-im-bauwesen-vollständige-kostengliederung)
F. [Baustelleneinrichtung (BE) und Baustellengemeinkosten (BGK)](#f-baustelleneinrichtung-be-und-baustellengemeinkosten-bgk)
G. [Ausschreibung — Schritt-für-Schritt-Ablauf](#g-ausschreibung--schritt-für-schritt-ablauf)
H. [Angebotsbewertung & Preisspiegel](#h-angebotsbewertung--preisspiegel)
I. [Kalkulation — Praxisbeispiele](#i-kalkulation--praxisbeispiele)
J. [Nachtragsmanagement — Praxisfälle](#j-nachtragsmanagement--praxisfälle)
K. [Aufmaß & Abrechnung — Praxisbeispiele](#k-aufmaß--abrechnung--praxisbeispiele)
L. [GAEB DA XML — Technische Implementierung](#l-gaeb-da-xml--technische-implementierung)
M. [Sanitär, Heizung, Elektro — Detailpositionen](#m-sanitär-heizung-elektro--detailpositionen)
N. [Dachdeckerarbeiten — Detailwissen](#n-dachdeckerarbeiten--detailwissen)
O. [Tischlerarbeiten — Detailwissen](#o-tischlerarbeiten--detailwissen)
P. [Funktionale Ausschreibung — Praxis](#p-funktionale-ausschreibung--praxis)
Q. [Vertragsarten im Bauwesen](#q-vertragsarten-im-bauwesen)
R. [Rechtssprechung & BGH-Urteile](#r-rechtssprechung--bgh-urteile)

---

## A. Gewerke-Reihenfolge nach Bauablauf

### Typische Gewerke im Hochbau (nach Bauablauf)

| Phase | Gewerk-Nr. | Bezeichnung | DIN-Norm |
|-------|-----------|-------------|----------|
| 1 | 01 | Abbruch- und Entarbeiten | DIN 18311 |
| 2 | 02 | Erdarbeiten | DIN 18300 |
| 3 | 03 | Brunnenbau / Entwässerung | DIN 18302/18303 |
| 4 | 04 | Beton- und Stahlbetonarbeiten | DIN 18331/18333 |
| 5 | 05 | Maurerarbeiten | DIN 18312 |
| 6 | 06 | Dachabdichtungsarbeiten | DIN 18334 |
| 7 | 07 | Metallbauarbeiten (Stahlbau) | DIN 18360 |
| 8 | 08 | Schreiner-/Tischlerarbeiten | DIN 18317 |
| 9 | 09 | Fenster- und Fassadenarbeiten | DIN 18317/18355 |
| 10 | 12 | Zimmererarbeiten | DIN 18334 |
| 11 | 13 | Dachdeckerarbeiten | DIN 18320 |
| 12 | 14 | Abdichtungs-/Isolierarbeiten | DIN 18336 |
| 13 | 18 | Trockenbauarbeiten | DIN 18340 |
| 14 | 16 | Fliesen-, Platten- und Mosaikarbeiten | DIN 18316 |
| 15 | 17 | Estricharbeiten | DIN 18332 |
| 16 | 19 | Stuckateurarbeiten | DIN 18350 |
| 17 | 20 | Maler- und Lackierarbeiten | DIN 18340 |
| 18 | 22 | Asphaltierarbeiten | DIN 18337 |
| 19 | 23 | Fußbodenarbeiten | DIN 18335 |
| 20 | 30 | Wärme-/Kälteschutz / Rohrleitungsdämmung | DIN 18339 |
| 21 | 32 | Wasserinstallationen | DIN 18322 |
| 22 | 33 | Gasinstallationen | DIN 18322 |
| 23 | 34 | Heizungsanlagen | DIN 18325 |
| 24 | 35 | Lüftungsanlagen | DIN 18326 |
| 25 | 36 | Klimatechnik | DIN 18326 |
| 26 | 37 | Sanitärinstallationen | DIN 18322 |
| 27 | 40 | Starkstromanlagen | DIN 18330 |
| 28 | 41 | Fernmeldeanlagen / EDV-Technik | DIN 18331 |
| 29 | 42 | Blitzschutzanlagen | DIN 18331 |
| 30 | 44 | Aufzugsanlagen | DIN 18331 |
| 31 | 46 | Schlosserarbeiten | DIN 18318 |

### Gewerke-Gruppen

| Gruppe | Gewerke | Beschreibung |
|--------|---------|-------------|
| **Rohbau** | 01–05 | Abbruch, Erde, Beton, Mauerwerk |
| **Dach** | 12–13 | Zimmerer, Dachdecker |
| **Abdichtung** | 06, 14 | Dachabdichtung, Bauwerksabdichtung |
| **Ausbau** | 08–09, 16–20 | Tischler, Fliesen, Estrich, Trockenbau, Maler |
| **Metall** | 07, 46 | Stahlbau, Schlosser |
| **Technische Ausrüstung (TA)** | 30–44 | SHK + Elektro + Lüftung + Aufzug |
| **Außenanlagen** | — | Landschaftsbau, Pflaster, Bepflanzung |

---

## B. Konkrete Positionstexte pro Gewerk

### B.1 Erdarbeiten (DIN 18300)

```
Gewerk 01 — Erdarbeiten
├── 01.01 Baugruben
│   ├── 01.01.01 Aushub
│   │   01.01.01.0010 | Erdarbeiten ohne besondere Anforderungen,
│   │                  | Baugruben, Gräben, Bodengruppe 3 (schlecht lösbar),
│   │                  | Menge ca. XXX m³                           | m³
│   │   01.01.01.0020 | Erdarbeiten ohne besondere Anforderungen,
│   │                  | Baugruben, Bodengruppe 5 (mittel lösbar),
│   │                  | Menge ca. XXX m³                           | m³
│   │   01.01.01.0030 | Erdarbeiten ohne besondere Anforderungen,
│   │                  | Baugruben, Bodengruppe 6 (leicht lösbar),
│   │                  | Menge ca. XXX m³                           | m³
│   │   01.01.01.0040 | Erdarbeiten ohne besondere Anforderungen,
│   │                  | Gräben, Bodengruppe 4, Menge ca. XXX m³  | m³
│   ├── 01.01.02 Verbauprofile
│   │   01.01.02.0010 | Verbauprofile einbauen, Erdarbeiten,
│   │                  | Menge ca. XXX m²                           | m²
│   └── 01.01.03 Boden abfahren
│       01.01.03.0010 | Überschüssigen Boden abfahren,
│                      | Abladeort ca. XX km Entfernung            | m³
├── 01.02 Oberboden
│   01.02.00.0010 | Oberboden abtragen, lagern und wieder einbauen,
│                 | Schichtdicke ca. 20 cm, Fläche ca. XXX m²    | m²
│   01.02.00.0020 | Oberboden abtragen und lagern,
│                 | Schichtdicke ca. 20 cm                       | m²
│   01.02.00.0030 | Oberboden wieder einbauen und planieren,
│                 | Schichtdicke ca. 20 cm                       | m²
├── 01.03 Planum
│   01.03.00.0010 | Planum herstellen, nach technischer Vorschrift
│                 | verdichten, Festigkeitsklasse prüfen          | m²
│   01.03.00.0020 | Planum herstellen, einschließlich Verdichtung
│                 | und Gradschlag                                | m²
├── 01.04 Boden einbauen
│   01.04.00.0010 | Eingelieferten Boden einbauen und verdichten,
│                 | Lagerdicke ca. 30 cm, DPr ≥ 1,03             | m³
│   01.04.00.0020 | Boden einbauen, verdichten und planieren,
│                 | Lagerdicke ca. 50 cm                         | m³
└── 01.05 Geländeformen
    01.05.00.0010 | Geländeformen herstellen nach Angaben
                   | der Objektplanung                             | m²
```

### B.2 Maurerarbeiten (DIN 18312)

```
Gewerk 05 — Maurerarbeiten
├── 05.01 Mauerwerk
│   05.01.00.0010 | Außenwand, Mauerziegel NF, 36,5 cm,
│                 | Mörtelgruppe III, Mauerwerksklasse 4           | m²
│   05.01.00.0020 | Außenwand, Kalksandstein NF, 24 cm,
│                 | Mörtelgruppe III, Mauerwerksklasse 6           | m²
│   05.01.00.0030 | Innenwand, Porenbeton-Plansteine, 17,5 cm,
│                 | Dünnbettmörtel                                 | m²
│   05.01.00.0040 | Innenwand, Mauerziegel NF, 11,5 cm,
│                 | Mörtelgruppe II                                | m²
│   05.01.00.0050 | Brandschutzwand, Kalksandstein, 24 cm,
│                 | Mörtelgruppe III, Mauerwerksklasse 6           | m²
├── 05.02 Pfeiler und Streifen
│   05.02.00.0010 | Mauerwerks-Pfeiler, Kalksandstein,
│                 | 24 x 24 cm, Mörtelgruppe III                  | lfm
│   05.02.00.0020 | Mauerwerks-Streifen, Porenbeton,
│                 | 24 cm, Dünnbettmörtel                          | lfm
├── 05.03 Sturz- und Ringanker
│   05.03.00.0010 | Sturz über Fenster/Tür, Stahlbeton,
│                 | 24 x 12 cm, C25/30, Bewehrung BSt 500 S      | lfm
│   05.03.00.0020 | Ringanker, Stahlbeton, 24 x 20 cm,
│                 | C25/30, Bewehrung BSt 500 S                    | lfm
└── 05.04 Schlitze und Durchbrüche
    05.04.00.0010 | Mauerschlitze für Leitungen, Breite bis 10 cm,
                   | Tiefe bis 5 cm                                 | lfm
    05.04.00.0020 | Durchbrüche in Mauerwerk, Wandstärke bis 24 cm,
                   | Öffnung bis 1,0 m²                            | Stk
```

### B.3 Tischlerarbeiten (DIN 18317)

```
Gewerk 08 — Tischlerarbeiten
├── 08.01 Fenster
│   08.01.00.0010 | Fenster, Holz, 2-flügelig, Dreh-Kipp,
│                 | 1,20 x 1,50 m, Wärmeschutzverglasung Ug 1,1,
│                 | inkl. Blendrahmen, Montage                     | Stk
│   08.01.00.0020 | Fenster, Holz-Aluminium, 1-flügelig, Dreh-Kipp,
│                 | 0,60 x 1,20 m, Ug 1,1, inkl. Blendrahmen     | Stk
│   08.01.00.0030 | Fenster, Kunststoff, 3-flügelig, Dreh-Kipp,
│                 | 1,80 x 1,50 m, Ug 1,1, inkl. Blendrahmen     | Stk
│   08.01.00.0040 | Fensterbänke, Naturstein, 30 cm tief,
│                 | inkl. Konsolen                                  | lfm
├── 08.02 Türen
│   08.02.00.0010 | Innentür, Holz, 1-flügelig, 88,5 x 212,5 cm,
│                 | Druckverschluss, inkl. Zarge                    | Stk
│   08.02.00.0020 | Innentür, Holz, 2-flügelig, 177 x 212,5 cm,
│                 | Schloss, inkl. Zarge                           | Stk
│   08.02.00.0030 | Außentür, Holz-Aluminium, 1-flügelig,
│                 | 100 x 220 cm, Schloss, Sicherheitsbeschlag     | Stk
│   08.02.00.0040 | Brandschutz-Tür, Holz, Feuerwiderstand 30,
│                 | 1-flügelig, 88,5 x 212,5 cm, inkl. Zarge      | Stk
├── 08.03 Treppen
│   08.03.00.0010 | Holz-Treppe, gerade, 15 Stufen, 100 cm breit,
│                 | Auftritt Eiche, Setzstufe Fichte                | Stk
│   08.03.00.0020 | Handlauf, Holz, Rundprofil 5 cm,
│                 | inkl. Wandhalter                                | lfm
├── 08.04 Sonstiges
│   08.04.00.0010 | Regalbrett, Holz, 30 cm tief, 2 cm stark,
│                 | inkl. Wandhalter                                | lfm
│   08.04.00.0020 | Holzverkleidung, Wandpaneel, Fichte/Kiefer,
│                 | 12,5 cm breit, Nut und Feder                    | m²
└── 08.05 Befestigung
    08.05.00.0010 | Befestigungsmittel für Tischlerarbeiten,
                   | Dübel, Schrauben, Nägel                       | Pausch
```

### B.4 Dachdeckerarbeiten (DIN 18320)

```
Gewerk 13 — Dachdeckerarbeiten
├── 13.01 Dacheindeckung
│   13.01.00.0010 | Dachziegel, Tondachpfanne, farbig, Typ 2,
│                 | inkl. First- und Gratziegel, Lattung           | m²
│   13.01.00.0020 | Dachziegel, Tondachpfanne, natur, Typ 1,
│                 | inkl. First- und Gratziegel, Lattung           | m²
│   13.01.00.0030 | Betondachstein, farbig, inkl. Firststein,
│                 | Lattung                                         | m²
│   13.01.00.0040 | Dachschiefer, naturschiefer, 40 x 24 cm,
│                 | inkl. Lattung                                   | m²
├── 13.02 Dachabdichtung (Flachdach)
│   13.02.00.0010 | Bitumen-Schweißbahn, 2-lagig, PYE PV 200 S4,
│                 | auf Unterlage verklebt                          | m²
│   13.02.00.0020 | Kunststoffabdichtung, PVC, 1,5 mm stark,
│                 | mechanisch befestigt                            | m²
│   13.02.00.0030 | EPDM-Dichtungsbahn, 1,2 mm, vollflächig
│                 | verklebt                                        | m²
├── 13.03 Dachrinnen und Fallrohre
│   13.03.00.0010 | Dachrinne, Kupfer, halbrund, 333 mm,
│                 | inkl. Halter und Stutzen                        | lfm
│   13.03.00.0020 | Fallrohr, Kupfer, rund, Ø 100 mm,
│                 | inkl. Bögen und Wandhalter                      | lfm
│   13.03.00.0030 | Dachrinne, Titanzink, halbrund, 250 mm,
│                 | inkl. Halter und Stutzen                        | lfm
│   13.03.00.0040 | Fallrohr, Titanzink, rund, Ø 100 mm,
│                 | inkl. Bögen und Wandhalter                      | lfm
├── 13.04 Unterdeckung / Unterspannung
│   13.04.00.0010 | Unterdeckbahn, diffusionsoffen, 2-lagig,
│                 | auf Sparren                                      | m²
│   13.04.00.0020 | Unterspannbahn, PP-Gewebe, 1-lagig,
│                 | auf Sparren                                      | m²
├── 13.05 Wärmedämmung Dach
│   13.05.00.0010 | Zwischensparrendämmung, Mineralwolle,
│                 | 16 cm, λ = 0,035 W/(mK)                        | m²
│   13.05.00.0020 | Aufsparrendämmung, Polyurethan,
│                 | 12 cm, λ = 0,025 W/(mK)                        | m²
│   13.05.00.0030 | Kerndämmung, Mineralwolle, 10 cm,
│                 | λ = 0,035 W/(mK)                               | m²
└── 13.06 Schnee- und Wetterschutz
    13.06.00.0010 | Schneefanggitter, Edelstahl, Höhe 30 cm,
                   | inkl. Halter                                    | lfm
    13.06.00.0020 | Dachhaken, Edelstahl, für Solaranlage          | Stk
```

### B.5 Maler- und Lackierarbeiten (DIN 18340)

```
Gewerk 20 — Maler- und Lackierarbeiten
├── 20.01 Wand- und Deckenanstriche
│   20.01.00.0010 | Wandanstrich, Dispersionsfarbe, 2 Anstriche,
│                 | auf Putz, weiß                                  | m²
│   20.01.00.0020 | Deckenanstrich, Dispersionsfarbe, 2 Anstriche,
│                 | auf Putz, weiß                                  | m²
│   20.01.00.0030 | Wandanstrich, Latexfarbe, 2 Anstriche,
│                 | auf Putz, weiß, abwaschbar                     | m²
│   20.01.00.0040 | Streichputz, mineralisch, Korn 2 mm,
│                 | 1 Anstrich                                       | m²
├── 20.02 Lackierarbeiten
│   20.02.00.0010 | Holzlack, 2 Anstriche, auf Holz, weiß,
│                 | Fenster/Türen                                   | m²
│   20.02.00.0020 | Metalllack, 2 Anstriche, auf Stahl,
│                 | Korrosionsschutz                                | m²
│   20.02.00.0030 | Klarlack, 1 Anstrich, auf Holz,
│                 | naturbelassen                                    | m²
├── 20.03 Tapezierarbeiten
│   20.03.00.0010 | Rauhfaser, 2 Anstriche, Dispersionsfarbe,
│                 | weiß                                              | m²
│   20.03.00.0020 | Vliestapete, 2 Anstriche, Dispersionsfarbe,
│                 | weiß                                              | m²
└── 20.04 Untergrundvorbereitung
    20.04.00.0010 | Untergrund schleifen und entstauben            | m²
    20.04.00.0020 | Risse spachteln und überarbeiten               | lfm
    20.04.00.0030 | Grundierung auftragen, Putz, 1 Anstrich        | m²
```

### B.6 Fliesen- und Plattenarbeiten (DIN 18316)

```
Gewerk 16 — Fliesen- und Plattenarbeiten
├── 16.01 Bodenfliesen
│   16.01.00.0010 | Bodenfliesen, Feinsteinzeug, 60 x 60 cm,
│                 | auf Estrich verlegen, inkl. Verfugen           | m²
│   16.01.00.0020 | Bodenfliesen, Feinsteinzeug, 30 x 30 cm,
│                 | auf Estrich verlegen, inkl. Verfugen           | m²
│   16.01.00.0030 | Bodenfliesen, Keramik, 20 x 20 cm,
│                 | auf Estrich verlegen, inkl. Verfugen           | m²
├── 16.02 Wandfliesen
│   16.02.00.0010 | Wandfliesen, Keramik, 30 x 60 cm,
│                 | auf Putz verlegen, inkl. Verfugen              | m²
│   16.02.00.0020 | Wandfliesen, Keramik, 20 x 20 cm,
│                 | auf Putz verlegen, inkl. Verfugen              | m²
│   16.02.00.0030 | Wandfliesen, Feinsteinzeug, 60 x 60 cm,
│                 | auf Putz verlegen, inkl. Verfugen              | m²
├── 16.03 Naturstein
│   16.03.00.0010 | Natursteinplatten, Granit, 60 x 30 x 2 cm,
│                 | auf Estrich verlegen, inkl. Verfugen           | m²
│   16.03.00.0020 | Natursteinplatten, Marmor, 40 x 40 x 1,5 cm,
│                 | auf Estrich verlegen, inkl. Verfugen           | m²
├── 16.04 Abdichtung unter Fliesen
│   16.04.00.0010 | Abdichtungsbahn, flexibel, 2-lagig,
│                 | unter Fliesen im Nassbereich                   | m²
│   16.04.00.0020 | Dichtschlämme, 2-lagig, unter Fliesen
│                 | im Nassbereich                                  | m²
└── 16.05 Zubehör
    16.05.00.0010 | Silikonfuge, Sanitärsilikon, dauerelastisch,
                   | Breite 8-10 mm                                  | lfm
    16.05.00.0020 | Sockelleiste, Keramik, 8 cm hoch,
                   | inkl. Verfugen                                  | lfm
```

### B.7 Dachdeckerarbeiten (DIN 18320)

```
Gewerk 13 — Dachdeckerarbeiten
├── 13.01 Unterkonstruktion
│   13.01.00.0010 | Lattung, 6/8 cm, auf Sparren nageln,
│                 | inkl. Lieferung                                  | m²
│   13.01.00.0020 | Konterlattung, 5/6 cm, auf Sparren nageln,
│                 | inkl. Lieferung                                  | m²
│   13.01.00.0030 | Unterkonstruktion für Flachdach, Holz,
│                 | inkl. Lieferung und Montage                      | m²
├── 13.02 Eindeckung Steildach
│   13.02.00.0010 | Dachziegel, Tondach, naturrot, inkl. Lieferung
│                 | und Verlegen                                     | m²
│   13.02.00.0020 | Dachziegel, Betondach, anthrazit, inkl.
│                 | Lieferung und Verlegen                           | m²
│   13.02.00.0030 | Dachpfanne, Falzziegel, glasiert, inkl.
│                 | Lieferung und Verlegen                           | m²
│   13.02.00.0040 | Schiefereindeckung, naturschiefer, inkl.
│                 | Lieferung und Verlegen                           | m²
├── 13.03 Eindeckung Flachdach
│   13.03.00.0010 | Bitumen-Schweißbahn, 2-lagig, PYE PV 200 S,
│                 | inkl. Verlegen und Verschweißen                  | m²
│   13.03.00.0020 | PVC-Dachbahn, 1,5 mm, mechanisch befestigt,
│                 | inkl. Verlegen                                   | m²
│   13.03.00.0030 | EPDM-Dachbahn, 1,2 mm, vollflächig verklebt,
│                 | inkl. Verlegen                                   | m²
│   13.03.00.0040 | Gründach, Substrathöhe 80 mm, inkl.
│                 | Vegetationsschicht und Drainage                  | m²
├── 13.04 Dachrinnen und Fallrohre
│   13.04.00.0010 | Dachrinne, Kupfer, 333 mm, inkl. Halter
│                 | und Anschluss                                    | lfm
│   13.04.00.0020 | Dachrinne, Stahl verzinkt, 250 mm, inkl.
│                 | Halter und Anschluss                             | lfm
│   13.04.00.0030 | Fallrohr, Kupfer, Ø 100 mm, inkl. Halter       | lfm
│   13.04.00.0040 | Fallrohr, Stahl verzinkt, Ø 100 mm,
│                 | inkl. Halter                                     | lfm
└── 13.05 Dachfenster
    13.05.00.0010 | Dachfenster, Holz, 78 x 118 cm, inkl. Einbau   | Stk
    13.05.00.0020 | Dachfenster, Kunststoff, 78 x 118 cm,
                   | inkl. Einbau                                     | Stk
    13.05.00.0030 | Dachfenster, Holz-Aluminium, 78 x 118 cm,
                   | inkl. Einbau                                     | Stk
```

### B.8 Metallbau / Schlosserarbeiten (DIN 18318)

```
Gewerk 46 — Schlosserarbeiten
├── 46.01 Geländer
│   46.01.00.0010 | Geländer, Edelstahl, Handlauf Ø 42 mm,
│                 | Füllung Seil, inkl. Montage                      | lfm
│   46.01.00.0020 | Geländer, Stahl pulverbeschichtet, Handlauf
│                 | Ø 42 mm, Füllung Stäbe, inkl. Montage            | lfm
│   46.01.00.0030 | Handlauf, Edelstahl, Ø 42 mm, Wandhalter,
│                 | inkl. Montage                                    | lfm
├── 46.02 Treppen
│   46.02.00.0010 | Stahltreppe, gerade, 15 Stufen, inkl. Geländer
│                 | und Montage                                      | Stk
│   46.02.00.0020 | Stahltreppe, gewendelt, Ø 150 cm, inkl.
│                 | Geländer und Montage                             | Stk
│   46.02.00.0030 | Feuertreppe, Stahl, außen, inkl. Geländer
│                 | und Montage                                      | Stk
├── 46.03 Tore und Türschlösser
│   46.03.00.0010 | Stahltür, 1-flügelig, 100 x 210 cm, inkl.
│                 | Zarge und Beschläge                              | Stk
│   46.03.00.0020 | Brandschutztür, EI 90, 1-flügelig, 90 x 210 cm,
│                 | inkl. Zarge und Beschläge                        | Stk
│   46.03.00.0030 | Panzerrolltor, Stahl, 300 x 250 cm, inkl.
│                 | Motor und Einbau                                 | Stk
└── 46.04 Metallkonstruktionen
    46.04.00.0010 | Stahlkonstruktion, IPE-Träger, inkl. Schweißen
                   | und Montage                                      | kg
    46.04.00.0020 | Laubengang, Stahl, 3,0 x 3,0 m, inkl.
                   | Dach und Montage                                 | Stk
```

### B.9 Trockenbauarbeiten (DIN 18340)

```
Gewerk 18 — Trockenbauarbeiten
├── 18.01 Wandsysteme
│   18.01.00.0010 | Trockenbauwand, 1-lagig beplankt, GKB 12,5 mm,
│                 | auf Ständerwerk, inkl. Dämmung                   | m²
│   18.01.00.0020 | Trockenbauwand, 2-lagig beplankt, GKB 12,5 mm,
│                 | auf Ständerwerk, inkl. Dämmung                   | m²
│   18.01.00.0030 | Brandschutzwand, F30, 2-lagig GKF 15 mm,
│                 | auf Ständerwerk, inkl. Dämmung                   | m²
│   18.01.00.0040 | Schallschutzwand, 2-lagig GKB 12,5 mm,
│                 | doppeltes Ständerwerk, inkl. Mineralwolle        | m²
├── 18.02 Deckensysteme
│   18.02.00.0010 | Abgehängte Decke, GKB 12,5 mm, auf
│                 | Tragprofilen, inkl. Unterkonstruktion            | m²
│   18.02.00.0020 | Brandschutzdecke, F30, 2-lagig GKF 15 mm,
│                 | auf Tragprofilen                                 | m²
│   18.02.00.0030 | Akustikdecke, gelochte GKB-Platte, 12,5 mm,
│                 | inkl. Unterkonstruktion und Dämmvlies            | m²
│   18.02.00.0040 | Küchen-Unterbaudecke, feuchtraumgeeignet,
│                 | GKF 12,5 mm, inkl. Unterkonstruktion             | m²
├── 18.03 Bekleidungen
│   18.03.00.0010 | Wandbekleidung, GKB 12,5 mm, auf Unterlage
│                 | geklebt                                          | m²
│   18.03.00.0020 | Sockelleiste, GKB, 10 cm hoch, aufkleben        | lfm
└── 18.04 Fugen und Anschlüsse
    18.04.00.0010 | Dehnfuge, Silikonfuge, 10 mm breit               | lfm
    18.04.00.0020 | Anschlussprofil, Eckschutz, Aluminium             | lfm
```

### B.10 Estricharbeiten (DIN 18353/18354)

```
Gewerk 17 — Estricharbeiten
├── 17.01 Zementestrich
│   17.01.00.0010 | Zementestrich, C25 F4, schwimmend, 60 mm,
│                 | inkl. Trennschicht und Randdämmstreifen           | m²
│   17.01.00.0020 | Zementestrich, C30 F5, auf Trennschicht,
│                 | 50 mm                                             | m²
│   17.01.00.0030 | Heizestrich, C25 F4, 65 mm über FBH,
│                 | inkl. Schweißfolie                                | m²
├── 17.02 Calciumsulfatestrich
│   17.02.00.0010 | Calciumsulfatestrich (CA), C30 F5, fließend,
│                 | schwimmend, 50 mm, inkl. Trennschicht             | m²
│   17.02.00.0020 | Heizestrich CA, C25 F4, 55 mm über FBH,
│                 | inkl. Schweißfolie                                | m²
├── 17.03 Anhydritestrich
│   17.03.00.0010 | Anhydritestrich, C25 F4, schwimmend, 50 mm,
│                 | inkl. Trennschicht                                | m²
└── 17.04 Oberflächenbehandlung
    17.04.00.0010 | Estrich schleifen, saugfähig                     | m²
    17.04.00.0020 | Estrich imprägnieren                             | m²
    17.04.00.0030 | Estrichspachtelung, 2 mm, vollflächig            | m²
```

### B.11 Maler- und Lackierarbeiten (DIN 18363)

```
Gewerk 20 — Maler- und Lackierarbeiten
├── 20.01 Wandbeschichtungen
│   20.01.00.0010 | Dispersionsfarbe, weiß, 2-lagig, auf Putz       | m²
│   20.01.00.0020 | Dispersionsfarbe, farbig, 2-lagig, auf Putz     | m²
│   20.01.00.0030 | Silikonharzfarbe, 2-lagig, auf Putz (Außen)     | m²
│   20.01.00.0040 | Latexfarbe, seidenmatt, 2-lagig, auf Putz       | m²
│   20.01.00.0050 | Tapete, Vliestapete, inkl. Kleister und Aufbringen| m²
│   20.01.00.0060 | Tapete, Raufaser, inkl. Kleister und Streichen  | m²
├── 20.02 Deckenbeschichtungen
│   20.02.00.0010 | Deckenfarbe, weiß, 2-lagig, auf Putz/GKB       | m²
│   20.02.00.0020 | Kalkfarbe, 2-lagig, auf Putz (historisch)       | m²
├── 20.03 Lackierarbeiten
│   20.03.00.0010 | Holzlack, seidenmatt, 2-lagig, auf Holz         | m²
│   20.03.00.0020 | Metalllack, 2-Komponenten, auf Stahl            | m²
│   20.03.00.0030 | Fensterlack, wetterbeständig, auf Holzfenster   | m²
└── 20.04 Beschichtung Trockenbau
    20.04.00.0010 | Grundierung, Tiefengrund, auf GKB               | m²
    20.04.00.0020 | Spachtelung, Fugen und Schraubenlöcher, GKB     | m²
    20.04.00.0030 | Oberflächenbeschichtung, Q3-Q4, GKB             | m²
```

### B.12 Elektroinstallation (DIN 18330)

```
Gewerk 40 — Starkstromanlagen
├── 40.01 Kabel und Leitungen
│   40.01.00.0010 | NYM-J Kabel, 3 x 1,5 mm², Unterputz
│                 | verlegen, inkl. Rohr                            | lfm
│   40.01.00.0020 | NYM-J Kabel, 3 x 2,5 mm², Unterputz
│                 | verlegen, inkl. Rohr                            | lfm
│   40.01.00.0030 | NYM-J Kabel, 5 x 2,5 mm², Unterputz
│                 | verlegen, inkl. Rohr                            | lfm
│   40.01.00.0040 | NYM-J Kabel, 5 x 4 mm², Unterputz
│                 | verlegen, inkl. Rohr                            | lfm
├── 40.02 Steckdosen und Schalter
│   40.02.00.0010 | Steckdose, Unterputz, 2-fach, weiß,
│                 | inkl. Unterputzdose                              | Stk
│   40.02.00.0020 | Steckdose, Unterputz, 3-fach, weiß,
│                 | inkl. Unterputzdose                              | Stk
│   40.02.00.0030 | Lichtschalter, Unterputz, 1-fach, weiß,
│                 | inkl. Unterputzdose                              | Stk
│   40.02.00.0040 | Lichtschalter, Unterputz, 2-fach, weiß,
│                 | inkl. Unterputzdose                              | Stk
│   40.02.00.0050 | Wechselschalter, Unterputz, 1-fach, weiß       | Stk
│   40.02.00.0060 | Serienschalter, Unterputz, 1-fach, weiß        | Stk
├── 40.03 Verteiler
│   40.03.00.0010 | Unterverteiler, 36 TE, komplett bestückt,
│                 | inkl. FI-Schutzschalter und Leitungsschutzschalter | Stk
│   40.03.00.0020 | Unterverteiler, 48 TE, komplett bestückt,
│                 | inkl. FI-Schutzschalter und Leitungsschutzschalter | Stk
│   40.03.00.0030 | FI-Schutzschalter, 4-polig, 40A, 30 mA          | Stk
│   40.03.00.0040 | Leitungsschutzschalter, 1-polig, B16A            | Stk
│   40.03.00.0050 | Leitungsschutzschalter, 1-polig, B13A            | Stk
├── 40.04 Beleuchtung
│   40.04.00.0010 | LED-Einbaustrahler, rund, Ø 9 cm, 10W,
│                 | 3000K, inkl. Einbau                              | Stk
│   40.04.00.0020 | LED-Panel, 60 x 60 cm, 40W, 4000K,
│                 | inkl. Einbau und Aufhängung                      | Stk
│   40.04.00.0030 | Pendelleuchte, E27, inkl. Leuchtmittel,
│                 | inkl. Montage                                    | Stk
└── 40.05 Daten und Kommunikation
    40.05.00.0010 | Cat-7-Kabel, Unterputz verlegen, inkl. Rohr    | lfm
    40.05.00.0020 | RJ45-Dose, Cat. 7, Unterputz, inkl. Dose       | Stk
    40.05.00.0030 | Patchfeld, 24-port, Cat. 7, 19 Zoll             | Stk
```

### B.13 Sanitärinstallation (DIN 18322)

```
Gewerk 37 — Sanitärinstallationen
├── 37.01 Kaltwasser
│   37.01.00.0010 | Kaltwasserleitung, Mehrschichtverbundrohr,
│                 | 16 x 2,0 mm, verlegen                           | lfm
│   37.01.00.0020 | Kaltwasserleitung, Mehrschichtverbundrohr,
│                 | 20 x 2,5 mm, verlegen                           | lfm
│   37.01.00.0030 | Kaltwasserleitung, Kupferrohr, 18 x 1,0 mm,
│                 | verlegen                                         | lfm
├── 37.02 Warmwasser
│   37.02.00.0010 | Warmwasserleitung, Mehrschichtverbundrohr,
│                 | 16 x 2,0 mm, verlegen, inkl. Dämmung            | lfm
│   37.02.00.0020 | Warmwasserleitung, Kupferrohr, 18 x 1,0 mm,
│                 | verlegen, inkl. Dämmung                          | lfm
│   37.02.00.0030 | Zirkulationsleitung, Mehrschichtverbundrohr,
│                 | 16 x 2,0 mm, verlegen, inkl. Dämmung            | lfm
├── 37.03 Abwasser
│   37.03.00.0010 | Abwasserleitung, KG-Rohr, DN 100,
│                 | verlegen, inkl. Muffen                           | lfm
│   37.03.00.0020 | Abwasserleitung, KG-Rohr, DN 150,
│                 | verlegen, inkl. Muffen                           | lfm
│   37.03.00.0030 | Abwasserleitung, HT-Rohr, DN 50,
│                 | verlegen, inkl. Muffen                           | lfm
│   37.03.00.0040 | Abwasserleitung, HT-Rohr, DN 100,
│                 | verlegen, inkl. Muffen                           | lfm
├── 37.04 Sanitärobjekte
│   37.04.00.0010 | WC, Unterputzspülkasten, inkl. Spülkasten,
│                 | Keramik, inkl. Anschluss                         | Stk
│   37.04.00.0020 | Waschtisch, Keramik, 60 x 45 cm, inkl. Siphon,
│                 | inkl. Anschluss                                  | Stk
│   37.04.00.0030 | Waschtisch mit Unterschrank, 80 x 45 cm,
│                 | inkl. Siphon und Anschluss                       | Stk
│   37.04.00.0040 | Badewanne, Acryl, 170 x 75 cm, inkl. Siphon,
│                 | inkl. Anschluss                                  | Stk
│   37.04.00.0050 | Duschtasse, Acryl, 90 x 90 cm, inkl. Siphon,
│                 | inkl. Anschluss                                  | Stk
│   37.04.00.0060 | Duschkabine, 90 x 90 cm, Glas, inkl. Montage   | Stk
│   37.04.00.0070 | Spülbecken, Edelstahl, 50 x 40 cm, inkl. Siphon,
│                 | inkl. Anschluss                                  | Stk
│   37.04.00.0080 | Urinal, Keramik, inkl. Spülkasten,
│                 | inkl. Anschluss                                  | Stk
└── 37.05 Armaturen
    37.05.00.0010 | Einhebelmischbatterie, Küche, inkl. Montage     | Stk
    37.05.00.0020 | Einhebelmischbatterie, Bad, inkl. Montage       | Stk
    37.05.00.0030 | Einhebelmischbatterie, Dusche, inkl. Montage    | Stk
    37.05.00.0040 | Eckventil, 1/2 Zoll, inkl. Montage              | Stk
```

### B.14 Heizungsinstallation (DIN 18325)

```
Gewerk 34 — Heizungsanlagen
├── 34.01 Heizkörper
│   34.01.00.0010 | Heizkörper, Paneel Typ 22, 1000 x 600 mm,
│                 | inkl. Anschlussgarnitur und Entlüfter            | Stk
│   34.01.00.0020 | Heizkörper, Paneel Typ 22, 1200 x 600 mm,
│                 | inkl. Anschlussgarnitur und Entlüfter            | Stk
│   34.01.00.0030 | Heizkörper, Paneel Typ 22, 600 x 600 mm,
│                 | inkl. Anschlussgarnitur und Entlüfter            | Stk
│   34.01.00.0040 | Heizkörper, Paneel Typ 33, 1000 x 600 mm,
│                 | inkl. Anschlussgarnitur und Entlüfter            | Stk
├── 34.02 Fußbodenheizung
│   34.02.00.0010 | Fußbodenheizung, Rohr 16 x 2,0 mm,
│                 | PE-RT, Verlegung auf Noppenplatten, inkl.
│                 | Wärmeverteiler                                  | m²
│   34.02.00.0020 | Fußbodenheizung, Rohr 17 x 2,0 mm,
│                 | PE-Xa, Verlegung auf Schienensystem, inkl.
│                 | Wärmeverteiler                                  | m²
│   34.02.00.0030 | Wärmeverteiler, 8-fach, inkl. Durchfluss-
│                 | messer und Thermostatventile                     | Stk
│   34.02.00.0040 | Wärmeverteiler, 12-fach, inkl. Durchfluss-
│                 | messer und Thermostatventile                     | Stk
├── 34.03 Verrohrung
│   34.03.00.0010 | Heizungsrohr, Kupfer, 22 x 1,0 mm,
│                 | verlegen                                         | lfm
│   34.03.00.0020 | Heizungsrohr, Kupfer, 28 x 1,5 mm,
│                 | verlegen                                         | lfm
│   34.03.00.0030 | Heizungsrohr, Mehrschichtverbundrohr,
│                 | 20 x 2,0 mm, verlegen                           | lfm
│   34.03.00.0040 | Heizungsrohr, Mehrschichtverbundrohr,
│                 | 26 x 3,0 mm, verlegen                           | lfm
├── 34.04 Wärmeerzeuger
│   34.04.00.0010 | Gas-Brennwerttherme, 24 kW, inkl. Abgas-
│                 | system und Anschluss                             | Stk
│   34.04.00.0020 | Gas-Brennwerttherme, 35 kW, inkl. Abgas-
│                 | system und Anschluss                             | Stk
│   34.04.00.0030 | Wärmepumpe, Luft-Wasser, 10 kW, inkl.
│                 | Außenaufstellung und Anschluss                   | Stk
│   34.04.00.0040 | Wärmepumpe, Sole-Wasser, 12 kW, inkl.
│                 | Erdkollektor und Anschluss                       | Stk
│   34.04.00.0050 | Pufferspeicher, 500 Liter, inkl. Anschluss      | Stk
│   34.04.00.0060 | Pufferspeicher, 1000 Liter, inkl. Anschluss     | Stk
└── 34.05 Regelung
    34.05.00.0010 | Heizungsregelung, Witterungsgeführt, inkl.
                   | Außentemperaturfühler und Stellglied             | Stk
    34.05.00.0020 | Einzelraumregelung, Funk-Thermostat,
                   | inkl. Empfänger                                  | Stk
```

---

## C. Bodengruppen DIN 18300 — Vollständige Tabelle

| Bodengruppe (BG) | Bezeichnung | Beschreibung | Lösbarkeit | Typische Vorkommen |
|-------------------|-------------|-------------|------------|-------------------|
| **1** | Fels | Sehr hart, Sprengarbeit nötig | Sprengen | Naturstein, Granit, Basalt |
| **2** | Verwitterter Fels | Weich, Locker oder Bruch | Lockern + Löffelbagger | Verwitterungsgestein |
| **3** | Grobboden | Grob, schlecht lösbar | Schlecht lösbar | Kies, Schotter, Blöcke |
| **4** | Mittel- bis feinkörnig | Mittel lösbar | Mittel lösbar | Sand, sandiger Kies |
| **5** | Feinkörnig | Gut lösbar | Gut lösbar | Lehm, Ton, Schluff |
| **6** | Anstehend bindig | Sehr gut lösbar | Sehr gut lösbar | Mutterboden, Humus |
| **7** | Locker | Extrem gut lösbar | Extrem gut lösbar | Sand, Flugsand |

### Bodengruppen-Klassifikation nach Korngröße

| BG | Korngröße | Lagerungsdichte | Lösbarkeit |
|----|-----------|-----------------|------------|
| 1 | >200 mm | Sehr dicht | Sprengen |
| 2 | 63-200 mm | Dicht | Lockern |
| 3 | 2-63 mm | Mittel dicht | Schaufelbagger |
| 4 | 0,06-2 mm | Locker | Schaufelbagger |
| 5 | <0,06 mm | Weich | Schaufelbagger |
| 6 | Organisch | Weich | Schaufelbagger |
| 7 | Sehr fein | Sehr locker | Schaufelbagger |

---

## D. Beton- und Stahlbetonarbeiten — Detailwissen

### D.1 Betonfestigkeitsklassen (DIN EN 206)

| Klasse | Zylinderdruckfestigkeit | Anwendung |
|--------|------------------------|-----------|
| **C8/10** | 8/10 MPa | Leichter Beton, Frostschutz |
| **C12/15** | 12/15 MPa | Fundamente, Bodenplatten |
| **C16/20** | 16/20 MPa | Standard-Hochbau |
| **C20/25** | 20/25 MPa | Standard-Hochbau |
| **C25/30** | 25/30 MPa | Verstärkter Hochbau |
| **C30/37** | 30/37 MPa | Brücken, Industriebau |
| **C35/45** | 35/45 MPa | Stark beanspruchte Bauteile |
| **C40/50** | 40/50 MPa | Brücken, Hochhäuser |
| **C45/55** | 45/55 MPa | Sonderbauwerke |
| **C50/60** | 50/60 MPa | Sonderbauwerke |

### D.2 Expositionsklassen

| Klasse | Beschreibung | Anwendung |
|--------|-------------|-----------|
| **XC1** | Trocken oder permanent nass | Innenräume |
| **XC2** | Nass, selten trocken | Fundamente |
| **XC3** | Mäßig feucht | Außenbauteile |
| **XC4** | Wechselnd nass/trocken | Kelleraußenwände |
| **XF1** | Mäßig wassergesättigt, Frost | Balkone |
| **XF2** | Wassergesättigt, Frost | Terrassen |
| **XF3** | Mäßig wassergesättigt, Frost + Tausalz | Straßenbau |
| **XF4** | Wassergesättigt, Frost + Tausalz | Brücken |
| **XA1** | Schwach chemisch angreifend | Kläranlagen |
| **XA2** | Mäßig chemisch angreifend | Industrieböden |
| **XA3** | Stark chemisch angreifend | Sonderbauwerke |

### D.3 Bewehrungsstahl

| Bezeichnung | Festigkeit | Anwendung |
|-------------|-----------|-----------|
| **BSt 500 S** | 500 MPa | Standard-Bewehrung |
| **BSt 500 M** | 500 MPa | Hochfest, dünnere Querschnitte |
| **BSt 420 S** | 420 MPa | Altbau-Sanierung |

### D.4 Typische LV-Positionen Beton-/Stahlbeton

```
Gewerk 04 — Beton- und Stahlbetonarbeiten
├── 04.01 Beton
│   04.01.00.0010 | Transportbeton, C25/30, XC4, Zementklasse 42,5 N,
│                 | Lieferung und Einbau, inkl. Verdichtung          | m³
│   04.01.00.0020 | Transportbeton, C30/37, XC4, Zementklasse 42,5 N,
│                 | Lieferung und Einbau, inkl. Verdichtung          | m³
│   04.01.00.0030 | Transportbeton, C20/25, XC2, Zementklasse 32,5 R,
│                 | Lieferung und Einbau, inkl. Verdichtung          | m³
├── 04.02 Bewehrung
│   04.02.00.0010 | Bewehrungsstahl, BSt 500 S, Ø 8 mm,
│                 | liefern und einlegen, inkl. Biegen und Binden    | kg
│   04.02.00.0020 | Bewehrungsstahl, BSt 500 S, Ø 12 mm,
│                 | liefern und einlegen, inkl. Biegen und Binden    | kg
│   04.02.00.0030 | Bewehrungsstahl, BSt 500 S, Ø 16 mm,
│                 | liefern und einlegen, inkl. Biegen und Binden    | kg
│   04.02.00.0040 | Bewehrungsstahl, BSt 500 S, Ø 20 mm,
│                 | liefern und einlegen, inkl. Biegen und Binden    | kg
│   04.02.00.0050 | Bewehrungsstahl, BSt 500 S, Ø 25 mm,
│                 | liefern und einlegen, inkl. Biegen und Binden    | kg
│   04.02.00.0060 | Bewehrungsstahl, BSt 500 S, Ø 32 mm,
│                 | liefern und einlegen, inkl. Biegen und Binden    | kg
│   04.02.00.0070 | Mattenbewehrung, Q 188A, Ø 6 mm,
│                 | liefern und einlegen                              | m²
│   04.02.00.0080 | Mattenbewehrung, Q 257A, Ø 7 mm,
│                 | liefern und einlegen                              | m²
├── 04.03 Schalung
│   04.03.00.0010 | Schalung herstellen, glatte Sichtbetonqualität,
│                 | inkl. Abbinden, Reinigen und Wiederverwenden     | m²
│   04.03.00.0020 | Schalung herstellen, normale Qualität,
│                 | inkl. Abbinden, Reinigen und Wiederverwenden     | m²
│   04.03.00.0030 | Schalung herstellen, Rundschalung, Ø bis 1,0 m,
│                 | inkl. Abbinden                                    | m²
├── 04.04 Oberflächenbehandlung
│   04.04.00.0010 | Betonoberfläche abreiben, Sichtbetonqualität    | m²
│   04.04.00.0020 | Betonoberfläche schleifen, Sichtbetonqualität   | m²
│   04.04.00.0030 | Betonoberfläche waschen, Sichtbetonqualität     | m²
│   04.04.00.0040 | Betonoberfläche imprägnieren                    | m²
└── 04.05 Fertigteile
    04.05.00.0010 | Fertigteil-Stütze, C30/37, 30 x 30 cm,
                   | Lieferung und Montage                            | Stk
    04.05.00.0020 | Fertigteil-Balken, C30/37, 40 x 20 cm,
                   | Lieferung und Montage                            | lfm
```

### D.5 Bewehrungsberechnung — Praxisregeln

#### Mindestbewehrung (DIN EN 1992-1-1)

| Bauteil | Mindestbewehrung | Beispiel |
|---------|-----------------|---------|
| **Bodenplatte 20 cm** | Ø 10 / 15 cm (beidseitig) | ~10,5 kg/m² |
| **Wand 24 cm** | Ø 10 / 20 cm (beidseitig) | ~8,5 kg/m² |
| **Decke 20 cm** | Ø 10 / 15 cm (Unterseite) | ~5,2 kg/m² |
| **Stütze 30×30 cm** | 4 Ø 16 + Bügel Ø 8/20 cm | ~15 kg/ml |

#### Bewehrungsstahl-Richtwerte (Erfahrungswerte)

| Bauteil | Stahlgehalt [kg/m³ Beton] | Stahlgehalt [kg/m² Fläche] |
|---------|--------------------------|---------------------------|
| **Bodenplatte** | 80–120 kg/m³ | 12–25 kg/m² |
| **Wände** | 100–150 kg/m³ | 20–35 kg/m² |
| **Decken** | 100–140 kg/m³ | 18–28 kg/m² |
| **Stützen** | 150–250 kg/m³ | — |
| **Treppen** | 120–180 kg/m³ | 25–35 kg/m² |
| **Fundamente** | 60–100 kg/m³ | 8–15 kg/m² |

#### Schalung — Kalkulationshilfe

| Schalungsart | Wiederverwendungen | Kosten pro m² | Anwendung |
|-------------|-------------------|--------------|-----------|
| **Wandschalung (System)** | 50–100× | 8–15 €/m² | Standard-Wände |
| **Deckenschalung (System)** | 50–80× | 10–18 €/m² | Ortbetondecken |
| **Rundschalung** | 30–50× | 15–25 €/m² | Säulen, Rundwände |
| **Sichtbetonschalung** | 15–30× | 20–40 €/m² | Sichtbeton-Qualität |
| **Einwegschalung** | 1× | 3–6 €/m² | Fundamente, Keller |

#### Betonage — Praxisregeln

```
Regeln für den Beton-Einbau:
1. Einbauhöhe max. 50 cm pro Schicht (Verdichtung!)
2. Beton-Temperatur: 5–30°C bei Einbau
3. Verdichtung: Rütteln bis keine Luftblasen mehr
4. Nachbehandlung: Mind. 7 Tage feucht halten
5. Frostschutz: Bei < 5°C beheizbare Schalung oder Frostschutzzusatz
6. Sichtbeton: Schalungsöl verwenden, glatte Bretter
7. Arbeitsfugen: Schräg anrauen, Haftvermittler auftragen
```

### D.6 Beton-Kosten-Richtwerte (2025/2026)

| Position | Einheit | Richtpreis |
|----------|---------|-----------|
| **Transportbeton C20/25** | m³ | 90–130 € |
| **Transportbeton C25/30** | m³ | 100–140 € |
| **Transportbeton C30/37** | m³ | 110–160 € |
| **Transportbeton C30/37, Sichtbeton** | m³ | 130–200 € |
| **Bewehrungsstahl BSt 500 S (inkl. Einbau)** | kg | 1,80–3,00 € |
| **Mattenbewehrung Q 188A (inkl. Einbau)** | m² | 8–15 € |
| **Schalung (System, inkl. Herstellung)** | m² | 15–30 € |
| **Schalung (Sichtbeton, inkl. Herstellung)** | m² | 25–50 € |
| **Stahlbetonarbeiten komplett** | m³ | 300–600 € |

---

## E. DIN 276 — Kosten im Bauwesen (Vollständige Kostengliederung)

### E.1 Überblick

Die **DIN 276:2018-12** ist die zentrale Norm für die Gliederung und Berechnung von Kosten im Hoch- und Ingenieurbau. Sie gliedert Baukosten in **Kostenstellen** (KSt) und **Kostengruppen** (KG).

### E.2 Kostengruppen — Hochbau (KG 100–700)

| Kostengruppe | Bezeichnung | Anteil typisch | Beispielpositionen |
|-------------|-------------|---------------|-------------------|
| **KG 100** | **Grundstück** | 10–25% | Grundstückskauf, Vermessung, Erschließung, Grunderwerbsteuer, Notar |
| **KG 200** | **Vorbereitende Maßnahmen** | 1–3% | Bodengutachten, Abriss, Altlastensanierung, Baugenehmigung, Vermessung |
| **KG 300** | **Bauwerk — Baukonstruktion** | 30–50% | Erdarbeiten, Fundamente, Rohbau, Dach, Fassade, Fenster, Innenausbau |
| **KG 400** | **Bauwerk — Technische Anlagen** | 15–30% | Heizung, Sanitär, Elektro, Lüftung, Aufzug, Brandschutz, MSR |
| **KG 500** | **Außenanlagen und Freiflächen** | 3–8% | Pflaster, Wege, Bepflanzung, Zäune, Außenbeleuchtung, Spielgeräte |
| **KG 600** | **Ausstattung und Kunstwerke** | 1–5% | Einbaumöbel, Küchenausstattung, Kunst am Bau, Beschilderung |
| **KG 700** | **Baunebenkosten** | 10–18% | Architektenhonorar, Ingenieurhonorar, Bauleitung, Finanzierung, Rechtskosten |

### E.3 Kostengruppe 300 — Detailgliederung (Auszug)

| Kostengruppe | Bezeichnung | Typische LV-Gewerke |
|-------------|-------------|-------------------|
| **KG 310** | Baugrubenherstellung, Sicherungsarbeiten | Erdarbeiten (DIN 18300), Verbauprofile |
| **KG 320** | Gründung, Bodenplatten | Pfahlgründung, Bodenplatte, Fundamente |
| **KG 330** | Aussenwände | Mauerwerk, Betonwände, Fassade, WDVS |
| **KG 340** | Innenwände | Trockenbau, Mauerwerk, Brandschutzwände |
| **KG 350** | Decken | Stahlbetondecken, Holzbalkendecken |
| **KG 360** | Dächer | Dacheindeckung, Dämmung, Abdichtung |
| **KG 370** | Innentüren | Zimmertüren, Brandschutztüren |
| **KG 380** | Aussenfenster, -türen | Fenster, Haustüren, Rollläden |
| **KG 390** | Innenausbau (sonstige) | Estrich, Putz, Fliesen, Parkett, Malerarbeiten |

### E.4 Kostengruppe 400 — Detailgliederung (Auszug)

| Kostengruppe | Bezeichnung | Typische LV-Gewerke |
|-------------|-------------|-------------------|
| **KG 410** | Abwasser-, Wasser-, Gasanlagen | Sanitärinstallation (DIN 18322) |
| **KG 420** | Wärmeversorgungsanlagen | Heizungsinstallation (DIN 18325), Wärmepumpe |
| **KG 430** | Raumlufttechnische Anlagen | Lüftung, Klimaanlage (DIN 18326) |
| **KG 440** | Starkstromanlagen | Elektroinstallation (DIN 18330) |
| **KG 450** | Fernmelde- und informationstechnische Anlagen | EDV-Verkabelung, Telefonanlage |
| **KG 460** | Förderanlagen | Aufzüge, Fahrtreppen |
| **KG 470** | Nutz- und Prozesswärme | Solarthermie, Photovoltaik |
| **KG 480** | Gebäude- und Anlagenautomation | KNX, BMS, Smart Home |
| **KG 490** | Sonstige Maßnahmen der technischen Ausrüstung | Blitzschutz, Erdung |

### E.5 Kostenberechnung vs. Kostenschätzung vs. Kostenanschlag

| Methode | Phase | Genauigkeit | Grundlage |
|---------|-------|-------------|-----------|
| **Kostenschätzung** | LP 2–3 | ±30% | Kubikmeterpreis, Richtwerte, Erfahrungswerte |
| **Kostenberechnung** | LP 3–4 | ±15–20% | Detaillierte Mengenermittlung × Einheitspreise |
| **Kostenanschlag** | LP 5–6 | ±5–10% | Ausschreibungsergebnisse, Auftragspreise |
| **Kostenfeststellung** | LP 8–9 | Genau | Tatsächliche Kosten nach Ausführung |

### E.6 Kubikmeterpreis-Verfahren

```
Baukosten (KG 300+400+500+600) = Brutto-Rauminhalt × Kubikmeterpreis

Beispiel EFH:
  Brutto-Rauminhalt: 1.200 m³
  Kubikmeterpreis: 350–500 €/m³ (je nach Ausstattung)
  Baukosten: 420.000–600.000 €

Kubikmeterpreise 2025/2026 (Hochbau, Mittelstandard):
  Einfamilienhaus:     300–500 €/m³
  Mehrfamilienhaus:    250–400 €/m³
  Bürogebäude:         350–600 €/m³
  Industriehalle:      100–200 €/m³
```

### E.7 DIN 276-Kostenstellen und LV-Bezug

```
DIN 276 Kostenstelle          ←→  LV-Gewerk
─────────────────────────────────────────────
KG 310 Baugrubenherstellung   ←→  Gewerk 01 (Erdarbeiten)
KG 320 Gründung               ←→  Gewerk 04 (Beton/Stahlbeton)
KG 330 Aussenwände            ←→  Gewerk 05 (Maurer) + 09 (Fassade)
KG 340 Innenwände             ←→  Gewerk 18 (Trockenbau) + 05 (Maurer)
KG 350 Decken                 ←→  Gewerk 04 (Beton/Stahlbeton)
KG 360 Dächer                 ←→  Gewerk 12 (Zimmerer) + 13 (Dachdecker)
KG 390 Innenausbau            ←→  Gewerk 16 (Fliesen) + 17 (Estrich)
                                  + 19 (Stuckateur) + 20 (Maler)
KG 410 Abwasser/Wasser        ←→  Gewerk 37 (Sanitär)
KG 420 Wärmeversorgung        ←→  Gewerk 34 (Heizung)
KG 440 Starkstrom             ←→  Gewerk 40 (Elektro)
```

---

## F. Baustelleneinrichtung (BE) und Baustellengemeinkosten (BGK)

### F.1 Baustelleneinrichtung (BE) — LV-Positionen

```
Gewerk 00 — Baustelleneinrichtung
├── 00.01 Allgemeines
│   00.01.00.0010 | Baustraßen und Wege, befestigt, inkl. Entfernung
│                 | nach Fertigstellung                               | m²
│   00.01.00.0020 | Bauzaun, Metall, 2,0 m hoch, inkl. Fundament
│                 | und Entfernung                                    | lfm
│   00.01.00.0030 | Baustellenbeleuchtung, inkl. Verbrauch          | Pausch
│   00.01.00.0040 | Baustrom, Anschluss und Verbrauch               | Pausch
│   00.01.00.0050 | Bauwasser, Anschluss und Verbrauch              | Pausch
├── 00.02 Baucontainer
│   00.02.00.0010 | Baucontainer, Büro, 6,0 x 2,5 m, inkl.
│                 | Aufstellung und Entfernung                        | Stk
│   00.02.00.0020 | Baucontainer, Sozialraum, 6,0 x 2,5 m, inkl.
│                 | Aufstellung und Entfernung                        | Stk
│   00.02.00.0030 | Baucontainer, Lager, 6,0 x 2,5 m, inkl.
│                 | Aufstellung und Entfernung                        | Stk
│   00.02.00.0040 | Toilettencontainer, 2-Kabine, inkl. Service     | Stk
├── 00.03 Kräne und Geräte
│   00.03.00.0010 | Turmdrehkran, 50 m Ausleger, inkl. Auf- und
│                 | Abbau, 6 Monate                                   | Mon
│   00.03.00.0020 | Mobilkran, 50t, inkl. Fahrt und Aufstellung     | Stk
│   00.03.00.0030 | Bagger, 14t, inkl. Fahrt und Aufstellung        | Mon
│   00.03.00.0040 | Radlader, 2,5 m³, inkl. Fahrt und Aufstellung  | Mon
├── 00.04 Sicherheit
│   00.04.00.0010 | Absturzsicherung, Geländer, 1,10 m hoch,
│                 | inkl. Montage und Demontage                       | lfm
│   00.04.00.0020 | Absperrung, Bauzaun, 2,0 m hoch,
│                 | inkl. Beschilderung                               | lfm
│   00.04.00.0030 | Verkehrssicherung, Ampel, inkl. Aufstellung
│                 | und Betrieb                                       | Stk
│   00.04.00.0040 | Erste-Hilfe-Station, inkl. Ausstattung          | Stk
└── 00.05 Entsorgung
    00.05.00.0010 | Container für Bauschutt, 7 m³, inkl.
                   | Abfuhr und Entsorgung                             | Stk
    00.05.00.0020 | Container für Restmüll, 7 m³, inkl.
                   | Abfuhr und Entsorgung                             | Stk
    00.05.00.0030 | Container für Holz, 7 m³, inkl.
                   | Abfuhr und Entsorgung                             | Stk
```

### F.2 Baustellengemeinkosten (BGK) — Positionen

| Position | Beschreibung | Kalkulation |
|----------|-------------|-------------|
| **BGK 1** | Bauüberwachung / Bauleitung | Pauschale oder % |
| **BGK 2** | Vermessungsarbeiten | Pauschale oder Einzelpositionen |
| **BGK 3** | Versicherungen (Bauleistungsversicherung) | % vom AN-Netto |
| **BGK 4** | Werkzeuge und Kleingeräte | Pauschale oder % |
| **BGK 5** | Ordnungs- und Reinigungsdienst | Pauschale |
| **BGK 6** | Vorhaltung Maschinen | Pauschale oder Einzelpositionen |
| **BGK 7** | Unvorhergesehenes | % vom AN-Netto (5-10%) |

### F.3 BGK-Kalkulation

```
BGK-Satz = 8-15% des Nettoauftragswerts (typisch)
BGK-Satz bei komplexen Projekten = 10-15%
BGK-Satz bei einfachen Projekten = 5-8%
```

---

## G. Ausschreibung — Schritt-für-Schritt-Ablauf

### G.1 Ablauf einer öffentlichen Ausschreibung

```
Phase 1: Vorbereitung (LP 6)
├── Leistungsbeschreibung erstellen
├── Mengenermittlung (LV aufstellen)
├── Vergabebestimmungen festlegen
├── Technische Unterlagen zusammenstellen
└── Einreichungsfrist festlegen (mind. 35 Tage)

Phase 2: Bekanntmachung
├── EU-Amtsblatt (TED) bei Oberschwellen
├── Nationales Bekanntmachungsblatt
└── Internet-Plattformen

Phase 3: Angebotsphase
├── Bieter erhalten LV (Blankett)
├── Bieter kalkulieren Einheitspreise
├── Bieter reichen Angebot fristgerecht ein
└── Angebote werden geöffnet (Submission)

Phase 4: Angebotswertung
├── Formale Prüfung (Vollständigkeit, Fristeinhaltung)
├── Plausibilitätsprüfung (Zuschlagsfähigkeit)
├── Preisspiegel erstellen
├── Wirtschaftlichstes Angebot ermitteln
└── Zuschlagsvorschlag

Phase 5: Zuschlag & Vertrag
├── Zuschlagserteilung
├── Auftragserteilung
├── Vertragsunterzeichnung
└── Baubeginn

Phase 6: Ausführung & Abrechnung
├── Bauleitung & Bauüberwachung
├── Nachtragsmanagement
├── Teilabnahmen
├── Schlussabnahme
├── Schlussrechnung
└── Gewährleistungsfrist
```

### G.2 Fristen

| Verfahren | Mindestfrist |
|-----------|-------------|
| **Öffentliche Ausschreibung** | 35 Tage |
| **Beschränkte Ausschreibung** | 30 Tage |
| **Freihändige Vergabe** | Keine Frist |
| **EU-weite Ausschreibung** | 52 Tage |

---

## H. Angebotsbewertung & Preisspiegel

### H.1 Wirtschaftlichstes Angebot

**§ 127 GWB / § 58 VgV:**
- Zuschlag auf das **wirtschaftlichste Angebot**
- Nicht zwingend das billigste!
- Bewertungskriterien:
  - Preis (Gewichtung: 60-80%)
  - Qualität (Gewichtung: 10-20%)
  - Ausführungsfristen (Gewichtung: 5-10%)
  - Nachhaltigkeit (Gewichtung: 0-5%)

### H.2 Preisspiegel-Methode

```
1. Alle Angebote nach Positionen vergleichen
2. Auffällige Preise identifizieren (zu hoch/zu niedrig)
3. Durchschnittspreise berechnen
4. Preisauffälligkeiten bewerten
5. Wirtschaftlichstes Angebot ermitteln
```

### H.3 Preisbewertungsformel

```
Punktzahl = (günstigstes Angebot / eigenes Angebot) × 100
```

### H.4 Nutzwertanalyse

```
Gesamtpunktzahl = Σ (Kriterium × Gewichtung)
Beispiel:
- Preis: 70% Gewichtung
- Qualität: 20% Gewichtung
- Fristen: 10% Gewichtung
```

---

## I. Kalkulation — Praxisbeispiele

### I.1 Einheitspreis-Kalkulation (Beispiel)

**Position:** Erdarbeiten, Bodengruppe 3, Aushub Baugrube

```
Materialkosten:           0,00 €/m³ (Erdarbeiten = kein Material)
Personalkosten:           8,50 €/m³ (2 Mann × 25 €/h ÷ 6 m³/h)
Gerätekosten:             4,00 €/m³ (Bagger 14t: 120 €/h ÷ 30 m³/h)
Baustellengemeinkosten:   1,25 €/m³ (10% Zuschlag)
Allg. Geschäftskosten:    1,25 €/m³ (10% Zuschlag)
Wagnis und Gewinn:        1,50 €/m³ (12% Zuschlag)
─────────────────────────────────
Einheitspreis:           16,50 €/m³
```

### I.2 Mischkalkulation (Beispiel)

```
Position 01.01: Aushub BG 3 → EP unter Selbstkosten (Lockvogel)
Position 01.02: Aushub BG 5 → EP über Selbstkosten (Gewinnbringer)
Position 01.03: Planum herstellen → EP über Selbstkosten
─────────────────────────────────
Gesamtgewinn gesichert durch Mischkalkulation
```

### I.3 Zuschlagskalkulation

```
Nettoauftragswert:        500.000,00 €
+ Baustellengemeinkosten:  50.000,00 € (10%)
+ Allg. Geschäftskosten:   50.000,00 € (10%)
+ Wagnis und Gewinn:       60.000,00 € (12%)
─────────────────────────────────
Angebotsnetto:            660.000,00 €
+ Umsatzsteuer (19%):    125.400,00 €
─────────────────────────────────
Angebotsbrutto:           785.400,00 €
```

---

## J. Nachtragsmanagement — Praxisfälle

### J.1 Nachtragsfall 1: Mehrminderleistung (§ 2 Abs. 3 VOB/B)

**Sachverhalt:**
- LV-Position: Aushub BG 3, 1.000 m³
- Tatsächlich ausgeführt: 1.200 m³ (20% mehr)

**Berechnung:**
```
Mehrmenge: 200 m³ (20%)
Regelung: § 2 Abs. 3 VOB/B → Mengenänderung > 10%
→ Preisanpassung für die gesamte Mehrmenge
→ Neuer EP für 200 m³ nach Preisermittlungsgrundsätzen
```

### J.2 Nachtragsfall 2: Geänderte Leistung (§ 1 Abs. 3 VOB/B)

**Sachverhalt:**
- LV: Wandstärke 24 cm
- AG ordnet 36,5 cm an

**Berechnung:**
```
Differenz: 12,5 cm
Mehrkosten pro m²: Material + Lohn + Geräte
Nachtrag = Differenz × Mengen × neuer EP
```

### J.3 Nachtragsfall 3: Behinderung (§ 6 Abs. 4-6 VOB/B)

**Sachverhalt:**
- AN behindert durch fehlende Vorleistung
- Behinderungsanzeige fristgerecht gestellt

**Ansprüche:**
```
1. Fristverlängerung (§ 6 Abs. 4)
2. Schadensersatz (§ 6 Abs. 6)
   - Baukostenzuschlag
   - Lohnkosten (Stillstand)
   - Gerätekosten (Vorhaltung)
   - Allgemeine Geschäftskosten
```

### J.4 Nachtragsfall 4: Zusätzliche Leistung (§ 1 Abs. 4 VOB/B)

**Sachverhalt:**
- AG ordnet zusätzliche Abdichtung an
- Nicht im ursprünglichen LV enthalten

**Berechnung:**
```
Preisermittlung nach § 2 Abs. 5 VOB/B
→ Kalkulation nach Selbstkosten + Zuschläge
→ Vereinbarung vor Ausführung
```

---

## K. Aufmaß & Abrechnung — Praxisbeispiele

### K.1 Aufmaßmethoden

| Methode | Beschreibung | Anwendung |
|---------|-------------|-----------|
| **Einzelstück-Aufmaß** | Zählen einzelner Elemente | Türen, Fenster, Sanitärobjekte |
| **Vermaßung** | Messen von Längen, Flächen, Volumina | Erdarbeiten, Mauerwerk, Putz |
| **Pauschaliertes Aufmaß** | Pauschale für Erfahrungswerte | Kleine Leistungen, Nebenleistungen |
| **Grob-Aufmaß** | Grobe Schätzung bei Einvernehmen | Unregelmäßige Leistungen |

### K.2 Aufmaß-Beispiel: Erdarbeiten

```
Position 01.01.01.0010: Aushub BG 3, Baugrube
Aufmaß:
  Länge: 20,00 m
  Breite: 15,00 m
  Tiefe: 2,50 m
  Volumen: 20,00 × 15,00 × 2,50 = 750,00 m³
Abrechnung:
  Soll-Menge: 700,00 m³
  Ist-Menge:  750,00 m³
  EP: 16,50 €/m³
  GP: 750,00 × 16,50 = 12.375,00 €
```

### K.3 Aufmaß-Beispiel: Mauerwerk

```
Position 05.01.00.0010: Außenwand, Mauerziegel, 36,5 cm
Aufmaß:
  Länge: 40,00 m
  Höhe: 3,00 m
  Fläche: 40,00 × 3,00 = 120,00 m²
  Abzüge (Fenster/Türen): 15,00 m²
  Netto-Fläche: 105,00 m²
Abrechnung:
  Soll-Menge: 100,00 m²
  Ist-Menge:  105,00 m²
  EP: 85,00 €/m²
  GP: 105,00 × 85,00 = 8.925,00 €
```

### K.4 Aufmaß-Beispiel: Fenster

```
Position 08.01.00.0010: Fenster, Holz, 2-flügelig
Aufmaß:
  Stückzahl: 24 Stk.
  (Einzelstück-Aufmaß)
Abrechnung:
  Soll-Menge: 24 Stk.
  Ist-Menge:  24 Stk.
  EP: 650,00 €/Stk.
  GP: 24 × 650,00 = 15.600,00 €
```

---

## L. GAEB DA XML — Technische Implementierung

### L.1 XML-Struktur (Vereinfacht)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<gaeb:GAEB xmlns:gaeb="http://www.gaeb.de/DAXML/3.3">
  <gaeb:PrjInfo>
    <gaeb:PrjName>Neubau Einfamilienhaus</gaeb:PrjName>
    <gaeb:PrjNo>2026-001</gaeb:PrjNo>
  </gaeb:PrjInfo>

  <gaeb:Award>
    <gaeb:AwardPhase>X83</gaeb:AwardPhase>

    <gaeb:Lots>
      <gaeb:Lot>
        <gaeb:LotNo>01</gaeb:LotNo>
        <gaeb:BoQ>
          <gaeb:BoQHead>
            <gaeb:BoQInfo>
              <gaeb:Bezeichnung>Erdarbeiten</gaeb:Bezeichnung>
            </gaeb:BoQInfo>
          </gaeb:BoQHead>

          <gaeb:BoQBody>
            <gaeb:Itemlist>
              <gaeb:Item>
                <gaeb:ID>01.01.01.0010</gaeb:ID>
                <gaeb:DescriptionText>
                  Erdarbeiten ohne besondere Anforderungen,
                  Baugruben, Bodengruppe 3, Menge ca. 750 m³
                </gaeb:DescriptionText>
                <gaeb:Qty>750</gaeb:Qty>
                <gaeb:QU>m3</gaeb:QU>
              </gaeb:Item>

              <gaeb:Item>
                <gaeb:ID>01.01.01.0020</gaeb:ID>
                <gaeb:DescriptionText>
                  Erdarbeiten ohne besondere Anforderungen,
                  Baugruben, Bodengruppe 5, Menge ca. 500 m³
                </gaeb:DescriptionText>
                <gaeb:Qty>500</gaeb:Qty>
                <gaeb:QU>m3</gaeb:QU>
              </gaeb:Item>
            </gaeb:Itemlist>
          </gaeb:BoQBody>
        </gaeb:BoQ>
      </gaeb:Lot>
    </gaeb:Lots>
  </gaeb:Award>
</gaeb:GAEB>
```

### L.2 Austauschphasen im XML

| Phase | GAEB-Code | XML-Tag | Beschreibung |
|-------|-----------|---------|-------------|
| **Ausschreibung** | X83 | `<gaeb:AwardPhase>X83</gaeb:AwardPhase>` | LV ohne Preise |
| **Angebot** | X84 | `<gaeb:AwardPhase>X84</gaeb:AwardPhase>` | Bieter ergänzt Preise |
| **Auftrag** | X86 | `<gaeb:AwardPhase>X86</gaeb:AwardPhase>` | Vertragsabschluss |
| **Abrechnung** | X81 | `<gaeb:AwardPhase>X81</gaeb:AwardPhase>` | Mengenermittlung |

### L.3 XSD-Schema-Referenz

```
Schema-Datei: DA1100_33.xsd
Namensraum: http://www.gaeb.de/DAXML/3.3
Kodierung: UTF-8
```

---

## M. Sanitär, Heizung, Elektro — Detailpositionen (Ergänzungen)

> **Hinweis:** Die vollständigen Positionstexte zu Gewerk 34 (Heizung), Gewerk 37 (Sanitär) und Gewerk 40 (Elektro) stehen in Abschnitt B.7–B.9. Dieser Abschnitt ergänzt um Detailwissen, das für die LV-Erstellung relevant ist.

### M.1 Sanitärinstallation — Technische Details

#### Rohrmaterialien

| Material | DN/Ø | Anwendung | Vorteil | Nachteil |
|----------|-------|-----------|---------|----------|
| **Mehrschichtverbund (MLV)** | 16–32 mm | Kalt-/Warmwasser | Leicht, korrosionsfest, biegsam | Nicht für hohe Temperaturen |
| **Kupfer** | 15–54 mm | Warmwasser, Heizung | Temperaturbeständig, langlebig | Teuer, Verzinnung nötig |
| **Edelstahl** | 15–108 mm | Trinkwasser, Industrie | Hygienisch, korrosionsfest | Sehr teuer |
| **PE-Xa** | 16–32 mm | Fußbodenheizung | Flexibel, formstabil | UV-empfindlich |
| **PP-R** | 20–110 mm | Abwasser, Chemie | Säure-/Laugenbeständig | Starre Rohre |
| **KG-Rohr (PVC-U)** | DN 100–DN 300 | Abwasser (erdverlegt) | Günstig, leicht | Nicht hitzebeständig |
| **HT-Rohr (PP)** | DN 50–DN 150 | Abwasser (innen) | Hitzebeständig bis 95°C | Teurer als KG |

#### Trinkwasserinstallation — Regelungen

| Regelung | Inhalt |
|----------|--------|
| **TrinkwV 2023** | Trinkwasserverordnung — Grenzwerte für Legionellen, Blei, Kupfer |
| **DIN 1988** | Technische Regeln für Trinkwasserinstallationen |
| **DIN EN 806** | Technische Regeln für Trinkwasserinstallationen (europäisch) |
| **VDI 6023** | Hygiene in Trinkwasserinstallationen — Planung, Betrieb, Instandhaltung |
| **Abstandsregelung** | Warmwasser mind. 55°C, Zirkulation Pflicht bei >3l Leitungsinhalt |

#### Typische Sanitär-LV-Vorbemerkung

```
Vorbemerkung Sanitärinstallation:
- Alle Rohrleitungen gemäß DIN 1988 / DIN EN 806
- Trinkwasserinstallation gemäß TrinkwV 2023
- Schallschutz: Rohrdurchführungen schallentkoppelt
- Wärmedämmung Warmwasser gemäß EnEV/GEG
- Druckprobe: 1,5-facher Betriebsdruck, mind. 2 bar
- Rohrleitungen farblich gekennzeichnet (VDI 6023)
```

### M.2 Heizungsinstallation — Technische Details

#### Wärmeerzeuger-Vergleich

| Technologie | COP/JAZ | Vorlauftemp. | Förderung (BEG 2025) | Platzbedarf |
|-------------|---------|-------------|----------------------|-------------|
| **Gas-Brennwert** | 0,98 (η) | 50–70°C | Keine | Gering |
| **Luft-Wasser-WP** | 3,0–4,5 | 35–55°C | Bis zu 70% | Mittel (Außengerät) |
| **Sole-Wasser-WP** | 4,0–5,5 | 30–50°C | Bis zu 70% | Hoch (Erdsonden) |
| **Wasser-Wasser-WP** | 5,0–6,0 | 30–45°C | Bis zu 70% | Sehr hoch (Brunnen) |
| **Pellet-Heizung** | 0,90 (η) | 50–70°C | Bis zu 70% | Hoch (Lager) |
| **Hybrid (Gas+Solar)** | Variabel | 35–70°C | Bis zu 40% | Mittel |

#### Heizkörper-Sizing

```
Heizlast (W) = Raumfläche (m²) × spezifische Heizlast (W/m²)

Spezifische Heizlast (gut gedämmt, Niedrigenergiehaus):
  Wohnzimmer:    40–60 W/m²
  Schlafzimmer:  30–50 W/m²
  Bad:           80–120 W/m²
  Küche:         50–80 W/m²
  Flur:          30–50 W/m²

Beispiel Wohnzimmer 25 m²:
  25 m² × 50 W/m² = 1.250 W → HK Typ 22, 1000×600 mm (~1.400 W)
```

#### Typische Heizungs-LV-Vorbemerkung

```
Vorbemerkung Heizungsinstallation:
- Alle Rohrleitungen gemäß DIN EN 12828
- Wärmepumpe: COP ≥ 3,5 (Luft-Wasser) / ≥ 4,5 (Sole-Wasser)
- Schallschutz WP: Schallleistungspegel ≤ 65 dB(A) in 1m
- Heizkörper: Paneel-Typ, RAL-Gütesiegel
- Fußbodenheizung: max. 55°C Vorlauf, max. 25 W/m²
- Druckprobe: 1,5-facher Betriebsdruck, mind. 6 bar
- Hydraulischer Abgleich gemäß VDI 2073
```

### M.3 Elektroinstallation — Technische Details

#### Kabelquerschnitte und Absicherung

| Querschnitt | Absicherung | Anwendung |
|-------------|------------|-----------|
| **1,5 mm²** | B10A / B13A | Leuchtenkreise |
| **2,5 mm²** | B16A | Steckdosenkreise (Standard) |
| **4 mm²** | B20A | Herd, Backofen, Wärmepumpe |
| **6 mm²** | B25A / B32A | Wallbox, Wärmepumpe (groß) |
| **10 mm²** | B35A / B50A | Hausanschluss, Zuleitung UV |
| **16 mm²** | B63A | Hauptleitung |

#### Typische Elektro-LV-Positionen (Ergänzung)

```
Gewerk 41 — Fernmeldeanlagen / EDV
├── 41.01 Netzwerk
│   41.01.00.0010 | Cat-7A-Kabel, S/FTP, Unterputz verlegen,
│                 | inkl. Rohr und Dose                               | lfm
│   41.01.00.0020 | Netzwerkdose, Cat. 6A, Keystone, UP, inkl. Dose  | Stk
│   41.01.00.0030 | Patchfeld, 24-port, Cat. 6A, 19 Zoll, beschriftet| Stk
│   41.01.00.0040 | Netzwerkschrank, 19 Zoll, 42 HE, inkl. Lüftung   | Stk
├── 41.02 Glasfaser
│   41.02.00.0010 | LWL-Kabel, OM4, Multimode, Unterputz verlegen   | lfm
│   41.02.00.0020 | LWL-Dose, SC/APC, Duplex, inkl. Dose             | Stk
│   41.02.00.0030 | LWL-Patchfeld, 24-port, SC/APC, 19 Zoll         | Stk
└── 41.03 Smart Home
    41.03.00.0010 | KNX-TP-Kabel, 2x2x0,8 mm, UP verlegen          | lfm
    41.03.00.0020 | KNX-Taster, 2-fach, inkl. UP-Dose               | Stk
    41.03.00.0030 | KNX-Aktor, 4-fach, 16A, inkl. Montage            | Stk
    41.03.00.0040 | KNX-IP-Interface, inkl. Einrichtung              | Stk
    41.03.00.0050 | KNX-Visualisierung, Softwarelizenz + Einrichtung | Stk

Gewerk 42 — Blitzschutzanlagen
├── 42.01 Äußerer Blitzschutz
│   42.01.00.0010 | Fangstange, Edelstahl, 1,0 m, inkl. Montage     | Stk
│   42.01.00.0020 | Ableitung, rund, Ø 8 mm, Edelstahl, inkl. Halter| lfm
│   42.01.00.0030 | Erdungserder, Tiefenerder, 3 m, inkl. Erdungsklemme| Stk
├── 42.02 Innerer Blitzschutz
│   42.02.00.0010 | Überspannungsschutz Typ 1, inkl. Montage         | Stk
│   42.02.00.0020 | Überspannungsschutz Typ 2, inkl. Montage         | Stk
│   42.02.00.0030 | Erdungsschiene, 12-fach, inkl. Montage           | Stk
```

#### Typische Elektro-LV-Vorbemerkung

```
Vorbemerkung Elektroinstallation:
- Alle Installationen gemäß DIN VDE 0100
- Schutzmaßnahmen: TN-C-S-System, FI-Schutzschalter 30 mA
- Unterverteiler: 36 TE minimum, mit FI-Schutz und LS-Schaltern
- Kabel: NYM-J, außer bei besonderen Anforderungen (Glasfaser, Cat7A)
- Beschriftung: Alle Stromkreise eindeutig beschriftet
- Prüfung: Elektrofachkraft prüft gemäß DIN VDE 0100-600
- Brandschutz: Durchbrüche brandschutzgerecht verschließen
- KNX/Smart Home: Nur auf ausdrückliche Anforderung
```

### M.4 SHK-Kalkulation — Richtwerte

| Gewerk | Position | Richtpreis (2025/2026) |
|--------|----------|----------------------|
| **Sanitär** | WC komplett (UP-Spülkasten + Keramik + Anschluss) | 400–800 €/Stk |
| **Sanitär** | Waschtisch komplett | 300–600 €/Stk |
| **Sanitär** | Duschtasse + Kabine komplett | 600–1.500 €/Stk |
| **Heizung** | Heizkörper Typ 22, 1000×600, inkl. Anschluss | 250–450 €/Stk |
| **Heizung** | Fußbodenheizung komplett | 40–80 €/m² |
| **Heizung** | Wärmepumpe Luft-Wasser 10 kW komplett | 18.000–30.000 €/Stk |
| **Heizung** | Gas-Brennwerttherme 24 kW komplett | 3.500–6.000 €/Stk |
| **Elektro** | Steckdose UP, 2-fach, inkl. Dose | 40–80 €/Stk |
| **Elektro** | Lichtschalter UP, 1-fach | 30–60 €/Stk |
| **Elektro** | Unterverteiler 36 TE komplett | 800–1.500 €/Stk |
| **Elektro** | Cat-7-Dose inkl. Kabel (gesamt) | 80–150 €/Stk |

---

## N. Dachdeckerarbeiten — Detailwissen

### N.1 Dacharten

| Dachart | Neigung | Eindeckung | Abdichtung |
|---------|---------|-----------|------------|
| **Flachdach** | <5° | Bitumen, EPDM, PVC | Abdichtungsbahn |
| **Flachdach geneigt** | 5-22° | Dachpfanne, Trapez | Unterspannbahn |
| **Steildach** | >22° | Dachziegel, Schiefer | Unterspannbahn |
| **Gründach** | 5-45° | Abdichtung + Substrat | Wurzelschutzbahn |

### N.2 Dämmstoffe

| Material | λ-Wert [W/(mK)] | Anwendung |
|----------|-----------------|-----------|
| **Mineralwolle** | 0,035-0,045 | Zwischensparren, Kerndämmung |
| **EPS** | 0,030-0,040 | Außendämmung, WDVS |
| **PU/PIR** | 0,020-0,030 | Aufsparrendämmung |
| **Holzfaser** | 0,040-0,055 | Aufsparrendämmung |
| **Zellulose** | 0,035-0,045 | Einblasdämmung |

---

## O. Tischlerarbeiten — Detailwissen

### O.1 Fensterarten

| Material | U-Wert [W/(m²K)] | Lebensdauer | Preis |
|----------|-------------------|-------------|-------|
| **Holz** | 1,0-1,3 | 40-60 Jahre | Mittel |
| **Kunststoff** | 1,0-1,4 | 30-50 Jahre | Günstig |
| **Holz-Aluminium** | 0,8-1,2 | 50-80 Jahre | Hoch |
| **Aluminium** | 1,0-1,5 | 60-80 Jahre | Hoch |

### O.2 Türarten

| Material | Anwendung | Preis |
|----------|-----------|-------|
| **Vollholz** | Innen | Mittel |
| **Holzrahmen** | Innen | Günstig |
| **Stahl** | Brandschutz | Mittel |
| **Aluminium** | Außen | Hoch |
| **Glas** | Innen | Hoch |

---

## P. Funktionale Ausschreibung — Praxis

### P.1 Was ist funktionale Ausschreibung?

- Bieter entwickelt **eigene Lösungen**
- AG beschreibt nur das **gewünschte Ergebnis**
- Höhere **Ergebnisoffenheit**
- Nach **VOB/A § 7 Abs. 3** zulässig

### P.2 Vorteile & Risiken

| Aspekt | Vorteil | Risiko |
|--------|---------|--------|
| **Innovation** | Bieter bringt eigene Lösungen ein | Kein Vergleich möglich |
| **Preissicherheit** | Niedrig | Hoch (Preisabweichungen) |
| **Vergleichbarkeit** | Niedrig | Niedrig |
| **Planungsaufwand** | Niedrig für AG | Hoch für Bieter |

### P.3 Anwendungsfälle

- **IT-Systeme** im Bau (Gebäudeautomation)
- **Energiekonzepte** (Heizung, Lüftung)
- **Fassadensysteme** (Fassade + Dämmung + Gestaltung)
- **Sanierung** (Bestand + Umbau)

---

## Q. Vertragsarten im Bauwesen

### Q.1 Einheitspreisvertrag (EP-Vertrag)

```
Vergütung = Ist-Menge × vereinbarter Einheitspreis
Vorteil: Flexible Mengen
Risiko: Mengenabweichungen
```

### Q.2 Pauschalvertrag

```
Vergütung = Fester Pauschalpreis
Vorteil: Preisssicherheit für AG
Risiko: Nachträge bei Änderungen
```

### Q.3 Festpreisvertrag

```
Vergütung = Fester Preis für definierten Leistungsumfang
Vorteil: Maximale Preissicherheit
Risiko: Keine Anpassung bei Mehr-/Minderleistungen
```

### Q.4 Regievertrag

```
Vergütung = tatsächlich erbrachte Leistungen nach Stunden/Material
Vorteil: Flexible Leistungserbringung
Risiko: Keine Preissicherheit
```

---

## R. Rechtsprechung & BGH-Urteile

### R.1 Wichtige BGH-Urteile zum Bauvertragsrecht

| Urteil | Datum | Kernsatz |
|--------|-------|---------|
| **VII ZR 45/06** | 2008 | Nachtragsanspruch bei geänderter Leistung |
| **VII ZR 139/07** | 2009 | Behinderungsanzeige muss konkret sein |
| **VII ZR 177/11** | 2013 | Pauschalvertrag und Nachträge |
| **VII ZR 165/13** | 2015 | Abrechnung nach § 14 VOB/B |
| **VII ZR 197/16** | 2018 | BGB-Bauvertrag und Widerrufsrecht |
| **VII ZR 84/20** | 2022 | Kündigung und Restwerklohn |

### R.2 Vergaberechtliche Urteile

| Urteil | Datum | Kernsatz |
|--------|-------|---------|
| **Enwg/RWE** | 2013 | Schwellenwerte und EU-Vergaberecht |
| **OLG Düsseldorf** | 2016 | Nachprüfungsverfahren bei freihändiger Vergabe |
| **OLG München** | 2018 | Zuschlagskriterien und Gewichtung |

---

*Dieses Dokument ist eine lückenlose Ergänzung zur EXPERT_KNOWLEDGE_BASE.md. Es deckt alle Praxisdimensionen ab: Positionstexte, Kalkulation, Nachträge, Abrechnung, Rechtsprechung, GAEB-XML, alle Gewerke, Vertragsarten.*
