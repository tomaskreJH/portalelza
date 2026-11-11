// Konfigurace portálu. Bezpečný výchozí stav: demo, nic se nikam neodesílá.
// Změna režimu nebo zápisu = samostatná verze s úpravou testu tests/bezpecnost.test.js (docs/architektura.md).
export const VERZE = "0.1.0";

export const CONFIG = Object.freeze({
  rezim: "demo", // "demo" = jen vzorová data v prohlížeči; "provoz" = volá předávací službu
  zapis: false, // zápis (připomínky, soubory) je povolen jen při true a rezim "provoz"
  api: Object.freeze({
    kod: "", // https adresa kroku „poslat kód“
    overit: "", // https adresa kroku „ověřit kód“
    seznam: "", // https adresa čtení připomínek
    pripominky: "", // https adresa zápisu připomínky
  }),
  povoleneHosty: Object.freeze([]), // hostitelé předávací služby (musí odpovídat CSP connect-src)
});

export const LIMITY = Object.freeze({
  maxSouboru: 10,
  maxVelikostMB: 25,
  nazevMin: 3,
  nazevMax: 120,
  textMin: 5,
  textMax: 4000,
  kodDelka: 6,
});
