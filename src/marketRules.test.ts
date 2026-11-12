import { describe, expect, it } from "vitest";
import { previewAnnounceSale, previewCreateBuyOffer, previewPurchaseSale } from "./marketRules";

describe("atomicmarket v2.0.0 shape", () => {
  it("lists one asset and refuses a second, a duplicate, and a zero price", () => {
    expect(previewAnnounceSale({ assetCount: 1, priceAmount: 100, sellerAlreadyListedThisAsset: false })).toEqual({
      ok: true,
      action: "announcesale",
    });
    expect(previewAnnounceSale({ assetCount: 2, priceAmount: 100, sellerAlreadyListedThisAsset: false }).ok).toBe(false);
    expect(previewAnnounceSale({ assetCount: 1, priceAmount: 100, sellerAlreadyListedThisAsset: true }).reason)
      .toContain("cancelsale");
    expect(previewAnnounceSale({ assetCount: 1, priceAmount: 0, sellerAlreadyListedThisAsset: false }).reason)
      .toBe("The sale price must be greater than zero");
  });

  it("builds one buy offer and refuses a self-offer, a bundle, and a long memo", () => {
    expect(previewCreateBuyOffer({
      buyer: "alice", recipient: "bob", assetCount: 1, priceAmount: 5, memo: "x",
    })).toEqual({ ok: true, action: "createbuyo" });
    expect(previewCreateBuyOffer({
      buyer: "alice", recipient: "alice", assetCount: 1, priceAmount: 5, memo: "",
    }).reason).toBe("buyer and recipient can't be the same account");
    expect(previewCreateBuyOffer({
      buyer: "alice", recipient: "bob", assetCount: 2, priceAmount: 5, memo: "",
    }).reason).toContain("one buyoffer per asset");
    expect(previewCreateBuyOffer({
      buyer: "alice", recipient: "bob", assetCount: 1, priceAmount: 5, memo: "x".repeat(257),
    }).reason).toBe("A buyoffer memo can only be 256 characters max");
  });

  it("buys an open sale and refuses a missing row, a self-buy, and a sale with no offer", () => {
    expect(previewPurchaseSale({ saleExists: true, buyer: "bob", seller: "alice", offerOpen: true })).toEqual({
      ok: true,
      action: "purchasesale",
    });
    expect(previewPurchaseSale({ saleExists: false, buyer: "bob", seller: "alice", offerOpen: true }).reason)
      .toBe("No sale with this sale_id exists");
    expect(previewPurchaseSale({ saleExists: true, buyer: "alice", seller: "alice", offerOpen: true }).reason)
      .toBe("You can't purchase your own sale");
    expect(previewPurchaseSale({ saleExists: true, buyer: "bob", seller: "alice", offerOpen: false }).reason)
      .toContain("not active yet");
  });
});
