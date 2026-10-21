"use client";

import { USE_CASES } from "./usecases";

export function Cases() {
  return (
    <section className="wrap">
      <h2>Queries and unsigned transactions</h2>
      <p className="note">
        Built here, not sent. A transaction has authorizations and no signatures. Where this feature has no
        action, the query is the whole chain example.
      </p>
      {USE_CASES.map((item) => (
        <article key={item.title}>
          <h3>{item.title}</h3>
          <p>{item.detail}</p>
          <p>
            <code>{item.request.method}</code> {item.request.url}
          </p>
          {item.request.body ? (
            <pre>
              <code>{JSON.stringify(item.request.body, null, 2)}</code>
            </pre>
          ) : null}
          {item.transaction ? (
            <>
              <p>{item.transaction.note}</p>
              <pre>
                <code>{JSON.stringify(item.transaction.actions, null, 2)}</code>
              </pre>
            </>
          ) : (
            <p>No transaction. This use case does not invent an action.</p>
          )}
        </article>
      ))}
    </section>
  );
}
