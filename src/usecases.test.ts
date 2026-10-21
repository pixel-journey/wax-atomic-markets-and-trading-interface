import { describe, expect, it } from "vitest";
import { USE_CASES, assertUseCases } from "./usecases";

describe("use cases", () => {
  it("keeps requests unsent and actions free of a signatures field", () => {
    assertUseCases();
    expect(USE_CASES.length).toBeGreaterThanOrEqual(2);
    for (const item of USE_CASES) {
      expect(item.request.executed).toBe(false);
      expect(item.request.url.startsWith("https://")).toBe(true);
      if (!item.transaction) continue;
      expect(item.transaction.actions.length).toBeGreaterThan(0);
      expect(JSON.stringify(item.transaction.actions)).not.toContain("signatures");
      for (const action of item.transaction.actions) {
        expect(action.account).toBeTruthy();
        expect(action.name).toBeTruthy();
        expect(Array.isArray(action.authorization)).toBe(true);
      }
    }
  });
});
