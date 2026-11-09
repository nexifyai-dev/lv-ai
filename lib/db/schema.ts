import type { InferSelectModel } from "drizzle-orm";
import {
  boolean,
  decimal,
  foreignKey,
  integer,
  json,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// ─── Enums ───────────────────────────────────────────────────────────────────

export const landEnum = pgEnum("land", ["DE", "AT", "CH"]);
export const projektStatusEnum = pgEnum("projekt_status", [
  "entwurf",
  "ausschreibung",
  "vergabe",
  "ausfuehrung",
  "abrechnung",
  "abgeschlossen",
]);
export const gaebFormatEnum = pgEnum("gaeb_format", [
  "X81",
  "X82",
  "X83",
  "X84",
  "X85",
  "X86",
  "X87",
  "X89",
]);
export const bieterStatusEnum = pgEnum("bieter_status", [
  "offen",
  "eingereicht",
  "gueltig",
  "unvollstaendig",
  "ausgeschlossen",
  "vergeben",
  "abgelehnt",
]);
export const rechnungStatusEnum = pgEnum("rechnung_status", [
  "entwurf",
  "gesendet",
  "geprueft",
  "bezahlt",
  "beanstandet",
]);
export const erinnerungTypEnum = pgEnum("erinnerung_typ", [
  "frist",
  "zahlung",
  "gewaehrleistung",
  "nachtrag",
  "termin",
]);

// ─── Users ───────────────────────────────────────────────────────────────────

export const user = pgTable("User", {
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  email: varchar("email", { length: 64 }).notNull(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  image: text("image"),
  isAnonymous: boolean("isAnonymous").notNull().default(false),
  name: text("name"),
  password: varchar("password", { length: 64 }),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export type User = InferSelectModel<typeof user>;

// ─── Projects (Jeder Chat = ein Bauprojekt) ─────────────────────────────────

export const project = pgTable("Project", {
  adresse: text("adresse"),
  bauherr: text("bauherr"),
  bemerkungen: text("bemerkungen"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  gewerk: text("gewerk"),
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  kostenbudget: decimal("kostenbudget", { precision: 12, scale: 2 }),
  land: landEnum("land").notNull().default("DE"),
  name: text("name").notNull(),
  status: projektStatusEnum("status").notNull().default("entwurf"),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id),
});

export type Project = InferSelectModel<typeof project>;

// ─── Chats (1:1 mit Projects) ────────────────────────────────────────────────

export const chat = pgTable("Chat", {
  createdAt: timestamp("createdAt").notNull(),
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  projectId: uuid("projectId").references(() => project.id),
  title: text("title").notNull(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id),
  visibility: varchar("visibility", { enum: ["public", "private"] })
    .notNull()
    .default("private"),
});

export type Chat = InferSelectModel<typeof chat>;

// ─── Messages ────────────────────────────────────────────────────────────────

export const message = pgTable("Message_v2", {
  attachments: json("attachments").notNull(),
  chatId: uuid("chatId")
    .notNull()
    .references(() => chat.id),
  createdAt: timestamp("createdAt").notNull(),
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  parts: json("parts").notNull(),
  role: varchar("role").notNull(),
});

export type DBMessage = InferSelectModel<typeof message>;

// ─── Votes ───────────────────────────────────────────────────────────────────

export const vote = pgTable(
  "Vote_v2",
  {
    chatId: uuid("chatId")
      .notNull()
      .references(() => chat.id),
    isUpvoted: boolean("isUpvoted").notNull(),
    messageId: uuid("messageId")
      .notNull()
      .references(() => message.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.chatId, table.messageId] }),
  })
);

export type Vote = InferSelectModel<typeof vote>;

// ─── Documents (Artifacts) ───────────────────────────────────────────────────

export const document = pgTable(
  "Document",
  {
    content: text("content"),
    createdAt: timestamp("createdAt").notNull(),
    id: uuid("id").notNull().defaultRandom(),
    kind: varchar("text", { enum: ["text", "code", "image", "sheet"] })
      .notNull()
      .default("text"),
    title: text("title").notNull(),
    userId: uuid("userId")
      .notNull()
      .references(() => user.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id, table.createdAt] }),
  })
);

export type Document = InferSelectModel<typeof document>;

// ─── Suggestions ─────────────────────────────────────────────────────────────

export const suggestion = pgTable(
  "Suggestion",
  {
    createdAt: timestamp("createdAt").notNull(),
    description: text("description"),
    documentCreatedAt: timestamp("documentCreatedAt").notNull(),
    documentId: uuid("documentId").notNull(),
    id: uuid("id").notNull().defaultRandom(),
    isResolved: boolean("isResolved").notNull().default(false),
    originalText: text("originalText").notNull(),
    suggestedText: text("suggestedText").notNull(),
    userId: uuid("userId")
      .notNull()
      .references(() => user.id),
  },
  (table) => ({
    documentRef: foreignKey({
      columns: [table.documentId, table.documentCreatedAt],
      foreignColumns: [document.id, document.createdAt],
    }),
    pk: primaryKey({ columns: [table.id] }),
  })
);

export type Suggestion = InferSelectModel<typeof suggestion>;

// ─── Streams ─────────────────────────────────────────────────────────────────

export const stream = pgTable(
  "Stream",
  {
    chatId: uuid("chatId").notNull(),
    createdAt: timestamp("createdAt").notNull(),
    id: uuid("id").notNull().defaultRandom(),
  },
  (table) => ({
    chatRef: foreignKey({
      columns: [table.chatId],
      foreignColumns: [chat.id],
    }),
    pk: primaryKey({ columns: [table.id] }),
  })
);

export type Stream = InferSelectModel<typeof stream>;

// ─── LV-Dokumente (GAEB) ────────────────────────────────────────────────────

export const lvDocument = pgTable("LvDocument", {
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  gaebFormat: gaebFormatEnum("gaebFormat"),
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  projectId: uuid("projectId")
    .notNull()
    .references(() => project.id),
  status: varchar("status", { length: 30 }).notNull().default("entwurf"),
  storageUrl: text("storageUrl"),
  titel: text("titel").notNull(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  version: varchar("version", { length: 20 }),
});

export type LvDocument = InferSelectModel<typeof lvDocument>;

// ─── LV-Positionen ──────────────────────────────────────────────────────────

export const lvPosition = pgTable("LvPosition", {
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  einheit: varchar("einheit", { length: 10 }), // m³, m², m, kg, Stk., lfm
  einheitspreis: decimal("einheitspreis", { precision: 12, scale: 2 }),
  gesamtpreis: decimal("gesamtpreis", { precision: 14, scale: 2 }),
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  kurztext: text("kurztext").notNull(),
  langtext: text("langtext"),
  lvDocumentId: uuid("lvDocumentId")
    .notNull()
    .references(() => lvDocument.id),
  menge: decimal("menge", { precision: 12, scale: 3 }),
  oz: varchar("oz", { length: 20 }).notNull(), // Ordnungszahl (z.B. 01.0020)
  positionstyp: varchar("positionstyp", { length: 20 }).default("standard"), // standard, alternativ, nachtrag
  sortierung: integer("sortierung").default(0),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export type LvPosition = InferSelectModel<typeof lvPosition>;

// ─── Angebote (Bieter) ──────────────────────────────────────────────────────

export const offer = pgTable("Offer", {
  auschlussGrund: text("auschlussGrund"), // bei status=ausgeschlossen
  bemerkungen: text("bemerkungen"),
  bieter: text("bieter").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  eingereichtAm: timestamp("eingereichtAm"),
  gaebSourceId: uuid("gaebSourceId"),
  gesamtsumme: decimal("gesamtsumme", { precision: 14, scale: 2 }),
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  projectId: uuid("projectId")
    .notNull()
    .references(() => project.id),
  status: bieterStatusEnum("status").notNull().default("offen"),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  zuschlagBegruendung: text("zuschlagBegruendung"),
  // Zuschlagserteilung (VOB/A § 17 Zuschlag)
  zuschlagErteiltAm: timestamp("zuschlagErteiltAm"),
});

export type Offer = InferSelectModel<typeof offer>;

// ─── Bieter-Angebotspositionen (position-level Preise pro Bieter) ────────────

export const offerPosition = pgTable(
  "OfferPosition",
  {
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    einheit: varchar("einheit", { length: 10 }),
    einheitspreis: decimal("einheitspreis", { precision: 12, scale: 2 }),
    gesamtpreis: decimal("gesamtpreis", { precision: 14, scale: 2 }),
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    kurztext: text("kurztext"),
    menge: decimal("menge", { precision: 12, scale: 3 }),
    offerId: uuid("offerId")
      .notNull()
      .references(() => offer.id, { onDelete: "cascade" }),
    oz: varchar("oz", { length: 20 }).notNull(),
    sortierung: integer("sortierung").default(0),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  },
  (table) => ({
    offerOzPk: primaryKey({ columns: [table.offerId, table.oz] }),
  })
);

export type OfferPosition = InferSelectModel<typeof offerPosition>;

// ─── Rechnungen ──────────────────────────────────────────────────────────────

export const invoice = pgTable("Invoice", {
  bemerkungen: text("bemerkungen"),
  betrag: decimal("betrag", { precision: 14, scale: 2 }).notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  eRechnungFormat: varchar("eRechnungFormat", { length: 20 }), // XRechnung, ZUGFeRD
  faelligkeit: timestamp("faelligkeit"),
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  nummer: text("nummer").notNull(),
  projectId: uuid("projectId")
    .notNull()
    .references(() => project.id),
  status: rechnungStatusEnum("status").notNull().default("entwurf"),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export type Invoice = InferSelectModel<typeof invoice>;

// ─── Erinnerungen ────────────────────────────────────────────────────────────

export const reminder = pgTable("Reminder", {
  beschreibung: text("beschreibung"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  faelligAm: timestamp("faelligAm").notNull(),
  gesendet: boolean("gesendet").notNull().default(false),
  gesendetAm: timestamp("gesendetAm"),
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  projectId: uuid("projectId")
    .notNull()
    .references(() => project.id),
  titel: text("titel").notNull(),
  typ: erinnerungTypEnum("typ").notNull(),
});

export type Reminder = InferSelectModel<typeof reminder>;

// ─── Dateien (Global + Projekt) ──────────────────────────────────────────────

export const fileGlobal = pgTable("FileGlobal", {
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  filename: text("filename").notNull(),
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  storageUrl: text("storageUrl").notNull(),
  tags: json("tags").$type<string[]>(),
  typ: varchar("typ", { length: 50 }),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id),
});

export type FileGlobal = InferSelectModel<typeof fileGlobal>;

export const fileProject = pgTable("FileProject", {
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  filename: text("filename").notNull(),
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  projectId: uuid("projectId")
    .notNull()
    .references(() => project.id),
  storageUrl: text("storageUrl").notNull(),
  tags: json("tags").$type<string[]>(),
  typ: varchar("typ", { length: 50 }),
});

export type FileProject = InferSelectModel<typeof fileProject>;

// ─── Zeichnungen ─────────────────────────────────────────────────────────────

export const drawing = pgTable("Drawing", {
  beschreibung: text("beschreibung"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  projectId: uuid("projectId")
    .notNull()
    .references(() => project.id),
  storageUrlPdf: text("storageUrlPdf"),
  storageUrlSvg: text("storageUrlSvg"),
  titel: text("titel").notNull(),
  typ: varchar("typ", { length: 30 }).notNull(), // grundriss, detail, lageplan, schnitt
});

export type Drawing = InferSelectModel<typeof drawing>;
