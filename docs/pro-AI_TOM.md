# Návrhy obecných pravidel pro AI_TOM

Obecné pravidlo vzniklé v tomto projektu (VP kap. 7). AI_TOM je převezme při synchronizaci; pak se doplní „převzato VP n“.

| Datum | Pravidlo | Proč | Stav |
|---|---|---|---|
| 2026-11-11 | Veřejný web (Pages) je jen zobrazení: ověření a oprávnění vynucuje serverová strana, zápis je ve výchozím stavu vypnutý a jeho zapnutí je samostatná verze s úpravou pojistného testu. | Statický kód nemůže chránit tajemství ani oprávnění; nechtěný zápis se tak zachytí v CI. | čeká na AI_TOM |
| 2026-11-11 | Veřejný repozitář: jen kód a smyšlená data; test hlídá podpisy adres a klíče. | Veřejný repozitář vidí každý. | čeká na AI_TOM |
