# A sale row, and a purchase that is not sent

**Trust label:** `educational-reference`  
**Catalog:** [wax-ecosystem-blueprint-catalog](https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog)

AtomicMarket listings are rows: a sale id, a seller, asset ids, a price string, a state. This repo filters fixture rows and, for one narrow case, writes the three actions a direct WAX buy is documented to use.

Those actions are not broadcast. Sale ids stay strings. `9007199254740993` is larger than a safe JavaScript integer and is still the same text in `purchasesale`.

## What the preview will build

Only when the row is `listed`, the buyer is a different Antelope-shaped name, every asset id is a decimal string, and the price matches `digits.8digits WAX`:

1. `atomicmarket::assertsale` pins the sale id, the asset ids, the price text, and `8,WAX`.
2. `eosio.token::transfer` to `atomicmarket` with memo `deposit` and the same price text.
3. `atomicmarket::purchasesale` with `intended_delphi_median` `"0"` and the taker marketplace, which may be empty.

`purchasesale` is last. Public client notes say it spends the deposited balance and removes the sale the assertion read. This repo did not submit the triple to a node.

## What it refuses

- Sold, cancelled, or unknown.
- Buyer equals seller.
- A price that is not 8-decimal WAX. A USD fixture is there so the refusal is visible. Delphi pairs are not guessed.
- Names that are not Antelope account shaped.
- A sale id or asset id run through `Number`.

## What is actually in the repo

| Piece | Role |
| --- | --- |
| `examples/sales.ts` | `visibleSales`, `buyPreview`, fixtures |
| `examples/sales.test.ts` | Order, string id, refusals |
| `examples/Demo.tsx` | Filter plus the unsigned action list |

## Edge cases

- Listed rows sort by WAX integer units. A non-WAX price sorts after those, still visible, still not buyable.
- Empty taker marketplace is allowed. The contract docs say that selects a default marketplace. It does not mean the purchase has no fee.
- `assertsale` is described in public docs as having no required authorization. The buyer still has to authorize the transfer and `purchasesale`. Confirm the assertion's auth on the ABI you ship against.

## Best practice and the opposite

**Do** show the price string you will assert, not a reformatted number.

**Do not** render "buy" as success. The first note is "Not broadcast."

**Do not** set `intended_delphi_median` to 0 for a sale whose listing symbol and settlement symbol differ. This function refuses that case instead.

## Antelope notes

The action names are WAX AtomicMarket (`atomicmarket`) as documented by the contract wiki and by `@atomichub/atomicmarket`'s purchase triple. Another chain's NFT market will not share them. Wax token precision here is 8 because the preview only accepts that. This pass did not query `atomicmarket` tables.

## Related

- [wax-drops-and-pack-opening-experience](https://github.com/pixel-journey/wax-drops-and-pack-opening-experience) — a different Atomic purchase shape
- [wax-fifo-cost-basis-calculator](https://github.com/pixel-journey/wax-fifo-cost-basis-calculator) — what a filled sale might mean later, still not tax advice

## Run

```bash
npm install
npm test
npm run dev
```
