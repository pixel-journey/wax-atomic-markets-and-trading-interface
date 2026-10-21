/**
 * Request builders. Nothing here calls fetch, a node, or a wallet.
 * Hosts are public examples. Availability is not a claim of this repo.
 */
export const CHAIN_ORIGIN = "https://wax.greymass.com";
export const HISTORY_ORIGIN = "https://wax.eosusa.io";
export const ATOMIC_ORIGIN = "https://wax.api.atomicassets.io";

const NAME = /^(?!.*\.\.)(?!\.)(?!.*\.$)[a-z1-5.]{1,12}$/;

export type HttpRequest = {
  method: "GET" | "POST";
  url: string;
  body?: Record<string, unknown>;
  executed: false;
};

export type ChainAction = {
  account: string;
  name: string;
  authorization: { actor: string; permission: "active" | "owner" }[];
  data: Record<string, unknown>;
};

function origin(value: string): string {
  if (!/^https:\/\/[a-z0-9.-]+$/i.test(value)) throw new Error("origin must be an https host with no path");
  return value;
}

function account(value: string, label = "account"): string {
  if (!NAME.test(value)) throw new Error(`${label} must be an Antelope name`);
  return value;
}

export function historyActions(host: string, accountName: string, filter: string, limit: number): HttpRequest {
  if (!/^[a-z1-5.]{1,12}:[a-z1-5]{1,13}$/.test(filter)) throw new Error("filter must be contract:action");
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) throw new Error("limit must be an integer from 1 to 100");
  const url = new URL("/v2/history/get_actions", `${origin(host)}/`);
  url.searchParams.set("account", account(accountName));
  url.searchParams.set("filter", filter);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("sort", "desc");
  return { method: "GET", url: url.toString(), executed: false };
}

export function historyTransaction(host: string, id: string): HttpRequest {
  if (!/^[0-9a-fA-F]{64}$/.test(id)) throw new Error("transaction id must be 64 hex characters");
  const url = new URL("/v2/history/get_transaction", `${origin(host)}/`);
  url.searchParams.set("id", id.toLowerCase());
  return { method: "GET", url: url.toString(), executed: false };
}

export function currencyBalance(host: string, accountName: string, code = "eosio.token", symbol = "WAX"): HttpRequest {
  account(code, "token contract");
  if (!/^[A-Z]{1,7}$/.test(symbol)) throw new Error("symbol must be 1 to 7 letters");
  return {
    method: "POST",
    url: `${origin(host)}/v1/chain/get_currency_balance`,
    body: { code, account: account(accountName), symbol },
    executed: false,
  };
}

export function atomicSales(host: string, seller: string): HttpRequest {
  const url = new URL("/atomicmarket/v1/sales", `${origin(host)}/`);
  url.searchParams.set("seller", account(seller, "seller"));
  url.searchParams.set("state", "1");
  url.searchParams.set("symbol", "WAX");
  url.searchParams.set("page", "1");
  url.searchParams.set("limit", "20");
  url.searchParams.set("order", "desc");
  return { method: "GET", url: url.toString(), executed: false };
}

export function atomicAssets(host: string, owner: string, collection: string): HttpRequest {
  const url = new URL("/atomicassets/v1/assets", `${origin(host)}/`);
  url.searchParams.set("owner", account(owner, "owner"));
  url.searchParams.set("collection_name", account(collection, "collection"));
  url.searchParams.set("page", "1");
  url.searchParams.set("limit", "20");
  return { method: "GET", url: url.toString(), executed: false };
}

export function active(actor: string, action: { account: string; name: string; data: Record<string, unknown> }): ChainAction {
  return { ...action, authorization: [{ actor: account(actor, "actor"), permission: "active" }] };
}
