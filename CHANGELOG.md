# Changelog – Portál ELZA

Nejnovější nahoře. Postup vydání: `AGENTS.md`, VP kap. 3.

## v0.1.0 (2026-11-11) – Založení projektu
> **Nasazení – kanál 🧪 BETA:** commit „v0.1 – založení projektu“ do `beta`. Data: žádná (jen demo v paměti stránky). Pravidla databáze: –.

**Přidáno**
- Kostra projektu ze šablony AI_TOM (pravidla VP 2), CI s testy a kontrolou závislostí, Dependabot.
- Přihlášení jednorázovým kódem, přehled zakázek a formulář připomínky v režimu demo; dvoukrokové odeslání.
- Testy validace a pojistek: zápis vypnutý, adresy jen https a povolení hostitelé, bez innerHTML/eval, CSP.
**Beze změny:** žádné volání mimo stránku; předávací služba a SharePoint zatím nejsou zapojeny.
**Ověřeno:** `npm test` (13 testů), `npm audit`.
