export type HomeContent = {
  hero: {
    badge: string
    title: string
    highlight: string
    description: string
    primaryCta: string
    secondaryCta: string
    image: string
  }
  stats: { label: string; value: string }[]
  popular: {
    badge: string
    title: string
    description: string
    cta: string
  }
  categories: {
    title: string
    highlight: string
    description: string
  }
  benefits: {
    badge: string
    title: string
    highlight: string
    description: string
    cards: { title: string; description: string }[]
  }
  steps: {
    title: string
    highlight: string
    description: string
    items: { title: string; description: string; icon: string }[]
  }
  cta: {
    badge: string
    title: string
    description: string
    promoCode: string
    button: string
  }
  social: {
    text: string
    facebookButton: string
    instagramButton: string
    instagramShareText: string
  }
  about: {
    badge: string
    title: string
    highlight: string
    paragraphs: string[]
    stats: { value: string; label: string }[]
    images: string[]
  }
  contact: {
    hoursTitle: string
    hoursFallback: string
    contactTitle: string
    address: string
    phone: string
    deliveryText: string
  }
}

export type CookieContent = {
  title: string
  text: string
  acceptButton: string
  rejectButton: string
  privacyLink: string
}

export type LegalSeed = {
  slug: string
  title: string
  content: string
}

export const defaultHomeContent: HomeContent = {
  hero: {
    badge: 'STREET FOOD HLOHOVEC',
    title: 'Street-food klasiky z Hlohovca',
    highlight: 'priamo k tebe',
    description: 'Burgre, kebab, pinsa, hot-dogy, boxy, wrapy, dezerty a rodinné combá. Objednaj si rýchlo cez náš vlastný systém - na rozvoz alebo osobný odber.',
    primaryCta: 'Objednať online',
    secondaryCta: 'Pozrieť menu',
    image: '/images/hero-bg.jpg',
  },
  stats: [
    { label: 'Doručenie', value: '25-45 min' },
    { label: 'Otváracie hodiny', value: 'Ut-Ne (Po zatv.)' },
    { label: 'Hodnotenie', value: '4.8 ★' },
    { label: 'Lokalita', value: 'Hlohovec a okolie' },
  ],
  popular: {
    badge: 'OBĽÚBENÉ',
    title: 'Naše najobľúbenejšie jedlá',
    description: 'To, čo si naši zákazníci objednávajú najčastejšie',
    cta: 'Celé menu',
  },
  categories: {
    title: 'Čo si dnes',
    highlight: 'chutí',
    description: 'Vyberte si z našich kategórií',
  },
  benefits: {
    badge: 'PREČO MY',
    title: 'Prečo objednať',
    highlight: 'priamo u nás',
    description: 'Keď objednávaš priamo cez Dragon, podporuješ lokálnu prevádzku a získavaš prístup k vlastným akciám, špeciálom a rýchlejšej komunikácii.',
    cards: [
      { title: 'Priama objednávka', description: 'Objednávka ide priamo do našej kuchyne - žiadni sprostredkovatelia' },
      { title: 'Vlastné akcie', description: 'Prístup k akciám dňa, týždenným špeciálom a promo kódom' },
      { title: 'Rýchlejší kontakt', description: 'Zmena objednávky alebo otázka priamo u nás' },
      { title: 'Podpora lokálnej prevádzky', description: 'Podporuješ miestnu reštauráciu namiesto nadnárodných platforiem' },
    ],
  },
  steps: {
    title: 'Ako to',
    highlight: 'funguje',
    description: 'Objednajte si za menej než 60 sekúnd',
    items: [
      { title: 'Vyberte si jedlo', description: 'Prechádzajte naším menu a pridajte obľúbené položky do košíka', icon: '🍔' },
      { title: 'Zvoľte doručenie', description: 'Doručenie k vám domov alebo osobný odber v reštaurácii', icon: '🛵' },
      { title: 'Zaplaťte', description: 'Online kartou alebo hotovosťou pri doručení - vyberte si', icon: '💳' },
      { title: 'Užite si jedlo', description: 'Sledujte stav objednávky v reálnom čase a užite si skvelé jedlo', icon: '🎉' },
    ],
  },
  cta: {
    badge: '🔥 ŠPECIÁLNA PONUKA',
    title: 'Prvá online objednávka so zľavou 10%',
    description: 'Použite promo kód pri vašej prvej objednávke a získajte 10% zľavu.',
    promoCode: 'DRAGON10',
    button: 'Objednať teraz',
  },
  social: {
    text: 'Zdieľajte nás so priateľmi!',
    facebookButton: 'Zdieľať na Facebooku',
    instagramButton: 'Zdieľať na Instagrame',
    instagramShareText: 'Skvelé street food v Hlohovci! Burgre, kebab, pinsa a viac - objednaj online na Dragon Street Food!',
  },
  about: {
    badge: 'O NÁS',
    title: 'Street food s',
    highlight: 'dušou',
    paragraphs: [
      'Dragon Street Food vznikol z vášne k street foodu a túžby priniesť tie najlepšie chute do Hlohovca. Naše jedlá pripravujeme z čerstvých surovín s dôrazom na kvalitu a rýchlosť.',
      'Burgre, kebaby, pinsy, hot dogy, wrapy - všetko, čo máš rád, na jednom mieste. A ak nemáš čas zájsť k nám, radi vám doručíme až domov.',
    ],
    stats: [
      { value: '500+', label: 'Doručení' },
      { value: '4.8', label: 'Hodnotenie' },
      { value: '80+', label: 'Jedál v menu' },
    ],
    images: ['/images/kebab.jpg', '/images/hotdog.jpg', '/images/chicken-wings.jpg', '/images/fries.jpg'],
  },
  contact: {
    hoursTitle: 'Otváracie hodiny',
    hoursFallback: 'Otváracie hodiny sa nepodarilo načítať.',
    contactTitle: 'Kontakt',
    address: 'Hlavná 42, 931 01 Hlohovec',
    phone: '+421 912 345 678',
    deliveryText: 'Doručujeme v Hlohovci a okolí',
  },
}

export const defaultCookieContent: CookieContent = {
  title: 'Cookies',
  text: 'Používame nevyhnutné cookies na fungovanie košíka, objednávok a prihlásenia do interných panelov. Voliteľné analytické cookies zapneme iba po vašom súhlase.',
  acceptButton: 'Súhlasím',
  rejectButton: 'Len nevyhnutné',
  privacyLink: 'Ochrana osobných údajov',
}

export const defaultLegalDocuments: LegalSeed[] = [
  {
    slug: 'terms',
    title: 'Obchodné podmienky',
    content: `# Obchodné podmienky

Tieto obchodné podmienky upravujú objednávanie jedál cez web Dragon Street Food Hlohovec.

## Objednávka
Zákazník odoslaním objednávky potvrdzuje správnosť zadaných údajov, najmä telefónneho čísla, adresy doručenia a zvoleného spôsobu prevzatia.

## Cena a platba
Cena objednávky je zobrazená v košíku pred odoslaním. Platba môže byť dostupná podľa aktuálnych možností prevádzky.

## Doručenie a osobný odber
Doručenie závisí od otváracích hodín, dostupnosti kuriéra a doručovacej zóny. Prevádzka môže zákazníka kontaktovať telefonicky pre upresnenie objednávky.

## Reklamácie
V prípade problému s objednávkou kontaktujte prevádzku čo najskôr telefonicky alebo emailom.

## Prevádzkovateľ
Doplňte presné obchodné meno, IČO, DIČ, sídlo a kontaktné údaje prevádzkovateľa.`,
  },
  {
    slug: 'privacy',
    title: 'Ochrana osobných údajov',
    content: `# Ochrana osobných údajov

Pri objednávke spracúvame údaje potrebné na vybavenie objednávky: meno, telefón, email, adresu doručenia a poznámku k objednávke.

## Účel spracúvania
Údaje používame na prijatie, prípravu, doručenie a prípadné riešenie objednávky.

## Doba uchovávania
Údaje uchovávame iba po dobu potrebnú na vybavenie objednávky a splnenie zákonných povinností.

## Cookies
Web používa nevyhnutné cookies pre košík, objednávky a prihlásenie obsluhy. Voliteľné cookies sa používajú len po súhlase.

## Kontakt
Doplňte kontaktný email a údaje prevádzkovateľa pre žiadosti týkajúce sa osobných údajov.`,
  },
]
