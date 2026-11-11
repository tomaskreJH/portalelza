// Vzorová (smyšlená) data pro režim demo. Žádná skutečná zakázka, jméno ani kontakt.
export const DEMO_KOD = "123456";

const UCASTNICI = {
  "projektant@example.com": { role: "Projektant", zakazky: ["DEMO-001"] },
  "investor@example.com": { role: "Investor", zakazky: ["DEMO-001"] },
  "stavbyvedouci@example.com": { role: "Stavbyvedoucí", zakazky: ["DEMO-001", "DEMO-002"] },
};

let pripominky = [
  { id: "p1", zakazka: "DEMO-001", nazev: "Upřesnit trasu kabelu v 1. NP", autor: "Vzorový projektant", stav: "Nová" },
  { id: "p2", zakazka: "DEMO-001", nazev: "Doplnit výkres rozvaděče", autor: "Vzorový investor", stav: "V řešení" },
  { id: "p3", zakazka: "DEMO-002", nazev: "Termín předání etapy", autor: "Vzorový stavbyvedoucí", stav: "Vyřízeno" },
];

export function demoUcastnik(email) {
  return UCASTNICI[String(email).trim().toLowerCase()] ?? null;
}

export function demoSeznam(zakazky) {
  return pripominky.filter((p) => zakazky.includes(p.zakazka)).map((p) => ({ ...p }));
}

// Jen v paměti stránky; po obnovení zmizí.
export function demoPridej(p) {
  pripominky = [...pripominky, { id: `p${pripominky.length + 1}`, autor: "Vy (demo)", stav: "Nová", ...p }];
}
