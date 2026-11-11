// Přihlášení jednorázovým kódem: e-mail → kód z e-mailu → relace jen v paměti stránky.
import { el } from "../core/dom.js";
import { volej } from "../core/api.js";
import { CONFIG } from "../config.js";
import { jeEmail, jeKod, klicRole } from "../domain/validace.js";

export function zobrazPrihlaseni(naPrihlasen) {
  let email = "";
  const zprava = el("p", { class: "zprava", role: "status" });
  const koren = el("section", { class: "karta" });

  function krokEmail() {
    const pole = el("input", { type: "email", autocomplete: "email", required: true, maxlength: 254 });
    const tlacitko = el("button", { type: "submit" }, "Poslat kód");
    const f = el("form", { onsubmit: async (e) => {
      e.preventDefault();
      if (!jeEmail(pole.value)) return (zprava.textContent = "Zadejte platný e-mail.");
      tlacitko.disabled = true;
      email = pole.value.trim();
      try { await volej("kod", { email }); zprava.textContent = "Pokud je adresa oprávněná, přišel kód."; krokKod(); }
      catch { zprava.textContent = "Kód se nepodařilo odeslat."; tlacitko.disabled = false; }
    } }, el("label", {}, "E-mail", pole), tlacitko);
    koren.replaceChildren(el("h2", {}, "Přihlášení"), f, zprava);
  }

  function krokKod() {
    const pole = el("input", { inputmode: "numeric", autocomplete: "one-time-code", required: true, maxlength: 6, pattern: "[0-9]{6}" });
    const tlacitko = el("button", { type: "submit" }, "Přihlásit");
    const f = el("form", { onsubmit: async (e) => {
      e.preventDefault();
      if (!jeKod(pole.value)) return (zprava.textContent = "Kód má 6 číslic.");
      tlacitko.disabled = true;
      try {
        const r = await volej("overit", { email, kod: pole.value.trim() });
        const role = klicRole(r.role);
        if (!role || !Array.isArray(r.zakazky)) throw new Error("Neplatná odpověď.");
        naPrihlasen({ token: r.token, role, zakazky: r.zakazky, vyprsi: Date.now() + (r.platnostMin ?? 30) * 60000 });
      } catch { zprava.textContent = "Kód neplatí nebo vypršel."; tlacitko.disabled = false; }
    } }, el("label", {}, "Kód z e-mailu", pole), tlacitko);
    koren.replaceChildren(el("h2", {}, "Zadejte kód"), f, zprava);
  }

  krokEmail();
  if (CONFIG.rezim === "demo") koren.append(el("p", { class: "napoveda" }, "Demo: projektant@example.com, kód 123456. Nic se neodesílá ani neukládá."));
  return koren;
}
