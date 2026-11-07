/**
 * Fixture sale rows and an unsigned direct-WAX purchase preview.
 * AtomicMarket v2: one asset per listing. A second asset id is refused.
 * Action names follow public AtomicMarket docs. This file does not broadcast.
 */

const NAME = /^(?!.*\.\.)(?!\.)(?!.*\.$)[a-z1-5.]{1,12}$/;
const UINT = /^[1-9][0-9]{0,19}$/;
const WAX_PRICE = /^(\d+)\.(\d{8}) WAX$/;

export type SaleState = "listed" | "sold" | "cancelled" | "unknown";

export type SaleRow = {
  saleId: string;
  seller: string;
  assetIds: string[];
  /** Copied into the preview. Not parsed with Number. */
  listingPrice: string;
  state: SaleState;
};

export type ActionData = Record<string, string | string[]>;

export type PreviewAction = {
  account: string;
  name: string;
  data: ActionData;
};

export type BuyPreview =
  | { ok: false; reason: string }
  | { ok: true; actions: PreviewAction[]; notes: string[] };

export function assertAccount(value: string, label: string): void {
  if (!NAME.test(value)) throw new Error(`${label} must be an Antelope name`);
}

export function waxUnits(listingPrice: string): bigint | null {
  const match = WAX_PRICE.exec(listingPrice);
  if (!match) return null;
  return BigInt(match[1] ?? "0") * 100_000_000n + BigInt(match[2] ?? "0");
}

export function visibleSales(sales: readonly SaleRow[], state: SaleState | "any"): SaleRow[] {
  const rows = state === "any" ? [...sales] : sales.filter((sale) => sale.state === state);
  return rows.sort((left, right) => {
    const a = waxUnits(left.listingPrice);
    const b = waxUnits(right.listingPrice);
    if (a === null && b === null) return left.saleId.localeCompare(right.saleId);
    if (a === null) return 1;
    if (b === null) return -1;
    if (a < b) return -1;
    if (a > b) return 1;
    return left.saleId.localeCompare(right.saleId);
  });
}

export function buyPreview(sale: SaleRow, buyer: string, takerMarketplace = ""): BuyPreview {
  try {
    assertAccount(buyer, "buyer");
    assertAccount(sale.seller, "seller");
    if (takerMarketplace !== "") assertAccount(takerMarketplace, "taker marketplace");
  } catch (err) {
    return { ok: false, reason: err instanceof Error ? err.message : "bad name" };
  }
  if (!UINT.test(sale.saleId)) return { ok: false, reason: "sale id must be a decimal string, not a number" };
  if (sale.state !== "listed") return { ok: false, reason: `sale is ${sale.state}. Only a listed sale can be previewed.` };
  if (buyer === sale.seller) return { ok: false, reason: "buyer and seller are the same account" };
  if (sale.assetIds.length !== 1 || sale.assetIds.some((id) => !UINT.test(id))) {
    return {
      ok: false,
      reason:
        "AtomicMarket v2 lists exactly one asset. A second id is a v1 bundle and is not previewed. Asset ids must be decimal strings.",
    };
  }
  if (!WAX_PRICE.test(sale.listingPrice)) {
    return {
      ok: false,
      reason: "This preview only covers a direct 8-decimal WAX listing. Other tokens and Delphi pairs are not guessed.",
    };
  }

  const notes = [
    "Not broadcast.",
    "purchasesale spends an atomicmarket balance. The transfer memo must be the word deposit, and that action must come before purchasesale.",
    "intended_delphi_median is 0 only because this is a direct WAX listing. A priced pair is refused above.",
    "assertsale pins the asset ids and the listing price text. Public docs say it has no required auth. Confirm that before you depend on it.",
    "An empty taker marketplace uses the contract default. It does not mean there is no fee.",
  ];

  return {
    ok: true,
    notes,
    actions: [
      {
        account: "atomicmarket",
        name: "assertsale",
        data: {
          sale_id: sale.saleId,
          asset_ids_to_assert: [...sale.assetIds],
          listing_price_to_assert: sale.listingPrice,
          settlement_symbol_to_assert: "8,WAX",
        },
      },
      {
        account: "eosio.token",
        name: "transfer",
        data: {
          from: buyer,
          to: "atomicmarket",
          quantity: sale.listingPrice,
          memo: "deposit",
        },
      },
      {
        account: "atomicmarket",
        name: "purchasesale",
        data: {
          buyer,
          sale_id: sale.saleId,
          intended_delphi_median: "0",
          taker_marketplace: takerMarketplace,
        },
      },
    ],
  };
}

export const SAMPLE_SALES: SaleRow[] = [
  {
    saleId: "9007199254740993",
    seller: "alice",
    assetIds: ["1099511627777"],
    listingPrice: "1.50000000 WAX",
    state: "listed",
  },
  {
    saleId: "42",
    seller: "bob.wam",
    assetIds: ["1001", "1002"],
    listingPrice: "0.25000000 WAX",
    state: "listed",
  },
  {
    saleId: "7",
    seller: "alice",
    assetIds: ["1003"],
    listingPrice: "2.00000000 WAX",
    state: "sold",
  },
  {
    saleId: "8",
    seller: "carol",
    assetIds: ["1004"],
    listingPrice: "3.00000000 USD",
    state: "listed",
  },
];
