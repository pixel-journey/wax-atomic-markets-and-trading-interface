"use client";

import { useState } from "react";
import { SAMPLE_SALES, buyPreview, visibleSales, type SaleState } from "./sales";

export function Demo() {
  const [state, setState] = useState<SaleState | "any">("listed");
  const [buyer, setBuyer] = useState("buyeracct");
  const [saleId, setSaleId] = useState(SAMPLE_SALES[1]!.saleId);
  const rows = visibleSales(SAMPLE_SALES, state);
  const selected = SAMPLE_SALES.find((sale) => sale.saleId === saleId) ?? rows[0] ?? SAMPLE_SALES[0]!;
  const preview = buyPreview(selected, buyer.trim());

  return (
    <main className="wrap">
      <p className="kicker">educational-reference · not broadcast</p>
      <h1>A listing is a row. A buy is three actions you have not sent.</h1>
      <p className="lede">
        These sales are fixtures. The preview only covers a direct 8-decimal WAX price. A USD row and a sold
        row fail on purpose. Sale ids stay strings so a large id is not rounded.
      </p>
      <div className="row">
        <label>
          Show
          <select value={state} onChange={(event) => setState(event.target.value as SaleState | "any")}>
            <option value="listed">listed</option>
            <option value="sold">sold</option>
            <option value="any">any state</option>
          </select>
        </label>
        <label>
          Buyer name
          <input value={buyer} onChange={(event) => setBuyer(event.target.value)} autoComplete="off" />
        </label>
      </div>
      <table>
        <caption>Fixture sales. Choose one to preview.</caption>
        <thead>
          <tr>
            <th>Sale</th>
            <th>Seller</th>
            <th>Price text</th>
            <th>State</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((sale) => (
            <tr key={sale.saleId}>
              <td>
                <button type="button" aria-pressed={sale.saleId === selected.saleId} onClick={() => setSaleId(sale.saleId)}>
                  {sale.saleId}
                </button>
              </td>
              <td>{sale.seller}</td>
              <td>{sale.listingPrice}</td>
              <td>{sale.state}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {preview.ok ? (
        <>
          <ul className="plain">
            {preview.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
          <pre>
            <code>{JSON.stringify(preview.actions, null, 2)}</code>
          </pre>
        </>
      ) : (
        <p role="alert">{preview.reason}</p>
      )}
    </main>
  );
}
