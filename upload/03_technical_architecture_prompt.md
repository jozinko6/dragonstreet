# Prompt: Technická architektúra objednávacieho systému

Si senior full-stack architekt. Navrhni technickú architektúru pre moderný objednávací a kuriérsky systém pre **Dragon Street Food Hlohovec**.

## Cieľ

Vytvoriť škálovateľný, ale realistický systém pre lokálnu reštauráciu, ktorý zahŕňa verejný web, online objednávky, administráciu, kuchynský panel a vlastný kuriérsky systém.

## Odporúčané technológie

Navrhni vhodný stack. Preferovaný smer:

- Next.js alebo moderný React framework,
- TypeScript,
- Tailwind CSS,
- PostgreSQL,
- Supabase alebo vlastný backend,
- serverless API alebo Node.js backend,
- Stripe / GoPay / TrustPay / CardPay podľa lokálneho kontextu,
- e-mail notifikácie,
- SMS notifikácie voliteľne,
- mapové API pre doručovanie,
- PWA pre kuriérov a personál.

Ak navrhneš iný stack, zdôvodni prečo.

## Moduly systému

Navrhni architektúru pre:

1. verejný web,
2. online menu,
3. objednávkový systém,
4. platobný systém,
5. zákaznícke účty,
6. admin panel,
7. kuchynský panel,
8. kuriérsky panel,
9. dispečerský panel,
10. live tracking,
11. notifikácie,
12. analytiku,
13. promo kódy,
14. vernostný systém.

## Databázový model

Navrhni tabuľky minimálne pre:

- users,
- customers,
- addresses,
- menu_categories,
- menu_items,
- item_variants,
- item_addons,
- allergens,
- orders,
- order_items,
- order_status_history,
- payments,
- delivery_zones,
- couriers,
- courier_locations,
- delivery_assignments,
- promo_codes,
- loyalty_points,
- opening_hours,
- restaurant_settings,
- social_posts,
- reviews.

Pre každú tabuľku uveď:

- názov,
- účel,
- hlavné polia,
- dátové typy,
- vzťahy,
- poznámky k indexom.

## Stavy objednávky

Navrhni stavový model objednávky:

- created,
- payment_pending,
- paid,
- accepted,
- rejected,
- preparing,
- ready_for_pickup,
- courier_assigned,
- picked_up,
- out_for_delivery,
- delivered,
- completed,
- cancelled,
- refunded.

Popíš, kto môže meniť ktorý stav.

## API návrh

Navrhni endpointy pre:

### Public API

- získanie menu,
- detail jedla,
- vytvorenie objednávky,
- výpočet dopravy,
- overenie adresy,
- aplikovanie promo kódu,
- tracking objednávky.

### Admin API

- správa menu,
- správa objednávok,
- zmena stavu,
- správa kuriérov,
- prideľovanie kuriéra,
- štatistiky,
- nastavenia reštaurácie.

### Courier API

- prihlásenie kuriéra,
- prepnutie dostupnosti,
- prijatie objednávky,
- zmena stavu doručenia,
- aktualizácia polohy,
- história doručení.

## Bezpečnosť

Navrhni:

- roly používateľov,
- prístupové práva,
- ochranu admin panelu,
- rate limiting,
- ochranu objednávkového API,
- GDPR pravidlá,
- uchovávanie osobných údajov,
- audit log pre zmeny objednávok.

## Výstup

Vytvor technický dokument v markdown formáte s:

1. architektúrou systému,
2. diagramovým popisom modulov,
3. odporúčaným stackom,
4. databázovým modelom,
5. API návrhom,
6. stavovým modelom objednávok,
7. rolami a právami,
8. bezpečnostnými pravidlami,
9. integračnými bodmi,
10. MVP technickým rozsahom,
11. roadmapou rozšírení.

