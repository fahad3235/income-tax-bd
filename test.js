/* Node unit tests for the pure tax engine (tax.js). Run: node test.js */
"use strict";
const { calculateTax, TAX_RULES } = require("./tax.js");

let pass = 0, fail = 0;
function eq(actual, expected, label) {
  const ok = (typeof actual === "string" || typeof expected === "string")
    ? actual === expected
    : Math.abs(actual - expected) < 0.005;
  if (ok) { pass++; console.log("  ok:", label, "=", actual); }
  else { fail++; console.error("FAIL:", label, "\n  expected:", expected, "\n  actual:  ", actual); }
}
function band(res, i) { return res.bands[i] || {}; }

// NOTE on expected values: the run brief listed expected values for three cases that
// are inconsistent with its own stated slab rules (next 300k@10%, 400k@15%, 500k@20%,
// 2M@25%, remainder@30% on income above threshold). Hand-checked below:
//
//  8,575,000 general: above threshold = 8,200,000.
//    300k*10% + 400k*15% + 500k*20% + 2M*25% = 30k+60k+100k+500k = 690k on 3.2M;
//    remainder 5M @30% = 1,500k. Total = 2,190,000 (brief said 1,940,000).
//  10,575,000 general: above = 10,200,000; remainder 7M @30% = 2,100k; total 2,790,000 (brief said 2,540,000).
//  675,001 general: above = 300,001 -> 300k@10% = 30,000 + 1@15% = 0.15 -> 30,000.15 (brief said 30,000.10;
//    the marginal 1 BDT sits in the 15% band, not 10%).
// The assertions below follow the slab rules; discrepancies are flagged, not papered over.

const g = (inc, floor) => calculateTax(inc, "general", floor || 0);

console.log("== general category gross tax ==");
eq(g(375000).payable, 0, "general 375,000 -> 0");
eq(g(675000).payable, 30000, "general 675,000 -> 30,000");
eq(g(1075000).payable, 90000, "general 1,075,000 -> 90,000");
eq(g(1575000).payable, 190000, "general 1,575,000 -> 190,000");
eq(g(3575000).payable, 690000, "general 3,575,000 -> 690,000");
eq(g(8575000).payable, 2190000, "general 8,575,000 -> 2,190,000 (brief's 1,940,000 is off per its own slabs)");
eq(g(10575000).payable, 2790000, "general 10,575,000 -> 2,790,000 (brief's 2,540,000 is off per its own slabs)");
eq(g(675001).payable, 30000.15, "general 675,001 -> 30,000.15 (marginal 1 BDT at 15%; brief said .10)");
eq(g(375001).payable, 0.10, "general 375,001 -> 0.10 (first marginal taka at 10%)");

console.log("== slab boundaries & band geometry ==");
let r = g(675000);
eq(r.bands.length, 1, "675,000 uses exactly 1 band");
eq(band(r, 0).portion, 300000, "band0 portion 300,000");
eq(band(r, 0).rate, 0.10, "band0 rate 10%");
eq(band(r, 0).tax, 30000, "band0 tax 30,000");
r = g(1075000);
eq(r.bands.length, 2, "1,075,000 uses exactly 2 bands");
eq(band(r, 1).tax, 60000, "band1 tax 60,000");
r = g(3575000);
eq(r.bands.length, 4, "3,575,000 uses exactly 4 bands (3.2M boundary)");
eq(band(r, 3).portion, 2000000, "band3 portion 2,000,000");
eq(band(r, 3).tax, 500000, "band3 tax 500,000");
r = g(10575000);
eq(r.bands.length, 5, "10,575,000 reaches the 30% remainder band");
eq(band(r, 4).rate, 0.30, "band4 rate 30%");
eq(band(r, 4).portion, 7000000, "band4 portion 7,000,000");
eq(band(r, 4).tax, 2100000, "band4 tax 2,100,000");
r = g(0);
eq(r.bands.length, 0, "income 0 -> no bands");
eq(r.payable, 0, "income 0 -> payable 0");

console.log("== other categories ==");
eq(calculateTax(425000, "women_senior").payable, 0, "women/senior 425,000 -> 0");
eq(calculateTax(725000, "women_senior").payable, 30000, "women/senior 725,000 -> 30,000");
eq(calculateTax(500000, "disabled_tg").payable, 0, "disabled/TG 500,000 -> 0");
eq(calculateTax(800000, "disabled_tg").payable, 30000, "disabled/TG 800,000 -> 30,000");
eq(calculateTax(525000, "freedom_fighter").payable, 0, "freedom fighter 525,000 -> 0");
eq(calculateTax(825000, "freedom_fighter").payable, 30000, "freedom fighter 825,000 -> 30,000");
eq(calculateTax(425000, "women_senior").threshold, 425000, "women/senior threshold 425,000");
eq(calculateTax(500000, "disabled_tg").threshold, 500000, "disabled/TG threshold 500,000");
eq(calculateTax(525000, "freedom_fighter").threshold, 525000, "freedom fighter threshold 525,000");
eq(calculateTax(675000, "bogus_id").threshold, 375000, "unknown category falls back to general");

console.log("== minimum tax floor ==");
eq(g(300000, 5000).payable, 5000, "general 300,000 existing taxpayer (floor 5,000) -> 5,000");
eq(g(300000, 1000).payable, 1000, "general 300,000 new taxpayer (floor 1,000) -> 1,000");
eq(g(300000, 5000).floorApplied, true, "floorApplied flag true when floor binds");
eq(g(300000, 5000).floorUsed, 5000, "floorUsed = 5,000");
eq(g(0, 5000).payable, 0, "income 0 -> payable 0 even with existing-taxpayer floor");
eq(g(0, 5000).floorApplied, false, "income 0 -> floor not applied");
eq(g(400000, 2500).payable, 2500, "general 400,000 custom floor 2,500 (gross 2,500) -> 2,500");
eq(g(675000, 5000).payable, 30000, "gross 30,000 above floor 5,000 -> floor does not bind");
eq(g(675000, 5000).floorApplied, true, "floorApplied true whenever floor>0 and income>0");
eq(g(675000, 0).payable, 30000, "no floor -> payable = gross");
eq(g(675000, 0).floorApplied, false, "floorApplied false with floor=0");
eq(TAX_RULES.minimumTax.existing, 5000, "announced minimum tax: existing 5,000");
eq(TAX_RULES.minimumTax.new, 1000, "announced minimum tax: new 1,000");

console.log("== effective rate & monthly ==");
r = g(675000);
eq(r.effectiveRate, 4.44, "675,000 general -> effective rate 4.44%");
eq(r.monthly, 2500, "675,000 general -> monthly 2,500");
r = g(375000);
eq(r.effectiveRate, 0, "zero payable -> effective rate 0%");
eq(r.monthly, 0, "zero payable -> monthly 0");
r = g(0);
eq(r.effectiveRate, 0, "zero income -> effective rate 0 (no divide-by-zero)");

console.log("== boundary continuity ==");
eq(g(675001).payable - g(675000).payable, 0.15, "675,000 -> 675,001 tax rises by 0.15 (continuous, monotone)");
eq(g(3575001).payable - g(3575000).payable, 0.30, "3,575,000 -> 3,575,001 tax rises by 0.30 (30% band entry)");
eq(g(3575000).payable, 690000, "3,575,000 exactly at 25%-band end -> 690,000");

console.log("== TAX_RULES config integrity ==");
eq(TAX_RULES.categories.length, 4, "4 taxpayer categories");
eq(TAX_RULES.slabs.length, 5, "5 slabs");
eq(TAX_RULES.assessmentYear, "2026-27", "assessment year 2026-27");
let total = 0; TAX_RULES.slabs.forEach(s => { total += s.width === Infinity ? 0 : s.width; });
eq(total, 3200000, "finite slab widths sum to 3,200,000");

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
