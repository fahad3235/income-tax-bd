/* income-tax-bd — pure Bangladesh personal income tax engine (AY 2026-27).
   Dependency-free: safe to require() from node unit tests and to <script>-include in the browser.
   Slab/threshold figures per press coverage of the Finance Ordinance 2025
   (TBS News, June 2025: tax-free thresholds + slab bands + minimum tax). */

"use strict";

var TAX_RULES = {
  assessmentYear: "2026-27",
  incomeYear: "FY 2025-26",
  // Slab rates apply to income ABOVE the taxpayer's tax-free threshold.
  categories: [
    { id: "general",          threshold: 375000 },
    { id: "women_senior",     threshold: 425000 },
    { id: "disabled_tg",      threshold: 500000 },
    { id: "freedom_fighter",  threshold: 525000 }
  ],
  // { width } of taxable income above threshold taxed at { rate }.
  // The last slab has infinite width (the "remainder").
  slabs: [
    { width: 300000, rate: 0.10 },
    { width: 400000, rate: 0.15 },
    { width: 500000, rate: 0.20 },
    { width: 2000000, rate: 0.25 },
    { width: Infinity, rate: 0.30 }
  ],
  minimumTax: { existing: 5000, new: 1000 },
  source: "Press coverage of the Finance Ordinance 2025 (TBS News, June 2025). Verify against NBR/official gazette before filing."
};

function round2(x) {
  return Math.round((x + Number.EPSILON) * 100) / 100;
}

function getCategory(id) {
  for (var i = 0; i < TAX_RULES.categories.length; i++) {
    if (TAX_RULES.categories[i].id === id) return TAX_RULES.categories[i];
  }
  return TAX_RULES.categories[0];
}

/* income: number (BDT, >= 0). categoryId: one of the category ids.
   floor: minimum-tax floor in BDT; 0/null/undefined means no floor.
   The floor only applies when income > 0.
   Returns a full breakdown object with all money values rounded to 2dp. */
function calculateTax(income, categoryId, floor) {
  var inc = Number(income);
  if (!isFinite(inc) || inc < 0) inc = 0;
  var cat = getCategory(categoryId);
  var threshold = cat.threshold;
  var above = Math.max(0, inc - threshold);

  var bands = [];
  var remaining = above;
  var lower = threshold; // lower bound (inclusive) of the band in total-income terms
  for (var i = 0; i < TAX_RULES.slabs.length && remaining > 0; i++) {
    var slab = TAX_RULES.slabs[i];
    var portion = Math.min(remaining, slab.width);
    var tax = round2(portion * slab.rate);
    bands.push({
      index: i,
      from: lower,
      to: isFinite(slab.width) ? lower + portion : null, // null = remainder band, open-ended
      width: isFinite(slab.width) ? slab.width : null,
      portion: portion,
      rate: slab.rate,
      tax: tax
    });
    remaining -= portion;
    if (isFinite(slab.width)) lower += slab.width;
  }

  var gross = round2(bands.reduce(function (s, b) { return s + b.tax; }, 0));
  var floorNum = Number(floor) || 0;
  var floorApplied = false;
  var floorUsed = 0;
  var payable = gross;
  if (inc > 0 && floorNum > 0) {
    floorApplied = true;
    floorUsed = floorNum;
    payable = round2(Math.max(gross, floorNum));
  }

  return {
    assessmentYear: TAX_RULES.assessmentYear,
    categoryId: cat.id,
    threshold: threshold,
    income: inc,
    taxableAbove: round2(above),
    bands: bands,
    gross: gross,
    floorApplied: floorApplied,
    floorUsed: floorApplied ? round2(floorUsed) : 0,
    payable: payable,
    effectiveRate: inc > 0 ? round2((payable / inc) * 100) : 0,
    monthly: round2(payable / 12)
  };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { TAX_RULES: TAX_RULES, calculateTax: calculateTax, getCategory: getCategory, round2: round2 };
}
