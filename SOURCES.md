# Sources

| Source | Use |
| --- | --- |
| [atomicmarket-contract v2.0.0](https://github.com/atomicassets/atomicmarket-contract/tree/v2.0.0) | Single-asset sales |
| [collection config](https://github.com/pixel-journey/wax-atomic-collection-config-visualizer) | Fee split, not recomputed here |
| [atomic-knowledge](https://github.com/atomicassets/atomic-knowledge) | Network before a live action |
| [wharfkit/skill](https://github.com/wharfkit/skill) | SessionKit if a host later signs |

## Locked by the preview

Unsigned triple, in order, only when listed, buyer ≠ seller, one asset id, price `digits.8digits WAX`:

1. `atomicmarket::assertsale`
2. `eosio.token::transfer` to `atomicmarket`, memo `deposit`
3. `atomicmarket::purchasesale` with `intended_delphi_median` `"0"`

**purchasesale is last.** Nothing is broadcast. Sale ids stay strings. v2 listings are single-asset. Not `createbuyo`. Not a pack unbox.

## Portability

Action names are WAX AtomicMarket-shaped. Other chains differ. Do not copy a bundle ban from a master branch that lacks the check — use the v2.0.0 tree.
