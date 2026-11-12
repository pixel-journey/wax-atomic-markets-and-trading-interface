# A sale is one asset

**Trust:** `educational-reference`. `src/marketRules.ts` is the v2.0.0 shape. `buyPreview` in `src/sales.ts` builds three unsigned actions for a direct WAX listing. Neither broadcasts.

Official source, opened: [atomicassets/atomicmarket-contract v2.0.0](https://github.com/atomicassets/atomicmarket-contract/releases/tag/v2.0.0).

[pinknetworkx/atomicmarket-contract](https://github.com/pinknetworkx/atomicmarket-contract) `master`, opened the same day, does not contain the one-asset check. Do not teach the bundle ban from that tree.

Collection fees and the live split are [wax-atomic-collection-config-visualizer](https://github.com/pixel-journey/wax-atomic-collection-config-visualizer). AtomicAssets `createoffer`, which still allows several ids, is [wax-atomicassets-v2-action-previews](https://github.com/pixel-journey/wax-atomicassets-v2-action-previews). Those are different actions.

---

## Scene

You announce a sale with two asset ids. The contract stops before it looks at the price. You announce the same asset again. It tells you to `cancelsale`. You try to buy your own sale. It refuses. You try to buy a sale whose AtomicAssets offer was never created. It is not active yet.

```bash
npm test
```

## What is locked

| Call | Refusal | Not checked |
| --- | --- | --- |
| `announcesale` | Not exactly one id. Same seller already listed these assets. Price not greater than zero. | Ownership, symbol pair, marketplace account |
| `createbuyo` | Buyer equals recipient. Not exactly one id. Price not greater than zero. Memo over 256. | The buyer's balance |
| `purchasesale` | Missing sale. Buyer is the seller. `offer_id` is still `-1`. | Delphi median, taker marketplace |

`buyPreview` still refuses a second id and only builds `assertsale`, a `deposit` transfer, and `purchasesale` for an 8-decimal WAX price. It does not build `createbuyo`.

## What this course will not teach

- A broadcast
- That a pre-v2 bundle cancels when touched. The release said that. This file does not walk that branch.
- `atomicdropsx::claimdrop`
