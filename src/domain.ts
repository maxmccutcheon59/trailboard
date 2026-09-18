export type Status =
  | "wishlist"
  | "applied"
  | "oa"
  | "phone"
  | "onsite"
  | "offer"
  | "rejected"
  | "withdrawn";

export type Application = {
  id: string;
  company: string;
  role: string;
  url: string;
  status: Status;
  notes: string;
  followUp: string; // YYYY-MM-DD or ""
  updatedAt: number;
  createdAt: number;
};

export const COLUMNS: { id: Status; label: string }[] = [
  { id: "wishlist", label: "Wishlist" },
  { id: "applied", label: "Applied" },
  { id: "oa", label: "OA" },
  { id: "phone", label: "Phone" },
  { id: "onsite", label: "Onsite" },
  { id: "offer", label: "Offer" },
];

export const ARCHIVE: Status[] = ["rejected", "withdrawn"];

export function createApplication(
  partial: Pick<Application, "company" | "role"> &
    Partial<Omit<Application, "id" | "createdAt" | "updatedAt" | "company" | "role">>,
): Application {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    company: partial.company.trim(),
    role: partial.role.trim(),
    url: partial.url?.trim() ?? "",
    status: partial.status ?? "wishlist",
    notes: partial.notes?.trim() ?? "",
    followUp: partial.followUp ?? "",
    createdAt: now,
    updatedAt: now,
  };
}

export function moveApplication(
  apps: Application[],
  id: string,
  status: Status,
): Application[] {
  return apps.map((a) =>
    a.id === id ? { ...a, status, updatedAt: Date.now() } : a,
  );
}

export function countsByStatus(apps: Application[]): Record<Status, number> {
  const base: Record<Status, number> = {
    wishlist: 0,
    applied: 0,
    oa: 0,
    phone: 0,
    onsite: 0,
    offer: 0,
    rejected: 0,
    withdrawn: 0,
  };
  for (const a of apps) base[a.status] += 1;
  return base;
}

export function filterApps(
  apps: Application[],
  query: string,
): Application[] {
  const q = query.trim().toLowerCase();
  if (!q) return apps;
  return apps.filter(
    (a) =>
      a.company.toLowerCase().includes(q) ||
      a.role.toLowerCase().includes(q) ||
      a.notes.toLowerCase().includes(q),
  );
}
