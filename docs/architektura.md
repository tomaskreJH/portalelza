# Architektura – Portál ELZA

## Princip
Repozitář je **veřejný** a Pages je **statická** stránka. Statický kód nemůže chránit tajemství ani oprávnění, protože ho vidí a může upravit každý návštěvník. Proto:
- portál je jen zobrazení a formulář,
- **ověření uživatele a oprávnění k zakázce vynucuje strana SharePointu** (předávací služba), ne prohlížeč,
- skutečná data (zakázky, kontakty, ceny, výkresy) nejsou v repozitáři nikdy.

## Tok (cílový stav)
```
Prohlížeč (Pages)  →  předávací služba (Power Automate, HTTPS)  →  SharePoint PortalElza
   kod                  vygeneruje kód, uloží HASH do Pristupy,       Pristupy (soukromý)
                        pošle e-mail jen oprávněné adrese            Pripominky
   overit               porovná hash, počet pokusů, platnost,
                        vydá krátkodobý token (30 min)
   seznam               vrátí jen připomínky zakázek účastníka
   pripominky           zapíše připomínku, kontroluje roli a zakázku
```

## Smlouva s předávací službou (JSON, POST, bez cookies)
| Operace | Vstup | Výstup | Povinné kontroly na straně služby |
|---|---|---|---|
| `kod` | `{email}` | `{ok:true}` vždy (nesmí prozradit, zda adresa existuje) | e-mail v `Pristupy`, `Aktivni`, limit odeslání kódu |
| `overit` | `{email, kod}` | `{token, role, zakazky[], platnostMin}` | hash kódu, platnost 10 min, jedno použití, max 5 pokusů, pak blokace 15 min |
| `seznam` | `{zakazka}` + token | `{pripominky[]}` | token platný, zakázka patří účastníkovi |
| `pripominky` | `{zakazka, nazev, text, klic}` + token | `{ok:true}` | token, role smí zapisovat, zakázka, délky, `klic` proti duplicitě |

Odpovědi neobsahují interní chyby. Služba nikdy nevrací data jiné zakázky, než má účastník přiřazenou.

## Známá rizika a jejich ošetření
- **Adresa služby je veřejná** (je vidět v kódu stránky). Služba proto musí odmítnout vše bez platného kódu/tokenu a omezit četnost volání. Adresa s podpisem se nedává do repozitáře bez vědomého rozhodnutí vlastníka (jinak se předává při nasazení mimo repozitář).
- **Vložení do cizího rámce (clickjacking):** GitHub Pages neumí nastavit hlavičky a `frame-ancestors` v meta značce nefunguje. Omezení se přijímá; portál nic nepotvrzuje jedním kliknutím (odeslání je dvoukrokové).
- **Jednorázový kód e-mailem** je slabší než Microsoft účet; v testovací fázi je přijatý, cílem je Entra ID (v1.0).
- **Nechtěný zápis:** výchozí `rezim: "demo"`, `zapis: false`, prázdné adresy; test v CI selže, když se to změní bez úpravy testu. Odeslání je dvoukrokové a tlačítko se zamkne.
- **Soubory (v0.4):** přijímají se do složky příjmu, ne do pracovních dat; ELZA je zkontroluje a až pak přesune do SharePointu zaměstnanců. Přípony jsou omezené, velikost 25 MB.

## SharePoint (PortalElza)
- Názvy bez diakritiky: `Pripominky`, `Pristupy`. Sloupce a typy: `skills/portal-seznamy` v AI_TOM.
- `Pristupy`: oprávnění jen vlastník a služba, v seznamu jen hash kódu (nikdy čistý kód).
- `Pripominky`: zapnuté verzování, účastník nemá právo mazat cizí záznamy.
- Účastníci bez firemního účtu nemají do SharePointu přímý přístup; vše jde přes službu.
