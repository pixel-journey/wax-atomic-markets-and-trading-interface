# Architecture

```
SaleRow
    |
    +--> visibleSales(state) --> rows sorted by WAX units, unparsed prices last
    |
    +--> buyPreview(buyer)
            |
            +--> refused: state, names, ids, non-WAX price, self-buy
            |
            +--> assertsale, transfer memo deposit, purchasesale median 0
```

No action in that list is signed.

## Decisions

**Price text is copied.** The sort key is `BigInt` of the 8 decimal digits. The transfer `quantity` is the original string.

**Direct WAX only.** Guessing `eosio.token` for another symbol would be a wrong contract.

**String ids.** A sale id that does not fit in `Number` must survive the preview unchanged.
