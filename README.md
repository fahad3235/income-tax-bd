# Income Tax BD — বাংলাদেশ ব্যক্তিগত আয়কর ক্যালকুলেটর

A fully offline, bilingual (EN/বাংলা) single-page web app that estimates Bangladesh
personal income tax for **Assessment Year 2026–27** (income year FY 2025–26):
slab-by-slab breakdown, minimum-tax floor, effective rate, monthly equivalent,
calculation history with JSON export/import, and print-friendly output.

No build step, no dependencies, no network requests — open `index.html` and it works.

## Tax rules (AY 2026–27)

Figures per press coverage of the **Finance Ordinance 2025** (TBS News, June 2025).
They live in one data-driven `TAX_RULES` object in `tax.js`, so updating them for a
new assessment year is a one-place edit.

| Taxpayer category | Tax-free threshold (BDT) |
|---|---|
| General individual | 375,000 |
| Women & senior citizens (65+) | 425,000 |
| Third gender & persons with disabilities | 500,000 |
| Gazetted war-wounded freedom fighters / July fighters | 525,000 |

Slabs apply to income **above** the threshold:

| Slab (BDT above threshold) | Rate |
|---|---|
| Next 300,000 | 10% |
| Next 400,000 | 15% |
| Next 500,000 | 20% |
| Next 2,000,000 | 25% |
| Remainder | 30% |

Minimum tax (announced): existing taxpayers **5,000**, new taxpayers **1,000**.
In the app this is a user-selectable floor (Existing / New / None) plus an optional
custom override; the floor applies only when income > 0.

> ⚠️ **Estimate only for planning** — verify with NBR / the official gazette before
> filing. Update the figures if NBR revises them.

## Features

1. **Calculator** — 4 taxpayer categories, taxable-income input with inline
   validation (empty / non-numeric / negative / > 1e12 sanity cap), Calculate + Reset.
2. **Results** — slab-by-slab breakdown table (range, taxable portion, rate, tax),
   gross tax, minimum-tax floor line, final payable, effective rate %, monthly
   equivalent; shows which category/threshold was applied.
3. **History** — every calculation saved to localStorage (date, income, category,
   payable); per-entry delete, clear-all, reload persistence, JSON export/import
   with round-trip and malformed-import rejection (data left untouched).
4. **Bilingual EN/বাংলা** — full UI translation with Bengali digits, persisted in
   localStorage.
5. **States & layout** — empty states before first calculation, inline validation
   errors, responsive down to 390px with no horizontal overflow, print stylesheet
   that prints only the breakdown.
6. **Footer disclaimer** — planning-estimate disclaimer plus the TBS News /
   Finance Ordinance 2025 source citation.

## Stack

Vanilla HTML + CSS + JS. `tax.js` is dependency-free (works in the browser via
`<script>` and in node via `require`). No frameworks, no trackers, no network calls.

## Run locally

Just open `index.html` in a browser — or serve it:

```bash
cd income-tax-bd
python3 -m http.server 8000   # then http://localhost:8000
```

## Testing

```bash
npm install        # installs puppeteer-core (dev/test only)
node test.js       # 59 pure-engine unit tests (slabs, boundaries, floors, config)
node smoke.js      # 46 headless-Chrome checks (puppeteer-core + system Chromium)
```

`test.js` hand-verifies the slab math, including boundary continuity
(675,000 → 675,001 rises by exactly ৳0.15) and the minimum-tax floors.
`smoke.js` covers calculation UI, validation errors, BN toggle + Bengali digits,
history CRUD, export/import round-trip, malformed-import rejection, reload
persistence, 390px mobile overflow, print CSS, and zero console/page errors.

See [TEST_RESULTS.md](TEST_RESULTS.md) for the recorded results of this run.

## Deployment (GitHub Pages)

Static files only — push the repo contents and enable Pages (branch `main`, root).
No build command needed.

## Limitations

- Slab/threshold figures are taken from **press coverage** of the Finance
  Ordinance 2025, not the gazette text itself — treat output as a planning
  estimate and re-check against NBR before filing.
- Covers the standard individual slabs only: no rebates, surcharges, perquisites,
  capital-gains or other special treatments.
- History lives in the browser's localStorage (per-device, per-browser).

## Status

BUILT_NOT_PUBLISHED — built and fully tested locally (59/59 node unit,
46/46 headless-Chrome smoke, 0 console/page errors). Awaiting repo creation + push.
