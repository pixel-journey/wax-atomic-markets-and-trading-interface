# Verification log

**Trust label:** educational-reference  
**Updated:** 2026-10-21

| Claim | Evidence | State |
| --- | --- | --- |
| Listed sort order, USD row last | `src/sales.test.ts` | verified (unit) |
| Preview order assertsale, transfer, purchasesale | same | verified (unit) |
| Sale id `9007199254740993` stays a string | same | verified (unit) |
| Deposit memo and price text | same | verified (unit) |
| Sold, self-buy, non-WAX, and a bad name are refused | same | verified (unit) |
| Demo renders `buyPreview` | `src/Demo.tsx` | partial (inspection) |
| Action names match the public AtomicMarket purchase triple | docs read, not a node | partial |
| A broadcast transaction | none | untested |
| WCAG audit | none | not claimed |
