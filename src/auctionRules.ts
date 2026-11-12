/**
 * Auction shape from atomicassets/atomicmarket-contract tag v2.0.0
 * src/atomicmarket.cpp (announceauct, auctionbid, cancelauct).
 * Not compiled. Not broadcast. No balance is moved.
 *
 * minimumIncrease is the config fraction. The contract compares with double.
 * This preview uses the same multiplication and does not round.
 */

export const ONE_AUCTION =
  "asset_ids must contain exactly one asset id. Bundle listings are not supported - " +
  "create one auction per asset (multiple auctions can be created within a single transaction)";

export type AuctionShape =
  | { ok: false; reason: string }
  | { ok: true; action: "announceauct" | "auctionbid" | "cancelauct" | "dissolve" };

export function previewAnnounceAuction(input: {
  assetCount: number;
  sellerAlreadyListed: boolean;
  startingBid: number;
  duration: number;
  minimumDuration: number;
  maximumDuration: number;
}): AuctionShape {
  if (input.assetCount !== 1) return { ok: false, reason: ONE_AUCTION };
  if (input.sellerAlreadyListed) {
    return {
      ok: false,
      reason:
        "You have already announced an auction for these assets. You can cancel an auction using the cancelauct action.",
    };
  }
  if (input.startingBid <= 0) return { ok: false, reason: "The starting bid must be greater than zero" };
  if (input.duration < input.minimumDuration) {
    return { ok: false, reason: "The specified duration is shorter than the minimum auction duration" };
  }
  if (input.duration > input.maximumDuration) {
    return { ok: false, reason: "The specified duration is longer than the maximum auction duration" };
  }
  return { ok: true, action: "announceauct" };
}

export function previewAuctionBid(input: {
  exists: boolean;
  assetCount: number;
  claimedBySeller: boolean;
  claimedByBuyer: boolean;
  bidder: string;
  seller: string;
  assetsTransferred: boolean;
  now: number;
  endTime: number;
  bidSymbol: string;
  auctionSymbol: string;
  bidAmount: number;
  currentBid: number;
  hasBidder: boolean;
  minimumIncrease: number;
}): AuctionShape {
  if (!input.exists) return { ok: false, reason: "No auction with this auction_id exists" };
  if (input.assetCount > 1) {
    if (input.claimedBySeller || input.claimedByBuyer) {
      return {
        ok: false,
        reason: "Partially claimed legacy bundle auctions have to be wrapped up using the claim actions",
      };
    }
    return { ok: true, action: "dissolve" };
  }
  if (input.bidder === input.seller) return { ok: false, reason: "You can't bid on your own auction" };
  if (!input.assetsTransferred) {
    return {
      ok: false,
      reason: "The auction is not yet active. The seller first needs to transfer the asset to the atomicmarket account",
    };
  }
  if (!(input.now < input.endTime)) return { ok: false, reason: "The auction is already finished" };
  if (input.bidSymbol !== input.auctionSymbol) {
    return { ok: false, reason: "The bid uses a different symbol than the current auction bid" };
  }
  if (!input.hasBidder) {
    if (input.bidAmount < input.currentBid) {
      return { ok: false, reason: "The bid must be at least as high as the minimum bid" };
    }
  } else if (input.bidAmount < input.currentBid * (1 + input.minimumIncrease)) {
    return {
      ok: false,
      reason: "The relative increase is less than the minimum bid increase specified in the config",
    };
  }
  return { ok: true, action: "auctionbid" };
}

export function previewCancelAuction(input: {
  exists: boolean;
  assetCount: number;
  assetsTransferred: boolean;
  hasBid: boolean;
  actorIsSeller: boolean;
}): AuctionShape {
  if (!input.exists) return { ok: false, reason: "No auction with this auction_id exists" };
  const invalid = input.assetCount > 1;
  if (input.assetsTransferred && input.hasBid && !invalid) {
    return { ok: false, reason: "This auction already has a bid. Auctions with bids can't be cancelled" };
  }
  if (!invalid && !input.actorIsSeller) {
    return {
      ok: false,
      reason: "The auction is not invalid, therefore the authorization of the seller is needed to cancel it",
    };
  }
  return { ok: true, action: "cancelauct" };
}
