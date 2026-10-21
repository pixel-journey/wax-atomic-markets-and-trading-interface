import { ATOMIC_ORIGIN, CHAIN_ORIGIN, active, atomicSales, currencyBalance } from "./api";
import { SAMPLE_SALES, buyPreview } from "./sales";
import type { ChainAction, HttpRequest } from "./api";

export type UseCase = {
  title: string;
  detail: string;
  request: HttpRequest;
  transaction: { note: string; actions: ChainAction[] } | null;
};

const sale = SAMPLE_SALES[0];
if (!sale) throw new Error("missing sale");
const preview = buyPreview(sale, "carol");
if (!preview.ok) throw new Error(preview.reason);
const actions: ChainAction[] = preview.actions.map((action) =>
  action.name === "assertsale"
    ? { ...action, authorization: [] }
    : active("carol", action),
);

export const USE_CASES: UseCase[] = [
  {
    title: "Listed WAX sales for the seller",
    detail: "AtomicMarket v1 sales, state 1, symbol WAX. The rows in this repo are fixtures. This URL is the real list shape and it is not requested.",
    request: atomicSales(ATOMIC_ORIGIN, sale.seller),
    transaction: null,
  },
  {
    title: "Unsigned direct-WAX purchase",
    detail: preview.notes.join(" "),
    request: currencyBalance(CHAIN_ORIGIN, "carol"),
    transaction: { note: "Not broadcast. assertsale has an empty authorization list in this preview.", actions },
  },
];

export function assertUseCases(): void {
  if (actions.map((action) => action.name).join(",") !== "assertsale,transfer,purchasesale") {
    throw new Error(actions.map((action) => action.name).join(","));
  }
  const transfer = actions[1];
  if (!transfer || transfer.data.memo !== "deposit" || transfer.data.quantity !== "1.50000000 WAX") {
    throw new Error("deposit transfer mismatch");
  }
  if (actions[0]?.authorization.length !== 0) throw new Error("assertsale auth");
  if (actions[2]?.data.buyer !== "carol") throw new Error("buyer");
}
