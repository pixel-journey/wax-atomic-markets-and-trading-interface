/**
 * Sale and buy-offer shape from atomicassets/atomicmarket-contract tag v2.0.0
 * src/atomicmarket.cpp. Not compiled. Not broadcast.
 *
 * Ownership, symbol support, and the marketplace registry are not checked.
 * pinknetworkx/atomicmarket-contract master, opened the same day, does not
 * contain the one-asset check. Use the atomicassets org tag.
 */

export const ONE_SALE =
  "asset_ids must contain exactly one asset id. Bundle listings are not supported - " +
  "create one sale per asset (multiple sales can be created within a single transaction)";

export const ONE_BUY =
  "asset_ids must contain exactly one asset id. Bundle listings are not supported - " +
  "create one buyoffer per asset (multiple buyoffers can be created within a single transaction)";

export type Shape = { ok: false; reason: string } | { ok: true; action: "announcesale" | "createbuyo" | "purchasesale" };

export function previewAnnounceSale(input: {
  assetCount: number;
  priceAmount: number;
  sellerAlreadyListedThisAsset: boolean;
}): Shape {
  if (input.assetCount !== 1) return { ok: false, reason: ONE_SALE };
  if (input.sellerAlreadyListedThisAsset) {
    return {
      ok: false,
      reason: "You have already announced a sale for these assets. You can cancel a sale using the cancelsale action.",
    };
  }
  if (input.priceAmount <= 0) return { ok: false, reason: "The sale price must be greater than zero" };
  return { ok: true, action: "announcesale" };
}

export function previewCreateBuyOffer(input: {
  buyer: string;
  recipient: string;
  assetCount: number;
  priceAmount: number;
  memo: string;
}): Shape {
  if (input.buyer === input.recipient) return { ok: false, reason: "buyer and recipient can't be the same account" };
  if (input.assetCount !== 1) return { ok: false, reason: ONE_BUY };
  if (input.priceAmount <= 0) return { ok: false, reason: "The price must be greater than zero" };
  if (input.memo.length > 256) return { ok: false, reason: "A buyoffer memo can only be 256 characters max" };
  return { ok: true, action: "createbuyo" };
}

export function previewPurchaseSale(input: {
  saleExists: boolean;
  buyer: string;
  seller: string;
  offerOpen: boolean;
}): Shape {
  if (!input.saleExists) return { ok: false, reason: "No sale with this sale_id exists" };
  if (input.buyer === input.seller) return { ok: false, reason: "You can't purchase your own sale" };
  if (!input.offerOpen) {
    return {
      ok: false,
      reason: "This sale is not active yet. The seller first has to create an atomicasset offer for this asset",
    };
  }
  return { ok: true, action: "purchasesale" };
}
