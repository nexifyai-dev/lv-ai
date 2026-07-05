export type ErrorType =
  | "bad_request"
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "rate_limit"
  | "offline";

export type Surface =
  | "chat"
  | "auth"
  | "api"
  | "stream"
  | "database"
  | "history"
  | "vote"
  | "document"
  | "suggestions";

export type ErrorCode = `${ErrorType}:${Surface}`;

export type ErrorVisibility = "response" | "log" | "none";

export const visibilityBySurface: Record<Surface, ErrorVisibility> = {
  database: "log",
  chat: "response",
  auth: "response",
  stream: "response",
  api: "response",
  history: "response",
  vote: "response",
  document: "response",
  suggestions: "response",
};

export class ChatbotError extends Error {
  type: ErrorType;
  surface: Surface;
  statusCode: number;

  constructor(errorCode: ErrorCode, cause?: string) {
    super();

    const [type, surface] = errorCode.split(":");

    this.type = type as ErrorType;
    this.cause = cause;
    this.surface = surface as Surface;
    this.message = getMessageByErrorCode(errorCode);
    this.statusCode = getStatusCodeByType(this.type);
  }

  toResponse() {
    const code: ErrorCode = `${this.type}:${this.surface}`;
    const visibility = visibilityBySurface[this.surface];

    const { message, cause, statusCode } = this;

    if (visibility === "log") {
      console.error({
        code,
        message,
        cause,
      });

      return Response.json(
        { code: "", message: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut." },
        { status: statusCode }
      );
    }

    return Response.json({ code, message, cause }, { status: statusCode });
  }
}

export function getMessageByErrorCode(errorCode: ErrorCode): string {
  if (errorCode.includes("database")) {
    return "Datenbankfehler. Bitte versuchen Sie es später erneut.";
  }

  switch (errorCode) {
    case "bad_request:api":
      return "Die Anfrage konnte nicht verarbeitet werden. Bitte überprüfen Sie Ihre Eingabe.";

    case "unauthorized:auth":
      return "Sie müssen sich anmelden, um fortzufahren.";
    case "forbidden:auth":
      return "Ihr Konto hat keinen Zugriff auf diese Funktion.";

    case "rate_limit:chat":
      return "Nachrichtenlimit erreicht. Versuchen Sie es in 1 Stunde erneut.";
    case "not_found:chat":
      return "Das Gespräch wurde nicht gefunden.";
    case "forbidden:chat":
      return "Dieses Gespräch gehört einem anderen Nutzer.";
    case "unauthorized:chat":
      return "Sie müssen sich anmelden, um dieses Gespräch zu sehen.";
    case "offline:chat":
      return "Nachricht konnte nicht gesendet werden. Bitte überprüfen Sie Ihre Internetverbindung.";

    case "not_found:document":
      return "Das Dokument wurde nicht gefunden.";
    case "forbidden:document":
      return "Dieses Dokument gehört einem anderen Nutzer.";
    case "unauthorized:document":
      return "Sie müssen sich anmelden, um dieses Dokument zu sehen.";
    case "bad_request:document":
      return "Die Anfrage ist ungültig. Bitte überprüfen Sie Ihre Eingabe.";

    default:
      return "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.";
  }
}

function getStatusCodeByType(type: ErrorType) {
  switch (type) {
    case "bad_request":
      return 400;
    case "unauthorized":
      return 401;
    case "forbidden":
      return 403;
    case "not_found":
      return 404;
    case "rate_limit":
      return 429;
    case "offline":
      return 503;
    default:
      return 500;
  }
}
