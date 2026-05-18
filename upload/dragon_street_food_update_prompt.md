# Prompt pre AI agenta: Úprava existujúceho systému pre Dragon Street Food Hlohovec

## Kontext

Uprav už existujúci návrh/web/objednávací systém pre reštauráciu **Dragon Street Food** v Hlohovci. Nevytváraj nový systém od nuly. Predchádzajúci základ už existuje a tvoja úloha je ho **refaktorovať, obsahovo doplniť, vizuálne upraviť a prispôsobiť reálnej ponuke reštaurácie**.

Dôležité: Názov **Dragon Street Food** neznamená ázijskú kuchyňu. Nepoužívaj texty typu „ázijské špeciality“, „dragon bowl“, „orientálna kuchyňa“, „wok“, „sushi“, „ramen“ ani podobné nesprávne asociácie. Reštaurácia predáva hlavne **street-food klasiky**: burgre, hot-dogy, kebab, pinsu, kapsalón, menu boxy, wrapy/tortilly, syrové snacky, mäso, šaláty, vegánske jedlá, dezerty/mlsky, prílohy a nápoje.

## Zdroje, ktoré musíš zohľadniť

Použi ako obsahový základ aktuálnu verejne dostupnú ponuku z týchto zdrojov:

1. Wolt profil Dragon Street Food Hlohovec
2. Bistro.sk profil Dragon street food
3. Facebook skupina Dragon street food
4. HCREGION jedálny lístok, ak je dostupný

Ak sa ponuky medzi portálmi líšia, ber ich ako viacero predajných kanálov a navrhni systém tak, aby zvládal:

- rozdielne ceny podľa kanálu,
- rozdielne kategórie podľa kanálu,
- dočasné denné menu,
- týždenné špeciály,
- akcie dňa,
- nočný rozvoz,
- položky dostupné iba v určitých časoch,
- položky dostupné iba na rozvoz alebo iba osobný odber.

## Reálne zistené positioning dáta

Aktuálny positioning má byť:

> Dragon Street Food – to naj zo street-food klasík v Hlohovci.

Neprezentuj reštauráciu ako ázijskú. Vizuálny štýl môže používať výrazný „dragon“ branding, ale obsahovo má ísť o **moderný lokálny fast casual / street food**.

Použi tone of voice:

- hladný, energický, mestský,
- jednoduchý a priamy,
- vhodný pre mladých ľudí, rodiny, partie a večerné/nočné objednávky,
- nie príliš luxusný,
- nie ázijsky štylizovaný.

Príklady vhodných textov:

- „Street-food klasiky, ktoré zasýtia.“
- „Burgre, kebab, pinsa, boxy, wrapy a sladké mlsky na jednom mieste.“
- „Objednaj si jedlo v Hlohovci rýchlo, pohodlne a bez zbytočných poplatkov tretím stranám.“
- „Tvoje obľúbené Dragon jedlo priamo z nášho vlastného systému.“

Nepoužívaj:

- „ázijská kuchyňa“,
- „orientálne chute“,
- „wok špeciality“,
- „dragon bowl“, ak taká položka reálne nie je v ponuke,
- generické fine-dining texty.

## Reálna ponuka, ktorú má systém podporovať

Aktualizuj existujúce kategórie a jedálny lístok tak, aby zodpovedali týmto kategóriám:

### Hlavné kategórie

- Najviac objednávané
- Týždenný špeciál
- Denné menu
- Polievka dňa
- Akcia dňa
- Pinsa
- Burgre
- Mini burgre
- Hot dog
- Kebab
- Kapsalón a krídla
- Mäso
- Syry
- Menu box
- Tortilly / wrapy
- Rodinné combo
- Šaláty
- Pre vegánov
- Špeci ponuka
- Mlsky / dezerty
- Prílohy
- Dresingy
- Nápoje

### Príklady položiek, ktoré majú byť pridané alebo použité ako seed dáta

#### Najviac objednávané

- Kebab box – kebab mäso, hranolky, zelenina, dresing
- Griff Burger – domáca maslová žemľa, hovädzie mäso, cheddar, slanina, karamelizovaná červená cibuľa, slaninová omáčka
- Chicken honey burger – kuracie smažené mäso, šalát, paradajka, cibuľa, kyslé uhorky, cheddar, slanina, horčicovo-medová omáčka
- Palacinky
- Extra slaninové hranolky

#### Pinsa

- Pinsa mozzarella, špenát, šunka
- Pinsa mozzarella, prosciutto, rukola
- Pinsa šunka, mozzarella, kukurica
- Pinsa burrata, prosciutto, olivy
- Pinsa kebab, mozzarella
- Pinsa chorizo, mozzarella, údený syr
- Pinsa mozzarella, slanina, sladká chilli, kukurica

#### Burgre

- Dragon Burger + hranolky
- Griff Burger
- Šmakov Burger + hranolky
- Leviatan Burger + hranolky
- Flákota Burger
- Flákota Chicken Burger
- Drako Burger
- Ruth Burger
- Moto Burger
- Chicken Honey Burger
- Bryndzový Burger
- Cheese Burger mini
- Double Cheese so slaninou mini

#### Hot dog

- Americký Hot-dog
- Americký Hot-dog cheese
- Americký Hot-dog bacon
- Americký Hot-dog slaninový-pikantný

#### Kebab a kapsalón

- Kebab box
- Kapsalón kurací – hranolky
- Kapsalón hovädzí – hranolky
- Kapsalón kurací – ryža
- Kapsalón hovädzí – ryža
- Krídla BBQ
- Kuracie krídla Buffalo

#### Mäso

- Hovädzie trhané líčka
- Kurací smažený rezeň
- Kuracie prsia grilované
- Vegánske mäso
- Kuracie nugetky 5 ks
- Kuracie nugetky 10 ks
- Kuracie nugetky 15 ks
- Kebab mäso

#### Syry

- Jalapeňo plnené syrom
- Syr v 3-obale
- Hermelín grilovaný
- Mozzarella tyčinky
- Syrové guličky
- Syrové nachos trojuholníky
- Chilli syr kúsky
- Camembert dukátiky
- Údené donuty
- Syrové vankúšiky

#### Menu box

- Kurací box
- Kurací box s nugetkami
- Bravčový box
- Kurací box deluxe
- Hovädzie líčka box
- Zeleninový box
- Syrový box
- Popin box

#### Tortilly / wrapy

- Zapekaná tortilla slaninová
- Zapekaná tortilla kuracia
- Zapekaná tortilla 3 druhy syra
- Zapekaná tortilla s bravčovým trhaným mäsom
- Wrap kurací
- Wrap hovädzí

#### Rodinné combo

- Kebab misa pre dvoch
- Kýblik stripsy
- Kýblik výber syrov
- Kýblik kuracie nugetky
- Kýblik batáty
- Jumbo kýblik
- 2x Griff burger + 2x hranolky
- Kuracie krídla buffalo
- Misa pre hladošov

#### Šaláty

- Ryu šalát
- ďalšie šaláty podľa aktuálneho menu, ak sú dostupné

#### Pre vegánov

- Vegán Šmak burger
- Vegán burger červená repa
- Vegán box

#### Špeci ponuka

- Cibuľové krúžky
- Cibuľové krúžky v pikant cestíčku
- Kurací popcorn

#### Mlsky / dezerty

- Palacinky
- Palacinky Lotus
- Lievance + javorový sirup
- Lievance + malinový sirup
- Lievance + karamelový sirup
- Churros vanilka
- Churros škorica
- Churros jahoda, vanilka
- Churros škorica, biela čokoláda

#### Prílohy

- Hranolky solené
- Belgické hranolky
- Domáce hranolky korenené
- Batátové hranolky
- Zemiakové placky
- Hranolky špeciál
- Extra cheddarové hranolky
- Hranolky Balkán

#### Nápoje

- Bonaqua nesýtená
- Bonaqua jemne sýtená
- Bonaqua ochutená
- Fuze Tea
- Sprite 0,33 l
- Sprite 0,5 l
- Fanta 0,33 l
- Coca-Cola 0,5 l
- Coca-Cola Zero 0,33 l
- Coca-Cola Zero 0,5 l
- Zlatý Bažant 0,0 %
- Zlatý Bažant 10 % – označiť ako 18+

## Úloha: upraviť existujúci systém, nie vytvoriť nový

Pracuj s existujúcou aplikáciou a doplň alebo uprav najmä tieto oblasti:

1. Homepage
2. Jedálny lístok
3. Produktové karty
4. Košík a checkout
5. Objednávkový flow
6. Admin menu manažment
7. Kurierský dashboard
8. Marketingové prvky pre Facebook a Instagram
9. SEO texty
10. Seed dáta podľa aktuálnej ponuky

Nevytváraj nový projekt, novú architektúru ani nové repo, pokiaľ už existujúce riešenie funguje. Preferuj malé, bezpečné úpravy nad veľkým prepisom.

## Homepage – úpravy textov a obsahu

Nahradiť generické alebo nesprávne texty novým positioningom.

### Hero headline

Použi napríklad:

> Street-food klasiky z Hlohovca priamo k tebe

### Hero subheadline

> Burgre, kebab, pinsa, hot-dogy, boxy, wrapy, dezerty a rodinné combá. Objednaj si rýchlo cez náš vlastný systém – na rozvoz alebo osobný odber.

### Primárne CTA

- Objednať online
- Pozrieť menu

### Sekundárne CTA

- Zavolať
- Zdieľať na Facebooku
- Zdieľať na Instagrame

### Sekcia „Prečo objednať priamo u nás“

Pridaj sekciu vysvetľujúcu výhodu vlastného objednávacieho systému:

- priama objednávka do reštaurácie,
- menej závislosti od sprostredkovateľov,
- vlastné akcie a vernostné výhody,
- jednoduchší kontakt pri zmene objednávky,
- podpora lokálnej reštaurácie.

Text:

> Keď objednávaš priamo cez Dragon, podporuješ lokálnu prevádzku a získavaš prístup k vlastným akciám, špeciálom a rýchlejšej komunikácii.

## Jedálny lístok – požiadavky

Uprav menu tak, aby bolo navrhnuté pre veľký počet položiek. Menu musí byť rýchle, prehľadné a vhodné pre mobil.

### Funkcie menu

- horizontálne sticky kategórie,
- vyhľadávanie jedál,
- filtre: burgre, kebab, pinsa, boxy, vegánske, dezerty, nápoje,
- štítky: obľúbené, nové, akcia, pikantné, vegánske, 18+,
- zobrazenie alergénov,
- zobrazenie gramáže,
- dostupnosť podľa času,
- možnosť označiť položku ako dočasne vypredanú,
- odporúčané doplnky: dresing, hranolky, nápoj, dezert.

### Produktová karta

Každá produktová karta má obsahovať:

- názov jedla,
- krátky popis,
- cenu,
- gramáž,
- alergény,
- fotku alebo placeholder,
- štítky,
- tlačidlo „Pridať do košíka“,
- voliteľné modifikátory.

### Modifikátory

Implementuj alebo uprav podporu modifikátorov:

- výber dresingu,
- príloha,
- extra syr,
- extra mäso,
- pikantnosť,
- nápoj k menu,
- poznámka k jedlu.

## Checkout – úpravy

Checkout musí byť jednoduchý a rýchly.

### Typ objednávky

- Rozvoz
- Osobný odber

### Zákaznícke údaje

- meno,
- telefón,
- e-mail voliteľný,
- adresa pri rozvoze,
- poznámka pre kuchyňu,
- poznámka pre kuriéra.

### Platba

Priprav systém tak, aby podporoval:

- hotovosť,
- platba kartou pri prevzatí,
- online platba kartou – pripraviť integračný bod, nemusí byť hotová v MVP,
- označenie alkoholických položiek ako 18+.

### Doručovacie zóny

Doplň zóny podľa známej lokálnej donášky. Systém musí umožniť upravovať cenu rozvozu a minimálnu objednávku v administrácii.

Seed zóny:

- Hlohovec – dovoz 1,00 €, nad 15 € dovoz zadarmo, minimálna objednávka 5,00 €
- Šulekovo – dovoz 2,50 €, minimálna objednávka 15,00 €
- Koplotovce – dovoz 3,00 €, minimálna objednávka 15,00 €
- Leopoldov – dovoz 3,00 €, minimálna objednávka 18,00 €
- Červeník – dovoz 3,50 €, minimálna objednávka 20,00 €
- Bojničky – dovoz 4,00 €, minimálna objednávka 15,00 €
- Bučany – dovoz 4,00 €, minimálna objednávka 20,00 €
- Dolné Zelenice – dovoz 4,00 €, minimálna objednávka 20,00 €
- Horné Zelenice – dovoz 4,00 €, minimálna objednávka 20,00 €
- Kľačany – dovoz 4,00 €, minimálna objednávka 20,00 €
- Madunice – dovoz 4,00 €, minimálna objednávka 20,00 €
- Malženice – dovoz 4,00 €, minimálna objednávka 20,00 €
- Rišňovce – dovoz 4,00 €, minimálna objednávka 20,00 €
- Tepličky – dovoz 4,00 €, minimálna objednávka 20,00 €
- Trakovice – dovoz 4,00 €, minimálna objednávka 20,00 €
- Sasinkovo – dovoz 4,50 €, minimálna objednávka 20,00 €
- Alekšince – dovoz 5,00 €, minimálna objednávka 20,00 €
- Brestovany – dovoz 5,00 €, minimálna objednávka 20,00 €
- Dvorníky – dovoz 5,00 €, minimálna objednávka 20,00 €
- Siladice – dovoz 5,50 €, minimálna objednávka 20,00 €
- Piešťany – dovoz 8,50 €, minimálna objednávka 25,00 €

## Otváracie a doručovacie časy

Systém musí podporovať viacero typov časov:

- otváracie hodiny prevádzky,
- doručovacie hodiny,
- nočný rozvoz,
- špeciálne výnimky,
- dočasné zatvorenie,
- sviatky.

Seed doručovacích časov podľa Wolt profilu:

- Pondelok: zatvorené
- Utorok: 11:30 – 22:20
- Streda: 11:30 – 22:20
- Štvrtok: 11:30 – 22:20
- Piatok: 12:00 – 01:00
- Sobota: 12:30 – 01:00
- Nedeľa: 14:00 – 22:00

Priprav administráciu tak, aby si reštaurácia vedela tieto časy meniť bez zásahu vývojára.

## Vlastný kuriérsky systém – úprava existujúcej funkcionality

Nemeň cieľ systému: má fungovať ako jednoduchý vlastný dispečing v štýle Wolt, ale pre interných kuriérov reštaurácie.

Uprav existujúci kuriérsky systém tak, aby podporoval:

### Role

- Admin / majiteľ
- Kuchyňa
- Dispečer
- Kuriér
- Zákazník

### Stavy objednávky

- Nová objednávka
- Potvrdená
- V príprave
- Pripravená
- Pridelená kuriérovi
- Kuriér ide do prevádzky
- Vyzdvihnutá kuriérom
- Na ceste
- Doručená
- Zrušená
- Problém s objednávkou

### Admin / dispečer pohľad

- zoznam aktuálnych objednávok,
- farebné stavy,
- čas od prijatia objednávky,
- odhadovaný čas prípravy,
- adresa zákazníka,
- cena objednávky,
- spôsob platby,
- poznámky,
- tlačidlo „Prideliť kuriéra“,
- možnosť zmeniť stav,
- možnosť kontaktovať zákazníka,
- možnosť označiť objednávku ako problémovú.

### Kuriérsky pohľad

- prihlásený kuriér vidí iba svoje objednávky,
- zoznam pridelených objednávok,
- detail objednávky,
- adresa a navigácia,
- telefón zákazníka,
- poznámka pre kuriéra,
- platba, ktorú má vybrať,
- tlačidlá stavov: „Idem do prevádzky“, „Vyzdvihnuté“, „Na ceste“, „Doručené“, „Problém“.

### Automatické prideľovanie – odporúčanie

Ak už systém má základ prideľovania, uprav ho nasledovne:

- primárne prideľuj kuriéra s najmenším počtom aktívnych objednávok,
- zohľadni zónu doručenia,
- zohľadni aktuálny stav kuriéra: dostupný, na rozvoze, pauza, offline,
- ak nie je dostupný kuriér, objednávka ostane v stave „Čaká na pridelenie“,
- admin musí mať možnosť manuálne prepísať kuriéra.

## Marketing: Facebook a Instagram

Uprav existujúci systém tak, aby podporoval zdieľanie a rast viditeľnosti na sociálnych sieťach.

### Funkcie zdieľania

Pridaj alebo uprav:

- tlačidlo „Zdieľať menu na Facebooku“,
- tlačidlo „Zdieľať akciu dňa“,
- tlačidlo „Zdieľať týždenný špeciál“,
- tlačidlo „Zdieľať jedlo“,
- tlačidlo „Zdieľať objednávku s kamarátom“,
- Open Graph obrázky pre kategórie a jedlá,
- copy-ready text pre Facebook a Instagram.

### Open Graph a SEO

Každá dôležitá stránka má mať:

- title,
- meta description,
- og:title,
- og:description,
- og:image,
- canonical URL,
- structured data pre Restaurant a Menu.

### Sociálne texty

Priprav automaticky generované texty napríklad:

#### Pre burger

> Dnes mám chuť na poriadny burger z Dragon Street Food Hlohovec. Kto sa pridá? 🍔🔥

#### Pre menu / špeciál

> Dragon má dnes nový špeciál. Klikni, pozri menu a objednaj si priamo. 🔥

#### Pre rodinné combo

> Jedlo pre celú partiu? Dragon Street Food má rodinné combá, boxy a kýbliky, ktoré zasýtia každého. 🍟🍔

#### Pre dezerty

> Palacinky, lievance alebo churros? Sladká bodka z Dragonu je vždy dobrý nápad. 🥞

### Instagram

Instagram nepodporuje klasické priame zdieľanie do feedu cez web rovnako ako Facebook. Preto navrhni:

- tlačidlo „Kopírovať text pre Instagram“,
- generovanie štvorcového promo obrázka 1080x1080,
- generovanie story formátu 1080x1920,
- QR kód na objednávku,
- odkaz na profil v pätičke,
- možnosť uložiť promo obrázok.

## Facebook skupina – zapracovanie

Facebook skupina má byť použitá ako komunitný kanál. Keďže verejný prístup ku skupine môže byť obmedzený, neprenášaj neoverené príspevky ako fakty. Použi len bezpečný obsahový smer:

- komunikovať aktuálne menu,
- akcie dňa,
- týždenné špeciály,
- denné menu,
- fotky jedál,
- nočný rozvoz,
- nové položky,
- hlasovania o nových jedlách,
- súťaže typu „označ kamoša“.

Do adminu pridaj sekciu „Marketingové príspevky“, kde majiteľ vyberie položku alebo akciu a systém mu vygeneruje:

- Facebook text,
- Instagram caption,
- krátku verziu pre story,
- hashtagy,
- obrázkový podklad.

## Odporúčaný vizuálny smer

Uprav dizajn existujúceho systému tak, aby sedel reálnemu street-food charakteru.

### Dizajn

- tmavé pozadie alebo tmavé sekcie,
- výrazné akcenty: červená, oranžová, žltá,
- veľké fotky jedál,
- výrazné CTA tlačidlá,
- mobile-first layout,
- jednoduché karty jedál,
- sticky košík na mobile,
- rýchle kategórie hore.

### Branding

Použi „dragon“ ako vizuálny prvok, nie ako kuchynskú asociáciu. Môže ísť o:

- plameň,
- energiu,
- výrazný maskot,
- street-food grafiku,
- oheň/chrumkavosť/šťavnatosť.

Nesmie to pôsobiť ako ázijské bistro.

## Admin požiadavky

Uprav admin tak, aby majiteľ vedel meniť obsah bez vývojára.

### Admin musí umožniť

- správa kategórií,
- správa položiek menu,
- ceny,
- gramáž,
- alergény,
- fotky,
- dostupnosť,
- akcie,
- denné menu,
- týždenný špeciál,
- zóny rozvozu,
- otváracie hodiny,
- kuriéri,
- stavy objednávok,
- marketingové príspevky,
- export objednávok.

## Dátový model – uprav existujúci

Ak už databáza existuje, navrhni migrácie namiesto prepisu.

Skontroluj, či existujú tieto entity alebo ich ekvivalenty:

- RestaurantSettings
- Category
- MenuItem
- MenuItemVariant
- ModifierGroup
- ModifierOption
- Allergen
- DeliveryZone
- OpeningHours
- Order
- OrderItem
- OrderStatusHistory
- Courier
- CourierShift
- CourierAssignment
- MarketingPost
- PromoCampaign
- SocialShareAsset

Ak chýbajú, navrhni najmenšie možné doplnenie.

## MVP rozsah úprav

Priorita 1 – nutné:

- opraviť positioning a texty,
- odstrániť ázijské asociácie,
- doplniť reálne kategórie menu,
- doplniť seed položky podľa Wolt/Bistro/HCREGION,
- upraviť homepage,
- upraviť produktové karty,
- upraviť rozvozové zóny,
- upraviť otváracie/doručovacie časy,
- doplniť zdieľanie na Facebook,
- doplniť Instagram copy/export,
- upraviť kuriérske stavy.

Priorita 2 – veľmi dôležité:

- marketingový generátor príspevkov,
- OG obrázky,
- SEO štruktúrované dáta,
- admin pre denné menu a špeciály,
- automatické prideľovanie kuriérov.

Priorita 3 – neskôr:

- online platby,
- vernostný systém,
- kupóny,
- push notifikácie,
- SMS notifikácie,
- mapové sledovanie kuriéra v reálnom čase,
- analytika najpredávanejších jedál.

## Výstup, ktorý má AI agent pripraviť

Priprav konkrétny plán úprav existujúceho systému:

1. Audit existujúceho stavu
2. Zoznam textov, ktoré treba prepísať
3. Upravená informačná architektúra
4. Upravené kategórie menu
5. Seed dáta menu
6. UX zmeny objednávkového procesu
7. Úpravy adminu
8. Úpravy kuriérskeho systému
9. Marketingové a sociálne funkcie
10. Databázové migrácie, ak treba
11. Implementačný checklist
12. Testovací checklist

## Testovací checklist

Po úpravách over:

- stránka nikde nekomunikuje ázijskú kuchyňu,
- hlavná ponuka sedí na street-food klasiky,
- menu je použiteľné na mobile,
- košík správne počíta cenu,
- rozvozová zóna správne nastaví cenu a minimálnu objednávku,
- objednávka prejde do adminu,
- objednávku možno priradiť kuriérovi,
- kuriér vie meniť stavy,
- zákazník vidí stav objednávky,
- FB zdieľanie má správny titulok, popis a obrázok,
- Instagram funkcia pripraví text/obrázok na skopírovanie alebo stiahnutie,
- alkoholické položky sú označené 18+,
- zatvorené hodiny blokujú nové objednávky alebo ponúkajú naplánovanie.

## Finálne pravidlá

- Neupravuj systém ako nový produkt od nuly.
- Použi existujúci základ a doplň len potrebné zmeny.
- Texty prispôsob reálnej ponuke Dragon Street Food.
- Nepoužívaj ázijský positioning.
- Zameraj sa na viac priamych objednávok, menej závislosti od Wolt/Bistro a jednoduchý vlastný kuriérsky dispečing.
- Výsledok má pôsobiť ako moderný lokálny street-food objednávací systém pre Hlohovec a okolie.
