/* income-tax-bd UI: validation, results, history, bilingual EN/বাংলা. */
"use strict";

const I18N = {
  en: {
    appTitle: "Income Tax BD",
    appSubtitle: "Bangladesh Personal Income Tax Calculator",
    ayBadge: "AY 2026–27 · Income Year FY 2025–26",
    langToggle: "বাংলা",
    calcTitle: "Tax calculator",
    categoryLabel: "Taxpayer category",
    cat_general: "General individual",
    cat_women_senior: "Women & senior citizens (65+)",
    cat_disabled_tg: "Third gender & persons with disabilities",
    cat_freedom_fighter: "Gazetted war-wounded freedom fighters / July fighters",
    thresholdHint: "Tax-free threshold: {amount}",
    incomeLabel: "Taxable income (BDT)",
    incomePlaceholder: "e.g. 675,000",
    errRequired: "This field is required.",
    errNotNumber: "Enter a valid number.",
    errNegative: "Income cannot be negative.",
    errTooLarge: "Amount is unrealistically large (max 1,000,000,000,000).",
    floorLegend: "Minimum tax",
    floorExisting: "Existing taxpayer (৳5,000)",
    floorNew: "New taxpayer (৳1,000)",
    floorNone: "None",
    floorCustomLabel: "Custom floor (optional, overrides above)",
    floorCustomPlaceholder: "e.g. 2,500",
    calcBtn: "Calculate",
    resetBtn: "Reset",
    resultsTitle: "Tax breakdown",
    resultsEmpty: "Enter your income and press Calculate to see your tax breakdown.",
    appliedLine: "Category: {cat} · Tax-free threshold {amount}",
    colSlab: "Slab", colPortion: "Taxable portion", colRate: "Rate", colTax: "Tax",
    rowExempt: "First {amount} (tax-free)",
    rowOpenEnded: "Above {amount}",
    grossTax: "Gross tax",
    floorLineLabel: "Minimum-tax floor",
    floorOn: "Applied ({amount})",
    floorOff: "None selected",
    payable: "Total tax payable",
    effRate: "Effective tax rate",
    monthlyEq: "Monthly equivalent",
    printBtn: "Print",
    historyTitle: "Calculation history",
    historyEmpty: "No saved calculations yet.",
    delBtn: "Delete",
    clearBtn: "Clear all",
    exportBtn: "Export JSON",
    importBtn: "Import JSON",
    importBad: "Import failed: file is not a valid history export. Your data was left untouched.",
    importOk: "Imported {n} entries.",
    histCat: "Category", histPay: "Payable",
    confirmClear: "Delete all history entries?",
    disclaimer: "Estimate only for planning — verify with NBR / the official gazette before filing. Slab figures per press coverage of the Finance Ordinance 2025; update if NBR revises.",
    source: "Source: TBS News coverage of the Finance Ordinance 2025 (June 2025).",
    footerNote: "100% offline — your data never leaves this device."
  },
  bn: {
    appTitle: "আয়কর বিডি",
    appSubtitle: "বাংলাদেশ ব্যক্তিগত আয়কর ক্যালকুলেটর",
    ayBadge: "করবর্ষ ২০২৬-২৭ · আয়বর্ষ ২০২৫-২৬",
    langToggle: "English",
    calcTitle: "কর ক্যালকুলেটর",
    categoryLabel: "করদাতার শ্রেণি",
    cat_general: "সাধারণ ব্যক্তি",
    cat_women_senior: "নারী ও প্রবীণ নাগরিক (৬৫+)",
    cat_disabled_tg: "তৃতীয় লিঙ্গ ও প্রতিবন্ধী ব্যক্তি",
    cat_freedom_fighter: "গেজেটভুক্ত যুদ্ধাহত মুক্তিযোদ্ধা / জুলাই যোদ্ধা",
    thresholdHint: "করমুক্ত সীমা: {amount}",
    incomeLabel: "করযোগ্য আয় (টাকা)",
    incomePlaceholder: "যেমন ৬,৭৫,০০০",
    errRequired: "এই ঘরটি পূরণ করা আবশ্যক।",
    errNotNumber: "সঠিক সংখ্যা লিখুন।",
    errNegative: "আয় ঋণাত্মক হতে পারে না।",
    errTooLarge: "অঙ্ক অবাস্তবভাবে বড় (সর্বোচ্চ ১,০০০,০০০,০০০,০০০)।",
    floorLegend: "ন্যূনতম কর",
    floorExisting: "বিদ্যমান করদাতা (৳৫,০০০)",
    floorNew: "নতুন করদাতা (৳১,০০০)",
    floorNone: "প্রযোজ্য নয়",
    floorCustomLabel: "কাস্টম সীমা (ঐচ্ছিক, উপরেরটি অগ্রাহ্য করবে)",
    floorCustomPlaceholder: "যেমন ২,৫০০",
    calcBtn: "হিসাব করুন",
    resetBtn: "রিসেট",
    resultsTitle: "করের বিশ্লেষণ",
    resultsEmpty: "আপনার করের বিশ্লেষণ দেখতে আয় লিখে হিসাব করুন চাপুন।",
    appliedLine: "শ্রেণি: {cat} · করমুক্ত সীমা {amount}",
    colSlab: "স্ল্যাব", colPortion: "করযোগ্য অংশ", colRate: "হার", colTax: "কর",
    rowExempt: "প্রথম {amount} (করমুক্ত)",
    rowOpenEnded: "{amount}-এর ঊর্ধ্বে",
    grossTax: "মোট কর (স্ল্যাব অনুযায়ী)",
    floorLineLabel: "ন্যূনতম করের সীমা",
    floorOn: "প্রযোজ্য ({amount})",
    floorOff: "নির্বাচন করা হয়নি",
    payable: "প্রদেয় মোট কর",
    effRate: "কার্যকর কর হার",
    monthlyEq: "মাসিক সমতুল্য",
    printBtn: "প্রিন্ট",
    historyTitle: "হিসাবের ইতিহাস",
    historyEmpty: "এখনও কোনো হিসাব সংরক্ষিত হয়নি।",
    delBtn: "মুছুন",
    clearBtn: "সব মুছুন",
    exportBtn: "JSON এক্সপোর্ট",
    importBtn: "JSON ইমপোর্ট",
    importBad: "ইমপোর্ট ব্যর্থ: ফাইলটি বৈধ হিসাব-ইতিহাস নয়। আপনার তথ্য অপরিবর্তিত আছে।",
    importOk: "{n}টি এন্ট্রি ইমপোর্ট হয়েছে।",
    histCat: "শ্রেণি", histPay: "প্রদেয়",
    confirmClear: "ইতিহাসের সব এন্ট্রি মুছে ফেলবেন?",
    disclaimer: "শুধুমাত্র পরিকল্পনার জন্য আনুমানিক হিসাব — দাখিলের আগে NBR / সরকারি গেজেট যাচাই করুন। অর্থ অধ্যাদেশ ২০২৫-এর সংবাদ-কভারেজ অনুযায়ী স্ল্যাবের অঙ্ক; NBR সংশোধন করলে আপডেট করুন।",
    source: "সূত্র: অর্থ অধ্যাদেশ ২০২৫-এর TBS News কভারেজ (জুন ২০২৫)।",
    footerNote: "১০০% অফলাইন — আপনার তথ্য এই ডিভাইসের বাইরে যায় না।"
  }
};

const LANG_KEY = "itbd_lang_v1";
const HIST_KEY = "itbd_history_v1";
const KNOWN_CATS = ["general", "women_senior", "disabled_tg", "freedom_fighter"];

let lang = "en";
try { const s = localStorage.getItem(LANG_KEY); if (s === "bn" || s === "en") lang = s; } catch (e) {}
function t(key, vars) {
  let s = (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key;
  if (vars) for (const k in vars) s = s.replace("{" + k + "}", vars[k]);
  return s;
}

const BN_DIGITS = { "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪", "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯" };
function locDigits(s) { return lang === "bn" ? String(s).replace(/[0-9]/g, d => BN_DIGITS[d]) : String(s); }

function groupLakh(n) {
  // lakh/crore grouping: last 3 digits, then groups of 2
  const parts = Math.abs(n).toFixed(2).split(".");
  let int = parts[0];
  let out = int.slice(-3);
  int = int.slice(0, -3);
  while (int.length > 0) { out = int.slice(-2) + "," + out; int = int.slice(0, -2); }
  return (n < 0 ? "-" : "") + out + "." + parts[1];
}
function fmt(n) { return "৳" + locDigits(groupLakh(n)); }
function fmtPct(n) { return locDigits(n.toFixed(2)) + "%"; }
function fmtRate(r) { return locDigits(Math.round(r * 100)) + "%"; }

function parseAmount(raw) {
  if (raw == null) return NaN;
  let s = String(raw).trim();
  if (!s) return NaN;
  s = s.replace(/[০-৯]/g, d => "০১২৩৪৫৬৭৮৯".indexOf(d)); // Bengali -> Latin digits
  s = s.replace(/[৳,\s]/g, "");
  if (!/^-?\d+(\.\d+)?$/.test(s)) return NaN;
  return parseFloat(s);
}

function getHistory() {
  try { const v = JSON.parse(localStorage.getItem(HIST_KEY)); return Array.isArray(v) ? v : []; }
  catch (e) { return []; }
}
function setHistory(h) { try { localStorage.setItem(HIST_KEY, JSON.stringify(h)); } catch (e) {} }

/* ---------- static i18n ---------- */
function applyI18n() {
  document.documentElement.lang = lang === "bn" ? "bn" : "en";
  document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.getAttribute("data-i18n")); });
  document.querySelectorAll("[data-i18n-ph]").forEach(el => { el.placeholder = t(el.getAttribute("data-i18n-ph")); });
  document.getElementById("lang-toggle").textContent = t("langToggle");
  document.title = t("appSubtitle");
  updateThresholdHint();
  renderHistory();
}

/* ---------- form ---------- */
const form = document.getElementById("tax-form");
const catSel = document.getElementById("category");
const incomeInput = document.getElementById("income");
const floorCustom = document.getElementById("floor-custom");
const errIncome = document.getElementById("err-income");
const errFloor = document.getElementById("err-floor");

function updateThresholdHint() {
  const cat = getCategory(catSel.value);
  document.getElementById("threshold-hint").textContent =
    t("thresholdHint", { amount: fmt(cat.threshold) });
}

function setError(el, msg) {
  el.textContent = msg || "";
  el.classList.toggle("show", !!msg);
  return !!msg;
}

function validate() {
  let bad = false;
  const raw = incomeInput.value;
  if (!String(raw).trim()) { bad = setError(errIncome, t("errRequired")) || bad; }
  else {
    const v = parseAmount(raw);
    if (isNaN(v)) bad = setError(errIncome, t("errNotNumber")) || bad;
    else if (v < 0) bad = setError(errIncome, t("errNegative")) || bad;
    else if (v > 1e12) bad = setError(errIncome, t("errTooLarge")) || bad;
    else setError(errIncome, "");
  }
  const fc = String(floorCustom.value).trim();
  if (fc) {
    const v = parseAmount(fc);
    if (isNaN(v) || v < 0) bad = setError(errFloor, t("errNotNumber")) || bad;
    else if (v > 1e12) bad = setError(errFloor, t("errTooLarge")) || bad;
    else setError(errFloor, "");
  } else setError(errFloor, "");
  return !bad;
}

function currentFloor() {
  const fc = String(floorCustom.value).trim();
  if (fc) return parseAmount(fc); // validated already
  const sel = form.querySelector('input[name="floor"]:checked');
  if (!sel || sel.value === "none") return 0;
  return TAX_RULES.minimumTax[sel.value] || 0;
}

/* ---------- results ---------- */
function slabRangeLabel(band) {
  if (band.width === null) return t("rowOpenEnded", { amount: fmt(band.from) });
  const lo = band.from + 1;
  const hi = band.from + band.portion;
  return fmt(lo) + " – " + fmt(hi);
}

function renderResults(res) {
  document.getElementById("results-empty").hidden = true;
  document.getElementById("results-body").hidden = false;
  document.getElementById("applied-line").textContent =
    t("appliedLine", { cat: t("cat_" + res.categoryId), amount: fmt(res.threshold) });

  const tb = document.getElementById("breakdown-body");
  tb.innerHTML = "";
  const tr0 = document.createElement("tr");
  [["td", t("rowExempt", { amount: fmt(res.threshold) })],
   ["td", fmt(res.threshold)], ["td", fmtRate(0)], ["td", fmt(0)]].forEach(([tag, txt], i) => {
    const c = document.createElement(tag); c.textContent = txt; if (i > 0) c.className = "num"; tr0.appendChild(c);
  });
  tb.appendChild(tr0);
  res.bands.forEach(b => {
    const tr = document.createElement("tr");
    [slabRangeLabel(b), fmt(b.portion), fmtRate(b.rate), fmt(b.tax)].forEach((txt, i) => {
      const c = document.createElement("td"); c.textContent = txt; if (i > 0) c.className = "num"; tr.appendChild(c);
    });
    tb.appendChild(tr);
  });
  document.getElementById("gross-cell").textContent = fmt(res.gross);
  document.getElementById("floor-cell").textContent =
    res.floorApplied ? t("floorOn", { amount: fmt(res.floorUsed) }) : t("floorOff");
  document.getElementById("payable-cell").textContent = fmt(res.payable);
  document.getElementById("rate-cell").textContent = fmtPct(res.effectiveRate);
  document.getElementById("monthly-cell").textContent = fmt(res.monthly);
}

function doCalculate() {
  if (!validate()) return;
  const income = parseAmount(incomeInput.value);
  const floor = currentFloor();
  const res = calculateTax(income, catSel.value, floor);
  renderResults(res);
  const h = getHistory();
  h.unshift({ id: Date.now(), ts: Date.now(), income: income, categoryId: res.categoryId, floor: floor, payable: res.payable, gross: res.gross });
  setHistory(h.slice(0, 200));
  renderHistory();
}

function doReset() {
  form.reset();
  incomeInput.value = "";
  floorCustom.value = "";
  setError(errIncome, ""); setError(errFloor, "");
  document.getElementById("results-body").hidden = true;
  document.getElementById("results-empty").hidden = false;
  updateThresholdHint();
}

/* ---------- history ---------- */
function fmtDateTime(ts) {
  const d = new Date(ts);
  const date = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const time = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  return locDigits(date + ", " + time);
}

function renderHistory() {
  const h = getHistory();
  const list = document.getElementById("history-list");
  list.innerHTML = "";
  document.getElementById("history-empty").hidden = h.length > 0;
  document.getElementById("history-actions").hidden = h.length === 0;
  h.forEach(e => {
    const li = document.createElement("li");
    const main = document.createElement("div"); main.className = "hist-main";
    const l1 = document.createElement("div"); l1.className = "hist-line";
    l1.textContent = t("histPay") + ": " + fmt(e.payable) + " · " + fmt(e.income);
    const l2 = document.createElement("div"); l2.className = "hist-sub";
    l2.textContent = t("histCat") + ": " + t("cat_" + (KNOWN_CATS.includes(e.categoryId) ? e.categoryId : "general")) +
      " · " + fmtDateTime(e.ts);
    main.appendChild(l1); main.appendChild(l2);
    const del = document.createElement("button");
    del.type = "button"; del.className = "hist-del"; del.textContent = t("delBtn");
    del.setAttribute("data-del", String(e.id));
    del.addEventListener("click", () => {
      setHistory(getHistory().filter(x => x.id !== e.id));
      renderHistory();
    });
    li.appendChild(main); li.appendChild(del);
    list.appendChild(li);
  });
}

function downloadJSON(name, obj) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}

function validHistoryEntry(e) {
  return e && typeof e === "object" &&
    typeof e.income === "number" && isFinite(e.income) && e.income >= 0 &&
    typeof e.payable === "number" && isFinite(e.payable) && e.payable >= 0 &&
    typeof e.ts === "number" && isFinite(e.ts) &&
    typeof e.categoryId === "string" && KNOWN_CATS.includes(e.categoryId);
}

function importFile(file) {
  const msg = document.getElementById("import-msg");
  const okm = document.getElementById("import-ok");
  msg.classList.remove("show"); okm.classList.remove("show");
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      const arr = Array.isArray(data) ? data : data.entries;
      if (!Array.isArray(arr) || arr.length === 0 || !arr.every(validHistoryEntry)) throw new Error("bad");
      const clean = arr.slice(0, 200).map(e => ({
        id: e.id || Date.now() + Math.random(), ts: e.ts, income: e.income,
        categoryId: e.categoryId, floor: e.floor || 0, payable: e.payable, gross: e.gross || e.payable
      }));
      const merged = clean.concat(getHistory()).slice(0, 200);
      setHistory(merged); renderHistory();
      okm.textContent = t("importOk", { n: locDigits(clean.length) }); okm.classList.add("show");
    } catch (e2) {
      msg.textContent = t("importBad"); msg.classList.add("show");
    }
  };
  reader.onerror = () => { msg.textContent = t("importBad"); msg.classList.add("show"); };
  reader.readAsText(file);
}

/* ---------- wiring ---------- */
catSel.addEventListener("change", updateThresholdHint);
form.addEventListener("submit", e => { e.preventDefault(); doCalculate(); });
document.getElementById("reset-btn").addEventListener("click", doReset);
document.getElementById("print-btn").addEventListener("click", () => window.print());
document.getElementById("lang-toggle").addEventListener("click", () => {
  lang = lang === "en" ? "bn" : "en";
  try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
  applyI18n();
});
document.getElementById("export-btn").addEventListener("click", () =>
  downloadJSON("income-tax-bd-history.json", getHistory()));
document.getElementById("import-btn").addEventListener("click", () =>
  document.getElementById("import-file").click());
document.getElementById("import-file").addEventListener("change", e => {
  if (e.target.files && e.target.files[0]) importFile(e.target.files[0]);
  e.target.value = "";
});
document.getElementById("clear-btn").addEventListener("click", () => {
  if (window.confirm(t("confirmClear"))) { setHistory([]); renderHistory(); }
});

applyI18n();
