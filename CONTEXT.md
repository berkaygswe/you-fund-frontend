# Domain glossary

Terms the codebase uses with a precise meaning. Keep names in code aligned with these.

## Money

- **Display currency** — the currency the user picked in the header (`USD` | `TRY`, `useCurrency()`). Market data and portfolio overview amounts are requested from the backend already converted to it. Money formatting defaults to it implicitly.
- **Quote currency** (native currency) — the currency an asset is priced and traded in (`tx.currency`, `tradeCurrency`). Can be any ISO 4217 code. Trades are submitted and shown in it, never converted on the client. Pass it explicitly: `<Money amount={x} currency={tx.currency} />`.
- **Base currency** — a portfolio's accounting currency (`baseCurrency`); cash balances and cash movements are denominated in it. Withdrawal limits and trade cash checks compare base currency to base currency.
- **Display projection** — `GET /portfolios?currency=` and `GET /portfolios/{id}/cash-movements?currency=` keep the base amount and add `displayAmount` / `displayCashBalance`, `displayCurrency`, `displayFxRateDate` and a **DisplayFxStatus**:
  - `BASE` — display equals base currency, no FX.
  - `CONVERTED` — converted with the rate observed on `displayFxRateDate`.
  - `UNAVAILABLE` — no usable rate; display amount is null. The UI shows the base amount in its own currency, marked with a tooltip.
  Resolved in one place: `resolveDisplayAmount()` / `<DisplayMoney>` (`src/lib/format`).
- **Never mix units**: do not add or compare a display-currency amount with a base-currency amount (e.g. holdings value + `portfolio.cashBalance`). Conversion happens only on the backend via `?currency=`.
- **Percentage points** — percentages arrive from the backend as points (`12.34` means 12.34%), not fractions.
- **Empty value** — missing/non-finite numbers render as `-` (`EMPTY_VALUE`).

## Money formatting rules (`src/lib/format`)

- Locale formatting follows `Intl` for the active next-intl locale (`tr` → `₺1.234,50`, `en` → `$1,234.50`). No hand-placed symbols.
- Prices ≥ 1 show 2 decimals; sub-unit prices keep 4 significant digits, capped at 8 decimals.
- Amounts are JS numbers end to end; rounding happens only at display time. The backend is authoritative for settled values; client totals are previews.

## Trading

- **Trade intake** — turning the trade form into a booked transaction (`src/features/portfolio/trade-intake`). Owns validation, the preview totals, the trade-day price range check, error classification and the auto-deposit protocol. `TransactionDialog` is only its view.
- **Quote currency is never guessed** — an asset without a known ISO currency cannot be traded (`resolveQuoteCurrency` returns null). Callers must pass the asset's native currency, never the display currency.
- **Trade-day price range** — the bar of the trade date, or the closest preceding bar on non-trading days. A price outside its low–high (inclusive) blocks submit.
- **Trade intent** — one idempotency key plus one frozen request body. Re-submitting the unchanged form re-sends both, so a double click or a retry after a timeout books the trade once. Assumes the backend replays the original result for a repeated key + body.
  - Kept after an **unknown outcome** (network error, timeout, 5xx): the trade may have been booked.
  - Dropped after success, a field change, or a **definite rejection** (4xx: stale revision, insufficient holdings, settlement unavailable, other rejections).
- **Auto-deposit** — on `409 INSUFFICIENT_CASH` the user may retry with `funding: AUTO_DEPOSIT_SHORTFALL`; that retry is its own intent with its own key.
