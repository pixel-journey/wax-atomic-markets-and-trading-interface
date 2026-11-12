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
- More than one asset id. AtomicMarket v2 listings are single-asset. Fixture sale `42` (`1001` and `1002`) is a v1 bundle and `buyPreview` refuses it for any buyer who is not already refused as a self-buy. Legacy bundle rows cancel when touched; this preview does not build that cancel.
- A price that is not 8-decimal WAX. A USD fixture is there so the refusal is visible. Delphi pairs are not guessed.
- Names that are not Antelope account shaped.
- A sale id or asset id run through `Number`.

## AtomicMarket v2 (2026-08-03)

Opened in [atomicassets/atomicmarket-contract v2.0.0](https://github.com/atomicassets/atomicmarket-contract/tree/v2.0.0) `src/atomicmarket.cpp`. Not compiled. The course is [EDUCATION.md](./EDUCATION.md). `previewAnnounceSale`, `previewCreateBuyOffer`, and `previewPurchaseSale` lock the strings from that file.

- A sale and a buy offer must contain exactly one asset id. The message says to create one sale, or one buy offer, per asset inside a single transaction.
- [pinknetworkx/atomicmarket-contract](https://github.com/pinknetworkx/atomicmarket-contract) `master` does not contain that check. Do not copy the bundle ban from it.
- The collection fee is read live at settlement. The split is computed in [wax-atomic-collection-config-visualizer](https://github.com/pixel-journey/wax-atomic-collection-config-visualizer). This preview does not recompute it.
- AtomicAssets `createoffer` still allows several ids. That is [wax-atomicassets-v2-action-previews](https://github.com/pixel-journey/wax-atomicassets-v2-action-previews). `createbuyo` is not that action.

`buyPreview` is still the unsigned three-action WAX purchase. It is not `createbuyo`.

## What is actually in the repo

| Piece | Role |
| --- | --- |
| `src/sales.ts` | `visibleSales`, `buyPreview`, fixtures |
| `src/sales.test.ts` | Order, string id, refusals |
| `src/Demo.tsx` | Filter plus the unsigned action list |

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


## Queries and unsigned transactions

`src/api.ts` builds the HTTP requests. `src/usecases.ts` is the worked case for this repo: those requests, and the unsigned transaction when the feature actually has an action. `executed` is false. Nothing is sent.

The engines used to sit in `examples/`. GitHub treats that directory as documentation, so the language bar showed the stylesheet and almost none of the TypeScript.

## Run

```bash
npm install
npm test
npm run dev
```
