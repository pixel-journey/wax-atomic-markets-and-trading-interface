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

## Auctions

`previewAnnounceAuction` is the same one-asset rule, with the auction sentence (`one auction per asset`). A second announcement of the same asset names `cancelauct`. The starting bid must be greater than zero. The duration must sit inside the config minimum and maximum. Those two numbers are inputs. This file does not know the chain's current config.

`previewAuctionBid` refuses your own auction, an auction whose asset has not been transferred to `atomicmarket` yet, a finished auction, a different symbol, a first bid under the floor, and a later bid under `current * (1 + minimumIncrease)`. That comparison is the contract's `double` multiply, so a raise that looks exact on paper can still fall short. A legacy row with more than one asset does not take the bid. It returns `action: "dissolve"`. If either side has already claimed, the string says to use the claim actions. No balance is refunded here.

`previewCancelAuction` refuses a one-asset auction that already has a bid. A legacy bundle is invalid, so a non-seller may cancel it.

## Claims

`previewClaimAuction` is `auctclaimbuy` and `auctclaimsel`. The auction is finished only when `endTime < now`. The same second is not finished. A buyer claim before the end sees that string. A seller claim checks the end before it checks for a bid.

The buyer receives the asset with memo `AtomicMarket Won Auction - ID # 7` (space before the number). The seller call does not move the asset. It calls `internal_payout_sale` and the memo is `AtomicMarket Auction Payout - ID #7` (no space). The cuts are `previewPayout` and `previewRoyalty` in [wax-atomic-collection-config-visualizer](https://github.com/pixel-journey/wax-atomic-collection-config-visualizer): maker, taker, live collection fee, then matching bonus fees, each truncated. The collection cut is then split by founder, template, and already-matched attribute weights. Dust stays with the author. The seller must be left more than zero. This claim preview still does not run that arithmetic.

The first claim marks the row. The second erases it. A legacy bundle that neither side has claimed is dissolved instead: the memo is `AtomicMarket Dissolved Legacy Bundle Auction - ID # 7`, and the row is erased. No balance is moved by this preview.

`require_auth` has no custom string. A seller who is not the seller fails with `require_auth` before "not active". A buyer who is not the bidder still sees "not active" or "no bids" first, because those checks come before the permission.

## What this course will not teach

- A broadcast. The claim preview names the memo and whether the row is marked or erased. It does not transfer the asset or pay the seller.
- `atomicdropsx::claimdrop`
