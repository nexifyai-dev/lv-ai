import { generateDummyPassword } from "./db/utils";

export const isProductionEnvironment = process.env.NODE_ENV === "production";
export const isDevelopmentEnvironment = process.env.NODE_ENV === "development";
export const isTestEnvironment = Boolean(
  process.env.PLAYWRIGHT_TEST_BASE_URL ||
    process.env.PLAYWRIGHT ||
    process.env.CI_PLAYWRIGHT
);

export const guestRegex = /^guest-\d+$/;

export const DUMMY_PASSWORD = generateDummyPassword();

// LV.AI — Vorgeschlagene Aktionen für den Chat
export const suggestions = [
  "Erstelle ein Leistungsverzeichnis für Rohbauarbeiten",
  "Kostenschätzung nach DIN 276 für ein Einfamilienhaus",
  "Preisspiegel für 3 Bieter erstellen und auswerten",
  "GAEB-Datei importieren und Positionen prüfen",
  "Nachtragsformulierung für Mehrleistungen vorbereiten",
  "Schlussrechnung gegen Auftrags-LV prüfen",
  "Gewährleistungsfristen für mein Projekt berechnen",
  "Alternativpositionen für günstigere Materialien vorschlagen",
];
