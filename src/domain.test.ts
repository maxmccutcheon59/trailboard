import { describe, expect, it } from "vitest";
import {
  countsByStatus,
  createApplication,
  filterApps,
  moveApplication,
} from "./domain";

describe("domain", () => {
  it("creates applications on wishlist by default", () => {
    const a = createApplication({ company: "Acme", role: "SWE Intern" });
    expect(a.status).toBe("wishlist");
    expect(a.company).toBe("Acme");
  });

  it("moves status and counts columns", () => {
    const a = createApplication({ company: "Acme", role: "SWE Intern" });
    const moved = moveApplication([a], a.id, "applied");
    expect(moved[0].status).toBe("applied");
    expect(countsByStatus(moved).applied).toBe(1);
  });

  it("filters by company or role", () => {
    const apps = [
      createApplication({ company: "CloudCo", role: "Backend Intern" }),
      createApplication({ company: "SecCo", role: "Security Intern" }),
    ];
    expect(filterApps(apps, "cloud")).toHaveLength(1);
    expect(filterApps(apps, "security")).toHaveLength(1);
  });
});
