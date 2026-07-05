ALTER TYPE "bieter_status" ADD VALUE 'gueltig';--> statement-breakpoint
ALTER TYPE "bieter_status" ADD VALUE 'unvollstaendig';--> statement-breakpoint
ALTER TYPE "bieter_status" ADD VALUE 'ausgeschlossen';--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "OfferPosition" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"offerId" uuid NOT NULL,
	"oz" varchar(20) NOT NULL,
	"kurztext" text,
	"menge" numeric(12, 3),
	"einheit" varchar(10),
	"einheitspreis" numeric(12, 2),
	"gesamtpreis" numeric(14, 2),
	"sortierung" integer DEFAULT 0,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "OfferPosition_offerId_oz_pk" PRIMARY KEY("offerId","oz")
);
--> statement-breakpoint
ALTER TABLE "Offer" ADD COLUMN "zuschlagErteiltAm" timestamp;--> statement-breakpoint
ALTER TABLE "Offer" ADD COLUMN "zuschlagBegruendung" text;--> statement-breakpoint
ALTER TABLE "Offer" ADD COLUMN "auschlussGrund" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "OfferPosition" ADD CONSTRAINT "OfferPosition_offerId_Offer_id_fk" FOREIGN KEY ("offerId") REFERENCES "public"."Offer"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
