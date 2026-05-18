# Prompt: Vlastný kuriérsky systém v štýle Wolt

Si produktový manažér a technický architekt pre delivery logistiku. Navrhni vlastný kuriérsky systém pre **Dragon Street Food Hlohovec**.

## Cieľ

Vytvoriť jednoduchý, ale funkčný kuriérsky systém, ktorý umožní reštaurácii prijímať objednávky, prideľovať ich kuriérom, sledovať stav doručenia a informovať zákazníka v reálnom čase.

Systém má byť inšpirovaný logikou Wolt/Bolt Food, ale prispôsobený malej lokálnej reštaurácii.

## Používatelia systému

Navrhni funkcie pre:

1. zákazníka,
2. kuchyňu,
3. dispečera / manažéra,
4. kuriéra,
5. administrátora.

## Kuriérsky flow

Detailne navrhni proces:

1. zákazník vytvorí objednávku,
2. objednávka sa zobrazí v admin/kuchyni,
3. reštaurácia objednávku prijme,
4. systém odhadne čas prípravy,
5. dispečer vidí dostupných kuriérov,
6. dispečer pridelí objednávku kuriérovi,
7. kuriér dostane notifikáciu,
8. kuriér potvrdí prevzatie,
9. kuriér vyzdvihne objednávku,
10. zákazník vidí stav „kuriér je na ceste“,
11. kuriér doručí objednávku,
12. systém uzavrie objednávku,
13. zákazník dostane výzvu na hodnotenie alebo zdieľanie.

## Funkcie kuriérskeho panelu

Navrhni kuriérsky panel ako mobilnú PWA:

- login,
- stav dostupný/nedostupný,
- aktívna objednávka,
- zoznam pridelených objednávok,
- adresa zákazníka,
- navigácia,
- telefón zákazníkovi,
- poznámka k doručeniu,
- suma na výber pri hotovosti,
- tlačidlo „Vyzdvihnuté“,
- tlačidlo „Doručené“,
- história doručení,
- denný zárobok / počet doručení voliteľne.

## Funkcie dispečera

Navrhni dispečerský panel:

- mapa alebo zoznam kuriérov,
- dostupnosť kuriérov,
- aktuálna poloha kuriérov,
- objednávky čakajúce na priradenie,
- odhadovaný čas prípravy,
- odhadovaný čas doručenia,
- manuálne pridelenie kuriéra,
- automatické odporúčanie kuriéra,
- možnosť zmeniť kuriéra,
- upozornenie na meškanie.

## Automatické prideľovanie

Navrhni logiku odporúčania kuriéra podľa:

- dostupnosti,
- vzdialenosti od reštaurácie,
- aktuálneho počtu objednávok,
- plánovaného času vyzdvihnutia,
- smeru trasy,
- priorít objednávky.

Nemusí ísť o komplexný algoritmus. Navrhni MVP verziu a neskoršie rozšírenie.

## Tracking pre zákazníka

Navrhni stránku sledovania objednávky:

- prijatá objednávka,
- pripravuje sa,
- čaká na kuriéra,
- kuriér vyzdvihol,
- kuriér je na ceste,
- doručené.

Zákazník by mal vidieť:

- odhadovaný čas doručenia,
- meno kuriéra alebo označenie kuriéra,
- možnosť kontaktovať reštauráciu,
- prípadne mapu s približnou polohou.

## Bezpečnosť a súkromie

Navrhni pravidlá:

- zákazník nevidí presnú polohu kuriéra, ak to nie je potrebné,
- kuriér vidí iba údaje potrebné na doručenie,
- telefónne čísla sa chránia,
- poloha kuriéra sa ukladá iba počas pracovného režimu,
- administrátor má audit log zmien.

## Výstup

Vytvor detailný dokument v markdown formáte:

1. cieľ kuriérskeho systému,
2. roly,
3. objednávkový a doručovací flow,
4. kuriérsky panel,
5. dispečerský panel,
6. zákaznícky tracking,
7. stavový model doručenia,
8. algoritmus prideľovania kuriérov,
9. notifikácie,
10. databázové tabuľky,
11. API endpointy,
12. MVP verzia,
13. budúce rozšírenia.

