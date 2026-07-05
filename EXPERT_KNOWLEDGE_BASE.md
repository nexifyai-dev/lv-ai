# Leistungsverzeichnis Bauwesen — Expert Knowledge Base
> **Erstellt:** 2026-07-04 | **Status:** Umfassendes Profi-Wissen
> **Zweck:** Vollständige Wissensbasis rund um Leistungsverzeichnisse in der Bauunternehmung

---

## INHALTSVERZEICHNIS

1. [Definition & Grundlagen](#1-definition--grundlagen)
2. [Aufbau & Struktur eines LV](#2-aufbau--struktur-eines-lv)
3. [Positionsarten](#3-positionsarten)
4. [Rechtliche Grundlagen — VOB](#4-rechtliche-grundlagen--vob)
5. [DIN 18299 ff. — ATV (VOB/C)](#5-din-18299-ff--at-vobc)
6. [Vergabeverfahren nach VOB/A](#6-vergabeverfahren-nach-voba)
7. [GAEB — Elektronischer Datenaustausch](#7-gaeb--elektronischer-datenaustausch)
8. [Standard-Leistungstexte (STLB-Bau)](#8-standard-leistungstexte-stlb-bau)
9. [Kalkulation & Einheitspreise](#9-kalkulation--einheitspreise)
10. [Nachtragsmanagement](#10-nachtragsmanagement)
11. [Abrechnung & Schlussrechnung](#11-abrechnung--schlussrechnung)
12. [HOAI & Leistungsphasen](#12-hoai--leistungsphasen)
13. [BIM 5D & Digitale LV-Erstellung](#13-bim-5d--digitale-lv-erstellung)
14. [Software-Landschaft (AVA)](#14-software-landschaft-ava)
15. [Internationale Standards](#15-internationale-standards)
16. [Praxis-Tipps & Häufige Fehler](#16-praxis-tipps--häufige-fehler)
17. [Glossar](#17-glossar)
18. [Quellen & Referenzen](#18-quellen--referenzen)

---

## 1. Definition & Grundlagen

### Was ist ein Leistungsverzeichnis?

Ein **Leistungsverzeichnis (LV)** ist ein tabellarisches Dokument, das eine Gesamtleistung in einzelne **Teilleistungen (Positionen)** gliedert. Es ist das zentrale Kommunikationsmittel im Bauwesen zwischen Auftraggeber, Planer und Bauunternehmen.

### Zweck & Nutzen

| Funktion | Beschreibung |
|----------|-------------|
| **Ausschreibung** | Vergleichbare Angebote von Bietern einholen |
| **Vergabe** | Wirtschaftlichsten Bieter ermitteln |
| **Kalkulation** | Bieter kalkuliert Einheitspreise pro Position |
| **Abrechnung** | Tatsächliche Mengen × Einheitspreise abrechnen |
| **Nachtragsmanagement** | Änderungen und Mehr-/Minderleistungen dokumentieren |
| **Preisspiegel** | Angebote vergleichbar machen |

### Abgrenzung verwandter Begriffe

| Begriff | Detailgrad | Preisoffenheit | Zweck |
|---------|-----------|---------------|-------|
| **Leistungsverzeichnis (LV)** | Sehr hoch | Preise durch Bieter | Vergabe + Abrechnung |
| **Leistungsbeschreibung** | Mittel–Hoch | Variabel | Inhaltliche Definition der Leistung |
| **Baubeschreibung** | Mittel | Meist fest | Projektübersicht (v.a. Bauträger) |
| **Funktionale Ausschreibung** | Niedrig | Hoch | Ergebnisoffen, Bieter entwickelt Lösung |

### Mutter- und Muster-Leistungsverzeichnisse

- **Mutter-LV** — Enthält detaillierte Positionen, Mengen ganz oder teilweise offen
- Grundlage: Vorhandene LVs aus früheren Ausschreibungen + Kalkulationsansätze
- Besonders nützlich bei **funktionaler Ausschreibung**

---

## 2. Aufbau & Struktur eines LV

### 2.1 Tabellarische Grundstruktur

| Spalte | Beschreibung | Beispiel |
|--------|-------------|---------|
| **Positionsnummer (OZ)** | Eindeutige Ordnungszahl | 01.0020 |
| **Langtext** | Detaillierte Leistungsbeschreibung | "Boden für Streifenfundamente ausheben..." |
| **Kurztext** | Verkürzte Bezeichnung (Rechnungen) | "Boden aush. Streifenfund." |
| **Mengeneinheit (ME)** | Maßeinheit | m³, m², m, kg, Stk., lfm |
| **Menge (Soll)** | Geplante Menge | 100.000 |
| **Einheitspreis (EP)** | Preis pro ME (durch Bieter) | 12,50 €/m³ |
| **Gesamtpreis (GP)** | Menge × EP | 1.250.000,00 € |

### 2.2 Hierarchische Gliederung (nach GAEB)

```
Gewerk (Leistungsart / Los)
└── Leistungstitel (Leistungsort / Abschnitt)
    └── Untertitel (Unterabschnitt)
        └── Positionen (Teilleistungen mit OZ)
```

**Beispiel:**
```
Gewerk 01 — Erdarbeiten
├── Titel 01.01 — Baugruben
│   ├── Untertitel 01.01.01 — Aushub
│   │   ├── Pos 01.01.01.0010 — Boden aush. 0-2m (m³)
│   │   ├── Pos 01.01.01.0020 — Boden aush. 2-4m (m³)
│   │   └── Pos 01.01.01.0030 — Boden aush. >4m (m³)
│   └── Untertitel 01.01.02 — Verbauprofile
│       └── Pos 01.01.02.0010 — Verbauprofile einb. (m²)
└── Titel 01.02 — Planum
    └── Pos 01.02.00.0010 — Planum herstellen (m²)
```

### 2.3 Ordnungszahlen (OZ)

- Jede Position wird durch eine **eindeutige OZ** identifiziert
- Aufsteigende Vergabe
- Unter einer OZ werden nur **inhaltlich gleichartige Leistungen** zusammengefasst
- Sammelpositionen für ungleartige Leistungen nur zulässig, wenn eine Teilleistung für die Durchschnittspreisbildung ohne nennenswerten Einfluss ist
- OZ-Struktur: **Gewerk.Titel.Untertitel.Position** (z.B. 01.02.01.0010)

### 2.4 Geteilte Form des LV

Bei Verwendung von Standardleistungstexten (STLB/STLK):

- **Langtext-Verzeichnis** — Vollständige Texte mit OZ, ohne Preisspalten
- **Kurztext-/Preis-Verzeichnis** — Gekürzte Texte mit EP- und GB-Spalten

### 2.5 Besondere Inhalte

- **Vorbemerkungen** — Technische Regelungen, die einheitlich für alle Positionen gelten
- **Zusammenfassende Vertragsbestimmungen (ZVB)** — Vertragliche Rahmenbedingungen
- **Zusammenstellung der Beträge (ZB)** — Wertmäßige Aufaddierung nach Gewerken
- **Baustelleneinrichtung (BE)** — Als Normalposition oder über BGK
- **Nebenangebote / Bedarfspositionen**

---

## 3. Positionsarten

| Positionsart | Beschreibung | Preisregel |
|-------------|-------------|-----------|
| **Leistungsposition (Normalposition)** | Tatsächlich auszuführende Leistung | EP + GP |
| **Grundposition** | Bezugsposition für Alternativ-/Zulagepositionen | EP + GP |
| **Alternativposition (Wahlposition)** | Alternative zur Grundposition — AG entscheidet | Nur EP (GP nur bei Zuschlag) |
| **Zulageposition** | Ergänzt die Grundposition | EP + GP |
| **Bedarfsposition (Eventualposition)** | Erfahrungsgemäß nötig, aber noch unklar | Nur EP (max. 10% Auftragssumme) |
| **Leitposition** | Übergeordnet, wird in Folgepositionen detailliert | EP + GP |

### Regeln zu Bedarfspositionen

- Erfahrungsgemäß nötig, aber zum Ausschreibungszeitpunkt unklar
- Öffentliche Vergabeordnungen schließen diese aus
- Falls unvermeidbar: Gesamtwert unter **10% der Auftragssumme**
- Nur Einheitspreis, kein Gesamtpreis im Angebot

---

## 4. Rechtliche Grundlagen — VOB

### 4.1 VOB-Übersicht

| VOB-Teil | Inhalt | Relevanz für LV |
|----------|--------|----------------|
| **VOB/A** | Vergabevorschriften | § 7: Leistung eindeutig beschreiben |
| **VOB/B** | Allgemeine Vertragsbedingungen | Vergütung, Abrechnung, Nachträge, Mängel |
| **VOB/C (ATV)** | Technische Vertragsbedingungen | DIN 18299 ff.: Regeln für LV-Aufstellung |

**Wichtig:** Bei Vereinbarung von VOB/B wird **VOB/C automatisch Vertragsbestandteil** (§ 1 Abs. 1 Satz 2 VOB/B). VOB/C geht bei Widersprüchen vor (§ 1 Abs. 2 Nr. 5 VOB/B).

### 4.2 VOB/A — Vergabevorschriften

#### Kerntatbestand § 7 Abs. 1 VOB/A

Die Leistung muss **eindeutig und so beschrieben** werden, dass:
- Alle Bewerber die Beschreibung im gleichen Sinne verstehen
- Bewerber sichere Preise kalkulieren können
- Erforderlichenfalls zeichnerisch oder durch Probestücke darstellen

**Seit 2007:** Keine Hersteller- oder Produktbezeichnungen im LV zulässig!

#### Vergabeverfahren (siehe Abschnitt 6)

### 4.3 VOB/B — Vertragsbedingungen (Wichtige Paragraphen)

| § | Thema | Kerninhalt |
|---|-------|-----------|
| **§ 1** | Vertragsinhalt | Leistungsumfang, Leistungsbeschreibung als Vertragsgrundlage |
| **§ 1 Abs. 3** | Geänderte Leistungen | Anordnungsrecht des AG für Änderungen |
| **§ 1 Abs. 4** | Zusätzliche Leistungen | Auf Anordnung des AG, gesondert zu vergüten |
| **§ 2** | Vergütung | Vergütung nach vereinbarten Preisen |
| **§ 2 Abs. 3** | Mehr-/Weniger-Mengen | Mengenänderung: bis 10% kein Preisausgleich (außer unzumutbar) |
| **§ 2 Abs. 5** | Besondere Leistungen | Nicht vertraglich vereinbarte Leistungen |
| **§ 2 Abs. 6** | Vergütungsanpassung | Bei Störung der Geschäftsgrundlage |
| **§ 6** | Behinderung | Behinderungsanzeige, Fristverlängerung |
| **§ 7** | Abnahme | Voraussetzung für Gewährleistungsbeginn |
| **§ 7 Abs. 2** | Fiktive Abnahme | Gilt als abgenommen, wenn AG nicht innerhalb 12 Werktagen verweigert |
| **§ 8** | Kündigung durch AG | Freie Kündigung (Abs. 1), außerordentliche Kündigung (Abs. 2) |
| **§ 9** | Kündigung durch AN | Bei Behinderung (Abs. 1), Zahlungsverzug (Abs. 2) |
| **§ 13** | Mängelansprüche | Frei von Sach- und Rechtsmängeln, Gewährleistungsfrist 4 Jahre |
| **§ 13 Abs. 4** | Mängelbeseitigung | AG kann Mängelbeseitigung verlangen |
| **§ 13 Abs. 5** | Minderung | Minderung der Vergütung |
| **§ 13 Abs. 7** | Selbstvornahme | Nach fruchtloser Fristsetzung |
| **§ 14** | Abrechnung | Nach vertraglichen Einzelpreisen, übersichtlich, prüfbar |
| **§ 15** | Ausführungsunterlagen | AN erstellt erforderliche Zeichnungen, Schalpläne etc. |
| **§ 16** | Ausführung | Keine Abweichung von Leistungsbeschreibung ohne Zustimmung |
| **§ 17** | Verjährung | 4 Jahre (allgemein), 2 Jahre (Handwerk) |

### 4.4 VOB/C — Technische Vertragsbedingungen (ATV)

(→ Siehe Abschnitt 5: DIN 18299 ff.)

### 4.5 BGB-Bauvertrag (seit 2018)

Seit 2018 hat das BGB spezifische Vertragstypen für Bauarbeiten eingeführt:
- **§ 650a BGB** — Bauvertrag
- **§ 650b BGB** — Verbraucherbauvertrag
- **§ 650c BGB** — Bauträgervertrag

Dies reduziert die Notwendigkeit von VOB/B als ergänzende AGB bei Privataufträgen.

---

## 5. DIN 18299 ff. — ATV (VOB/C)

### 5.1 Überblick

Die **Allgemeinen Technischen Vertragsbedingungen (ATV)** in VOB/C regeln die fachtechnischen Anforderungen an Bauleistungen. Sie gliedern sich in:

- **DIN 18299** — Allgemeine Regeln für alle Gewerke (Grundnorm)
- **DIN 18300 ff.** — Einzelgewerke (spezifische Regeln pro Gewerk)

### 5.2 DIN 18299 — Allgemeine Regeln

Kerninhalte:
- **Definitionen** — Leistung, Teilleistung, Ausführungsfragen
- **Vorbemerkungen** — Was muss im LV stehen
- **Ausführung** — Regeln für die Leistungserbringung
- **Abrechnung** — Wie wird gemessen und abgerechnet
- **Teilleistungen** — Gliederung der Bauleistungen

### 5.3 ATV-Gewerke (DIN 18300–18384)

| Norm | Gewerk | Typische Positionen |
|------|--------|-------------------|
| **DIN 18300** | Erdarbeiten | Aushub, Bodenverbesserung, Planum, Verdichtung |
| **DIN 18301** | Bohrarbeiten | Kernbohrungen, Rammungen |
| **DIN 18302** | Entwässerungsarbeiten | Regenwasser, Schmutzwasser, Drainage |
| **DIN 18303** | Brunnenbauarbeiten | Brunnenherstellung |
| **DIN 18304** | Schutzmaßnahmen | Konservierung, Korrosionsschutz |
| **DIN 18310** | Wasserundurchlässige Bauwerke | Weiße Wanne, Abdichtung |
| **DIN 18311** | Stahlbetonarbeiten | Bewehrung, Schalung, Betonage |
| **DIN 18312** | Maurerarbeiten | Mauerwerk, Klinker, Porenbeton |
| **DIN 18313** | Betonarbeiten | Ortbeton, Fertigteilbeton |
| **DIN 18315** | Putz- und Trockenbauarbeiten | Putz, Gipskarton, Akustikdecken |
| **DIN 18316** | Fliesen- und Plattenarbeiten | Bodenfliesen, Wandfliesen, Naturstein |
| **DIN 18317** | Tischlerarbeiten | Fenster, Türen, Möbel, Innenausbau |
| **DIN 18318** | Schlosserarbeiten | Metallkonstruktionen, Geländer, Treppen |
| **DIN 18319** | Klempnerarbeiten | Dachrinnen, Fassadenverkleidung |
| **DIN 18320** | Dachdeckerarbeiten | Dacheindeckung, Abdichtung |
| **DIN 18322** | Sanitärinstallation | Wasser, Abwasser, Gas |
| **DIN 18325** | Heizungsinstallation | Heizkörper, Fußbodenheizung, Wärmepumpe |
| **DIN 18330** | Elektroinstallation | Starkstrom, Schwachstrom, KNX |
| **DIN 18335** | Bodenbelagsarbeiten | Parkett, Teppich, Estrich |
| **DIN 18340** | Maler-/Lackierarbeiten | Anstriche, Lackierungen, Tapeten |
| **DIN 18350** | Gipserarbeiten | Gipsputz, Stuck |
| **DIN 18355** | Glaserarbeiten | Verglasung, Fensterglas |
| **DIN 18360** | Stukkateurarbeiten | Stuckelemente |
| **DIN 18380** | Wärme-/Kälte-/Schallschutz | Dämmung, Isolierung |
| **DIN 18381** | Metallbauarbeiten | Stahlbau, Aluminiumbau |
| **DIN 18382** | Abdichtungsarbeiten | Bitumen, Kunststoff, Mineralisch |
| **DIN 18384** | Natur- und Betonsteinarbeiten | Pflaster, Platten, Fassaden |
| **DIN 18385** | Terrazzoarbeiten | Estrich, Terrazzo |
| **DIN 18421** | Feuerungsanlagen | Kamin, Schornstein |

### 5.4 Positionstexte nach ATV

Positionstexte müssen:
- **Eindeutig** die Leistung beschreiben
- **Messbar** sein (Mengenermittlung möglich)
- **VOB/C-konform** formuliert sein
- Auf **DIN-Normen** mit **Jahr** verweisen
- **Besondere Leistungen** gesondert ausweisen

---

## 6. Vergabeverfahren nach VOB/A

### 6.1 Arten der Vergabeverfahren

| Verfahren | VOB/A | Beschreibung | Voraussetzung |
|-----------|-------|-------------|---------------|
| **Öffentliche Ausschreibung** | § 3 Abs. 1 | Jeder darf ein Angebot abgeben (Regelfall) | Leistung eindeutig beschreibbar |
| **Beschränkte Ausschreibung** | § 3 Abs. 3 | Nur ausgewählte Unternehmen werden eingeladen | Besondere Fähigkeiten nötig |
| **Freihändige Vergabe** | § 3 Abs. 4 | Direkte Verhandlung mit einem Unternehmen | Dringlichkeit, Vertraulichkeit, geringer Wert |
| **Verhandlungsvergabe** | — | Verhandlung mit einem oder mehreren Bietern | Leistung nicht spezifizierbar |
| **Wettbewerblicher Dialog** | — | Besonders komplexe Vorhaben | Komplexe Projekte |
| **Innovationspartnerschaft** | — | Für innovative Leistungen | Innovation am Markt nicht verfügbar |

### 6.2 Schwellenwerte (2024–2025, gültig)

| Auftraggeber | Bauleistungen | Liefer-/Dienstleistungen |
|-------------|--------------|------------------------|
| **Oberschwellenbereich** | **€ 5.538.000** | **€ 221.000** (klassisch) / **€ 443.000** (Sektorenauftraggeber) |
| **Sektorenauftraggeber** | **€ 750.000** | **€ 443.000** |

### 6.3 Schwellenwerte (ab 2026, voraussichtlich)

| Auftraggeber | Bauleistungen | Liefer-/Dienstleistungen |
|-------------|--------------|------------------------|
| **Oberschwellenbereich** | **€ 5.404.000** | **€ 216.000** / **€ 432.000** |

### 6.4 Wertgrenzen für Verfahrensarten

| Wertgrenze | Erlaubtes Verfahren |
|-----------|-------------------|
| **< € 15.000** | Freihändig / ohne Ausschreibung (Direktvergabe) |
| **€ 15.000 – € 221.000** | Freihändige Vergabe, beschränkte Ausschreibung (mind. 3 Angebote) |
| **€ 221.000 – € 5.538.000** | Beschränkte Ausschreibung, freihändige Vergabe (mit Begründung) |
| **> € 5.538.000** | **Pflicht: Öffentliche Ausschreibung** |

### 6.5 Allgemeine Grundsätze (§ 97 GWB)

1. **Wettbewerb** — Vergabe im Wettbewerb
2. **Transparenz** — Verfahrensoffenheit
3. **Gleichbehandlung** — Nichtdiskriminierung
4. **Mittelstandsförderung** — Losvergabe-Pflicht
5. **Eignung** — Fachkundige, leistungsfähige, zuverlässige Unternehmen
6. **Wirtschaftlichkeit** — Zuschlag auf wirtschaftlichstes Angebot

### 6.6 Vergabekontrolle

- **Vergabekammern** — Bundes- und Landesbehörden (Verwaltungsakte)
- **Vergabesenate** der **OLG** — Rechtsmittel (sofortige Beschwerde)
- **Fachanwalt für Vergaberecht** — Seit 2015 anerkannte Spezialisierung

---

## 7. GAEB — Elektronischer Datenaustausch

### 7.1 Überblick

Der **Gemeinsame Ausschuss Elektronik im Bauwesen (GAEB)** entwickelt seit 1966 Standards für den elektronischen Datenaustausch. Ca. **80 Mrd. €** Bauvolumen werden jährlich über GAEB transferiert.

### 7.2 Austauschphasen

| Phase | GAEB-Code | Beschreibung |
|-------|-----------|-------------|
| **Angebotsaufforderung** | X83 | LV ohne Preise → an Bieter |
| **Angebotsabgabe** | X84 | Bieter ergänzt Preise → zurück |
| **Nebenangebot** | X85 | Alternatives Angebot |
| **Auftragserteilung** | X86 | Vertragsabschluss |
| **Abrechnung** | X81 | Mengenermittlung, Aufmaß |
| **Schlussrechnung** | X82 | Abschlussrechnung |

### 7.3 GAEB DA XML (seit 2009)

- Modernes **XML-basiertes** Austauschformat
- **Version 3.3** (2019): Anbindung an **BIM-Modelle** möglich
- Schema-Dateien: `.xsd` (z.B. `DA1100_33.xsd`)
- Namensraum: `http://www.gaeb.de/DAXML/3.3`
- Kodierung: **UTF-8**
- Zertifizierung durch **BVBS** (Bundesverband Bausoftware)

### 7.4 Historische Formate

| Format | Jahr | Beschreibung |
|--------|------|-------------|
| **GAEB DA** | 1985 | Erstes ASCII-basiertes Austauschformat |
| **GAEB 90** | 1990 | Weiterentwicklung |
| **GAEB 2000** | 1999 | XML-nahe Struktur |
| **GAEB DA XML** | 2009 | XML-basiert, aktuell |
| **GAEB DA XML 3.3** | 2019 | BIM-Integration |

### 7.5 Technische Struktur (DA XML 3.3)

```
GAEB_DA_XML
├── Projektinfo
│   ├── Projektbezeichnung
│   ├── Auftraggeber
│   └── Ausschreibungsdaten
├── LV-Gruppen
│   ├── Gewerk
│   │   ├── Titel
│   │   │   ├── Untertitel
│   │   │   │   └── Positionen
│   │   │   │       ├── OZ
│   │   │   │       ├── Langtext
│   │   │   │       ├── Kurztext
│   │   │   │       ├── ME
│   │   │   │       ├── Menge
│   │   │   │       ├── EP
│   │   │   │       └── GP
│   │   │   └── Vorbemerkungen
│   │   └── Zusammenstellung
│   └── Gesamtzusammenstellung
└── Metadaten
```

---

## 8. Standard-Leistungstexte (STLB-Bau)

### 8.1 Überblick

Das **STLB-Bau** (Standardleistungsbau) ist ein vom **BBR** (Bundesanstalt für Bauwesen und Raumordnung) betriebenes System für standardisierte Leistungstexte.

### 8.2 Textarten

| Textart | Beschreibung |
|---------|-------------|
| **Festtexte** | Unveränderliche Standardtexte |
| **Wahltexte** | Optionale Texte zur Auswahl |
| **Dynamische Textelemente** | Passen sich basierend auf Auswahl an |
| **Bedingte Texte** | "Wenn...dann"-Logik |

### 8.3 Standard-Leistungstext-Systeme

| System | Beschreibung |
|--------|-------------|
| **STLB-Bau** | Dynamisches Werkzeug des DIN für alle Gewerke |
| **STLK** | Standardleistungen Straßen- und Brückenbau |
| **STLK-W** | Leistungstexte Wasserbau |
| **STLB-BauZ** | Wiederkehrende Bauunterhaltungsarbeiten (Zeitvertragsarbeiten) |
| **Individuelle Datenbanken** | Softwareanbieter mit freien Texten |

### 8.4 Verwendung

- Bei öffentlichen Aufträgen in der Regel **Standardtexte vorgeschrieben**
- Integration in AVA-Software (STLB-Bau Online, AVAVUS, KOSSY, CPI)
- **Version-controlled** — Updates bei DIN/VOB-Änderungen

---

## 9. Kalkulation & Einheitspreise

### 9.1 Kalkulationsarten

| Art | Beschreibung | Anwendung |
|-----|-------------|-----------|
| **Selbstkalkulation** | Basierend auf eigenen Kosten | Standard |
| **Marktorientierte Kalkulation** | Preise an Markt angepasst | Wettbewerb |
| **Mischkalkulation** | Kombination aus beiden | Strategisch |

### 9.2 Einheitspreis-Zusammensetzung

```
Einheitspreis (EP) =
  Materialkosten (inkl. Fuhrkosten, Schwund)
+ Personalkosten (inkl. Lohnnebenkosten)
+ Gerätekosten
+ Allgemeine Geschäftskosten (AGK)
+ Baustellengemeinkosten (BGK)
+ Wagnis und Gewinn (W&G)
```

### 9.3 Mischkalkulation

- Positionen werden **nicht einzeln** nach Selbstkosten kalkuliert
- Manche Positionen **unter Selbstkosten** (Lockvogel-Positionen)
- Andere Positionen **über Selbstkosten** → Gesamtgewinn gesichert
- **Vorsicht:** Bei Leistungsänderungen (Mehr-/Minderleistungen) problematisch

### 9.4 Preisangaben

- Alle Preise **netto** (ohne Umsatzsteuer)
- **Einheitspreis (EP)** — unveränderlich für die angegebene Soll-Menge
- **Gesamtbetrag (GB)** — veränderliche Größe (Ist-Menge × EP)
- Am Ende: Aufaddierung → Angebotssumme netto + USt → Angebotssumme brutto

---

## 10. Nachtragsmanagement

### 10.1 Nachtragsansprüche — Übersicht

| Grundlage | Paragraph | Tatbestand |
|-----------|-----------|-----------|
| **Geänderte Leistungen** | § 1 Abs. 3 VOB/B | Anordnung geänderter Leistungen durch AG |
| **Zusätzliche Leistungen** | § 1 Abs. 4 VOB/B | Zusätzliche Leistungen auf Anordnung |
| **Mehr-/Weniger-Mengen** | § 2 Abs. 3, Abs. 6 VOB/B | Mengenabweichung >10% |
| **Behinderung/Unterbrechung** | § 6 Abs. 4–6 VOB/B | Leistungsbehinderung |
| **Störung Geschäftsgrundlage** | § 2 Abs. 6 VOB/B | Unvorhersebare Umstände |
| **Fehlerhafte Leistungsbeschreibung** | § 1 Abs. 2 VOB/B | Unvollständige/fehlerhafte Beschreibung |

### 10.2 Mehr-/Mindermengen (§ 2 Abs. 3 VOB/B)

- Mengenänderung **bis 10%** → Preisanpassung nur bei Unzumutbarkeit
- Mengenänderung **über 10%** → Neue Preisvereinbarung zu treffen

### 10.3 Behinderungsanzeige (§ 6 VOB/B)

- AN muss **unverzüglich schriftlich** anzeigen
- Grund: Umstände, die Verzögerung verursachen oder drohen
- Voraussetzung für: Fristverlängerung, Vergütungsanpassung

### 10.4 Anordnungsrecht des AG (§ 1 Abs. 3 VOB/B)

- AG kann Leistungen **ändern** lassen
- AN darf nicht einfach ablehnen
- Vergütungsanpassung nach § 2 Abs. 5/6 VOB/B

---

## 11. Abrechnung & Schlussrechnung

### 11.1 Abrechnung nach § 14 VOB/B

- Abrechnung muss nach **vertraglichen Einzelpreisen** erfolgen
- Muss **übersichtlich** aufgebaut sein
- Grundlagen der Preise müssen **erkennbar** sein
- Aufführung der **ausgeführten Leistungen** mit Mengen und Preisen

### 11.2 Aufmaß (Messung)

- **Aufmaß** = Messung der tatsächlich erbrachten Mengen
- Muss **nachprüfbar** sein
- In der Regel nach **DIN 18299 ff.** (ATV)
- AN erstellt Aufmaß, AG prüft
- Bei keiner Einigung: Aufmaß ist entscheidend

### 11.3 Schlussrechnung

- Abschlussrechnung über **alle erbrachten Leistungen**
- Innerhalb der vertraglichen Frist einreichen
- Grundlage: Tatsächliche Ist-Mengen × Einheitspreise + berechtigte Nachträge
- AG muss prüfen und annehmen oder beanstanden

### 11.4 Abrechnungsmethoden

| Methode | Beschreibung |
|---------|-------------|
| **Einzelstück-Aufmaß** | Zählen einzelner Elemente |
| **Vermaßung** | Messen von Längen, Flächen, Volumina |
| **Pauschaliertes Aufmaß** | Pauschale für Erfahrungswerte |
| **Grob-Aufmaß** | Grobe Schätzung bei Einvernehmen |

---

## 12. HOAI & Leistungsphasen

### 12.1 HOAI-Reform 2021

Seit dem **CJEU-Urteil 2019** ist die HOAI nur noch **Empfehlung**, nicht mehr verbindlich (Mindest-/Höchstsätze nicht mehr bindend).

### 12.2 Die 9 Leistungsphasen

| Phase | Name | Anteil | Beschreibung |
|-------|------|--------|-------------|
| **LP 1** | Grundlagenermittlung | 2% | Aufgabenstellung klären, Bedarf ermitteln |
| **LP 2** | Vorplanung (Entwurfsplanung) | 7% | Konzept, Varianten, erste Kostenberechnung |
| **LP 3** | Entwurfsplanung | 15% | Detaillierter Entwurf, Kostenberechnung |
| **LP 4** | Genehmigungsplanung | 3% | Bauantrag, Genehmigungsunterlagen |
| **LP 5** | Ausführungsplanung | 25% | Detaillierte Ausführungspläne |
| **LP 6** | Vorbereitung der Vergabe | 10% | Leistungsverzeichnisse erstellen |
| **LP 7** | Mitwirkung bei der Vergabe | 4% | Angebote prüfen, Vergabevorschlag |
| **LP 8** | Objektüberwachung | 32% | Bauüberwachung, Abnahmen, Rechnungsprüfung |
| **LP 9** | Objektbetreuung | 2% | Gewährleistungsprüfung, Dokumentation |

### 12.3 LV-Erstellung in LP 6

Die Erstellung von Leistungsverzeichnissen findet primär in **Leistungsphase 6** statt:
- Leistungsbeschreibungen mit Leistungsverzeichnissen aufstellen
- Mengenermittlung
- Vergabeunterlagen zusammenstellen
- Nach STLB-Bau oder freien Texten

---

## 13. BIM 5D & Digitale LV-Erstellung

### 13.1 BIM 5D Konzept

```
3D (Geometrie) + 4D (Zeit/Planung) + 5D (Kosten) = BIM 5D
```

### 13.2 Quantity Take-Off (QTO) aus BIM-Modellen

| Schritt | Beschreibung |
|---------|-------------|
| 1. BIM-Modell erstellen | Ab LOD 300 für Mengenrelevanz |
| 2. Property-Zuweisung | Bauteile mit mengenrelevanten Attributen versehen |
| 3. Automatische Extraktion | Mengen aus Modellgeometrie ableiten |
| 4. Mapping auf LV | Zuordnung zu DIN 18299 ff. / GAEB |
| 5. Kostenzuordnung | Preise/Kostensätze zuweisen |

### 13.3 QTO-Software

| Tool | Hersteller | Funktion |
|------|-----------|---------|
| **Solibri** | Nemetschek | Regelbasierte Prüfung + Mengenextraktion |
| **CostX** | Exactal | QTO direkt aus IFC/BIM-Modellen |
| **Vico Office** | Trimble | 5D QTO + Zeitplanung |
| **Bexel Manager** | Bexel | Mengen + Termine + Kosten |
| **ARCHICAD + GAEB-Export** | Graphisoft | LV-Erstellung aus Modell |
| **Revit + Dynamo** | Autodesk | Tabellarische Mengenermittlung |

### 13.4 Herausforderungen

- **Modellqualität** — Nur sauber modellierte Bauteile liefern korrekte Mengen
- **Mapping-Problem** — BIM-Elemente ≠ LV-Positionen (intelligente Zuordnung nötig)
- **Nicht modellierbare Leistungen** — z.B. Baustelleneinrichtung → manuell ergänzen
- **LOD-Anforderung** — Ab LOD 300 werden Mengen zuverlässig

### 13.5 Standards & Formate

- **IFC** (Industry Foundation Classes) — Offener BIM-Datenaustausch
- **GAEB DA XML 3.3** — LV-Standard mit BIM-Anbindung
- **ÖNORM A 2063** — Mengenermittlung Österreich
- **DIN 18299–18356** — ATV für Vergabe

---

## 14. Software-Landschaft (AVA)

### 14.1 AVA-Software Vergleich

| Software | Hersteller | Zielgruppe | Besonderheit | Preis |
|----------|-----------|-----------|-------------|-------|
| **RIB iTWO** | RIB Software (Stuttgart) | Mittel–Groß | BIM-integriert, 5D, Cloud | SaaS/Lizenz |
| **Nevaris Build** | NEVARIS Bausoftware | Bauunternehmen, Architekten | Umfangreiche Kalkulation, GAEB | Lizenz + Wartung |
| **Data-Plan (AVANTI)** | Data-Plan IT-Service (Köln) | Klein–Mittel | Niedrigschwellig, GAEB-kompatibel | Günstig |
| **HOCHTIEF ViCon** | HOCHTIEF | Großprojekte | BIM-fokussiert | Individuell |
| **graphisoft Archicad** | Nemetschek | Architekten | Integrierte Planung + LV | Lizenz |
| **AVEVA / Widas** | Diverse | Klassisch | LV-Bau-Fokus | Lizenz |
| **NeoWare / Gauss** | Diverse | Ausschreibung | VOB/A-konform | Lizenz |

### 14.2 Trends 2025/2026

- **KI-gestützte LV-Erstellung** — Automatische Texterkennung, Mengenextraktion
- **Cloud & SaaS** wird Standard
- **GAEB DA XML 3.3** als neuer Austauschstandard
- **Open BIM / IFC-Integration** in AVA-Workflows
- **Mobile Verfügbarkeit** für Baustelle
- **API-basierte Anbindung** an ERP-Systeme (SAP)
- **Automatisierte Nachtragsprüfung** durch KI

---

## 15. Internationale Standards

### 15.1 Deutschland

| Norm | Inhalt |
|------|--------|
| **VOB/A** | Vergabevorschriften |
| **VOB/B** | Vertragsbedingungen |
| **VOB/C (DIN 18299 ff.)** | Technische Vertragsbedingungen |
| **GAEB DA XML** | Elektronischer Datenaustausch |
| **STLB-Bau** | Standardleistungstexte |
| **HOAI** | Honorarordnung (Empfehlung seit 2021) |

### 15.2 Österreich

| Norm | Inhalt |
|------|--------|
| **ÖNORM B 2060** | Leistungsverzeichnis |
| **ÖNORM B 2110** | Allgemeine Vertragsbedingungen Hochbau |
| **ÖNORM B 2118** | Allgemeine Vertragsbedingungen Tiefbau |
| **ÖNORM A 2063** | Mengenermittlung |
| **GAEB-Entsprechung** | Über ÖNORM |

### 15.3 Schweiz

| Norm | Inhalt |
|------|--------|
| **SIA 118** | Allgemeine Bedingungen für Bauarbeiten |
| **SIA 102** | Ortsansässige Generalunternehmer |
| **SIA 103** | Ortsansässige Unternehmer |
| **SIA 108** | Leistungs- und Ausschreibungsnorm |
| **SIA 110** | Thermische Bauphysik |

### 15.4 EU-Vergaberichtlinien

- **Richtlinie 2014/24/EU** — Öffentliche Aufträge
- **Richtlinie 2014/25/EU** — Sektorenauftraggeber
- **Richtlinie 2014/23/EU** — Konzessionsverträge
- Umsetzung in nationales Recht (GWB, VgV, VOB/A)

---

## 16. Praxis-Tipps & Häufige Fehler

### 16.1 Häufige Fehler bei der LV-Erstellung

| # | Fehler | Folge | Vermeidung |
|---|--------|-------|-----------|
| 1 | **Unklare Positionstexte** | Nachtragsforderungen | Eindeutig nach VOB/C formulieren |
| 2 | **Fehlende VOB/C-Bezugsnormen** | Rechtsunsicherheit | DIN-Normen mit Jahr zitieren |
| 3 | **Doppelte Positionen** | Überzahlung | Vollständigkeitsprüfung |
| 4 | **Lücken im LV** | Teure Nachträge | Systematische Gewerke-Prüfung |
| 5 | **Falsche Mengenermittlung** | Preisstreitigkeiten | Fachkundige Mengenermittlung |
| 6 | **Mischung von Gewerken** | Kalkulationsprobleme | Gewerke trennen |
| 7 | **Fehlende Vorbemerkungen** | Missverständnisse | Vorbemerkungen immer aufnehmen |
| 8 | **Herstellerangaben** | Vergaberechtswidrig | Seit 2007 verboten! |
| 9 | **Unklare Mengeneinheiten** | Abrechnungsstreit | Einheitliche ME verwenden |
| 10 | **Fehlende Bedarfspositionen** | Nachträge für erwartbare Leistungen | Erfahrungswerte einbeziehen |

### 16.2 Best Practices

1. **STLB-Bau verwenden** — Standardtexte nutzen, wo möglich
2. **Normen korrekt zitieren** — Immer mit Erscheinungsjahr
3. **Besondere Leistungen sauber ausweisen** — Nicht in Normalpositionen verstecken
4. **Vorbemerkungen vollständig** — Alle allgemeinen Anforderungen
5. **Mengenermittlung dokumentiert** — Nachvollziehbar für alle Beteiligten
6. **Software-gestützt arbeiten** — AVA-Programme für Konsistenz
7. **Wirtschaftlichkeitskontrolle** — Plausibilitätsprüfung der Gesamtsumme
8. **Peer Review** — Zweite Person prüft LV vor Ausschreibung
9. **Mutter-LV pflegen** — Aus Erfahrungslernen für zukünftige Projekte
10. **GAEB-Format nutzen** — Elektronischer Austausch reduziert Fehler

### 16.3 Checkliste LV-Erstellung

- [ ] Alle Gewerke erfasst?
- [ ] Positionstexte eindeutig und VOB/C-konform?
- [ ] Mengenermittlung plausibel?
- [ ] Mengeneinheiten korrekt?
- [ ] Vorbemerkungen vollständig?
- [ ] Besondere Leistungen ausgewiesen?
- [ ] Bedarfspositionen markiert?
- [ ] Alternativpositionen gekennzeichnet?
- [ ] GAEB-kompatibel exportiert?
- [ ] Rechtschreibung und Formatierung geprüft?
- [ ] Peer Review durchgeführt?

---

## 17. Glossar

| Begriff | Definition |
|---------|-----------|
| **AG** | Auftraggeber |
| **AN** | Auftragnehmer |
| **AGK** | Allgemeine Geschäftskosten |
| **ATV** | Allgemeine Technische Vertragsbedingungen (VOB/C) |
| **AVA** | Ausschreibung, Vergabe und Abrechnung |
| **BE** | Baustelleneinrichtung |
| **BGK** | Baustellengemeinkosten |
| **BIM** | Building Information Modeling |
| **EP** | Einheitspreis |
| **GAEB** | Gemeinsamer Ausschuss Elektronik im Bauwesen |
| **GB** | Gesamtbetrag |
| **GP** | Gesamtpreis |
| **HOAI** | Honorarordnung für Architekten und Ingenieure |
| **IFC** | Industry Foundation Classes (BIM-Austauschformat) |
| **LB** | Leistungsbereich |
| **LOD** | Level of Development (BIM-Detailgrad) |
| **LV** | Leistungsverzeichnis |
| **ME** | Mengeneinheit |
| **MLB** | Muster-Leistungsbeschreibung |
| **OZ** | Ordnungszahl |
| **QTO** | Quantity Take-Off |
| **STLB** | Standardleistungsbau |
| **STLK** | Standardleistungen Straßen- und Brückenbau |
| **VOB** | Vergabe- und Vertragsordnung für Bauleistungen |
| **VgV** | Vergabeverordnung |
| **W&G** | Wagnis und Gewinn |
| **ZB** | Zusammenstellung der Beträge |
| **ZVB** | Zusammenfassende Vertragsbestimmungen |

---

## 18. Quellen & Referenzen

### Offizielle Quellen

- [VOB Online](https://www.vob-online.com) — VOB-Texte und Kommentare
- [GAEB](https://www.gaeb.de) — Elektronischer Datenaustausch
- [DIN / Beuth Verlag](https://www.beuth.de) — DIN-Normen bestellen
- [STLB-Bau](https://www.stlb-bau.de) — Standardleistungstexte
- [Bundesgesetzblatt](https://www.bgbl.de) — Rechtstexte

### Fachportale

- [Bauprofessor](https://www.bauprofessor.de) — Baufachwissen
- [Vergabe24](https://www.vergabe24.de) — Vergabeplattform
- [Baunetz](https://www.baunetz.de) — Branchennachrichten
- [Gabot.de](https://www.gabot.de) — Bau-IT-Fachportal
- [Vergabeblog](https://www.vergabeblog.de) — Vergaberecht

### Verbände

- [ZDB — Zentralverband Deutsches Baugewerbe](https://www.zdb.de)
- [BVBS — Bundesverband Bausoftware](https://www.bvbs.de)
- [Bundesarchitektenkammer (BAK)](https://www.bak.de)
- [buildingSMART Deutschland](https://www.buildingsmart.de)

### Rechtstexte

- [dejure.org — VOB/B](https://dejure.org/gesetze/VOB-B)
- [Gesetze im Internet — GWB](https://www.gesetze-im-internet.de/gwb/)
- [Gesetze im Internet — VOB/A](https://www.gesetze-im-internet.de/vob_a_2019/)

### Normen (Kauf)

- [Beuth Verlag — DIN 18299](https://www.beuth.de)
- [ÖNORM — Austrian Standards](https://www.austrian-standards.at)
- [SIA — Schweiz](https://www.sia.ch)

---

*Dieses Dokument ist eine lebendige Wissensbasis. Regelmäßig aktualisieren mit neuen Erkenntnissen, Normen-Updates und Praxiserfahrungen.*
