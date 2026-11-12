import { describe, expect, it } from "vitest";
import { previewAnnounceAuction, previewAuctionBid, previewCancelAuction } from "./auctionRules";

const announce = {
  assetCount: 1,
  sellerAlreadyListed: false,
  startingBid: 10,
  duration: 3600,
  minimumDuration: 60,
  maximumDuration: 86400,
};

const bid = {
  exists: true,
  assetCount: 1,
  claimedBySeller: false,
  claimedByBuyer: false,
  bidder: "bob",
  seller: "alice",
  assetsTransferred: true,
  now: 100,
  endTime: 200,
  bidSymbol: "WAX",
  auctionSymbol: "WAX",
  bidAmount: 10,
  currentBid: 10,
  hasBidder: false,
  minimumIncrease: 0.1,
};

describe("auctions", () => {
  it("announces one asset inside the duration window", () => {
    expect(previewAnnounceAuction(announce)).toEqual({ ok: true, action: "announceauct" });
    expect(previewAnnounceAuction({ ...announce, assetCount: 2 }).reason).toContain("one auction per asset");
    expect(previewAnnounceAuction({ ...announce, duration: 10 }).reason).toContain("shorter than the minimum");
    expect(previewAnnounceAuction({ ...announce, sellerAlreadyListed: true }).reason).toContain("cancelauct");
  });

  it("takes a first bid at the floor and a later bid only after the configured raise", () => {
    expect(previewAuctionBid(bid)).toEqual({ ok: true, action: "auctionbid" });
    expect(previewAuctionBid({ ...bid, bidAmount: 9 }).reason).toBe("The bid must be at least as high as the minimum bid");
    expect(previewAuctionBid({ ...bid, hasBidder: true, currentBid: 100, bidAmount: 109 }).reason).toContain("minimum bid increase");
    expect(previewAuctionBid({ ...bid, hasBidder: true, currentBid: 100, bidAmount: 111 }).ok).toBe(true);
  });

  it("dissolves a legacy bundle bid and refuses a cancel after a real bid", () => {
    expect(previewAuctionBid({ ...bid, assetCount: 2 })).toEqual({ ok: true, action: "dissolve" });
    expect(previewAuctionBid({ ...bid, assetCount: 2, claimedByBuyer: true }).reason).toContain("claim actions");
    expect(previewCancelAuction({
      exists: true, assetCount: 1, assetsTransferred: true, hasBid: true, actorIsSeller: true,
    }).reason).toBe("This auction already has a bid. Auctions with bids can't be cancelled");
    expect(previewCancelAuction({
      exists: true, assetCount: 2, assetsTransferred: true, hasBid: true, actorIsSeller: false,
    })).toEqual({ ok: true, action: "cancelauct" });
  });
});
