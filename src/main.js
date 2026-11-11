// Vstup: záhlaví s verzí, přihlášení, přehled zakázky. Relace jen v paměti (po obnovení stránky se odhlásí).
import { VERZE, CONFIG } from "./config.js";
import { el, vymen } from "./core/dom.js";
import { zobrazPrihlaseni } from "./views/prihlaseni.js";
import { zobrazZakazku } from "./views/zakazka.js";

const app = document.getElementById("app");
let relace = null;
let casovac = null;

function odhlasit() {
  relace = null;
  clearTimeout(casovac);
  vykresli();
}

async function vykresli() {
  const zahlavi = el("header", {}, el("h1", {}, "Portál ELZA"), el("span", { class: "verze" }, `beta v${VERZE}`));
  const pruh = CONFIG.rezim === "demo" ? el("p", { class: "pruh" }, "BETA – DEMO: vzorová data, nic se neukládá.") : "";
  const obsah = relace ? await zobrazZakazku(relace, odhlasit) : zobrazPrihlaseni((r) => {
    relace = r;
    casovac = setTimeout(odhlasit, Math.max(0, r.vyprsi - Date.now()));
    vykresli();
  });
  vymen(app, zahlavi, pruh, obsah);
}

vykresli();
