# Plán – Portál ELZA

## Fáze
| Verze | Stav | Obsah |
|---|---|---|
| v0.1 | hotovo | kostra, CI, pravidla, demo |
| v0.2 | plán | předávací služba: kód a ověření (jen čtení seznamu), zápis stále vypnutý |
| v0.3 | plán | zápis připomínek na SharePoint |
| v0.4 | plán | nahrávání souborů do složky příjmu, kontrola ELZOU |
| v1.0 | plán | přihlášení Microsoft účtem, předání zakázky |

## Měřítka rychlosti a paměti (VP kap. 5)
- Objem testovacích dat: 50 zakázek, 500 připomínek, 100 uživatelů (5× očekávaný stav).
- Nejdelší scénář (paměť): 30 min relace s opakovaným odesíláním připomínek.
- Cílové časy: start do 2 s, přepnutí zakázky do 0,3 s na běžném telefonu.
- Měření `npm run perf` (Playwright) od v0.2.
