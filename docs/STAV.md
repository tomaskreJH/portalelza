# Stav projektu Portál ELZA

Krátký vstup pro každé vlákno. Nahrazovat, ne přidávat historii (ta je v `CHANGELOG.md`).

## Verze
- **Beta:** v0.1.0 (2026-11-11), režim demo
- **Stabilní (`main`):** –
- **Další číslo:** v0.2
- **Pravidla databáze:** – (SharePoint seznamy, oprávnění ověřit)
- **Poslední audit:** –

## K testu
- Beta se načte, přihlášení demo účtem, odeslání připomínky v demu, bez síťových volání.

## Otevřené
1. Pages: zdroj „GitHub Actions“, prostředí `github-pages` povolit pro `main` a `beta`.
2. Ověřit nastavení seznamů `Pripominky` a `Pristupy` (sloupce, oprávnění, verzování).
3. Předávací služba (Power Automate): kód, ověření, seznam, zápis; smlouva v `docs/architektura.md`.
4. Rozhodnout: smí Investor přikládat soubory (v0.1: ne).
5. Nahrávání souborů (v0.1 jen kontrola, neodesílá se).
