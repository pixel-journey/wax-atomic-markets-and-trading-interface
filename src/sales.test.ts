import { describe, expect, it } from "vitest";
import { SAMPLE_SALES, buyPreview, visibleSales } from "./sales";

const big = SAMPLE_SALES[0]!;
const cheap = SAMPLE_SALES[1]!;
const sold = SAMPLE_SALES[2]!;
const usd = SAMPLE_SALES[3]!;

describe("visibleSales", () => {
  it("sorts listed WAX sales by integer units and leaves other prices in the list only when asked", () => {
    const listed = visibleSales(SAMPLE_SALES, "listed");
    expect(listed.map((sale) => sale.saleId)).toEqual(["42", "9007199254740993", "8"]);
  });
});

describe("buyPreview", () => {
  it("keeps a large sale id as a string and deposits the price text", () => {
    const preview = buyPreview(big, "buyeracct");
    expect(preview.ok).toBe(true);
    if (!preview.ok) throw new Error("expected ok");
    expect(preview.actions.map((action) => action.name)).toEqual(["assertsale", "transfer", "purchasesale"]);
    expect(preview.actions[2]?.data.sale_id).toBe("9007199254740993");
    expect(typeof preview.actions[2]?.data.sale_id).toBe("string");
    expect(preview.actions[1]?.data.quantity).toBe("1.50000000 WAX");
    expect(preview.actions[1]?.data.memo).toBe("deposit");
    expect(preview.actions[2]?.data.intended_delphi_median).toBe("0");
    expect(preview.notes[0]).toBe("Not broadcast.");
  });

  it("refuses a v1 bundle listing", () => {
    const bundle = buyPreview(cheap, "buyeracct");
    expect(bundle.ok).toBe(false);
    if (!bundle.ok) expect(bundle.reason).toMatch(/exactly one asset/);
  });

  it("refuses a sold sale, a self-buy, a non-WAX price, and a bad name", () => {
    expect(buyPreview(sold, "buyeracct").ok).toBe(false);
    expect(buyPreview(cheap, "bob.wam").ok).toBe(false);
    const foreign = buyPreview(usd, "buyeracct");
    expect(foreign.ok).toBe(false);
    if (!foreign.ok) expect(foreign.reason).toMatch(/not guessed/);
    expect(buyPreview(big, "Not_A_Name").ok).toBe(false);
  });
});
