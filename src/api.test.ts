import { describe, expect, it } from "vitest";
import { currencyBalance, historyActions } from "./api";

describe("query builders", () => {
  it("locks a Hyperion actions URL and a get_currency_balance body", () => {
    const history = historyActions("https://wax.eosusa.io", "alice", "eosio.token:transfer", 20);
    expect(history.executed).toBe(false);
    expect(history.method).toBe("GET");
    expect(history.url).toBe(
      "https://wax.eosusa.io/v2/history/get_actions?account=alice&filter=eosio.token%3Atransfer&limit=20&sort=desc",
    );
    const balance = currencyBalance("https://wax.greymass.com", "alice");
    expect(balance.executed).toBe(false);
    expect(balance.url).toBe("https://wax.greymass.com/v1/chain/get_currency_balance");
    expect(balance.body).toEqual({ code: "eosio.token", account: "alice", symbol: "WAX" });
  });
});
