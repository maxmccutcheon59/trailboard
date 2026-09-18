import type { Application } from "./domain";

const KEY = "trailboard.v1";

type Store = {
  version: 1;
  apps: Application[];
};

export function loadApps(): Application[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seedIfEmpty();
    const parsed = JSON.parse(raw) as Store;
    if (parsed.version !== 1 || !Array.isArray(parsed.apps)) return seedIfEmpty();
    return parsed.apps;
  } catch {
    return seedIfEmpty();
  }
}

export function saveApps(apps: Application[]): void {
  const store: Store = { version: 1, apps };
  localStorage.setItem(KEY, JSON.stringify(store));
}

export function exportJson(apps: Application[]): string {
  return JSON.stringify({ version: 1, apps, exportedAt: new Date().toISOString() }, null, 2);
}

export function importJson(text: string): Application[] {
  const parsed = JSON.parse(text) as { apps?: Application[] };
  if (!Array.isArray(parsed.apps)) throw new Error("Invalid Trailboard JSON");
  return parsed.apps;
}

function seedIfEmpty(): Application[] {
  // Empty by default — demo seed only when explicitly requested
  return [];
}
