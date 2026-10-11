# TEST_RESULTS.md — income-tax-bd, run #27 (12:00 slot, 2026-10-11)

## Node unit tests (`node test.js`) — 59/59 passed

Pure-engine tests against `tax.js` (dependency-free, required directly by node).
All values hand-verified against the slab rules in the brief
(next 300k@10%, 400k@15%, 500k@20%, 2M@25%, remainder@30% on income above threshold).

- General: 375,000→0 · 675,000→30,000 · 1,075,000→90,000 · 1,575,000→190,000 ·
  3,575,000→690,000 · 375,001→0.10
- Band geometry: 675,000 uses exactly 1 band; 1,075,000 → 2 bands;
  3,575,000 → 4 bands (3.2M boundary); 10,575,000 reaches the 30% remainder band
  (7,000,000 × 30% = 2,100,000)
- Other categories: women/senior 425,000→0, 725,000→30,000; disabled/TG 500,000→0,
  800,000→30,000; freedom fighter 525,000→0, 825,000→30,000; unknown category id
  falls back to general
- Minimum-tax floor: 300,000 + existing floor → 5,000 payable (floorApplied=true);
  new floor → 1,000; income 0 → 0 payable and floor NOT applied; custom floor 2,500
  on 400,000 → 2,500; gross above floor → floor does not bind
- Effective rate: 675,000 general → 4.44%; monthly → 2,500; zero income → 0%
  (no divide-by-zero)
- Boundary continuity: 675,000→675,001 rises by exactly 0.15;
  3,575,000→3,575,001 rises by exactly 0.30 (monotone, continuous)
- Config integrity: 4 categories, 5 slabs, AY 2026-27, finite widths sum 3,200,000

### Brief-vs-rules discrepancies (flagged, not papered over)

The brief listed three expected values inconsistent with its own stated slab rules;
the tests assert the rule-consistent values:

| Case | Brief said | Correct per slabs | Reason |
|---|---|---|---|
| General 8,575,000 | 1,940,000 | **2,190,000** | 8.2M above threshold: 690k on 3.2M + 5M×30% = 1,500k |
| General 10,575,000 | 2,540,000 | **2,790,000** | 10.2M above: 690k + 7M×30% = 2,100k |
| General 675,001 | 30,000.10 | **30,000.15** | marginal ৳1 falls in the 15% band, not 10% |

### Repair cycles (unit): 1
- `eq()` helper compared strings with `Math.abs` (NaN) — fixed to use `===`
  for string comparisons. Test-side fix; 0 app bugs.

## Headless-Chrome smoke tests (`node smoke.js`, puppeteer-core + system Chromium) — 46/46 passed

- Page loads, results/history empty states visible, default threshold hint
  "Tax-free threshold: ৳3,75,000.00"
- Category select → hint updates (women/senior → ৳4,25,000.00)
- Validation: empty → "This field is required."; negative → "Income cannot be
  negative."; results stay hidden on error
- Calculate general 675,000 → payable/gross ৳30,000.00, effective 4.44%,
  monthly ৳2,500.00, 2 breakdown rows (tax-free row + slab row with correct
  range/rate/tax), applied-line shows category + threshold
- New-taxpayer floor: 300,000 → payable ৳1,000.00, "Applied (৳1,000.00)", gross ৳0.00
- History: 2 entries → delete → 1 → correct remaining entry; persists across reload
- Export/import: good JSON round-trips ("Imported 1 entries.", ৳90,000.00 entry
  appears); malformed JSON rejected with error and data intact
- BN toggle: all key strings switch, Bengali digits (৳৩,৭৫,০০০.০০, ৳১,০০০.০০,
  ০.৩৩%), language persisted across reload
- Reset: hides results, restores empty state, clears input
- Print emulation: form section + header hidden, results card visible
- 390px viewport: no horizontal overflow; 8,575,000 → ৳21,90,000.00 renders
- **Zero console/page errors**

### Repair cycles (smoke): 2
1. **Real app bug**: negative income fell through to "Enter a valid number"
   because `parseAmount` rejected `-` before the negativity check — fixed by
   allowing an optional leading `-` in the parser so the `< 0` branch fires.
2. **Test-side**: expectations used standard thousands grouping; app uses
   lakh/crore grouping (৳3,75,000.00) per BD convention — updated expectations;
   BN-after-reload and print assertions corrected to match intended behavior
   (results are session-only; `no-print` sits on parent section/header).

### Harness observation (not an app bug)
During development, the second `uploadFile` on the hidden file input intermittently
produced a `TargetCloseError` / odd `$eval` return in headless=new Chromium.
Identical page actions in isolated debug scripts never reproduced it, the app
showed correct behavior in every run (import message text correct, data intact),
and 7 consecutive full runs after the final test edits passed cleanly. Treated as
a puppeteer/harness-level flake, not an application defect.

## Totals
- **node unit: 59/59 passed**
- **headless-Chrome smoke: 46/46 passed, 0 console/page errors**
- App bugs found and fixed: 1 (negative-income validation message)
- Test-side fixes: 7 (lakh-grouping expectations, slab-range label, remaining-entry
  label, BN-after-reload flow, print selectors, BN effective-rate value,
  unit-test `eq()` string comparison)
