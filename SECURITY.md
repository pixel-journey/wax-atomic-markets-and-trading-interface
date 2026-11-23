# Security — AtomicMarket buy preview

## Closed in the preview rules

| Issue | Behavior |
| --- | --- |
| Buyer equals seller | refused |
| Two asset ids | refused (v2 is single-asset) |
| Sale id past `MAX_SAFE_INTEGER` | kept as a **string** |
| Action order | assertsale, deposit transfer, purchasesale last |
| Broadcast | not performed |

## Not closed

| Concern | Guidance |
| --- | --- |
| Live sale row | Not read in the pure preview |
| Collection fee | Not recomputed here |
| Delphi median other than `"0"` | Only when listing symbol differs — do not invent it |

## Attack angles

1. Rendering the preview as a completed purchase.  
2. Coercing the sale id through `Number`.  
3. Putting `purchasesale` before the deposit.  
4. Mixing `createbuyo` fields into this triple.

## Honesty limits

Unsigned builders only. Prefer WharfKit for any later signature.
