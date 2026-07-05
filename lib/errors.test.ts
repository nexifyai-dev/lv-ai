import { describe, expect, it } from "vitest";
import { ChatbotError, getMessageByErrorCode } from "./errors";

describe("LV.AI Error Messages (German)", () => {
  describe("getMessageByErrorCode", () => {
    it("should return German message for database errors", () => {
      const msg = getMessageByErrorCode("bad_request:database");
      expect(msg).toContain("Datenbankfehler");
    });

    it("should return German message for unauthorized", () => {
      const msg = getMessageByErrorCode("unauthorized:auth");
      expect(msg).toContain("anmelden");
    });

    it("should return German message for rate limit", () => {
      const msg = getMessageByErrorCode("rate_limit:chat");
      expect(msg).toContain("Nachrichtenlimit");
    });

    it("should return German message for offline", () => {
      const msg = getMessageByErrorCode("offline:chat");
      expect(msg).toContain("Internetverbindung");
    });

    it("should return German default message", () => {
      const msg = getMessageByErrorCode("bad_request:api");
      expect(msg).toContain("verarbeitet");
    });

    it("should not contain Vercel or AI Gateway references", () => {
      const codes = [
        "bad_request:api",
        "unauthorized:auth",
        "rate_limit:chat",
        "offline:chat",
        "bad_request:database",
      ];
      for (const code of codes) {
        const msg = getMessageByErrorCode(code as any);
        expect(msg).not.toContain("Vercel");
        expect(msg).not.toContain("AI Gateway");
      }
    });
  });

  describe("ChatbotError", () => {
    it("should create error with German message", () => {
      const error = new ChatbotError("unauthorized:chat");
      expect(error.message).toContain("anmelden");
      expect(error.statusCode).toBe(401);
    });

    it("should create error with correct status code", () => {
      const error400 = new ChatbotError("bad_request:api");
      expect(error400.statusCode).toBe(400);

      const error404 = new ChatbotError("not_found:chat");
      expect(error404.statusCode).toBe(404);

      const error429 = new ChatbotError("rate_limit:chat");
      expect(error429.statusCode).toBe(429);
    });
  });
});
