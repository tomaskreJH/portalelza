import { test } from "node:test";
import assert from "node:assert/strict";
import { jeEmail, jeKod, klicRole, nazevSouboru, ocistiText, zkontrolujSoubor, zkontrolujSoubory, zkontrolujPripominku } from "../src/domain/validace.js";

test("e-mail a kód", () => {
  assert.equal(jeEmail("a@firma.cz"), true);
  assert.equal(jeEmail("a b@firma.cz"), false);
  assert.equal(jeEmail("bez-zavinace"), false);
  assert.equal(jeKod("123456"), true);
  assert.equal(jeKod("12345"), false);
  assert.equal(jeKod("12345a"), false);
});

test("role s diakritikou i bez ní", () => {
  assert.equal(klicRole("Stavbyvedoucí"), "stavbyvedouci");
  assert.equal(klicRole("Zaměstnanec ELZY"), "zamestnanec");
  assert.equal(klicRole("ZamestnanecELZY"), "zamestnanec");
  assert.equal(klicRole("Investor"), "investor");
  assert.equal(klicRole("admin"), null);
  assert.equal(klicRole("__proto__"), null);
});

test("názvy souborů bez diakritiky a speciálních znaků", () => {
  assert.equal(nazevSouboru("Půdorys 1.NP (v2).pdf"), "Pudorys_1.NP_v2.pdf");
  assert.equal(nazevSouboru("../../etc/passwd"), "etcpasswd");
});

test("kontrola souborů", () => {
  assert.equal(zkontrolujSoubor({ name: "vykres.pdf", size: 1000 }).ok, true);
  assert.equal(zkontrolujSoubor({ name: "tz.exe", size: 1000 }).ok, false);
  assert.equal(zkontrolujSoubor({ name: "faktura.exe.pdf", size: 1000 }).ok, false);
  assert.equal(zkontrolujSoubor({ name: "vykres.pdf", size: 0 }).ok, false);
  assert.equal(zkontrolujSoubor({ name: "vykres.pdf", size: 26 * 1024 * 1024 }).ok, false);
  assert.equal(zkontrolujSoubor({ name: "bezpripony", size: 10 }).ok, false);
  const moc = Array.from({ length: 11 }, () => ({ name: "a.pdf", size: 10 }));
  assert.equal(zkontrolujSoubory(moc).ok, false);
});

test("kontrola připomínky: jen povolená zakázka, meze délky, řídicí znaky pryč", () => {
  const ok = zkontrolujPripominku({ zakazka: "DEMO-001", nazev: "Trasa kabelu", text: "Upřesnit\u0000 trasu" }, ["DEMO-001"]);
  assert.equal(ok.ok, true);
  assert.equal(ok.data.text, "Upřesnit trasu");
  assert.equal(zkontrolujPripominku({ zakazka: "DEMO-999", nazev: "Trasa kabelu", text: "Upřesnit trasu" }, ["DEMO-001"]).ok, false);
  assert.equal(zkontrolujPripominku({ zakazka: "DEMO-001", nazev: "ab", text: "Upřesnit trasu" }, ["DEMO-001"]).ok, false);
  assert.equal(ocistiText("  a\r\nb  "), "a\nb");
});
