# AI handoff — AtomicMarket trading interface

## Agent tooling

```bash
git clone https://github.com/wharfkit/skill.git ~/.claude/skills/wharfkit
# https://github.com/atomicassets/atomic-knowledge — pin commit, AGENTS.md
```

| Source | Role |
| --- | --- |
| [atomicmarket-contract v2](https://github.com/atomicassets/atomicmarket-contract/tree/v2.0.0) | Single-asset sales |
| [collection config](https://github.com/pixel-journey/wax-atomic-collection-config-visualizer) | Fee split (not recomputed here) |
| [atomic-knowledge](https://github.com/atomicassets/atomic-knowledge) | Network before action |

## Non-negotiables

1. `buyPreview` builds **unsigned** triple only when listed, buyer ≠ seller, one asset id, price `digits.8digits WAX`:
   - `atomicmarket::assertsale`
   - `eosio.token::transfer` to `atomicmarket` memo `deposit`
   - `atomicmarket::purchasesale` (`intended_delphi_median` `"0"`)
2. **purchasesale is last.** Nothing is broadcast.
3. Sale ids stay **strings**. `9007199254740993` must not become a Number.
4. AtomicMarket **v2** listings are single-asset. Multi-id fixture is refused.
5. Do not copy the bundle ban from pinknetworkx master if it lacks the check — use atomicassets v2.0.0 tree.
6. Action names are WAX AtomicMarket-shaped; other chains differ.
7. Not `createbuyo`. Not a pack unbox.

## Prompt seeds

- "List the three actions in order for a valid listed WAX sale."
- "Sale id larger than MAX_SAFE_INTEGER — keep as string?"
- "Two asset ids on v2 listing — refuse?"
- "Refuse setting intended_delphi_median when listing symbol ≠ settlement."

## Do not

- Render buy as success — first note is Not broadcast.
- Use Number on sale/asset ids.
- Recompute collection fee here (collection config lab).
