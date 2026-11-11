# Portál ELZA

**Aktuální verze: beta v0.1.0 (2026-11-11)** – kostra portálu, režim demo.

Veřejná stránka pro komunikaci ELZY s kontakty zákazníka a zaměstnanci: přihlášení, přehled zakázek, připomínky. Skutečná data a ověření jsou na SharePointu `PortalElza`, tento repozitář obsahuje jen kód a smyšlená demo data.

| Dokument | Obsah |
|---|---|
| [AGENTS.md](AGENTS.md) | pravidla pro AI (obecná VP + projektová) |
| [docs/STAV.md](docs/STAV.md) | kde projekt stojí |
| [docs/architektura.md](docs/architektura.md) | tok dat a bezpečnostní návrh |
| [docs/plan.md](docs/plan.md) | fáze |
| [docs/testy-rucni.md](docs/testy-rucni.md) | ruční test |

## Spuštění a testy
- Lokálně: `npm start` → `http://localhost:3000`.
- `npm ci` jednou, pak `npm test`.

## Kanály
- `main` = stabilní (kořen webu), `beta` = testování (`…/beta/`). Před nasazením běží testy a kontrola závislostí, červené = nic se nenasadí.
- Vydání: Pull requests → New → base `main` ← compare `beta` → Merge.
