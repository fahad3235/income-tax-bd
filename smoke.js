/* Headless-Chrome smoke tests for income-tax-bd (puppeteer-core + system Chromium). */
"use strict";
const fs = require("fs");
const puppeteer = require("puppeteer-core");

const DIR = "/home/hatch/workspace/muse-project-factory/builds/income-tax-bd";
const FILE = "file://" + DIR + "/index.html";
let pass = 0, fail = 0;
function eq(actual, expected, label) {
  if (actual === expected) { pass++; console.log("  ok:", label); }
  else { fail++; console.error("FAIL:", label, "\n  expected:", JSON.stringify(expected), "\n  actual:  ", JSON.stringify(actual)); }
}
function ok(cond, label) { eq(cond, true, label); }
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "/opt/meta-chromium/chrome",
    headless: "new",
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--allow-file-access-from-files"]
  });
  const errors = [];
  try {
    const page = await browser.newPage();
    page.on("console", m => { if (m.type() === "error") errors.push("console: " + m.text()); });
    page.on("pageerror", e => errors.push("pageerror: " + e.message));
    await page.setViewport({ width: 1280, height: 900 });
    await page.goto(FILE, { waitUntil: "load", timeout: 30000 });
    await page.waitForFunction(() => document.getElementById("threshold-hint").textContent.length > 0, { timeout: 5000 });

    // 1. initial state
    eq(await page.$eval("#results-body", el => el.hidden), true, "results hidden before calculate");
    eq(await page.$eval("#results-empty", el => el.hidden), false, "results empty state visible");
    eq(await page.$eval("#threshold-hint", el => el.textContent), "Tax-free threshold: ৳3,75,000.00",
      "default threshold hint (general, 375,000)");
    eq(await page.$eval("#history-empty", el => el.hidden), false, "history empty state visible");

    // 2. category change updates threshold label
    await page.select("#category", "women_senior");
    eq(await page.$eval("#threshold-hint", el => el.textContent), "Tax-free threshold: ৳4,25,000.00",
      "women/senior threshold hint updates");
    await page.select("#category", "general");

    // 3. validation: empty input
    await page.click('#tax-form button[type="submit"]');
    await page.waitForFunction(() => document.getElementById("err-income").classList.contains("show"), { timeout: 5000 });
    eq(await page.$eval("#err-income", el => el.textContent), "This field is required.", "empty income -> required error");
    eq(await page.$eval("#results-body", el => el.hidden), true, "results stay hidden on validation error");

    // 4. validation: negative input
    await page.$eval("#income", el => { el.value = "-500"; });
    await page.click('#tax-form button[type="submit"]');
    await page.waitForFunction(() => document.getElementById("err-income").textContent === "Income cannot be negative.", { timeout: 5000 });
    eq(await page.$eval("#err-income", el => el.textContent), "Income cannot be negative.", "negative income -> error");

    // 5. calculate general 675,000
    await page.$eval("#income", el => { el.value = "675000"; });
    await page.click('#tax-form button[type="submit"]');
    await page.waitForFunction(() => !document.getElementById("results-body").hidden, { timeout: 5000 });
    eq(await page.$eval("#payable-cell", el => el.textContent), "৳30,000.00", "payable = ৳30,000.00");
    eq(await page.$eval("#gross-cell", el => el.textContent), "৳30,000.00", "gross = ৳30,000.00");
    eq(await page.$eval("#rate-cell", el => el.textContent), "4.44%", "effective rate 4.44%");
    eq(await page.$eval("#monthly-cell", el => el.textContent), "৳2,500.00", "monthly = ৳2,500.00");
    eq(await page.$eval("#floor-cell", el => el.textContent), "None selected", "no floor -> floor row shows none");
    const rows = await page.$$eval("#breakdown-body tr", els => els.map(tr => [...tr.children].map(td => td.textContent)));
    eq(rows.length, 2, "2 breakdown rows (tax-free row + 1 slab row)");
    eq(rows[0][0], "First ৳3,75,000.00 (tax-free)", "row1 = tax-free row");
    eq(rows[1][0], "৳3,75,001.00 – ৳6,75,000.00", "row2 slab range");
    eq(rows[1][2], "10%", "row2 rate");
    eq(rows[1][3], "৳30,000.00", "row2 tax");
    eq(await page.$eval("#applied-line", el => el.textContent),
      "Category: General individual · Tax-free threshold ৳3,75,000.00", "applied-line shows category+threshold");

    // 6. minimum tax floor: new taxpayer, income 300,000 -> payable 1,000
    await page.$eval("#income", el => { el.value = "300000"; });
    await page.click('input[name="floor"][value="new"]');
    await page.click('#tax-form button[type="submit"]');
    await sleep(300);
    eq(await page.$eval("#payable-cell", el => el.textContent), "৳1,000.00", "new taxpayer floor 1,000 binds on 300,000");
    eq(await page.$eval("#floor-cell", el => el.textContent), "Applied (৳1,000.00)", "floor row shows applied");
    eq(await page.$eval("#gross-cell", el => el.textContent), "৳0.00", "gross 0 below threshold");
    await page.click('input[name="floor"][value="none"]');

    // 7. history: 2 entries listed, delete one
    eq(await page.$$eval("#history-list li", els => els.length), 2, "history has 2 entries");
    await page.click("#history-list li:first-child .hist-del");
    eq(await page.$$eval("#history-list li", els => els.length), 1, "delete removes entry");
    eq((await page.$eval("#history-list", el => el.textContent)).includes("৳30,000.00"), true, "remaining entry shows ৳30,000.00");

    // 8. reload persistence
    await page.reload({ waitUntil: "load" });
    await page.waitForFunction(() => document.getElementById("threshold-hint").textContent.length > 0, { timeout: 5000 });
    eq(await page.$$eval("#history-list li", els => els.length), 1, "history persists across reload");

    // 9. export/import round-trip + malformed import rejected
    const good = [{ id: 111, ts: 1760000000000, income: 1075000, categoryId: "general", floor: 0, payable: 90000, gross: 90000 }];
    fs.writeFileSync("/tmp/itbd-good.json", JSON.stringify(good));
    fs.writeFileSync("/tmp/itbd-bad.json", "{not valid json");
    await (await page.$("#import-file")).uploadFile("/tmp/itbd-good.json");
    await page.waitForFunction(() => document.getElementById("import-ok").classList.contains("show"), { timeout: 5000 });
    eq(await page.$eval("#import-ok", el => el.textContent), "Imported 1 entries.", "import ok message");
    eq(await page.$$eval("#history-list li", els => els.length), 2, "import adds entry (now 2)");
    eq((await page.$eval("#history-list", el => el.textContent)).includes("৳90,000.00"), true, "imported entry payable ৳90,000.00");
    console.log("  [t] before 2nd upload");
    await (await page.$("#import-file")).uploadFile("/tmp/itbd-bad.json");
    console.log("  [t] after 2nd upload");
    await page.waitForFunction(() => document.getElementById("import-msg").classList.contains("show"), { timeout: 5000 });
    console.log("  [t] import-msg shown");
    try {
      const rawVal = await page.$eval("#import-msg", el => el.textContent);
      console.log("  [t] rawVal type:", typeof rawVal, "ctor:", rawVal && rawVal.constructor && rawVal.constructor.name, "val:", JSON.stringify(rawVal).slice(0, 120));
      eq(String(rawVal).slice(0, 14), "Import failed:", "malformed import rejected");
    } catch (e) {
      console.log("  [t] CAUGHT:", e.message.slice(0, 100));
      console.log("  [t] browser.connected:", browser.connected);
      console.log("  [t] page.isClosed:", page.isClosed());
      const proc = browser.process();
      console.log("  [t] proc alive:", proc && proc.exitCode === null, "pid:", proc && proc.pid);
      try { console.log("  [t] targets:", (await browser.targets()).length); }
      catch (e2) { console.log("  [t] targets() failed:", e2.message.slice(0, 80)); }
      throw e;
    }
    console.log("  [t] after msg check");
    eq(await page.$$eval("#history-list li", els => els.length), 2, "data intact after bad import");
    console.log("  [t] after count check");

    // 10. BN toggle: strings + digits, persisted
    await page.click("#lang-toggle");
    await page.waitForFunction(() => document.querySelector('#tax-form button[type="submit"]').textContent === "হিসাব করুন", { timeout: 5000 });
    eq(await page.$eval("#results-heading", el => el.textContent), "করের বিশ্লেষণ", "BN: results title");
    eq(await page.$eval("#history-heading", el => el.textContent), "হিসাবের ইতিহাস", "BN: history title");
    eq(await page.$eval("#threshold-hint", el => el.textContent), "করমুক্ত সীমা: ৳৩,৭৫,০০০.০০", "BN: threshold hint with Bengali digits");
    eq(await page.evaluate(() => localStorage.getItem("itbd_lang_v1")), "bn", "language persisted");
    await page.reload({ waitUntil: "load" });
    await page.waitForFunction(() => document.querySelector('#tax-form button[type="submit"]').textContent === "হিসাব করুন", { timeout: 5000 });
    await page.$eval("#income", el => { el.value = "300000"; });
    await page.click('input[name="floor"][value="new"]');
    await page.click('#tax-form button[type="submit"]');
    await page.waitForFunction(() => !document.getElementById("results-body").hidden, { timeout: 5000 });
    eq(await page.$eval("#payable-cell", el => el.textContent), "৳১,০০০.০০", "BN: payable with Bengali digits after reload");
    eq(await page.$eval("#rate-cell", el => el.textContent), "০.৩৩%", "BN: effective rate with Bengali digits");
    await page.click('input[name="floor"][value="none"]');
    // back to EN for remaining checks
    await page.click("#lang-toggle");
    await page.waitForFunction(() => document.querySelector('#tax-form button[type="submit"]').textContent === "Calculate", { timeout: 5000 });

    // 11. reset
    await page.click("#reset-btn");
    eq(await page.$eval("#results-body", el => el.hidden), true, "reset hides results");
    eq(await page.$eval("#results-empty", el => el.hidden), false, "reset shows empty state");
    eq(await page.$eval("#income", el => el.value), "", "reset clears income");

    // 12. print stylesheet: emulate print, form/history hidden
    await page.emulateMediaType("print");
    eq(await page.$eval("#tax-form", el => getComputedStyle(el.closest("section")).display), "none", "print: form section hidden");
    eq(await page.$eval("#lang-toggle", el => getComputedStyle(el.closest("header")).display), "none", "print: header hidden");
    eq(await page.$eval("#results-card", el => getComputedStyle(el).display), "block", "print: results card visible");
    await page.emulateMediaType("screen");

    // 13. 390px mobile: no horizontal overflow
    await page.setViewport({ width: 390, height: 844 });
    await page.reload({ waitUntil: "load" });
    await page.waitForFunction(() => document.getElementById("threshold-hint").textContent.length > 0, { timeout: 5000 });
    await page.$eval("#income", el => { el.value = "8575000"; });
    await page.click('#tax-form button[type="submit"]');
    await page.waitForFunction(() => !document.getElementById("results-body").hidden, { timeout: 5000 });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth <= 390);
    ok(overflow, "390px: no horizontal overflow");
    eq(await page.$eval("#payable-cell", el => el.textContent), "৳21,90,000.00", "8,575,000 -> ৳2,190,000.00 in UI");

    // 14. zero console/page errors
    eq(errors.length, 0, "zero console/page errors (" + errors.length + ")");
    if (errors.length) console.error(errors.join("\n"));
  } finally {
    await browser.close();
  }
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error("HARNESS ERROR:", e); process.exit(2); });
