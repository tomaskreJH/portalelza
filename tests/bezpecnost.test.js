// Funkční pojistky proti nechtěnému zápisu a nebezpečnému kódu (ne bezpečnostní audit; ten je mimo repozitář).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { CONFIG, VERZE } from "../src/config.js";
import { volej, zapisPovolen, adresaOperace } from "../src/core/api.js";

const koren = new URL("..", import.meta.url).pathname;

function soubory(dir) {
  return readdirSync(dir).flatMap((n) => {
    const c = join(dir, n);
    return statSync(c).isDirectory() ? soubory(c) : [c];
  });
}

test("výchozí stav: demo a zápis vypnutý (změna jen vědomě, samostatnou verzí)", () => {
  assert.equal(CONFIG.rezim, "demo");
  assert.equal(CONFIG.zapis, false);
  assert.deepEqual(Object.values(CONFIG.api), ["", "", "", ""]);
  assert.equal(zapisPovolen(), false);
});

test("verze v kódu = verze v package.json", () => {
  assert.equal(JSON.parse(readFileSync(join(koren, "package.json"))).version, VERZE);
});

test("CSP bez unsafe-inline a unsafe-eval, connect-src jen self", () => {
  const html = readFileSync(join(koren, "index.html"), "utf8");
  const csp = html.match(/Content-Security-Policy" content="([^"]+)"/)?.[1] ?? "";
  assert.ok(csp.includes("default-src 'self'"));
  assert.ok(!/unsafe-(inline|eval)/.test(csp));
  assert.ok(/connect-src 'self';/.test(csp));
});

test("kód neobsahuje innerHTML, eval, document.write ani inline obsluhu událostí", () => {
  for (const f of soubory(join(koren, "src")).filter((s) => s.endsWith(".js"))) {
    const t = readFileSync(f, "utf8");
    assert.ok(!/innerHTML|outerHTML|insertAdjacentHTML|document\.write|\beval\(|new Function/.test(t), f);
  }
});

test("v repozitáři nejsou tajné soubory ani klíče", () => {
  for (const f of soubory(koren).filter((s) => !s.includes("node_modules") && !s.includes("/.git/") && !s.endsWith("bezpecnost.test.js"))) {
    assert.ok(!/\.env(\.|$)/.test(f) || f.endsWith(".gitignore"), f);
    if (/\.(js|json|html|md|yml)$/.test(f)) assert.ok(!/sig=[A-Za-z0-9_-]{20,}|client_secret|BEGIN (RSA|PRIVATE)/.test(readFileSync(f, "utf8")), f);
  }
});

test("zápis bez povolení odmítne a nevolá síť", async () => {
  let volano = false;
  const fetchFn = async () => { volano = true; return { ok: true, json: async () => ({}) }; };
  const cfg = { rezim: "provoz", zapis: false, api: { pripominky: "https://sluzba.example/x" }, povoleneHosty: ["sluzba.example"] };
  await assert.rejects(volej("pripominky", {}, { cfg, fetchFn }), /Zápis je vypnutý/);
  assert.equal(volano, false);
});

test("adresa služby musí být https a v seznamu povolených hostitelů", () => {
  const base = { api: { kod: "http://sluzba.example/x" }, povoleneHosty: ["sluzba.example"] };
  assert.throws(() => adresaOperace("kod", base), /není povolená/);
  assert.throws(() => adresaOperace("kod", { ...base, api: { kod: "https://jiny.example/x" } }), /není povolená/);
  assert.equal(adresaOperace("kod", { ...base, api: { kod: "https://sluzba.example/x" } }), "https://sluzba.example/x");
});

test("demo: bez přihlášení nejde číst ani zapsat, cizí zakázka se odmítne", async () => {
  await assert.rejects(volej("seznam", {}), /Nejste přihlášeni/);
  const relace = { token: "demo", role: "projektant", zakazky: ["DEMO-001"] };
  await assert.rejects(volej("pripominky", { zakazka: "DEMO-002", nazev: "x" }, { relace }), /oprávnění/);
  await assert.rejects(volej("overit", { email: "projektant@example.com", kod: "000000" }), /Kód neplatí/);
});
