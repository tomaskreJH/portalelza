// Čisté funkce bez DOM: kontrola vstupů, role a názvů souborů. Pravidla pojmenování: bez diakritiky (AI_TOM, portal-seznamy).
import { LIMITY } from "../config.js";

export const ROLE = Object.freeze({
  investor: { nazev: "Investor", pripominky: true, soubory: false },
  projektant: { nazev: "Projektant", pripominky: true, soubory: true },
  stavbyvedouci: { nazev: "Stavbyvedoucí", pripominky: true, soubory: true },
  zamestnanec: { nazev: "Zaměstnanec ELZY", pripominky: true, soubory: true },
});

const POVOLENE_PRIPONY = ["pdf", "dwg", "dxf", "png", "jpg", "jpeg", "docx", "xlsx", "txt", "zip"];
const ZAKAZANE_PRIPONY = ["exe", "js", "mjs", "bat", "cmd", "ps1", "vbs", "html", "htm", "svg", "msi", "scr", "com", "jar", "lnk", "dll"];

export function bezDiakritiky(s) {
  return String(s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export function klicRole(role) {
  const k = bezDiakritiky(role).toLowerCase().replace(/[^a-z]/g, "");
  if (k.startsWith("zamestnanec")) return "zamestnanec";
  return Object.hasOwn(ROLE, k) ? k : null;
}

export function jeEmail(s) {
  const t = String(s ?? "").trim();
  return t.length <= 254 && /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/.test(t);
}

export function jeKod(s) {
  return new RegExp(`^\\d{${LIMITY.kodDelka}}$`).test(String(s ?? "").trim());
}

// Odstraní řídicí znaky, sjednotí konce řádků a ořízne okraje. Výstup je vždy jen text (zobrazuje se přes textContent).
export function ocistiText(s) {
  return String(s ?? "").replace(/\r\n?/g, "\n").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();
}

export function nazevSouboru(jmeno) {
  const t = bezDiakritiky(jmeno).replace(/\s+/g, "_").replace(/[^A-Za-z0-9._-]/g, "").replace(/\.{2,}/g, ".").replace(/^[.-]+/, "");
  return t.slice(0, 120);
}

export function zkontrolujSoubor(soubor) {
  const chyby = [];
  const jmeno = nazevSouboru(soubor?.name);
  const casti = jmeno.toLowerCase().split(".");
  const pripona = casti.length > 1 ? casti.at(-1) : "";
  if (!jmeno || !pripona) chyby.push("Soubor musí mít název a příponu.");
  else if (!POVOLENE_PRIPONY.includes(pripona)) chyby.push(`Přípona .${pripona} není povolená.`);
  if (casti.slice(0, -1).some((c) => ZAKAZANE_PRIPONY.includes(c))) chyby.push("Název obsahuje zakázanou příponu.");
  if (!(soubor?.size > 0)) chyby.push("Soubor je prázdný.");
  if (soubor?.size > LIMITY.maxVelikostMB * 1024 * 1024) chyby.push(`Soubor je větší než ${LIMITY.maxVelikostMB} MB.`);
  return { ok: chyby.length === 0, chyby, jmeno };
}

export function zkontrolujSoubory(seznam) {
  const polozky = Array.from(seznam ?? []);
  const chyby = [];
  if (polozky.length > LIMITY.maxSouboru) chyby.push(`Nejvýše ${LIMITY.maxSouboru} souborů najednou.`);
  const vysledky = polozky.map((s) => ({ ...zkontrolujSoubor(s), puvodni: s }));
  for (const v of vysledky) for (const c of v.chyby) chyby.push(`${v.puvodni?.name ?? "soubor"}: ${c}`);
  return { ok: chyby.length === 0, chyby, soubory: vysledky };
}

export function zkontrolujPripominku({ zakazka, nazev, text }, povoleneZakazky) {
  const chyby = [];
  const d = { zakazka: ocistiText(zakazka), nazev: ocistiText(nazev), text: ocistiText(text) };
  if (!Array.isArray(povoleneZakazky) || !povoleneZakazky.includes(d.zakazka)) chyby.push("Zakázka není pro vás povolená.");
  if (d.nazev.length < LIMITY.nazevMin || d.nazev.length > LIMITY.nazevMax) chyby.push(`Název má mít ${LIMITY.nazevMin}–${LIMITY.nazevMax} znaků.`);
  if (d.text.length < LIMITY.textMin || d.text.length > LIMITY.textMax) chyby.push(`Text má mít ${LIMITY.textMin}–${LIMITY.textMax} znaků.`);
  return { ok: chyby.length === 0, chyby, data: d };
}
