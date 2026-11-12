/**
 * auctclaimbuy and auctclaimsel from atomicassets/atomicmarket-contract
 * tag v2.0.0 src/atomicmarket.cpp. Not compiled. Not broadcast.
 * require_auth has no custom string. A failed permission is reported as
 * "require_auth". The seller claim calls internal_payout_sale. The fee
 * numbers are not recomputed here.
 */

export type Claim =
  | { ok: false; reason: string }
  | {
      ok: true;
      action: "auctclaimbuy" | "auctclaimsel";
      effect: "dissolve" | "deliver" | "payout";
      row: "erase" | "mark";
      memo: string;
    };

export function previewClaimAuction(input: {
  side: "buyer" | "seller";
  exists: boolean;
  actorIsClaimant: boolean;
  assetsTransferred: boolean;
  hasBid: boolean;
  now: number;
  endTime: number;
  claimedByBuyer: boolean;
  claimedBySeller: boolean;
  assetCount: number;
  auctionId: string;
}): Claim {
  if (!input.exists) return { ok: false, reason: "No auction with this auction_id exists" };
  if (input.side === "seller" && !input.actorIsClaimant) return { ok: false, reason: "require_auth" };
  if (!input.assetsTransferred) return { ok: false, reason: "The auction is not active" };
  if (input.side === "seller" && !(input.endTime < input.now)) {
    return { ok: false, reason: "The auction is not finished yet" };
  }
  if (!input.hasBid) return { ok: false, reason: "The auction does not have any bids" };
  if (input.side === "buyer" && !input.actorIsClaimant) return { ok: false, reason: "require_auth" };
  if (input.side === "buyer" && !(input.endTime < input.now)) {
    return { ok: false, reason: "The auction is not finished yet" };
  }
  if (input.side === "buyer" && input.claimedByBuyer) {
    return { ok: false, reason: "The auction has already been claimed by the buyer" };
  }
  if (input.side === "seller" && input.claimedBySeller) {
    return { ok: false, reason: "The auction has already been claimed by the seller" };
  }
  const bundle = input.assetCount > 1;
  if (input.side === "buyer" && bundle && !input.claimedBySeller) {
    return {
      ok: true,
      action: "auctclaimbuy",
      effect: "dissolve",
      row: "erase",
      memo: `AtomicMarket Dissolved Legacy Bundle Auction - ID # ${input.auctionId}`,
    };
  }
  if (input.side === "seller" && bundle && !input.claimedByBuyer) {
    return {
      ok: true,
      action: "auctclaimsel",
      effect: "dissolve",
      row: "erase",
      memo: `AtomicMarket Dissolved Legacy Bundle Auction - ID # ${input.auctionId}`,
    };
  }
  if (input.side === "buyer") {
    return {
      ok: true,
      action: "auctclaimbuy",
      effect: "deliver",
      row: input.claimedBySeller ? "erase" : "mark",
      memo: `AtomicMarket Won Auction - ID # ${input.auctionId}`,
    };
  }
  return {
    ok: true,
    action: "auctclaimsel",
    effect: "payout",
    row: input.claimedByBuyer ? "erase" : "mark",
    memo: `AtomicMarket Auction Payout - ID #${input.auctionId}`,
  };
}
