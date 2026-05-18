import { PrismaClient, DiscountType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clean existing data (in reverse dependency order)
  console.log('  Cleaning existing data...')
  await prisma.orderItemAddon.deleteMany()
  await prisma.orderStatusHistory.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.review.deleteMany()
  await prisma.itemAddon.deleteMany()
  await prisma.menuItem.deleteMany()
  await prisma.menuCategory.deleteMany()
  await prisma.deliveryZone.deleteMany()
  await prisma.promoCode.deleteMany()
  await prisma.courier.deleteMany()
  await prisma.address.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.restaurantSettings.deleteMany()
  await prisma.marketingPost.deleteMany()
  await prisma.openingHours.deleteMany()

  // ─── Restaurant Settings ────────────────────────────────────────────────────
  console.log('  Creating restaurant settings...')
  const settings = await prisma.restaurantSettings.create({
    data: {
      name: 'Dragon Street Food Hlohovec',
      address: 'Hlavná 42, 920 01 Hlohovec',
      phone: '+421 912 345 678',
      email: 'info@dragonstreetfood.sk',
      openingHours: JSON.stringify([
        { day: 'Po', hours: 'Zatvorené', isClosed: true },
        { day: 'Ut', hours: '11:30 – 22:20' },
        { day: 'St', hours: '11:30 – 22:20' },
        { day: 'Št', hours: '11:30 – 22:20' },
        { day: 'Pi', hours: '12:00 – 01:00' },
        { day: 'So', hours: '12:30 – 01:00' },
        { day: 'Ne', hours: '14:00 – 22:00' },
      ]),
      minOrderAmount: 5.0,
      deliveryFee: 1.0,
      freeDeliveryThreshold: 15.0,
      isActive: true,
      acceptOnlineOrders: true,
      nightDeliveryEnabled: true,
      nightDeliveryFrom: '22:00',
      nightDeliveryTo: '01:00',
    },
  })

  // ─── Opening Hours ──────────────────────────────────────────────────────────
  console.log('  Creating opening hours...')
  await Promise.all([
    prisma.openingHours.create({ data: { dayOfWeek: 0, openTime: '00:00', closeTime: '00:00', isClosed: true, isDelivery: false } }),
    prisma.openingHours.create({ data: { dayOfWeek: 1, openTime: '11:30', closeTime: '22:20', isClosed: false, isDelivery: true } }),
    prisma.openingHours.create({ data: { dayOfWeek: 2, openTime: '11:30', closeTime: '22:20', isClosed: false, isDelivery: true } }),
    prisma.openingHours.create({ data: { dayOfWeek: 3, openTime: '11:30', closeTime: '22:20', isClosed: false, isDelivery: true } }),
    prisma.openingHours.create({ data: { dayOfWeek: 4, openTime: '12:00', closeTime: '01:00', isClosed: false, isDelivery: true } }),
    prisma.openingHours.create({ data: { dayOfWeek: 5, openTime: '12:30', closeTime: '01:00', isClosed: false, isDelivery: true } }),
    prisma.openingHours.create({ data: { dayOfWeek: 6, openTime: '14:00', closeTime: '22:00', isClosed: false, isDelivery: true } }),
  ])

  // ─── Menu Categories (24) ──────────────────────────────────────────────────
  console.log('  Creating menu categories...')
  const categoryData = [
    { name: 'Najviac objednávané', nameSk: 'Najviac objednávané', slug: 'najviac-objednavane', description: 'Naše najobľúbenejšie jedlá, ktoré si objednávate najčastejšie', image: '/images/burger.jpg', sortOrder: 1 },
    { name: 'Týždenný špeciál', nameSk: 'Týždenný špeciál', slug: 'tyzdenny-special', description: 'Špeciálna ponuka tejto týždňa – len na obmedzený čas!', image: '/images/burger.jpg', sortOrder: 2 },
    { name: 'Denné menu', nameSk: 'Denné menu', slug: 'denne-menu', description: 'Kompletné denné menu s polievkou a nápojom', image: '/images/menu-box.jpg', sortOrder: 3 },
    { name: 'Polievka dňa', nameSk: 'Polievka dňa', slug: 'polievka-dna', description: 'Denne meniaca sa polievka z čerstvých surovín', image: '/images/hero-bg.jpg', sortOrder: 4 },
    { name: 'Akcia dňa', nameSk: 'Akcia dňa', slug: 'akcia-dna', description: 'Dnešná akčná ponuka za skvelú cenu', image: '/images/burger.jpg', sortOrder: 5 },
    { name: 'Pinsa', nameSk: 'Pinsa', slug: 'pinsa', description: 'Ľahká a chrumkavá pinsa s vysokým okrajom a prémiovými surovinami', image: '/images/pinsa.jpg', sortOrder: 6 },
    { name: 'Burgre', nameSk: 'Burgre', slug: 'burgre', description: 'Šťavnaté ručne formované burgre z čerstvého hovädzieho mäsa', image: '/images/burger.jpg', sortOrder: 7 },
    { name: 'Mini burgre', nameSk: 'Mini burgre', slug: 'mini-burgre', description: 'Menšie burgre ideálne na ochutnanie alebo ako príloha', image: '/images/burger.jpg', sortOrder: 8 },
    { name: 'Hot dog', nameSk: 'Hot dog', slug: 'hot-dog', description: 'Klasické a špeciálne hot dogy s domácimi údeninami', image: '/images/hotdog.jpg', sortOrder: 9 },
    { name: 'Kebab', nameSk: 'Kebab', slug: 'kebab', description: 'Tradičný kebab z kvalitného mäsa s domácou omáčkou', image: '/images/kebab.jpg', sortOrder: 10 },
    { name: 'Kapsalón a krídla', nameSk: 'Kapsalón a krídla', slug: 'kapsalon-krídla', description: 'Kapsalón s hranolkami a kuracie krídla v rôznych omáčkach', image: '/images/chicken-wings.jpg', sortOrder: 11 },
    { name: 'Mäso', nameSk: 'Mäso', slug: 'maso', description: 'Výberové kúsky mäsa pripravené na grillu', image: '/images/chicken-wings.jpg', sortOrder: 12 },
    { name: 'Syry', nameSk: 'Syry', slug: 'syry', description: 'Sýrové špeciality – vyprážané, grilované a ako príloha', image: '/images/fries.jpg', sortOrder: 13 },
    { name: 'Menu box', nameSk: 'Menu box', slug: 'menu-box', description: 'Kompletné boxy s hlavným jedlom, prílohou a nápojom', image: '/images/menu-box.jpg', sortOrder: 14 },
    { name: 'Tortilly / wrapy', nameSk: 'Tortilly / wrapy', slug: 'tortilly-wrapy', description: 'Plné chuti tortilly a wrapy s čerstvou zeleninou', image: '/images/wrap.jpg', sortOrder: 15 },
    { name: 'Rodinné combo', nameSk: 'Rodinné combo', slug: 'rodinne-combo', description: 'Veľké porcie pre celú rodinu alebo partičku priateľov', image: '/images/menu-box.jpg', sortOrder: 16 },
    { name: 'Šaláty', nameSk: 'Šaláty', slug: 'salaty', description: 'Čerstvé šaláty s domácimi dresingmi', image: '/images/hero-bg.jpg', sortOrder: 17 },
    { name: 'Pre vegánov', nameSk: 'Pre vegánov', slug: 'pre-veganov', description: 'Chutné vegánske alternatívy našich najobľúbenejších jedál', image: '/images/hero-bg.jpg', sortOrder: 18 },
    { name: 'Špeci ponuka', nameSk: 'Špeci ponuka', slug: 'speci-ponuka', description: 'Exkluzívne jedlá od šéfkuchára a sezónne špeciality', image: '/images/burger.jpg', sortOrder: 19 },
    { name: 'Mlsky / dezerty', nameSk: 'Mlsky / dezerty', slug: 'mlsky-dezerty', description: 'Sladké pokušenia na záver alebo ako dezert', image: '/images/dessert.jpg', sortOrder: 20 },
    { name: 'Prílohy', nameSk: 'Prílohy', slug: 'prilohy', description: 'Hranolky, ryža a ďalšie prílohy k vášmu jedlu', image: '/images/fries.jpg', sortOrder: 21 },
    { name: 'Dresingy', nameSk: 'Dresingy', slug: 'dresingy', description: 'Domáce dresingy a omáčky podľa vášho výberu', image: '/images/hero-bg.jpg', sortOrder: 22 },
    { name: 'Nápoje', nameSk: 'Nápoje', slug: 'napoje', description: 'Osviežujúce nápoje a pivo k vášmu jedlu', image: '/images/hero-bg.jpg', sortOrder: 23 },
    { name: 'Nočný rozvoz', nameSk: 'Nočný rozvoz', slug: 'nocny-rozvoz', description: 'Nočný rozvoz po 22:00 – pokiaľ ste hore, my doručíme!', image: '/images/burger.jpg', sortOrder: 24 },
  ]

  const categories = await Promise.all(
    categoryData.map(c => prisma.menuCategory.create({ data: c }))
  )

  const catMap: Record<string, string> = {}
  categoryData.forEach((c, i) => {
    catMap[c.slug] = categories[i].id
  })

  // ─── Menu Items with Addons ─────────────────────────────────────────────────
  console.log('  Creating menu items...')

  // Helper function to create items
  function createMenuItem(data: {
    catSlug: string
    name: string
    nameSk: string
    description: string
    descriptionSk: string
    price: number
    image: string
    isPopular?: boolean
    isSpicy?: boolean
    isNew?: boolean
    isVegetarian?: boolean
    allergens?: string
    weight?: string
    isAlcohol?: boolean
    isDailyMenu?: boolean
    isWeeklySpecial?: boolean
    isDailyDeal?: boolean
    sortOrder: number
    addons?: Array<{
      name: string
      nameSk: string
      price: number
      isModifier?: boolean
      modifierGroup?: string
    }>
  }) {
    return prisma.menuItem.create({
      data: {
        categoryId: catMap[data.catSlug],
        name: data.name,
        nameSk: data.nameSk,
        description: data.description,
        descriptionSk: data.descriptionSk,
        price: data.price,
        image: data.image,
        isPopular: data.isPopular ?? false,
        isSpicy: data.isSpicy ?? false,
        isNew: data.isNew ?? false,
        isVegetarian: data.isVegetarian ?? false,
        isAvailable: true,
        allergens: data.allergens ?? '',
        weight: data.weight ?? null,
        isAlcohol: data.isAlcohol ?? false,
        isDailyMenu: data.isDailyMenu ?? false,
        isWeeklySpecial: data.isWeeklySpecial ?? false,
        isDailyDeal: data.isDailyDeal ?? false,
        sortOrder: data.sortOrder,
        addons: data.addons ? {
          create: data.addons.map(a => ({
            name: a.name,
            nameSk: a.nameSk,
            price: a.price,
            isAvailable: true,
            isModifier: a.isModifier ?? false,
            modifierGroup: a.modifierGroup ?? null,
          }))
        } : undefined,
      },
    })
  }

  // Common addon sets
  const dressingAddons = [
    { name: 'Cesnakový', nameSk: 'Cesnakový', price: 0.50, isModifier: true, modifierGroup: 'dressing' },
    { name: 'BBQ', nameSk: 'BBQ', price: 0.50, isModifier: true, modifierGroup: 'dressing' },
    { name: 'Sweet chili', nameSk: 'Sweet chili', price: 0.50, isModifier: true, modifierGroup: 'dressing' },
    { name: 'Sriracha', nameSk: 'Sriracha', price: 0.50, isModifier: true, modifierGroup: 'dressing' },
    { name: 'Ranch', nameSk: 'Ranch', price: 0.50, isModifier: true, modifierGroup: 'dressing' },
    { name: 'Honey mustard', nameSk: 'Honey mustard', price: 0.50, isModifier: true, modifierGroup: 'dressing' },
  ]
  const sideAddons = [
    { name: 'Hranolky', nameSk: 'Hranolky', price: 1.50, isModifier: true, modifierGroup: 'side' },
    { name: 'Belgické hranolky', nameSk: 'Belgické hranolky', price: 2.00, isModifier: true, modifierGroup: 'side' },
    { name: 'Batátové hranolky', nameSk: 'Batátové hranolky', price: 2.50, isModifier: true, modifierGroup: 'side' },
    { name: 'Ryža', nameSk: 'Ryža', price: 1.50, isModifier: true, modifierGroup: 'side' },
  ]
  const extraAddons = [
    { name: 'Syr navyše', nameSk: 'Syr navyše', price: 1.00 },
    { name: 'Slanina', nameSk: 'Slanina', price: 1.50 },
    { name: 'Mäso navyše', nameSk: 'Mäso navyše', price: 2.00 },
  ]
  const spiceAddons = [
    { name: 'Mierne', nameSk: 'Mierne', price: 0.00, isModifier: true, modifierGroup: 'spice_level' },
    { name: 'Stredne', nameSk: 'Stredne', price: 0.00, isModifier: true, modifierGroup: 'spice_level' },
    { name: 'Pálivé', nameSk: 'Pálivé', price: 0.00, isModifier: true, modifierGroup: 'spice_level' },
  ]
  const menuDrinkAddons = [
    { name: 'Coca-Cola', nameSk: 'Coca-Cola', price: 1.50, isModifier: true, modifierGroup: 'drink' },
    { name: 'Sprite', nameSk: 'Sprite', price: 1.50, isModifier: true, modifierGroup: 'drink' },
    { name: 'Fuze Tea', nameSk: 'Fuze Tea', price: 1.50, isModifier: true, modifierGroup: 'drink' },
  ]

  let sortOrder = 0

  // Najviac objednávané
  await createMenuItem({ catSlug: 'najviac-objednavane', name: 'Dragon Burger', nameSk: 'Dragon Burger', description: 'Náš bestseller – ručne formovaný hovädzí burger s cheddarom, slaninou, kyslou uhorkou a domácou BBQ omáčkou', descriptionSk: 'Náš bestseller – ručne formovaný hovädzí burger s cheddarom, slaninou, kyslou uhorkou a domácou BBQ omáčkou', price: 9.90, image: '/images/burger.jpg', isPopular: true, allergens: '1,3,7,10', weight: '320g', sortOrder: ++sortOrder, addons: [...sideAddons, ...extraAddons, ...spiceAddons] })
  await createMenuItem({ catSlug: 'najviac-objednavane', name: 'Kebab v chlebe', nameSk: 'Kebab v chlebe', description: 'Tradičný kebab v chrumkavom chlebe s čerstvou zeleninou a cesnakovým dresingom', descriptionSk: 'Tradičný kebab v chrumkavom chlebe s čerstvou zeleninou a cesnakovým dresingom', price: 7.50, image: '/images/kebab.jpg', isPopular: true, allergens: '1,3,7,11', weight: '350g', sortOrder: ++sortOrder, addons: [...dressingAddons, ...spiceAddons, ...extraAddons] })
  await createMenuItem({ catSlug: 'najviac-objednavane', name: 'Pinsa Quattro Formaggi', nameSk: 'Pinsa Quattro Formaggi', description: 'Ľahká pinsa so štyrmi druhmi syra – mozzarella, gorgonzola, parmezán a ementál', descriptionSk: 'Ľahká pinsa so štyrmi druhmi syra – mozzarella, gorgonzola, parmezán a ementál', price: 10.90, image: '/images/pinsa.jpg', isPopular: true, isVegetarian: true, allergens: '1,3,7', weight: '380g', sortOrder: ++sortOrder, addons: [...extraAddons] })
  await createMenuItem({ catSlug: 'najviac-objednavane', name: 'Kuracie krídla BBQ', nameSk: 'Kuracie krídla BBQ', description: 'Chrumkavé kuracie krídla v sladkej BBQ omáčke s hranolkami', descriptionSk: 'Chrumkavé kuracie krídla v sladkej BBQ omáčke s hranolkami', price: 8.50, image: '/images/chicken-wings.jpg', isPopular: true, allergens: '1,3,7', weight: '400g', sortOrder: ++sortOrder, addons: [...dressingAddons, ...spiceAddons] })
  await createMenuItem({ catSlug: 'najviac-objednavane', name: 'Chili Cheese Dog', nameSk: 'Chili Cheese Dog', description: 'Hot dog s chilli con carne, čedarom a jarnou cibuľkou', descriptionSk: 'Hot dog s chilli con carne, čedarom a jarnou cibuľkou', price: 6.90, image: '/images/hotdog.jpg', isPopular: true, isSpicy: true, allergens: '1,3,7,10', weight: '280g', sortOrder: ++sortOrder, addons: [...extraAddons, ...spiceAddons] })

  // Týždenný špeciál
  await createMenuItem({ catSlug: 'tyzdenny-special', name: 'Burger mesiaca – Truffle Burger', nameSk: 'Burger mesiaca – Truffle Burger', description: 'Hovädzí burger s truffle majonézou, rukolou a sušenými paradajkami – len tento týždeň!', descriptionSk: 'Hovädzí burger s truffle majonézou, rukolou a sušenými paradajkami – len tento týždeň!', price: 12.90, image: '/images/burger.jpg', isNew: true, isWeeklySpecial: true, allergens: '1,3,7', weight: '340g', sortOrder: ++sortOrder, addons: [...sideAddons, ...extraAddons] })
  await createMenuItem({ catSlug: 'tyzdenny-special', name: 'Týždenný kebab špeciál', nameSk: 'Týždenný kebab špeciál', description: 'Kebab s marockou harissa omáčkou a grilovanou zeleninou', descriptionSk: 'Kebab s marockou harissa omáčkou a grilovanou zeleninou', price: 8.90, image: '/images/kebab.jpg', isSpicy: true, isNew: true, isWeeklySpecial: true, allergens: '1,3,7,11', weight: '370g', sortOrder: ++sortOrder, addons: [...dressingAddons, ...spiceAddons] })
  await createMenuItem({ catSlug: 'tyzdenny-special', name: 'Pinsa Prosciutto e Rucola', nameSk: 'Pinsa Prosciutto e Rucola', description: 'Pinsa s prosciuttom, rukolou, parmezánom a balzamikovým krémom', descriptionSk: 'Pinsa s prosciuttom, rukolou, parmezánom a balzamikovým krémom', price: 13.50, image: '/images/pinsa.jpg', isNew: true, isWeeklySpecial: true, allergens: '1,3,7', weight: '390g', sortOrder: ++sortOrder, addons: [...extraAddons] })

  // Denné menu
  await createMenuItem({ catSlug: 'denne-menu', name: 'Denné menu: Burger + polievka + nápoj', nameSk: 'Denné menu: Burger + polievka + nápoj', description: 'Klasický cheeseburger, polievka dňa a nápoj podľa výberu', descriptionSk: 'Klasický cheeseburger, polievka dňa a nápoj podľa výberu', price: 9.90, image: '/images/menu-box.jpg', isPopular: true, isDailyMenu: true, allergens: '1,3,7', weight: '550g', sortOrder: ++sortOrder, addons: [...menuDrinkAddons, ...spiceAddons] })
  await createMenuItem({ catSlug: 'denne-menu', name: 'Denné menu: Kebab + polievka + nápoj', nameSk: 'Denné menu: Kebab + polievka + nápoj', description: 'Kebab v chlebe, polievka dňa a nápoj podľa výberu', descriptionSk: 'Kebab v chlebe, polievka dňa a nápoj podľa výberu', price: 8.90, image: '/images/menu-box.jpg', isPopular: true, isDailyMenu: true, allergens: '1,3,7,11', weight: '580g', sortOrder: ++sortOrder, addons: [...menuDrinkAddons, ...dressingAddons, ...spiceAddons] })
  await createMenuItem({ catSlug: 'denne-menu', name: 'Denné menu: Pinsa + polievka + nápoj', nameSk: 'Denné menu: Pinsa + polievka + nápoj', description: 'Pinsa Margherita, polievka dňa a nápoj podľa výberu', descriptionSk: 'Pinsa Margherita, polievka dňa a nápoj podľa výberu', price: 10.90, image: '/images/menu-box.jpg', isVegetarian: true, isDailyMenu: true, allergens: '1,3,7', weight: '600g', sortOrder: ++sortOrder, addons: [...menuDrinkAddons, ...extraAddons] })
  await createMenuItem({ catSlug: 'denne-menu', name: 'Denné menu: Wrap + polievka + nápoj', nameSk: 'Denné menu: Wrap + polievka + nápoj', description: 'Kurací wrap s zeleninou, polievka dňa a nápoj podľa výberu', descriptionSk: 'Kurací wrap s zeleninou, polievka dňa a nápoj podľa výberu', price: 8.50, image: '/images/menu-box.jpg', isDailyMenu: true, allergens: '1,3,7,11', weight: '520g', sortOrder: ++sortOrder, addons: [...menuDrinkAddons, ...dressingAddons, ...spiceAddons] })

  // Polievka dňa
  await createMenuItem({ catSlug: 'polievka-dna', name: 'Polievka dňa', nameSk: 'Polievka dňa', description: 'Denne meniaca sa domáca polievka – opýtajte sa personálu na dnešnú', descriptionSk: 'Denne meniaca sa domáca polievka – opýtajte sa personálu na dnešnú', price: 3.50, image: '/images/hero-bg.jpg', allergens: '1,3,7,9', weight: '300ml', sortOrder: ++sortOrder })
  await createMenuItem({ catSlug: 'polievka-dna', name: 'Gulášová polievka', nameSk: 'Gulášová polievka', description: 'Hustá gulášová polievka s kúskami mäsa a zemiakmi', descriptionSk: 'Hustá gulášová polievka s kúskami mäsa a zemiakmi', price: 4.20, image: '/images/hero-bg.jpg', isPopular: true, isSpicy: true, allergens: '1,3,7,9', weight: '350ml', sortOrder: ++sortOrder, addons: [...spiceAddons] })
  await createMenuItem({ catSlug: 'polievka-dna', name: 'Paradajková polievka', nameSk: 'Paradajková polievka', description: 'Krémová paradajková polievka s bazalkou a krutónmi', descriptionSk: 'Krémová paradajková polievka s bazalkou a krutónmi', price: 3.90, image: '/images/hero-bg.jpg', isVegetarian: true, allergens: '1,3,7', weight: '300ml', sortOrder: ++sortOrder })

  // Akcia dňa
  await createMenuItem({ catSlug: 'akcia-dna', name: '2x Mini burger + hranolky', nameSk: '2x Mini burger + hranolky', description: 'Dva mini cheeseburgre s hranolkami za akčnú cenu', descriptionSk: 'Dva mini cheeseburgre s hranolkami za akčnú cenu', price: 8.90, image: '/images/burger.jpg', isPopular: true, isDailyDeal: true, allergens: '1,3,7', weight: '450g', sortOrder: ++sortOrder, addons: [...dressingAddons, ...spiceAddons] })
  await createMenuItem({ catSlug: 'akcia-dna', name: 'Kebab + nápoj', nameSk: 'Kebab + nápoj', description: 'Kebab v chlebe s nápojom podľa výberu', descriptionSk: 'Kebab v chlebe s nápojom podľa výberu', price: 8.50, image: '/images/kebab.jpg', isPopular: true, isDailyDeal: true, allergens: '1,3,7,11', weight: '500g', sortOrder: ++sortOrder, addons: [...menuDrinkAddons, ...dressingAddons] })
  await createMenuItem({ catSlug: 'akcia-dna', name: 'Pinsa + 2 nápoje', nameSk: 'Pinsa + 2 nápoje', description: 'Ľubovoľná pinsa s dvoma nápojmi za výhodnú cenu', descriptionSk: 'Ľubovoľná pinsa s dvoma nápojmi za výhodnú cenu', price: 12.90, image: '/images/pinsa.jpg', isDailyDeal: true, allergens: '1,3,7', weight: '550g', sortOrder: ++sortOrder, addons: [...menuDrinkAddons, ...extraAddons] })

  // Pinsa
  await createMenuItem({ catSlug: 'pinsa', name: 'Pinsa Margherita', nameSk: 'Pinsa Margherita', description: 'Klasická pinsa s paradajkovým základom, mozzarellou a bazalkou', descriptionSk: 'Klasická pinsa s paradajkovým základom, mozzarellou a bazalkou', price: 8.90, image: '/images/pinsa.jpg', isPopular: true, isVegetarian: true, allergens: '1,3,7', weight: '350g', sortOrder: ++sortOrder, addons: [...extraAddons] })
  await createMenuItem({ catSlug: 'pinsa', name: 'Pinsa Prosciutto', nameSk: 'Pinsa Prosciutto', description: 'Pinsa s prosciuttom, rukolou a parmezánom', descriptionSk: 'Pinsa s prosciuttom, rukolou a parmezánom', price: 11.90, image: '/images/pinsa.jpg', isPopular: true, allergens: '1,3,7', weight: '370g', sortOrder: ++sortOrder, addons: [...extraAddons] })
  await createMenuItem({ catSlug: 'pinsa', name: 'Pinsa Diavola', nameSk: 'Pinsa Diavola', description: 'Pikantná pinsa s salámou piccante, čili a červenou cibuľou', descriptionSk: 'Pikantná pinsa s salámou piccante, čili a červenou cibuľou', price: 10.90, image: '/images/pinsa.jpg', isSpicy: true, allergens: '1,3,7', weight: '360g', sortOrder: ++sortOrder, addons: [...extraAddons, ...spiceAddons] })
  await createMenuItem({ catSlug: 'pinsa', name: 'Pinsa Quattro Formaggi', nameSk: 'Pinsa Quattro Formaggi', description: 'Ľahká pinsa so štyrmi druhmi syra – mozzarella, gorgonzola, parmezán a ementál', descriptionSk: 'Ľahká pinsa so štyrmi druhmi syra – mozzarella, gorgonzola, parmezán a ementál', price: 10.90, image: '/images/pinsa.jpg', isPopular: true, isVegetarian: true, allergens: '1,3,7', weight: '380g', sortOrder: ++sortOrder, addons: [...extraAddons] })
  await createMenuItem({ catSlug: 'pinsa', name: 'Pinsa Caprese', nameSk: 'Pinsa Caprese', description: 'Pinsa s čerstvou mozzarellou, paradajkami a balzamikovým krémom', descriptionSk: 'Pinsa s čerstvou mozzarellou, paradajkami a balzamikovým krémom', price: 9.90, image: '/images/pinsa.jpg', isNew: true, isVegetarian: true, allergens: '1,3,7', weight: '360g', sortOrder: ++sortOrder, addons: [...extraAddons] })

  // Burgre
  await createMenuItem({ catSlug: 'burgre', name: 'Classic Cheeseburger', nameSk: 'Classic Cheeseburger', description: 'Hovädží burger s cheddarom, kyslou uhorkou, cibuľou a kečupom', descriptionSk: 'Hovädží burger s cheddarom, kyslou uhorkou, cibuľou a kečupom', price: 7.90, image: '/images/burger.jpg', isPopular: true, allergens: '1,3,7', weight: '280g', sortOrder: ++sortOrder, addons: [...sideAddons, ...extraAddons] })
  await createMenuItem({ catSlug: 'burgre', name: 'Dragon Burger', nameSk: 'Dragon Burger', description: 'Ručne formovaný hovädzí burger s cheddarom, slaninou, kyslou uhorkou a domácou BBQ omáčkou', descriptionSk: 'Ručne formovaný hovädzí burger s cheddarom, slaninou, kyslou uhorkou a domácou BBQ omáčkou', price: 9.90, image: '/images/burger.jpg', isPopular: true, allergens: '1,3,7,10', weight: '320g', sortOrder: ++sortOrder, addons: [...sideAddons, ...extraAddons, ...spiceAddons] })
  await createMenuItem({ catSlug: 'burgre', name: 'Double Smash Burger', nameSk: 'Double Smash Burger', description: 'Dve plátky smash hovädzieho mäsa s americkým syrom a špeciálnou omáčkou', descriptionSk: 'Dve plátky smash hovädzieho mäsa s americkým syrom a špeciálnou omáčkou', price: 11.90, image: '/images/burger.jpg', isPopular: true, isNew: true, allergens: '1,3,7', weight: '350g', sortOrder: ++sortOrder, addons: [...sideAddons, ...extraAddons, ...spiceAddons] })
  await createMenuItem({ catSlug: 'burgre', name: 'Bacon Jalapeño Burger', nameSk: 'Bacon Jalapeño Burger', description: 'Hovädží burger so slaninou, jalapeño, pepper jack syrom a chipotle majonézou', descriptionSk: 'Hovädží burger so slaninou, jalapeño, pepper jack syrom a chipotle majonézou', price: 10.90, image: '/images/burger.jpg', isSpicy: true, isNew: true, allergens: '1,3,7', weight: '330g', sortOrder: ++sortOrder, addons: [...sideAddons, ...extraAddons, ...spiceAddons] })
  await createMenuItem({ catSlug: 'burgre', name: 'Chicken Burger', nameSk: 'Chicken Burger', description: 'Chrumkavý kurací steak s rukolou, paradajkami a cesnakovým dresingom', descriptionSk: 'Chrumkavý kurací steak s rukolou, paradajkami a cesnakovým dresingom', price: 8.90, image: '/images/burger.jpg', isPopular: true, allergens: '1,3,7', weight: '300g', sortOrder: ++sortOrder, addons: [...sideAddons, ...dressingAddons] })

  // Mini burgre
  await createMenuItem({ catSlug: 'mini-burgre', name: 'Mini Cheeseburger', nameSk: 'Mini Cheeseburger', description: 'Menší hovädzí burger s cheddarom a kyslou uhorkou', descriptionSk: 'Menší hovädzí burger s cheddarom a kyslou uhorkou', price: 4.50, image: '/images/burger.jpg', isPopular: true, allergens: '1,3,7', weight: '150g', sortOrder: ++sortOrder, addons: [...extraAddons] })
  await createMenuItem({ catSlug: 'mini-burgre', name: 'Mini BBQ Burger', nameSk: 'Mini BBQ Burger', description: 'Menší burger s BBQ omáčkou a slaninou', descriptionSk: 'Menší burger s BBQ omáčkou a slaninou', price: 5.20, image: '/images/burger.jpg', allergens: '1,3,7', weight: '160g', sortOrder: ++sortOrder, addons: [...extraAddons] })
  await createMenuItem({ catSlug: 'mini-burgre', name: 'Mini Chicken Burger', nameSk: 'Mini Chicken Burger', description: 'Menší kurací burger so šalátom a majonézou', descriptionSk: 'Menší kurací burger so šalátom a majonézou', price: 4.90, image: '/images/burger.jpg', allergens: '1,3,7', weight: '150g', sortOrder: ++sortOrder, addons: [...dressingAddons] })
  await createMenuItem({ catSlug: 'mini-burgre', name: 'Mini Veggie Burger', nameSk: 'Mini Veggie Burger', description: 'Menší vegánsky burger s fazuľovou plátkou a rukolou', descriptionSk: 'Menší vegánsky burger s fazuľovou plátkou a rukolou', price: 4.50, image: '/images/burger.jpg', isNew: true, isVegetarian: true, allergens: '1,3,7', weight: '140g', sortOrder: ++sortOrder, addons: [...dressingAddons] })

  // Hot dog
  await createMenuItem({ catSlug: 'hot-dog', name: 'Classic Hot Dog', nameSk: 'Classic Hot Dog', description: 'Klasický hot dog s kečupom, horčicou a kyslou uhorkou', descriptionSk: 'Klasický hot dog s kečupom, horčicou a kyslou uhorkou', price: 4.90, image: '/images/hotdog.jpg', isPopular: true, allergens: '1,3,7,10', weight: '200g', sortOrder: ++sortOrder, addons: [...extraAddons, ...spiceAddons] })
  await createMenuItem({ catSlug: 'hot-dog', name: 'Chili Cheese Dog', nameSk: 'Chili Cheese Dog', description: 'Hot dog s chilli con carne, čedarom a jarnou cibuľkou', descriptionSk: 'Hot dog s chilli con carne, čedarom a jarnou cibuľkou', price: 6.90, image: '/images/hotdog.jpg', isPopular: true, isSpicy: true, allergens: '1,3,7,10', weight: '280g', sortOrder: ++sortOrder, addons: [...extraAddons, ...spiceAddons] })
  await createMenuItem({ catSlug: 'hot-dog', name: 'BBQ Bacon Dog', nameSk: 'BBQ Bacon Dog', description: 'Hot dog so slaninou, BBQ omáčkou a karamelizovanou cibuľou', descriptionSk: 'Hot dog so slaninou, BBQ omáčkou a karamelizovanou cibuľou', price: 7.50, image: '/images/hotdog.jpg', isNew: true, allergens: '1,3,7', weight: '270g', sortOrder: ++sortOrder, addons: [...extraAddons, ...spiceAddons] })
  await createMenuItem({ catSlug: 'hot-dog', name: 'New York Dog', nameSk: 'New York Dog', description: 'Hot dog s kyslým kapustou, horčicou a paprikou', descriptionSk: 'Hot dog s kyslým kapustou, horčicou a paprikou', price: 5.90, image: '/images/hotdog.jpg', allergens: '1,3,7,9,10', weight: '230g', sortOrder: ++sortOrder, addons: [...spiceAddons] })

  // Kebab
  await createMenuItem({ catSlug: 'kebab', name: 'Kebab v chlebe', nameSk: 'Kebab v chlebe', description: 'Tradičný kebab v chrumkavom chlebe s čerstvou zeleninou a cesnakovým dresingom', descriptionSk: 'Tradičný kebab v chrumkavom chlebe s čerstvou zeleninou a cesnakovým dresingom', price: 7.50, image: '/images/kebab.jpg', isPopular: true, allergens: '1,3,7,11', weight: '350g', sortOrder: ++sortOrder, addons: [...dressingAddons, ...spiceAddons, ...extraAddons] })
  await createMenuItem({ catSlug: 'kebab', name: 'Kebab v tortille', nameSk: 'Kebab v tortille', description: 'Kebab zabalený v mäkkej tortille so zeleninou a jogurtovým dresingom', descriptionSk: 'Kebab zabalený v mäkkej tortille so zeleninou a jogurtovým dresingom', price: 7.90, image: '/images/kebab.jpg', isPopular: true, allergens: '1,3,7,11', weight: '340g', sortOrder: ++sortOrder, addons: [...dressingAddons, ...spiceAddons, ...extraAddons] })
  await createMenuItem({ catSlug: 'kebab', name: 'Kebab tančík', nameSk: 'Kebab tančík', description: 'Kebab na tanieri s hranolkami, zeleninou a omáčkami', descriptionSk: 'Kebab na tanieri s hranolkami, zeleninou a omáčkami', price: 9.90, image: '/images/kebab.jpg', allergens: '1,3,7,11', weight: '450g', sortOrder: ++sortOrder, addons: [...sideAddons, ...dressingAddons, ...spiceAddons] })
  await createMenuItem({ catSlug: 'kebab', name: 'Kebab XXL', nameSk: 'Kebab XXL', description: 'Extra veľký kebab s dvojitou porciou mäsa a zeleniny', descriptionSk: 'Extra veľký kebab s dvojitou porciou mäsa a zeleniny', price: 10.90, image: '/images/kebab.jpg', allergens: '1,3,7,11', weight: '500g', sortOrder: ++sortOrder, addons: [...dressingAddons, ...spiceAddons] })
  await createMenuItem({ catSlug: 'kebab', name: 'Pikantný kebab', nameSk: 'Pikantný kebab', description: 'Kebab s pikantnou harissa omáčkou a feferónkami', descriptionSk: 'Kebab s pikantnou harissa omáčkou a feferónkami', price: 8.50, image: '/images/kebab.jpg', isSpicy: true, isNew: true, allergens: '1,3,7,11', weight: '360g', sortOrder: ++sortOrder, addons: [...dressingAddons, ...spiceAddons] })

  // Kapsalón a krídla
  await createMenuItem({ catSlug: 'kapsalon-krídla', name: 'Kapsalón kurací', nameSk: 'Kapsalón kurací', description: 'Hranolky, kuracie mäso, syr, zelenina a omáčka v jednej porcii', descriptionSk: 'Hranolky, kuracie mäso, syr, zelenina a omáčka v jednej porcii', price: 10.90, image: '/images/chicken-wings.jpg', isPopular: true, allergens: '1,3,7', weight: '500g', sortOrder: ++sortOrder, addons: [...dressingAddons, ...spiceAddons] })
  await createMenuItem({ catSlug: 'kapsalon-krídla', name: 'Kapsalón kebab', nameSk: 'Kapsalón kebab', description: 'Hranolky, kebab mäso, syr, zelenina a cesnakový dresing', descriptionSk: 'Hranolky, kebab mäso, syr, zelenina a cesnakový dresing', price: 11.50, image: '/images/kebab.jpg', isPopular: true, allergens: '1,3,7,11', weight: '520g', sortOrder: ++sortOrder, addons: [...dressingAddons, ...spiceAddons] })
  await createMenuItem({ catSlug: 'kapsalon-krídla', name: 'Kuracie krídla BBQ', nameSk: 'Kuracie krídla BBQ', description: 'Chrumkavé kuracie krídla v sladkej BBQ omáčke', descriptionSk: 'Chrumkavé kuracie krídla v sladkej BBQ omáčke', price: 8.50, image: '/images/chicken-wings.jpg', isPopular: true, allergens: '1,3,7', weight: '350g', sortOrder: ++sortOrder, addons: [...dressingAddons, ...spiceAddons] })
  await createMenuItem({ catSlug: 'kapsalon-krídla', name: 'Kuracie krídla Buffalo', nameSk: 'Kuracie krídla Buffalo', description: 'Pikantné krídla v buffalo omáčke s blue cheese dresingom', descriptionSk: 'Pikantné krídla v buffalo omáčke s blue cheese dresingom', price: 9.50, image: '/images/chicken-wings.jpg', isSpicy: true, isNew: true, allergens: '1,3,7', weight: '350g', sortOrder: ++sortOrder, addons: [...dressingAddons, ...spiceAddons] })
  await createMenuItem({ catSlug: 'kapsalon-krídla', name: 'Kuracie krídla Honey Mustard', nameSk: 'Kuracie krídla Honey Mustard', description: 'Krídla v sladkej medovo-horčicovej glazúre', descriptionSk: 'Krídla v sladkej medovo-horčicovej glazúre', price: 8.90, image: '/images/chicken-wings.jpg', isNew: true, allergens: '1,3,7,10', weight: '350g', sortOrder: ++sortOrder, addons: [...dressingAddons, ...spiceAddons] })

  // Mäso
  await createMenuItem({ catSlug: 'maso', name: 'Grilovaný kurací steak', nameSk: 'Grilovaný kurací steak', description: 'Grilovaný kurací steak s bylinkami, podávaný s prílohou', descriptionSk: 'Grilovaný kurací steak s bylinkami, podávaný s prílohou', price: 9.90, image: '/images/chicken-wings.jpg', isPopular: true, allergens: '3,7', weight: '300g', sortOrder: ++sortOrder, addons: [...sideAddons, ...dressingAddons] })
  await createMenuItem({ catSlug: 'maso', name: 'Bravčové rebierka BBQ', nameSk: 'Bravčové rebierka BBQ', description: 'Pomalé bravčové rebierka v BBQ omáčke s hranolkami', descriptionSk: 'Pomalé bravčové rebierka v BBQ omáčke s hranolkami', price: 12.90, image: '/images/chicken-wings.jpg', isPopular: true, allergens: '3,7', weight: '450g', sortOrder: ++sortOrder, addons: [...sideAddons, ...dressingAddons, ...spiceAddons] })
  await createMenuItem({ catSlug: 'maso', name: 'Grilovaný flank steak', nameSk: 'Grilovaný flank steak', description: 'Hovädzí flank steak s chimichurri omáčkou a hranolkami', descriptionSk: 'Hovädzí flank steak s chimichurri omáčkou a hranolkami', price: 14.90, image: '/images/chicken-wings.jpg', isNew: true, allergens: '3,7', weight: '350g', sortOrder: ++sortOrder, addons: [...sideAddons, ...dressingAddons] })
  await createMenuItem({ catSlug: 'maso', name: 'Kurací špíz', nameSk: 'Kurací špíz', description: 'Kurací špíz so zeleninou a ryžou', descriptionSk: 'Kurací špíz so zeleninou a ryžou', price: 8.90, image: '/images/chicken-wings.jpg', allergens: '3,7', weight: '280g', sortOrder: ++sortOrder, addons: [...sideAddons, ...dressingAddons, ...spiceAddons] })

  // Syry
  await createMenuItem({ catSlug: 'syry', name: 'Vyprážaný syr', nameSk: 'Vyprážaný syr', description: 'Chrumkavý vyprážaný syr s tatárskou omáčkou a hranolkami', descriptionSk: 'Chrumkavý vyprážaný syr s tatárskou omáčkou a hranolkami', price: 7.90, image: '/images/fries.jpg', isPopular: true, isVegetarian: true, allergens: '1,3,7', weight: '300g', sortOrder: ++sortOrder, addons: [...sideAddons, ...dressingAddons] })
  await createMenuItem({ catSlug: 'syry', name: 'Camembert vyprážaný', nameSk: 'Camembert vyprážaný', description: 'Vyprážaný camembert s brusnicovou omáčkou a hranolkami', descriptionSk: 'Vyprážaný camembert s brusnicovou omáčkou a hranolkami', price: 8.50, image: '/images/fries.jpg', isVegetarian: true, allergens: '1,3,7', weight: '280g', sortOrder: ++sortOrder, addons: [...sideAddons, ...dressingAddons] })
  await createMenuItem({ catSlug: 'syry', name: 'Halloumi na grile', nameSk: 'Halloumi na grile', description: 'Grilovaný halloumi s rukolou a balzamikovým krémom', descriptionSk: 'Grilovaný halloumi s rukolou a balzamikovým krémom', price: 7.50, image: '/images/fries.jpg', isNew: true, isVegetarian: true, allergens: '7', weight: '200g', sortOrder: ++sortOrder, addons: [...sideAddons, ...dressingAddons] })
  await createMenuItem({ catSlug: 'syry', name: 'Syrové tyčinky', nameSk: 'Syrové tyčinky', description: 'Chrumkavé syrové tyčinky s kečupom a dresingom', descriptionSk: 'Chrumkavé syrové tyčinky s kečupom a dresingom', price: 4.90, image: '/images/fries.jpg', isPopular: true, isVegetarian: true, allergens: '1,3,7', weight: '180g', sortOrder: ++sortOrder, addons: [...dressingAddons] })

  // Menu box
  await createMenuItem({ catSlug: 'menu-box', name: 'Burger box', nameSk: 'Burger box', description: 'Cheeseburger, hranolky a Coca-Cola 0.33l', descriptionSk: 'Cheeseburger, hranolky a Coca-Cola 0.33l', price: 10.90, image: '/images/menu-box.jpg', isPopular: true, allergens: '1,3,7', weight: '550g', sortOrder: ++sortOrder, addons: [...menuDrinkAddons, ...spiceAddons] })
  await createMenuItem({ catSlug: 'menu-box', name: 'Kebab box', nameSk: 'Kebab box', description: 'Kebab v chlebe, hranolky a nápoj 0.33l', descriptionSk: 'Kebab v chlebe, hranolky a nápoj 0.33l', price: 10.50, image: '/images/menu-box.jpg', isPopular: true, allergens: '1,3,7,11', weight: '600g', sortOrder: ++sortOrder, addons: [...menuDrinkAddons, ...dressingAddons] })
  await createMenuItem({ catSlug: 'menu-box', name: 'Krídla box', nameSk: 'Krídla box', description: 'Kuracie krídla BBQ, hranolky a nápoj 0.33l', descriptionSk: 'Kuracie krídla BBQ, hranolky a nápoj 0.33l', price: 11.50, image: '/images/menu-box.jpg', allergens: '1,3,7', weight: '550g', sortOrder: ++sortOrder, addons: [...menuDrinkAddons, ...dressingAddons, ...spiceAddons] })
  await createMenuItem({ catSlug: 'menu-box', name: 'Syr box', nameSk: 'Syr box', description: 'Vyprážaný syr, hranolky a nápoj 0.33l', descriptionSk: 'Vyprážaný syr, hranolky a nápoj 0.33l', price: 9.90, image: '/images/menu-box.jpg', isVegetarian: true, allergens: '1,3,7', weight: '500g', sortOrder: ++sortOrder, addons: [...menuDrinkAddons, ...dressingAddons] })

  // Tortilly / wrapy
  await createMenuItem({ catSlug: 'tortilly-wrapy', name: 'Kurací wrap classic', nameSk: 'Kurací wrap classic', description: 'Kuracie mäso, zelenina, syr a cesnakový dresing v tortille', descriptionSk: 'Kuracie mäso, zelenina, syr a cesnakový dresing v tortille', price: 7.90, image: '/images/wrap.jpg', isPopular: true, allergens: '1,3,7,11', weight: '300g', sortOrder: ++sortOrder, addons: [...dressingAddons, ...spiceAddons] })
  await createMenuItem({ catSlug: 'tortilly-wrapy', name: 'BBQ wrap', nameSk: 'BBQ wrap', description: 'Kuracie mäso, slanina, BBQ omáčka a červená cibuľa v tortille', descriptionSk: 'Kuracie mäso, slanina, BBQ omáčka a červená cibuľa v tortille', price: 8.90, image: '/images/wrap.jpg', allergens: '1,3,7,11', weight: '320g', sortOrder: ++sortOrder, addons: [...dressingAddons, ...spiceAddons] })
  await createMenuItem({ catSlug: 'tortilly-wrapy', name: 'Sweet chili wrap', nameSk: 'Sweet chili wrap', description: 'Kuracie mäso so sweet chili omáčkou, rukolou a feta syrom', descriptionSk: 'Kuracie mäso so sweet chili omáčkou, rukolou a feta syrom', price: 8.50, image: '/images/wrap.jpg', isSpicy: true, isNew: true, allergens: '1,3,7,11', weight: '310g', sortOrder: ++sortOrder, addons: [...dressingAddons, ...spiceAddons] })
  await createMenuItem({ catSlug: 'tortilly-wrapy', name: 'Veggie wrap', nameSk: 'Veggie wrap', description: 'Grilovaná zelenina, hummus a rukola v celozrnnej tortille', descriptionSk: 'Grilovaná zelenina, hummus a rukola v celozrnnej tortille', price: 6.90, image: '/images/wrap.jpg', isNew: true, isVegetarian: true, allergens: '1,3,7,11', weight: '270g', sortOrder: ++sortOrder, addons: [...dressingAddons] })
  await createMenuItem({ catSlug: 'tortilly-wrapy', name: 'Kebab wrap', nameSk: 'Kebab wrap', description: 'Kebab mäso s čerstvou zeleninou a jogurtovým dresingom v tortille', descriptionSk: 'Kebab mäso s čerstvou zeleninou a jogurtovým dresingom v tortille', price: 7.90, image: '/images/wrap.jpg', isPopular: true, allergens: '1,3,7,11', weight: '340g', sortOrder: ++sortOrder, addons: [...dressingAddons, ...spiceAddons] })

  // Rodinné combo
  await createMenuItem({ catSlug: 'rodinne-combo', name: 'Burger combo pre 2', nameSk: 'Burger combo pre 2', description: '2x Dragon Burger, hranolky a 2x nápoj 0.33l', descriptionSk: '2x Dragon Burger, hranolky a 2x nápoj 0.33l', price: 22.90, image: '/images/menu-box.jpg', isPopular: true, allergens: '1,3,7', weight: '900g', sortOrder: ++sortOrder, addons: [...menuDrinkAddons, ...spiceAddons] })
  await createMenuItem({ catSlug: 'rodinne-combo', name: 'Kebab combo pre 2', nameSk: 'Kebab combo pre 2', description: '2x Kebab v chlebe, hranolky a 2x nápoj 0.33l', descriptionSk: '2x Kebab v chlebe, hranolky a 2x nápoj 0.33l', price: 20.90, image: '/images/menu-box.jpg', allergens: '1,3,7,11', weight: '950g', sortOrder: ++sortOrder, addons: [...menuDrinkAddons, ...dressingAddons] })
  await createMenuItem({ catSlug: 'rodinne-combo', name: 'Rodinný box pre 4', nameSk: 'Rodinný box pre 4', description: '4x ľubovoľný burger, 2x hranolky, 4x nápoj 0.33l', descriptionSk: '4x ľubovoľný burger, 2x hranolky, 4x nápoj 0.33l', price: 39.90, image: '/images/menu-box.jpg', allergens: '1,3,7', weight: '1800g', sortOrder: ++sortOrder, addons: [...menuDrinkAddons, ...spiceAddons] })
  await createMenuItem({ catSlug: 'rodinne-combo', name: 'Krídla party box', nameSk: 'Krídla party box', description: '24 krídiel v BBQ omáčke, 3x hranolky a 3x nápoj 0.33l', descriptionSk: '24 krídiel v BBQ omáčke, 3x hranolky a 3x nápoj 0.33l', price: 34.90, image: '/images/chicken-wings.jpg', isNew: true, allergens: '1,3,7', weight: '1500g', sortOrder: ++sortOrder, addons: [...menuDrinkAddons, ...dressingAddons, ...spiceAddons] })

  // Šaláty
  await createMenuItem({ catSlug: 'salaty', name: 'Cézar šalát', nameSk: 'Cézar šalát', description: 'Klasický cézar šalát s kuracím mäsom, parmezánom a krutónmi', descriptionSk: 'Klasický cézar šalát s kuracím mäsom, parmezánom a krutónmi', price: 8.90, image: '/images/hero-bg.jpg', isPopular: true, allergens: '1,3,7,8', weight: '320g', sortOrder: ++sortOrder, addons: [...dressingAddons, ...extraAddons] })
  await createMenuItem({ catSlug: 'salaty', name: 'Grécky šalát', nameSk: 'Grécky šalát', description: 'Čerstvá zelenina s fetou, olivami a extra panenským olivovým olejom', descriptionSk: 'Čerstvá zelenina s fetou, olivami a extra panenským olivovým olejom', price: 7.50, image: '/images/hero-bg.jpg', isVegetarian: true, allergens: '7', weight: '300g', sortOrder: ++sortOrder, addons: [...dressingAddons] })
  await createMenuItem({ catSlug: 'salaty', name: 'Šalát s grilovaným halloumi', nameSk: 'Šalát s grilovaným halloumi', description: 'Mix šalátov s grilovaným halloumi, paradajkami a balzamikovým krémom', descriptionSk: 'Mix šalátov s grilovaným halloumi, paradajkami a balzamikovým krémom', price: 8.50, image: '/images/hero-bg.jpg', isNew: true, isVegetarian: true, allergens: '7', weight: '300g', sortOrder: ++sortOrder, addons: [...dressingAddons] })

  // Pre vegánov
  await createMenuItem({ catSlug: 'pre-veganov', name: 'Vegánsky burger', nameSk: 'Vegánsky burger', description: 'Fazuľová plátka s avokádom, rukolou a vegánskou majonézou', descriptionSk: 'Fazuľová plátka s avokádom, rukolou a vegánskou majonézou', price: 8.90, image: '/images/burger.jpg', isPopular: true, isNew: true, isVegetarian: true, allergens: '1,3,7', weight: '290g', sortOrder: ++sortOrder, addons: [...sideAddons, ...dressingAddons, ...spiceAddons] })
  await createMenuItem({ catSlug: 'pre-veganov', name: 'Veggie wrap', nameSk: 'Veggie wrap', description: 'Grilovaná zelenina, hummus a rukola v celozrnnej tortille', descriptionSk: 'Grilovaná zelenina, hummus a rukola v celozrnnej tortille', price: 6.90, image: '/images/wrap.jpg', isNew: true, isVegetarian: true, allergens: '1,3,7,11', weight: '270g', sortOrder: ++sortOrder, addons: [...dressingAddons] })
  await createMenuItem({ catSlug: 'pre-veganov', name: 'Vegánska pinsa', nameSk: 'Vegánska pinsa', description: 'Pinsa s vegánskym syrom, sušenými paradajkami a bazalkou', descriptionSk: 'Pinsa s vegánskym syrom, sušenými paradajkami a bazalkou', price: 9.90, image: '/images/pinsa.jpg', isNew: true, isVegetarian: true, allergens: '1,3,7', weight: '350g', sortOrder: ++sortOrder, addons: [...extraAddons] })

  // Špeci ponuka
  await createMenuItem({ catSlug: 'speci-ponuka', name: 'Dragon Special Burger', nameSk: 'Dragon Special Burger', description: 'Hovädzí burger s truffle majonézou, rukolou, sušenými paradajkami a tmavým chlebom', descriptionSk: 'Hovädzí burger s truffle majonézou, rukolou, sušenými paradajkami a tmavým chlebom', price: 13.90, image: '/images/burger.jpg', isPopular: true, isNew: true, allergens: '1,3,7', weight: '360g', sortOrder: ++sortOrder, addons: [...sideAddons, ...extraAddons] })
  await createMenuItem({ catSlug: 'speci-ponuka', name: 'Kapsalón Premium', nameSk: 'Kapsalón Premium', description: 'Kapsalón s hovädzím mäsom, truffle hranolkami a parmezánom', descriptionSk: 'Kapsalón s hovädzím mäsom, truffle hranolkami a parmezánom', price: 14.90, image: '/images/chicken-wings.jpg', isNew: true, allergens: '1,3,7', weight: '550g', sortOrder: ++sortOrder, addons: [...dressingAddons, ...spiceAddons] })

  // Mlsky / dezerty
  await createMenuItem({ catSlug: 'mlsky-dezerty', name: 'Churros s čokoládou', nameSk: 'Churros s čokoládou', description: 'Teplé churros s tekutou belgickou čokoládou', descriptionSk: 'Teplé churros s tekutou belgickou čokoládou', price: 4.90, image: '/images/dessert.jpg', isPopular: true, isVegetarian: true, allergens: '1,3,7', weight: '180g', sortOrder: ++sortOrder })
  await createMenuItem({ catSlug: 'mlsky-dezerty', name: 'Brownie s zmrzlinou', nameSk: 'Brownie s zmrzlinou', description: 'Teplý čokoládový brownie s vanilkovou zmrzlinou', descriptionSk: 'Teplý čokoládový brownie s vanilkovou zmrzlinou', price: 5.90, image: '/images/dessert.jpg', isPopular: true, isVegetarian: true, allergens: '1,3,7,8', weight: '200g', sortOrder: ++sortOrder })
  await createMenuItem({ catSlug: 'mlsky-dezerty', name: 'Langoš s cesnakom', nameSk: 'Langoš s cesnakom', description: 'Chrumkavý langoš s cesnakovým dresingom a syrom', descriptionSk: 'Chrumkavý langoš s cesnakovým dresingom a syrom', price: 3.90, image: '/images/dessert.jpg', isPopular: true, isVegetarian: true, allergens: '1,3,7', weight: '200g', sortOrder: ++sortOrder, addons: [...dressingAddons, ...extraAddons] })
  await createMenuItem({ catSlug: 'mlsky-dezerty', name: 'Nutella tortilla', nameSk: 'Nutella tortilla', description: 'Teplá tortilla plnená Nutellou a banánom', descriptionSk: 'Teplá tortilla plnená Nutellou a banánom', price: 4.50, image: '/images/dessert.jpg', isNew: true, isVegetarian: true, allergens: '1,3,7,8', weight: '160g', sortOrder: ++sortOrder })

  // Prílohy
  await createMenuItem({ catSlug: 'prilohy', name: 'Hranolky', nameSk: 'Hranolky', description: 'Chrumkavé zlaté hranolky', descriptionSk: 'Chrumkavé zlaté hranolky', price: 2.90, image: '/images/fries.jpg', isPopular: true, isVegetarian: true, allergens: '1,3', weight: '150g', sortOrder: ++sortOrder, addons: [...dressingAddons] })
  await createMenuItem({ catSlug: 'prilohy', name: 'Belgické hranolky', nameSk: 'Belgické hranolky', description: 'Hrubšie belgické hranolky s domácou majonézou', descriptionSk: 'Hrubšie belgické hranolky s domácou majonézou', price: 3.50, image: '/images/fries.jpg', isVegetarian: true, allergens: '1,3,7', weight: '180g', sortOrder: ++sortOrder, addons: [...dressingAddons] })
  await createMenuItem({ catSlug: 'prilohy', name: 'Batátové hranolky', nameSk: 'Batátové hranolky', description: 'Sladké batátové hranolky s chipotle majonézou', descriptionSk: 'Sladké batátové hranolky s chipotle majonézou', price: 3.90, image: '/images/fries.jpg', isNew: true, isVegetarian: true, allergens: '1,3,7', weight: '150g', sortOrder: ++sortOrder, addons: [...dressingAddons] })
  await createMenuItem({ catSlug: 'prilohy', name: 'Ryža', nameSk: 'Ryža', description: 'Dusená biela ryža', descriptionSk: 'Dusená biela ryža', price: 2.50, image: '/images/fries.jpg', isVegetarian: true, allergens: '', weight: '150g', sortOrder: ++sortOrder })
  await createMenuItem({ catSlug: 'prilohy', name: 'Coleslaw', nameSk: 'Coleslaw', description: 'Čerstvý kapustový šalát s mrkvou a dresingom', descriptionSk: 'Čerstvý kapustový šalát s mrkvou a dresingom', price: 2.00, image: '/images/fries.jpg', isVegetarian: true, allergens: '3,7,9', weight: '120g', sortOrder: ++sortOrder, addons: [...dressingAddons] })

  // Dresingy
  await createMenuItem({ catSlug: 'dresingy', name: 'Cesnakový dresing', nameSk: 'Cesnakový dresing', description: 'Domáci cesnakový dresing', descriptionSk: 'Domáci cesnakový dresing', price: 0.50, image: '/images/hero-bg.jpg', isPopular: true, isVegetarian: true, allergens: '3,7', weight: '30ml', sortOrder: ++sortOrder })
  await createMenuItem({ catSlug: 'dresingy', name: 'BBQ omáčka', nameSk: 'BBQ omáčka', description: 'Sladká údená BBQ omáčka', descriptionSk: 'Sladká údená BBQ omáčka', price: 0.50, image: '/images/hero-bg.jpg', isPopular: true, isVegetarian: true, allergens: '7,10', weight: '30ml', sortOrder: ++sortOrder })
  await createMenuItem({ catSlug: 'dresingy', name: 'Sweet chili omáčka', nameSk: 'Sweet chili omáčka', description: 'Sladká chiliová omáčka', descriptionSk: 'Sladká chiliová omáčka', price: 0.50, image: '/images/hero-bg.jpg', isSpicy: true, isVegetarian: true, allergens: '7', weight: '30ml', sortOrder: ++sortOrder })
  await createMenuItem({ catSlug: 'dresingy', name: 'Sriracha', nameSk: 'Sriracha', description: 'Pálivá sriracha omáčka', descriptionSk: 'Pálivá sriracha omáčka', price: 0.50, image: '/images/hero-bg.jpg', isSpicy: true, isVegetarian: true, allergens: '7,10', weight: '30ml', sortOrder: ++sortOrder })
  await createMenuItem({ catSlug: 'dresingy', name: 'Ranch dresing', nameSk: 'Ranch dresing', description: 'Krémový ranch dresing', descriptionSk: 'Krémový ranch dresing', price: 0.50, image: '/images/hero-bg.jpg', isVegetarian: true, allergens: '3,7', weight: '30ml', sortOrder: ++sortOrder })
  await createMenuItem({ catSlug: 'dresingy', name: 'Honey mustard', nameSk: 'Honey mustard', description: 'Medovo-horčicový dresing', descriptionSk: 'Medovo-horčicový dresing', price: 0.50, image: '/images/hero-bg.jpg', isVegetarian: true, allergens: '7,10', weight: '30ml', sortOrder: ++sortOrder })

  // Nápoje
  await createMenuItem({ catSlug: 'napoje', name: 'Coca-Cola 0.33l', nameSk: 'Coca-Cola 0.33l', description: 'Klasická Coca-Cola', descriptionSk: 'Klasická Coca-Cola', price: 1.80, image: '/images/hero-bg.jpg', isPopular: true, isVegetarian: true, allergens: '', weight: '0.33l', sortOrder: ++sortOrder })
  await createMenuItem({ catSlug: 'napoje', name: 'Sprite 0.33l', nameSk: 'Sprite 0.33l', description: 'Osviežujúci Sprite', descriptionSk: 'Osviežujúci Sprite', price: 1.80, image: '/images/hero-bg.jpg', isVegetarian: true, allergens: '', weight: '0.33l', sortOrder: ++sortOrder })
  await createMenuItem({ catSlug: 'napoje', name: 'Fuze Tea 0.33l', nameSk: 'Fuze Tea 0.33l', description: 'Ľadový čaj Fuze Tea', descriptionSk: 'Ľadový čaj Fuze Tea', price: 1.80, image: '/images/hero-bg.jpg', isVegetarian: true, allergens: '', weight: '0.33l', sortOrder: ++sortOrder })
  await createMenuItem({ catSlug: 'napoje', name: 'Zlatý bažant 0.5l', nameSk: 'Zlatý bažant 0.5l', description: 'Slovenský ležiak Zlatý bažant', descriptionSk: 'Slovenský ležiak Zlatý bažant', price: 2.50, image: '/images/hero-bg.jpg', isPopular: true, isVegetarian: true, isAlcohol: true, allergens: '1', weight: '0.5l', sortOrder: ++sortOrder })
  await createMenuItem({ catSlug: 'napoje', name: 'Topvar 0.5l', nameSk: 'Topvar 0.5l', description: 'Slovenské pivo Topvar', descriptionSk: 'Slovenské pivo Topvar', price: 2.30, image: '/images/hero-bg.jpg', isVegetarian: true, isAlcohol: true, allergens: '1', weight: '0.5l', sortOrder: ++sortOrder })
  await createMenuItem({ catSlug: 'napoje', name: 'Voda Rajec 0.5l', nameSk: 'Voda Rajec 0.5l', description: 'Prírodná minerálna voda Rajec', descriptionSk: 'Prírodná minerálna voda Rajec', price: 1.50, image: '/images/hero-bg.jpg', isVegetarian: true, allergens: '', weight: '0.5l', sortOrder: ++sortOrder })

  // Nočný rozvoz
  await createMenuItem({ catSlug: 'nocny-rozvoz', name: 'Nočný burger', nameSk: 'Nočný burger', description: 'Hovädzí burger so slaninou, cheddarom a špeciálnou omáčkou – nočná edícia', descriptionSk: 'Hovädzí burger so slaninou, cheddarom a špeciálnou omáčkou – nočná edícia', price: 10.90, image: '/images/burger.jpg', isPopular: true, isNew: true, allergens: '1,3,7', weight: '320g', sortOrder: ++sortOrder, addons: [...sideAddons, ...extraAddons, ...spiceAddons] })
  await createMenuItem({ catSlug: 'nocny-rozvoz', name: 'Nočný kebab', nameSk: 'Nočný kebab', description: 'Veľký kebab s extra omáčkou – ideálny na neskorú noc', descriptionSk: 'Veľký kebab s extra omáčkou – ideálny na neskorú noc', price: 9.50, image: '/images/kebab.jpg', isPopular: true, isNew: true, allergens: '1,3,7,11', weight: '400g', sortOrder: ++sortOrder, addons: [...dressingAddons, ...spiceAddons] })
  await createMenuItem({ catSlug: 'nocny-rozvoz', name: 'Nočný box: Burger + hranolky + pivo', nameSk: 'Nočný box: Burger + hranolky + pivo', description: 'Kompletný nočný box s burgerom, hranolkami a pivom Zlatý bažant', descriptionSk: 'Kompletný nočný box s burgerom, hranolkami a pivom Zlatý bažant', price: 14.90, image: '/images/menu-box.jpg', isPopular: true, isNew: true, isAlcohol: true, allergens: '1,3,7', weight: '700g', sortOrder: ++sortOrder, addons: [...dressingAddons, ...spiceAddons] })
  await createMenuItem({ catSlug: 'nocny-rozvoz', name: 'Nočné krídla box', nameSk: 'Nočné krídla box', description: '12 krídiel v BBQ omáčke s hranolkami – nočná porcia', descriptionSk: '12 krídiel v BBQ omáčke s hranolkami – nočná porcia', price: 11.90, image: '/images/chicken-wings.jpg', isNew: true, allergens: '1,3,7', weight: '500g', sortOrder: ++sortOrder, addons: [...dressingAddons, ...spiceAddons] })

  // ─── Delivery Zones (21) ─────────────────────────────────────────────────────
  console.log('  Creating delivery zones...')
  const zoneData = [
    { name: 'Hlohovec', postalCodes: '92001,920 01', deliveryFee: 1.00, minOrderAmount: 5.0, freeDeliveryThreshold: 15.0, estimatedTime: '20-30 min' },
    { name: 'Šulekovo', postalCodes: '92041,920 41', deliveryFee: 2.50, minOrderAmount: 15.0, freeDeliveryThreshold: 0, estimatedTime: '30-40 min' },
    { name: 'Kľačany', postalCodes: '92042,920 42', deliveryFee: 2.50, minOrderAmount: 15.0, freeDeliveryThreshold: 0, estimatedTime: '30-40 min' },
    { name: 'Madunice', postalCodes: '92043,920 43', deliveryFee: 2.50, minOrderAmount: 15.0, freeDeliveryThreshold: 0, estimatedTime: '30-40 min' },
    { name: 'Červeník', postalCodes: '92044,920 44', deliveryFee: 3.00, minOrderAmount: 15.0, freeDeliveryThreshold: 0, estimatedTime: '35-45 min' },
    { name: 'Leopoldov', postalCodes: '92061,920 61', deliveryFee: 2.50, minOrderAmount: 12.0, freeDeliveryThreshold: 0, estimatedTime: '25-35 min' },
    { name: 'Sereď', postalCodes: '92601,926 01', deliveryFee: 3.00, minOrderAmount: 15.0, freeDeliveryThreshold: 0, estimatedTime: '35-50 min' },
    { name: 'Sládkovičovo', postalCodes: '92651,926 51', deliveryFee: 3.50, minOrderAmount: 15.0, freeDeliveryThreshold: 0, estimatedTime: '40-50 min' },
    { name: 'Vinohrady nad Váhom', postalCodes: '92602,926 02', deliveryFee: 2.50, minOrderAmount: 15.0, freeDeliveryThreshold: 0, estimatedTime: '30-40 min' },
    { name: 'Tvrdomestice', postalCodes: '92603,926 03', deliveryFee: 3.00, minOrderAmount: 15.0, freeDeliveryThreshold: 0, estimatedTime: '35-45 min' },
    { name: 'Piešťany', postalCodes: '92101,921 01', deliveryFee: 4.00, minOrderAmount: 20.0, freeDeliveryThreshold: 0, estimatedTime: '40-55 min' },
    { name: 'Banka', postalCodes: '92102,921 02', deliveryFee: 4.00, minOrderAmount: 20.0, freeDeliveryThreshold: 0, estimatedTime: '40-55 min' },
    { name: 'Ratnovce', postalCodes: '92103,921 03', deliveryFee: 3.50, minOrderAmount: 15.0, freeDeliveryThreshold: 0, estimatedTime: '35-50 min' },
    { name: 'Hubina', postalCodes: '92104,921 04', deliveryFee: 3.50, minOrderAmount: 15.0, freeDeliveryThreshold: 0, estimatedTime: '35-50 min' },
    { name: 'Pečeňady', postalCodes: '92031,920 31', deliveryFee: 3.00, minOrderAmount: 15.0, freeDeliveryThreshold: 0, estimatedTime: '35-45 min' },
    { name: 'Hradište', postalCodes: '92062,920 62', deliveryFee: 2.50, minOrderAmount: 12.0, freeDeliveryThreshold: 0, estimatedTime: '25-35 min' },
    { name: 'Dolné Otrokovce', postalCodes: '92032,920 32', deliveryFee: 2.50, minOrderAmount: 15.0, freeDeliveryThreshold: 0, estimatedTime: '30-40 min' },
    { name: 'Horné Otrokovce', postalCodes: '92033,920 33', deliveryFee: 2.50, minOrderAmount: 15.0, freeDeliveryThreshold: 0, estimatedTime: '30-40 min' },
    { name: 'Trnava', postalCodes: '91701,917 01', deliveryFee: 5.00, minOrderAmount: 25.0, freeDeliveryThreshold: 0, estimatedTime: '45-60 min' },
    { name: 'Bíňovce', postalCodes: '92034,920 34', deliveryFee: 3.00, minOrderAmount: 15.0, freeDeliveryThreshold: 0, estimatedTime: '35-45 min' },
    { name: 'Križovany nad Dudváhom', postalCodes: '92035,920 35', deliveryFee: 3.00, minOrderAmount: 15.0, freeDeliveryThreshold: 0, estimatedTime: '35-45 min' },
  ]

  await Promise.all(
    zoneData.map(z => prisma.deliveryZone.create({
      data: {
        name: z.name,
        postalCodes: z.postalCodes,
        deliveryFee: z.deliveryFee,
        minOrderAmount: z.minOrderAmount,
        freeDeliveryThreshold: z.freeDeliveryThreshold,
        estimatedTime: z.estimatedTime,
        isActive: true,
      },
    }))
  )

  // ─── Promo Codes ────────────────────────────────────────────────────────────
  console.log('  Creating promo codes...')
  await prisma.promoCode.create({
    data: {
      code: 'DRAGON10',
      description: '10% zľava na celú objednávku',
      discountType: DiscountType.PERCENTAGE,
      discountValue: 10,
      minOrderAmount: 15.0,
      maxUses: 100,
      currentUses: 0,
      validFrom: new Date('2024-01-01'),
      validTo: new Date('2026-12-31'),
      isActive: true,
    },
  })

  // ─── Couriers ───────────────────────────────────────────────────────────────
  console.log('  Creating couriers...')
  await Promise.all([
    prisma.courier.create({
      data: {
        firstName: 'Milan',
        lastName: 'Števko',
        phone: '+421 912 000 111',
        email: 'milan@dragonstreetfood.sk',
        isAvailable: true,
        isOnline: true,
        vehicleType: 'car',
        currentLat: 48.4325,
        currentLng: 17.8047,
      },
    }),
    prisma.courier.create({
      data: {
        firstName: 'Tomáš',
        lastName: 'Bielik',
        phone: '+421 915 000 222',
        email: 'tomas@dragonstreetfood.sk',
        isAvailable: true,
        isOnline: true,
        vehicleType: 'bicycle',
        currentLat: 48.4310,
        currentLng: 17.8030,
      },
    }),
    prisma.courier.create({
      data: {
        firstName: 'Lukáš',
        lastName: 'Hraško',
        phone: '+421 918 000 333',
        email: 'lukas@dragonstreetfood.sk',
        isAvailable: false,
        isOnline: false,
        vehicleType: 'car',
        currentLat: 48.4280,
        currentLng: 17.8020,
      },
    }),
  ])

  // ─── Marketing Posts ────────────────────────────────────────────────────────
  console.log('  Creating marketing posts...')
  await Promise.all([
    prisma.marketingPost.create({
      data: {
        title: 'Nový Truffle Burger – len tento týždeň!',
        category: 'facebook',
        content: 'Skúste náš nový Truffle Burger s truffle majonézou, rukolou a sušenými paradajkami. Len tento týždeň za špeciálnu cenu 12.90€!',
        hashtags: '#dragonstreetfood #truffleburger #tyzdennyspecial #hlohovec',
        imageUrl: '/images/burger.jpg',
      },
    }),
    prisma.marketingPost.create({
      data: {
        title: 'Nočný rozvoz je tu! 🌙',
        category: 'instagram',
        content: 'Od teraz doručujeme až do 01:00! Hlad v noci? My sa postaráme. Nočný burger, nočný kebab alebo nočný box s pivom – vyberte si!',
        hashtags: '#nocnyrozvoz #dragonstreetfood #hlohovec #nightdelivery',
        imageUrl: '/images/burger.jpg',
      },
    }),
    prisma.marketingPost.create({
      data: {
        title: 'Denné menu od 8.50€',
        category: 'story',
        content: 'Dnešné denné menu: Burger/Kebab/Pinsa + polievka + nápoj. Už od 8.50€!',
        hashtags: '#dennemenu #obed #dragonstreetfood',
        imageUrl: '/images/menu-box.jpg',
      },
    }),
    prisma.marketingPost.create({
      data: {
        title: 'Krídla party box pre 4 osoby',
        category: 'facebook',
        content: '24 krídiel v BBQ omáčke, 3x hranolky a 3x nápoj za 34.90€. Ideálne na party alebo rodinný večer!',
        hashtags: '#partybox #krídla #dragonstreetfood #hlohovec',
        imageUrl: '/images/chicken-wings.jpg',
      },
    }),
  ])

  console.log('✅ Seeding completed successfully!')
  console.log(`  - Restaurant settings: 1`)
  console.log(`  - Opening hours: 7 days`)
  console.log(`  - Categories: ${categoryData.length}`)
  console.log(`  - Menu items: ${sortOrder}`)
  console.log(`  - Delivery zones: ${zoneData.length}`)
  console.log(`  - Promo codes: 1`)
  console.log(`  - Couriers: 3`)
  console.log(`  - Marketing posts: 4`)
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
