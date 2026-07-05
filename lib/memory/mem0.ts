// ─── Mem0 Memory Service — Projekt + Global Scope ────────────────────────────
// Mem0 kombiniert Vektorsuche, Knowledge-Graph und Key-Value-Caching.
// Drei Scopes: user-level (Präferenzen), session-level (Aufgabe), agent-level (Fachwissen)

export const MEMORY_SCOPE_PROJECT = "project";
export const MEMORY_SCOPE_GLOBAL = "global";

export type MemoryScope = typeof MEMORY_SCOPE_PROJECT | typeof MEMORY_SCOPE_GLOBAL;

export interface Mem0Config {
  apiKey: string;
  userId: string;
  agentId?: string;
  baseUrl?: string;
}

export interface MemoryEntry {
  id: string;
  content: string;
  scope: MemoryScope;
  projectId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface SearchOptions {
  query: string;
  scope?: MemoryScope;
  projectId?: string;
  limit?: number;
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
      "Content-Type": "application/json",
      Authorization: `Token ${this.config.apiKey}`,
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
      messages: [{ role: "user", content }],
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
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Mem0 remember failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return {
      id: result.id || crypto.randomUUID(),
      content,
      scope,
      projectId,
      metadata,
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Sucht in Erinnerungen. Kann projekt-scope oder global-scope durchsuchen.
   */
  async search(options: SearchOptions): Promise<MemoryEntry[]> {
    const body: Record<string, unknown> = {
      query: options.query,
      user_id: this.config.userId,
      limit: options.limit || 10,
    };

    if (options.scope === MEMORY_SCOPE_PROJECT && options.projectId) {
      body.project_id = options.projectId;
    }

    if (this.config.agentId) {
      body.agent_id = this.config.agentId;
    }

    const response = await fetch(`${this.baseUrl}/search/`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Mem0 search failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return (result.memories || []).map(
      (m: { id: string; memory: string; metadata?: Record<string, unknown> }) => ({
        id: m.id,
        content: m.memory,
        scope: (m.metadata?.scope as MemoryScope) || MEMORY_SCOPE_GLOBAL,
        projectId: options.projectId,
        metadata: m.metadata,
        createdAt: new Date().toISOString(),
      })
    );
  }

  /**
   * Ruft alle Erinnerungen für ein Projekt ab.
   */
  async getProjectMemories(projectId: string): Promise<MemoryEntry[]> {
    return this.search({
      query: "",
      scope: MEMORY_SCOPE_PROJECT,
      projectId,
      limit: 50,
    });
  }

  /**
   * Ruft globale Erinnerungen ab (büroweite Präferenzen).
   */
  async getGlobalMemories(): Promise<MemoryEntry[]> {
    return this.search({
      query: "",
      scope: MEMORY_SCOPE_GLOBAL,
      limit: 50,
    });
  }

  /**
   * Löscht eine Erinnerung.
   */
  async forget(memoryId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/memories/${memoryId}/`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Mem0 forget failed: ${response.status} ${response.statusText}`);
    }
  }
}

export function createMem0Service(config: Mem0Config): Mem0Service {
  return new Mem0Service(config);
}
