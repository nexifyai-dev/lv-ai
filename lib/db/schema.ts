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
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  email: varchar("email", { length: 64 }).notNull(),
  password: varchar("password", { length: 64 }),
  name: text("name"),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  isAnonymous: boolean("isAnonymous").notNull().default(false),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export type User = InferSelectModel<typeof user>;

// ─── Projects (Jeder Chat = ein Bauprojekt) ─────────────────────────────────

export const project = pgTable("Project", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id),
  name: text("name").notNull(),
  land: landEnum("land").notNull().default("DE"),
  gewerk: text("gewerk"),
  bauherr: text("bauherr"),
  adresse: text("adresse"),
  status: projektStatusEnum("status").notNull().default("entwurf"),
  kostenbudget: decimal("kostenbudget", { precision: 12, scale: 2 }),
  bemerkungen: text("bemerkungen"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export type Project = InferSelectModel<typeof project>;

// ─── Chats (1:1 mit Projects) ────────────────────────────────────────────────

export const chat = pgTable("Chat", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  createdAt: timestamp("createdAt").notNull(),
  title: text("title").notNull(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id),
  projectId: uuid("projectId").references(() => project.id),
  visibility: varchar("visibility", { enum: ["public", "private"] })
    .notNull()
    .default("private"),
});

export type Chat = InferSelectModel<typeof chat>;

// ─── Messages ────────────────────────────────────────────────────────────────

export const message = pgTable("Message_v2", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  chatId: uuid("chatId")
    .notNull()
    .references(() => chat.id),
  role: varchar("role").notNull(),
  parts: json("parts").notNull(),
  attachments: json("attachments").notNull(),
  createdAt: timestamp("createdAt").notNull(),
});

export type DBMessage = InferSelectModel<typeof message>;

// ─── Votes ───────────────────────────────────────────────────────────────────

export const vote = pgTable(
  "Vote_v2",
  {
    chatId: uuid("chatId")
      .notNull()
      .references(() => chat.id),
    messageId: uuid("messageId")
      .notNull()
      .references(() => message.id),
    isUpvoted: boolean("isUpvoted").notNull(),
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
    id: uuid("id").notNull().defaultRandom(),
    createdAt: timestamp("createdAt").notNull(),
    title: text("title").notNull(),
    content: text("content"),
    kind: varchar("text", { enum: ["text", "code", "image", "sheet"] })
      .notNull()
      .default("text"),
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
    id: uuid("id").notNull().defaultRandom(),
    documentId: uuid("documentId").notNull(),
    documentCreatedAt: timestamp("documentCreatedAt").notNull(),
    originalText: text("originalText").notNull(),
    suggestedText: text("suggestedText").notNull(),
    description: text("description"),
    isResolved: boolean("isResolved").notNull().default(false),
    userId: uuid("userId")
      .notNull()
      .references(() => user.id),
    createdAt: timestamp("createdAt").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    documentRef: foreignKey({
      columns: [table.documentId, table.documentCreatedAt],
      foreignColumns: [document.id, document.createdAt],
    }),
  })
);

export type Suggestion = InferSelectModel<typeof suggestion>;

// ─── Streams ─────────────────────────────────────────────────────────────────

export const stream = pgTable(
  "Stream",
  {
    id: uuid("id").notNull().defaultRandom(),
    chatId: uuid("chatId").notNull(),
    createdAt: timestamp("createdAt").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    chatRef: foreignKey({
      columns: [table.chatId],
      foreignColumns: [chat.id],
    }),
  })
);

export type Stream = InferSelectModel<typeof stream>;

// ─── LV-Dokumente (GAEB) ────────────────────────────────────────────────────

export const lvDocument = pgTable("LvDocument", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  projectId: uuid("projectId")
    .notNull()
    .references(() => project.id),
  titel: text("titel").notNull(),
  gaebFormat: gaebFormatEnum("gaebFormat"),
  version: varchar("version", { length: 20 }),
  status: varchar("status", { length: 30 }).notNull().default("entwurf"),
  storageUrl: text("storageUrl"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export type LvDocument = InferSelectModel<typeof lvDocument>;

// ─── LV-Positionen ──────────────────────────────────────────────────────────

export const lvPosition = pgTable("LvPosition", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  lvDocumentId: uuid("lvDocumentId")
    .notNull()
    .references(() => lvDocument.id),
  oz: varchar("oz", { length: 20 }).notNull(), // Ordnungszahl (z.B. 01.0020)
  kurztext: text("kurztext").notNull(),
  langtext: text("langtext"),
  menge: decimal("menge", { precision: 12, scale: 3 }),
  einheit: varchar("einheit", { length: 10 }), // m³, m², m, kg, Stk., lfm
  einheitspreis: decimal("einheitspreis", { precision: 12, scale: 2 }),
  gesamtpreis: decimal("gesamtpreis", { precision: 14, scale: 2 }),
  positionstyp: varchar("positionstyp", { length: 20 }).default("standard"), // standard, alternativ, nachtrag
  sortierung: integer("sortierung").default(0),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export type LvPosition = InferSelectModel<typeof lvPosition>;

// ─── Angebote (Bieter) ──────────────────────────────────────────────────────

export const offer = pgTable("Offer", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  projectId: uuid("projectId")
    .notNull()
    .references(() => project.id),
  bieter: text("bieter").notNull(),
  gaebSourceId: uuid("gaebSourceId"),
  gesamtsumme: decimal("gesamtsumme", { precision: 14, scale: 2 }),
  status: bieterStatusEnum("status").notNull().default("offen"),
  bemerkungen: text("bemerkungen"),
  eingereichtAm: timestamp("eingereichtAm"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export type Offer = InferSelectModel<typeof offer>;

// ─── Rechnungen ──────────────────────────────────────────────────────────────

export const invoice = pgTable("Invoice", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  projectId: uuid("projectId")
    .notNull()
    .references(() => project.id),
  nummer: text("nummer").notNull(),
  betrag: decimal("betrag", { precision: 14, scale: 2 }).notNull(),
  status: rechnungStatusEnum("status").notNull().default("entwurf"),
  faelligkeit: timestamp("faelligkeit"),
  eRechnungFormat: varchar("eRechnungFormat", { length: 20 }), // XRechnung, ZUGFeRD
  bemerkungen: text("bemerkungen"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export type Invoice = InferSelectModel<typeof invoice>;

// ─── Erinnerungen ────────────────────────────────────────────────────────────

export const reminder = pgTable("Reminder", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  projectId: uuid("projectId")
    .notNull()
    .references(() => project.id),
  typ: erinnerungTypEnum("typ").notNull(),
  titel: text("titel").notNull(),
  beschreibung: text("beschreibung"),
  faelligAm: timestamp("faelligAm").notNull(),
  gesendet: boolean("gesendet").notNull().default(false),
  gesendetAm: timestamp("gesendetAm"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export type Reminder = InferSelectModel<typeof reminder>;

// ─── Dateien (Global + Projekt) ──────────────────────────────────────────────

export const fileGlobal = pgTable("FileGlobal", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id),
  filename: text("filename").notNull(),
  typ: varchar("typ", { length: 50 }),
  storageUrl: text("storageUrl").notNull(),
  tags: json("tags").$type<string[]>(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export type FileGlobal = InferSelectModel<typeof fileGlobal>;

export const fileProject = pgTable("FileProject", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  projectId: uuid("projectId")
    .notNull()
    .references(() => project.id),
  filename: text("filename").notNull(),
  typ: varchar("typ", { length: 50 }),
  storageUrl: text("storageUrl").notNull(),
  tags: json("tags").$type<string[]>(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export type FileProject = InferSelectModel<typeof fileProject>;

// ─── Zeichnungen ─────────────────────────────────────────────────────────────

export const drawing = pgTable("Drawing", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  projectId: uuid("projectId")
    .notNull()
    .references(() => project.id),
  titel: text("titel").notNull(),
  typ: varchar("typ", { length: 30 }).notNull(), // grundriss, detail, lageplan, schnitt
  storageUrlSvg: text("storageUrlSvg"),
  storageUrlPdf: text("storageUrlPdf"),
  beschreibung: text("beschreibung"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export type Drawing = InferSelectModel<typeof drawing>;
