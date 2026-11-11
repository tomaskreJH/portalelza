// Jediné místo, odkud portál volá cokoli mimo stránku. Bez nastavení (CONFIG) neodejde nic.
// Ověření a oprávnění vynucuje SharePoint strana (předávací služba); portál je jen zobrazení (docs/architektura.md).
import { CONFIG } from "../config.js";
import { DEMO_KOD, demoUcastnik, demoSeznam, demoPridej } from "./demo.js";

const OPERACE_ZAPISU = new Set(["pripominky"]);

export function zapisPovolen(cfg = CONFIG) {
  return cfg.rezim === "provoz" && cfg.zapis === true && Boolean(cfg.api.pripominky);
}

export function adresaOperace(operace, cfg = CONFIG) {
  const url = cfg.api?.[operace];
  if (!url) throw new Error("Služba není nastavená.");
  const u = new URL(url);
  if (u.protocol !== "https:" || !cfg.povoleneHosty.includes(u.host)) throw new Error("Adresa služby není povolená.");
  return u.href;
}

export async function volej(operace, data, { cfg = CONFIG, fetchFn = globalThis.fetch, relace = null } = {}) {
  if (cfg.rezim === "demo") return demo(operace, data, relace);
  if (OPERACE_ZAPISU.has(operace) && !zapisPovolen(cfg)) throw new Error("Zápis je vypnutý.");
  const odpoved = await fetchFn(adresaOperace(operace, cfg), {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(relace ? { Authorization: `Bearer ${relace.token}` } : {}) },
    body: JSON.stringify(data),
    credentials: "omit",
    referrerPolicy: "no-referrer",
  });
  if (!odpoved.ok) throw new Error(odpoved.status === 401 || odpoved.status === 403 ? "Nemáte oprávnění." : "Služba neodpověděla.");
  return odpoved.json();
}

function demo(operace, data, relace) {
  if (operace === "kod") return { ok: true };
  if (operace === "overit") {
    const u = demoUcastnik(data.email);
    if (!u || data.kod !== DEMO_KOD) throw new Error("Kód neplatí.");
    return { token: "demo", role: u.role, zakazky: u.zakazky, platnostMin: 30 };
  }
  if (!relace) throw new Error("Nejste přihlášeni.");
  if (operace === "seznam") return { pripominky: demoSeznam(relace.zakazky) };
  if (operace === "pripominky") {
    if (!relace.zakazky.includes(data.zakazka)) throw new Error("Nemáte oprávnění.");
    demoPridej({ zakazka: data.zakazka, nazev: data.nazev });
    return { ok: true };
  }
  throw new Error("Neznámá operace.");
}
