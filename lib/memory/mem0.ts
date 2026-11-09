// ─── Mem0 Memory Service — Projekt + Global Scope ────────────────────────────
// Mem0 kombiniert Vektorsuche, Knowledge-Graph und Key-Value-Caching.
// Drei Scopes: user-level (Präferenzen), session-level (Aufgabe), agent-level (Fachwissen)

export const MEMORY_SCOPE_PROJECT = "project";
export const MEMORY_SCOPE_GLOBAL = "global";

export type MemoryScope =
  | typeof MEMORY_SCOPE_PROJECT
  | typeof MEMORY_SCOPE_GLOBAL;

export interface Mem0Config {
  agentId?: string;
  apiKey: string;
  baseUrl?: string;
  userId: string;
}

export interface MemoryEntry {
  content: string;
  createdAt: string;
  id: string;
  metadata?: Record<string, unknown>;
  projectId?: string;
  scope: MemoryScope;
}

export interface SearchOptions {
  limit?: number;
  projectId?: string;
  query: string;
  scope?: MemoryScope;
}

export class Mem0Service {
  private config: Mem0Config;
  private baseUrl: string;

  constructor(config: Mem0Config) {
    this.config = config;
    this.baseUrl = config.baseUrl || "https://api.mem0.ai/v1";
  }

  private getHeaders(): HeadersInit {
    return {
      Authorization: `Token ${this.config.apiKey}`,
      "Content-Type": "application/json",
    };
  }

  /**
   * Erinnert eine Erkenntnis/Entscheidung im angegebenen Scope.
   * Projekt-Scope: nur für dieses Bauprojekt relevant.
   * Global-Scope: büroweite Präferenzen, Standardtexte, Muster.
   */
  async remember(
    content: string,
    scope: MemoryScope,
    projectId?: string,
    metadata?: Record<string, unknown>
  ): Promise<MemoryEntry> {
    const body: Record<string, unknown> = {
      messages: [{ content, role: "user" }],
      user_id: this.config.userId,
    };

    if (scope === MEMORY_SCOPE_PROJECT && projectId) {
      body.project_id = projectId;
    }

    if (this.config.agentId) {
      body.agent_id = this.config.agentId;
    }

    if (metadata) {
      body.metadata = { ...metadata, scope };
    }

    const response = await fetch(`${this.baseUrl}/memories/`, {
      body: JSON.stringify(body),
      headers: this.getHeaders(),
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(
        `Mem0 remember failed: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    return {
      content,
      createdAt: new Date().toISOString(),
      id: result.id || crypto.randomUUID(),
      metadata,
      projectId,
      scope,
    };
  }

  /**
   * Sucht in Erinnerungen. Kann projekt-scope oder global-scope durchsuchen.
   */
  async search(options: SearchOptions): Promise<MemoryEntry[]> {
    const body: Record<string, unknown> = {
      limit: options.limit || 10,
      query: options.query,
      user_id: this.config.userId,
    };

    if (options.scope === MEMORY_SCOPE_PROJECT && options.projectId) {
      body.project_id = options.projectId;
    }

    if (this.config.agentId) {
      body.agent_id = this.config.agentId;
    }

    const response = await fetch(`${this.baseUrl}/search/`, {
      body: JSON.stringify(body),
      headers: this.getHeaders(),
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(
        `Mem0 search failed: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    return (result.memories || []).map(
      (m: {
        id: string;
        memory: string;
        metadata?: Record<string, unknown>;
      }) => ({
        content: m.memory,
        createdAt: new Date().toISOString(),
        id: m.id,
        metadata: m.metadata,
        projectId: options.projectId,
        scope: (m.metadata?.scope as MemoryScope) || MEMORY_SCOPE_GLOBAL,
      })
    );
  }

  /**
   * Ruft alle Erinnerungen für ein Projekt ab.
   */
  async getProjectMemories(projectId: string): Promise<MemoryEntry[]> {
    return this.search({
      limit: 50,
      projectId,
      query: "",
      scope: MEMORY_SCOPE_PROJECT,
    });
  }

  /**
   * Ruft globale Erinnerungen ab (büroweite Präferenzen).
   */
  async getGlobalMemories(): Promise<MemoryEntry[]> {
    return this.search({
      limit: 50,
      query: "",
      scope: MEMORY_SCOPE_GLOBAL,
    });
  }

  /**
   * Löscht eine Erinnerung.
   */
  async forget(memoryId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/memories/${memoryId}/`, {
      headers: this.getHeaders(),
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(
        `Mem0 forget failed: ${response.status} ${response.statusText}`
      );
    }
  }
}

export function createMem0Service(config: Mem0Config): Mem0Service {
  return new Mem0Service(config);
}
