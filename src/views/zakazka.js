// Přehled zakázky: seznam připomínek a formulář s dvoukrokovým odesláním (kontrola → potvrzení).
import { el } from "../core/dom.js";
import { volej, zapisPovolen } from "../core/api.js";
import { CONFIG } from "../config.js";
import { ROLE, zkontrolujPripominku, zkontrolujSoubory } from "../domain/validace.js";

export async function zobrazZakazku(relace, odhlasit) {
  const koren = el("section", { class: "karta" });
  const seznam = el("ul", { class: "seznam" });
  const zprava = el("p", { class: "zprava", role: "status" });
  const prava = ROLE[relace.role];
  const vyber = el("select", { "aria-label": "Zakázka" }, relace.zakazky.map((z) => el("option", { value: z }, z)));

  async function nactiSeznam() {
    try {
      const r = await volej("seznam", { zakazka: vyber.value }, { relace });
      const polozky = r.pripominky.filter((p) => p.zakazka === vyber.value);
      seznam.replaceChildren(...(polozky.length ? polozky.map((p) => el("li", {}, el("strong", {}, p.nazev), ` – ${p.autor} · ${p.stav}`)) : [el("li", {}, "Zatím žádné připomínky.")]));
    } catch { seznam.replaceChildren(el("li", {}, "Seznam se nepodařilo načíst.")); }
  }

  const nazev = el("input", { maxlength: 120, required: true });
  const text = el("textarea", { rows: 5, maxlength: 4000, required: true });
  const soubory = el("input", { type: "file", multiple: true });
  const nahled = el("div", { class: "nahled" });
  const form = el("form", { onsubmit: (e) => { e.preventDefault(); kontrola(); } },
    el("label", {}, "Název", nazev), el("label", {}, "Text připomínky", text),
    prava.soubory ? el("label", {}, "Soubory (výkresy, TZ…)", soubory) : "",
    el("button", { type: "submit" }, "Zkontrolovat"));

  function kontrola() {
    const p = zkontrolujPripominku({ zakazka: vyber.value, nazev: nazev.value, text: text.value }, relace.zakazky);
    const s = zkontrolujSoubory(prava.soubory ? soubory.files : []);
    if (!p.ok || !s.ok) return nahled.replaceChildren(el("ul", { class: "chyby" }, [...p.chyby, ...s.chyby].map((c) => el("li", {}, c))));
    const odeslat = el("button", { type: "button" }, "Odeslat");
    odeslat.addEventListener("click", async () => {
      odeslat.disabled = true; // ochrana proti dvojímu odeslání
      try {
        await volej("pripominky", { ...p.data, klic: crypto.randomUUID() }, { relace });
        nazev.value = ""; text.value = ""; soubory.value = "";
        nahled.replaceChildren(); zprava.textContent = "Připomínka odeslána."; await nactiSeznam();
      } catch (err) { zprava.textContent = err.message; odeslat.disabled = false; }
    });
    const upozorneni = CONFIG.rezim === "demo" ? "DEMO: nic se neukládá." : zapisPovolen() ? "Odesláním se připomínka zapíše do SharePointu." : "Zápis je vypnutý.";
    nahled.replaceChildren(el("h3", {}, "Zkontrolujte před odesláním"), el("p", {}, `${p.data.zakazka}: ${p.data.nazev}`),
      el("p", {}, `Souborů: ${s.soubory.length} (soubory zatím neodesíláme)`), el("p", { class: "napoveda" }, upozorneni),
      el("button", { type: "button", onclick: () => nahled.replaceChildren() }, "Zpět"), odeslat);
  }

  vyber.addEventListener("change", nactiSeznam);
  koren.append(el("h2", {}, `Zakázky – ${prava.nazev}`), vyber, seznam, el("h3", {}, "Nová připomínka"), form, nahled, zprava,
    el("button", { type: "button", class: "druhotne", onclick: odhlasit }, "Odhlásit"));
  await nactiSeznam();
  return koren;
}
