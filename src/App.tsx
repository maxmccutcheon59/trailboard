import { useEffect, useMemo, useState } from "react";
import {
  ARCHIVE,
  COLUMNS,
  createApplication,
  countsByStatus,
  filterApps,
  moveApplication,
  type Application,
  type Status,
} from "./domain";
import { exportJson, importJson, loadApps, saveApps } from "./storage";
import "./App.css";

const DEMO: Omit<ReturnType<typeof createApplication>, "id" | "createdAt" | "updatedAt">[] = [
  {
    company: "Example Cloud",
    role: "Software Engineering Intern",
    url: "https://example.com/careers",
    status: "applied",
    notes: "Replace with real apps — this is sample data.",
    followUp: "",
  },
  {
    company: "Systems Co",
    role: "Infrastructure Intern",
    url: "",
    status: "wishlist",
    notes: "Spindle-fit role",
    followUp: "",
  },
];

export default function App() {
  const [apps, setApps] = useState<Application[]>(() => loadApps());
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState({ company: "", role: "", url: "" });
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    saveApps(apps);
  }, [apps]);

  const visible = useMemo(() => filterApps(apps, query), [apps, query]);
  const counts = useMemo(() => countsByStatus(apps), [apps]);
  const selectedApp = apps.find((a) => a.id === selected) ?? null;

  function addApp(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.company.trim() || !draft.role.trim()) return;
    const app = createApplication(draft);
    setApps((prev) => [app, ...prev]);
    setDraft({ company: "", role: "", url: "" });
    setSelected(app.id);
  }

  function updateSelected(patch: Partial<Application>) {
    if (!selected) return;
    setApps((prev) =>
      prev.map((a) =>
        a.id === selected ? { ...a, ...patch, updatedAt: Date.now() } : a,
      ),
    );
  }

  function removeSelected() {
    if (!selected) return;
    setApps((prev) => prev.filter((a) => a.id !== selected));
    setSelected(null);
  }

  function onExport() {
    const blob = new Blob([exportJson(apps)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trailboard-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function onImport(file: File) {
    file.text().then((text) => {
      try {
        const next = importJson(text);
        setApps(next);
        setSelected(null);
      } catch {
        alert("Could not import that JSON file.");
      }
    });
  }

  function loadDemo() {
    if (apps.length && !confirm("Replace current board with demo cards?")) return;
    setApps(DEMO.map((d) => createApplication(d)));
  }

  return (
    <div className="shell">
      <header className="top">
        <div>
          <p className="brand">Trailboard</p>
          <p className="tag">Internship pipeline · local-first · by Max McCutcheon</p>
        </div>
        <div className="top-actions">
          <button type="button" className="ghost" onClick={loadDemo}>
            Demo data
          </button>
          <button type="button" className="ghost" onClick={onExport}>
            Export JSON
          </button>
          <label className="ghost file">
            Import
            <input
              type="file"
              accept="application/json,.json"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onImport(f);
                e.target.value = "";
              }}
            />
          </label>
        </div>
      </header>

      <section className="stats">
        {COLUMNS.map((c) => (
          <div key={c.id} className="stat">
            <span>{c.label}</span>
            <strong>{counts[c.id]}</strong>
          </div>
        ))}
        <div className="stat muted">
          <span>Closed</span>
          <strong>{counts.rejected + counts.withdrawn}</strong>
        </div>
      </section>

      <form className="composer" onSubmit={addApp}>
        <input
          placeholder="Company"
          value={draft.company}
          onChange={(e) => setDraft((d) => ({ ...d, company: e.target.value }))}
          required
        />
        <input
          placeholder="Role"
          value={draft.role}
          onChange={(e) => setDraft((d) => ({ ...d, role: e.target.value }))}
          required
        />
        <input
          placeholder="Posting URL (optional)"
          value={draft.url}
          onChange={(e) => setDraft((d) => ({ ...d, url: e.target.value }))}
        />
        <button type="submit">Add</button>
      </form>

      <div className="toolbar">
        <input
          className="search"
          placeholder="Search company, role, notes…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <a
          className="link"
          href="https://github.com/maxmccutcheon59/trailboard"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </div>

      <div className="board">
        {COLUMNS.map((col) => (
          <section key={col.id} className="column">
            <h2>
              {col.label} <span>{visible.filter((a) => a.status === col.id).length}</span>
            </h2>
            <div className="cards">
              {visible
                .filter((a) => a.status === col.id)
                .map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    className={`card ${selected === a.id ? "active" : ""}`}
                    onClick={() => setSelected(a.id)}
                  >
                    <strong>{a.company}</strong>
                    <span>{a.role}</span>
                    {a.followUp ? <em>Follow-up {a.followUp}</em> : null}
                  </button>
                ))}
            </div>
          </section>
        ))}
      </div>

      {selectedApp ? (
        <aside className="drawer">
          <div className="drawer-head">
            <h3>Edit application</h3>
            <button type="button" className="ghost" onClick={() => setSelected(null)}>
              Close
            </button>
          </div>
          <label>
            Company
            <input
              value={selectedApp.company}
              onChange={(e) => updateSelected({ company: e.target.value })}
            />
          </label>
          <label>
            Role
            <input
              value={selectedApp.role}
              onChange={(e) => updateSelected({ role: e.target.value })}
            />
          </label>
          <label>
            URL
            <input
              value={selectedApp.url}
              onChange={(e) => updateSelected({ url: e.target.value })}
            />
          </label>
          <label>
            Status
            <select
              value={selectedApp.status}
              onChange={(e) =>
                setApps((prev) =>
                  moveApplication(prev, selectedApp.id, e.target.value as Status),
                )
              }
            >
              {[...COLUMNS.map((c) => c.id), ...ARCHIVE].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label>
            Follow-up date
            <input
              type="date"
              value={selectedApp.followUp}
              onChange={(e) => updateSelected({ followUp: e.target.value })}
            />
          </label>
          <label>
            Notes
            <textarea
              rows={5}
              value={selectedApp.notes}
              onChange={(e) => updateSelected({ notes: e.target.value })}
            />
          </label>
          <div className="drawer-actions">
            {selectedApp.url ? (
              <a className="primary" href={selectedApp.url} target="_blank" rel="noreferrer">
                Open posting
              </a>
            ) : null}
            <button type="button" className="danger" onClick={removeSelected}>
              Delete
            </button>
          </div>
        </aside>
      ) : null}

      <footer className="foot">
        Data stays in this browser · MIT © Max McCutcheon ·{" "}
        <a href="mailto:maxmccutcheon59@gmail.com">maxmccutcheon59@gmail.com</a>
      </footer>
    </div>
  );
}
