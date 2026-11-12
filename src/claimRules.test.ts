import { describe, expect, it } from "vitest";
import { previewClaimAuction } from "./claimRules";

const open = {
  exists: true,
  actorIsClaimant: true,
  assetsTransferred: true,
  hasBid: true,
  now: 200,
  endTime: 100,
  claimedByBuyer: false,
  claimedBySeller: false,
  assetCount: 1,
  auctionId: "7",
};

describe("auction claims", () => {
  it("delivers the asset to the bidder and pays the seller on the other call", () => {
    expect(previewClaimAuction({ ...open, side: "buyer" })).toEqual({
      ok: true,
      action: "auctclaimbuy",
      effect: "deliver",
      row: "mark",
      memo: "AtomicMarket Won Auction - ID # 7",
    });
    expect(previewClaimAuction({ ...open, side: "seller" })).toMatchObject({
      effect: "payout",
      row: "mark",
      memo: "AtomicMarket Auction Payout - ID #7",
    });
  });

  it("erases the row only after the other side has already claimed", () => {
    expect(previewClaimAuction({ ...open, side: "buyer", claimedBySeller: true }).row).toBe("erase");
    expect(previewClaimAuction({ ...open, side: "seller", claimedByBuyer: true }).row).toBe("erase");
  });

  it("refuses an unfinished auction and dissolves an unclaimed bundle", () => {
    expect(previewClaimAuction({ ...open, side: "buyer", now: 100 }).reason).toBe("The auction is not finished yet");
    expect(previewClaimAuction({ ...open, side: "buyer", assetCount: 2 })).toMatchObject({
      effect: "dissolve",
      row: "erase",
      memo: "AtomicMarket Dissolved Legacy Bundle Auction - ID # 7",
    });
    expect(previewClaimAuction({ ...open, side: "seller", hasBid: false }).reason).toBe(
      "The auction does not have any bids",
    );
  });
});
