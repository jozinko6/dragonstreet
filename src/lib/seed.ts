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

  // ─── Restaurant Settings ────────────────────────────────────────────────────
  console.log('  Creating restaurant settings...')
  const settings = await prisma.restaurantSettings.create({
    data: {
      name: 'Dragon Street Food Hlohovec',
      address: 'Hlavná 42, 920 01 Hlohovec',
      phone: '+421 912 345 678',
      email: 'info@dragonstreetfood.sk',
      openingHours: JSON.stringify([
        { day: 'Po - Št', hours: '10:00 - 21:00' },
        { day: 'Pi', hours: '10:00 - 22:00' },
        { day: 'So', hours: '11:00 - 22:00' },
        { day: 'Ne', hours: '11:00 - 20:00' },
      ]),
      minOrderAmount: 8.0,
      deliveryFee: 2.0,
      freeDeliveryThreshold: 25.0,
      isActive: true,
      acceptOnlineOrders: true,
    },
  })

  // ─── Menu Categories ────────────────────────────────────────────────────────
  console.log('  Creating menu categories...')
  const categories = await Promise.all([
    prisma.menuCategory.create({
      data: {
        name: 'Noodles',
        nameSk: 'Rezance',
        slug: 'rezance',
        description: 'Aromatické ázijské rezance plné chuti',
        image: '/images/pad-thai.jpg',
        sortOrder: 1,
        isActive: true,
      },
    }),
    prisma.menuCategory.create({
      data: {
        name: 'Rice Dishes',
        nameSk: 'Ryžové jedlá',
        slug: 'ryzove-jedla',
        description: 'Voňavá ryža s výberom ázijských špecialít',
        image: '/images/fried-rice.jpg',
        sortOrder: 2,
        isActive: true,
      },
    }),
    prisma.menuCategory.create({
      data: {
        name: 'Chicken',
        nameSk: 'Kura',
        slug: 'kura',
        description: 'Chrumkavé a šťavnaté kuracie špeciality',
        image: '/images/kung-pao.jpg',
        sortOrder: 3,
        isActive: true,
      },
    }),
    prisma.menuCategory.create({
      data: {
        name: 'Starters',
        nameSk: 'Predjedlá',
        slug: 'predjedla',
        description: 'Perfektný začiatok vášho jedla',
        image: '/images/spring-rolls.jpg',
        sortOrder: 4,
        isActive: true,
      },
    }),
    prisma.menuCategory.create({
      data: {
        name: 'Curry',
        nameSk: 'Curry',
        slug: 'curry',
        description: 'Pikantné a krémové curry z Thajska',
        image: '/images/curry.jpg',
        sortOrder: 5,
        isActive: true,
      },
    }),
    prisma.menuCategory.create({
      data: {
        name: 'Drinks',
        nameSk: 'Nápoje',
        slug: 'napoje',
        description: 'Osviežujúce nápoje k vášmu jedlu',
        image: '/images/boba-tea.jpg',
        sortOrder: 6,
        isActive: true,
      },
    }),
  ])

  const [catNoodles, catRice, catChicken, catStarters, catCurry, catDrinks] = categories

  // ─── Menu Items with Addons ─────────────────────────────────────────────────
  console.log('  Creating menu items...')

  // Noodles items
  const padThai = await prisma.menuItem.create({
    data: {
      categoryId: catNoodles.id,
      name: 'Pad Thai',
      nameSk: 'Pad Thai',
      description: 'Classic Thai stir-fried rice noodles with eggs, tofu, bean sprouts, and crushed peanuts',
      descriptionSk: 'Klasické thajské rezance wok s vajíčkom, tofu, výhonkami a arašidmi',
      price: 8.90,
      image: '/images/pad-thai.jpg',
      isPopular: true,
      isSpicy: false,
      isNew: false,
      isVegetarian: true,
      isAvailable: true,
      allergens: '1,3,8',
      sortOrder: 1,
      addons: {
        create: [
          { name: 'Extra chicken', nameSk: 'Extra kura', price: 2.00, isAvailable: true },
          { name: 'Extra shrimp', nameSk: 'Extra krevety', price: 3.00, isAvailable: true },
          { name: 'Extra spicy', nameSk: 'Extra pálivé', price: 0.00, isAvailable: true },
        ],
      },
    },
  })

  const ramen = await prisma.menuItem.create({
    data: {
      categoryId: catNoodles.id,
      name: 'Ramen',
      nameSk: 'Ramen',
      description: 'Rich Japanese ramen broth with noodles, soft-boiled egg, nori, and green onions',
      descriptionSk: 'Bohatý japonský vývar s rezancami, vajíčkom, nori a zelenou cibuľkou',
      price: 9.50,
      image: '/images/ramen.jpg',
      isPopular: true,
      isSpicy: false,
      isNew: false,
      isVegetarian: false,
      isAvailable: true,
      allergens: '1,3,7,9',
      sortOrder: 2,
      addons: {
        create: [
          { name: 'Extra egg', nameSk: 'Extra vajíčko', price: 1.00, isAvailable: true },
          { name: 'Chashu pork', nameSk: 'Chashu bravčové', price: 3.00, isAvailable: true },
        ],
      },
    },
  })

  const spicyUdon = await prisma.menuItem.create({
    data: {
      categoryId: catNoodles.id,
      name: 'Spicy Udon',
      nameSk: 'Pálivé Udon',
      description: 'Thick udon noodles in spicy chili sauce with vegetables and sesame',
      descriptionSk: 'Hrubé udon rezance v pálivej chiliovej omáčke so zeleninou a sezamom',
      price: 9.90,
      image: '/images/pad-thai.jpg',
      isPopular: false,
      isSpicy: true,
      isNew: true,
      isVegetarian: true,
      isAvailable: true,
      allergens: '1,3,8',
      sortOrder: 3,
      addons: {
        create: [
          { name: 'Extra tofu', nameSk: 'Extra tofu', price: 1.50, isAvailable: true },
        ],
      },
    },
  })

  // Rice Dishes items
  const friedRice = await prisma.menuItem.create({
    data: {
      categoryId: catRice.id,
      name: 'Fried Rice',
      nameSk: 'Vyprážaná ryža',
      description: 'Wok-fried rice with egg, vegetables, soy sauce, and spring onions',
      descriptionSk: 'Wok ryža s vajíčkom, zeleninou, sójovou omáčkou a jarnou cibuľkou',
      price: 7.90,
      image: '/images/fried-rice.jpg',
      isPopular: true,
      isSpicy: false,
      isNew: false,
      isVegetarian: true,
      isAvailable: true,
      allergens: '1,3,7',
      sortOrder: 1,
      addons: {
        create: [
          { name: 'Extra chicken', nameSk: 'Extra kura', price: 2.00, isAvailable: true },
          { name: 'Extra egg', nameSk: 'Extra vajíčko', price: 1.00, isAvailable: true },
        ],
      },
    },
  })

  const nasiGoreng = await prisma.menuItem.create({
    data: {
      categoryId: catRice.id,
      name: 'Nasi Goreng',
      nameSk: 'Nasi Goreng',
      description: 'Indonesian-style fried rice with chicken, egg, and shrimp crackers',
      descriptionSk: 'Indonézska vyprážaná ryža s kuracím, vajíčkom a krevetovými lupienkami',
      price: 8.50,
      image: '/images/fried-rice.jpg',
      isPopular: false,
      isSpicy: true,
      isNew: false,
      isVegetarian: false,
      isAvailable: true,
      allergens: '1,3,4,7',
      sortOrder: 2,
      addons: {
        create: [
          { name: 'Extra shrimp', nameSk: 'Extra krevety', price: 3.00, isAvailable: true },
        ],
      },
    },
  })

  const mangoRice = await prisma.menuItem.create({
    data: {
      categoryId: catRice.id,
      name: 'Mango Sticky Rice',
      nameSk: 'Mango lepkavá ryža',
      description: 'Sweet Thai dessert with coconut sticky rice and fresh mango',
      descriptionSk: 'Sladký thajský dezert s kokosovou lepkavou ryžou a čerstvým mangom',
      price: 6.90,
      image: '/images/fried-rice.jpg',
      isPopular: false,
      isSpicy: false,
      isNew: true,
      isVegetarian: true,
      isAvailable: true,
      allergens: '7,8',
      sortOrder: 3,
      addons: {
        create: [
          { name: 'Extra mango', nameSk: 'Extra mango', price: 1.50, isAvailable: true },
        ],
      },
    },
  })

  // Chicken items
  const kungPao = await prisma.menuItem.create({
    data: {
      categoryId: catChicken.id,
      name: 'Kung Pao Chicken',
      nameSk: 'Kung Pao kura',
      description: 'Spicy Sichuan chicken with peanuts, dried chilies, and Sichuan pepper',
      descriptionSk: 'Pálivé sečuánske kura s arašidmi, sušenými čili a sečuánskym korením',
      price: 9.90,
      image: '/images/kung-pao.jpg',
      isPopular: true,
      isSpicy: true,
      isNew: false,
      isVegetarian: false,
      isAvailable: true,
      allergens: '1,3,8',
      sortOrder: 1,
      addons: {
        create: [
          { name: 'Extra spicy', nameSk: 'Extra pálivé', price: 0.00, isAvailable: true },
          { name: 'Rice side', nameSk: 'Príloha ryža', price: 1.50, isAvailable: true },
        ],
      },
    },
  })

  const sweetSour = await prisma.menuItem.create({
    data: {
      categoryId: catChicken.id,
      name: 'Sweet & Sour Chicken',
      nameSk: 'Sladkokyslé kura',
      description: 'Crispy chicken pieces in tangy sweet and sour sauce with bell peppers and pineapple',
      descriptionSk: 'Chrumkavé kuracie kúsky v sladkokyslej omáčke s paprikou a ananásom',
      price: 9.50,
      image: '/images/sweet-sour.jpg',
      isPopular: true,
      isSpicy: false,
      isNew: false,
      isVegetarian: false,
      isAvailable: true,
      allergens: '1,3,7',
      sortOrder: 2,
      addons: {
        create: [
          { name: 'Rice side', nameSk: 'Príloha ryža', price: 1.50, isAvailable: true },
        ],
      },
    },
  })

  const teriyaki = await prisma.menuItem.create({
    data: {
      categoryId: catChicken.id,
      name: 'Teriyaki Chicken',
      nameSk: 'Teriyaki kura',
      description: 'Grilled chicken glazed with sweet teriyaki sauce, served with steamed rice',
      descriptionSk: 'Grilované kura v sladkej teriyaki omáčke, podávané s dusenou ryžou',
      price: 10.50,
      image: '/images/kung-pao.jpg',
      isPopular: false,
      isSpicy: false,
      isNew: true,
      isVegetarian: false,
      isAvailable: true,
      allergens: '1,3,7',
      sortOrder: 3,
      addons: {
        create: [
          { name: 'Extra sauce', nameSk: 'Extra omáčka', price: 0.50, isAvailable: true },
        ],
      },
    },
  })

  // Starters items
  const springRolls = await prisma.menuItem.create({
    data: {
      categoryId: catStarters.id,
      name: 'Spring Rolls',
      nameSk: 'Jarné rolky',
      description: 'Crispy vegetable spring rolls served with sweet chili dipping sauce',
      descriptionSk: 'Chrumkavé zeleninové jarné rolky so sladkou chiliovou omáčkou',
      price: 4.90,
      image: '/images/spring-rolls.jpg',
      isPopular: true,
      isSpicy: false,
      isNew: false,
      isVegetarian: true,
      isAvailable: true,
      allergens: '1,3,7',
      sortOrder: 1,
      addons: {
        create: [
          { name: 'Extra sauce', nameSk: 'Extra omáčka', price: 0.50, isAvailable: true },
        ],
      },
    },
  })

  const dumplings = await prisma.menuItem.create({
    data: {
      categoryId: catStarters.id,
      name: 'Steamed Dumplings',
      nameSk: 'Parené knedličky',
      description: 'Handmade steamed dumplings filled with pork and vegetables',
      descriptionSk: 'Ručne robené parené knedličky plnené bravčovým a zeleninou',
      price: 5.90,
      image: '/images/dumplings.jpg',
      isPopular: true,
      isSpicy: false,
      isNew: false,
      isVegetarian: false,
      isAvailable: true,
      allergens: '1,3,7',
      sortOrder: 2,
      addons: {
        create: [
          { name: 'Extra portion', nameSk: 'Extra porcia', price: 3.00, isAvailable: true },
        ],
      },
    },
  })

  const edamame = await prisma.menuItem.create({
    data: {
      categoryId: catStarters.id,
      name: 'Edamame',
      nameSk: 'Edamame',
      description: 'Steamed soy beans with sea salt and chili flakes',
      descriptionSk: 'Parené sójové bôby s morskou soľou a čili vločkami',
      price: 3.90,
      image: '/images/spring-rolls.jpg',
      isPopular: false,
      isSpicy: false,
      isNew: false,
      isVegetarian: true,
      isAvailable: true,
      allergens: '7',
      sortOrder: 3,
    },
  })

  // Curry items
  const greenCurry = await prisma.menuItem.create({
    data: {
      categoryId: catCurry.id,
      name: 'Green Curry',
      nameSk: 'Zelené curry',
      description: 'Thai green curry with coconut milk, bamboo shoots, and fresh basil',
      descriptionSk: 'Thajské zelené curry s kokosovým mliekom, bambusovými výhonkami a bazalkou',
      price: 10.90,
      image: '/images/curry.jpg',
      isPopular: true,
      isSpicy: true,
      isNew: false,
      isVegetarian: false,
      isAvailable: true,
      allergens: '1,3,7,8',
      sortOrder: 1,
      addons: {
        create: [
          { name: 'Extra chicken', nameSk: 'Extra kura', price: 2.00, isAvailable: true },
          { name: 'Rice side', nameSk: 'Príloha ryža', price: 1.50, isAvailable: true },
        ],
      },
    },
  })

  const redCurry = await prisma.menuItem.create({
    data: {
      categoryId: catCurry.id,
      name: 'Red Curry',
      nameSk: 'Červené curry',
      description: 'Rich red curry with coconut cream, vegetables, and lemongrass',
      descriptionSk: 'Bohaté červené curry s kokosovým krémom, zeleninou a citronovou trávou',
      price: 10.90,
      image: '/images/curry.jpg',
      isPopular: false,
      isSpicy: true,
      isNew: true,
      isVegetarian: false,
      isAvailable: true,
      allergens: '1,3,7,8',
      sortOrder: 2,
      addons: {
        create: [
          { name: 'Tofu instead', nameSk: 'Namiesto tofu', price: 0.00, isAvailable: true },
          { name: 'Rice side', nameSk: 'Príloha ryža', price: 1.50, isAvailable: true },
        ],
      },
    },
  })

  const massaman = await prisma.menuItem.create({
    data: {
      categoryId: catCurry.id,
      name: 'Massaman Curry',
      nameSk: 'Massaman curry',
      description: 'Mild peanut curry with potatoes, onions, and roasted peanuts',
      descriptionSk: 'Mierne arašidové curry so zemiakmi, cibuľou a praženými arašidmi',
      price: 11.50,
      image: '/images/curry.jpg',
      isPopular: false,
      isSpicy: false,
      isNew: true,
      isVegetarian: false,
      isAvailable: true,
      allergens: '1,3,7,8',
      sortOrder: 3,
      addons: {
        create: [
          { name: 'Rice side', nameSk: 'Príloha ryža', price: 1.50, isAvailable: true },
        ],
      },
    },
  })

  // Drinks items
  const bobaTea = await prisma.menuItem.create({
    data: {
      categoryId: catDrinks.id,
      name: 'Boba Tea',
      nameSk: 'Boba čaj',
      description: 'Fresh bubble tea with tapioca pearls in your choice of flavor',
      descriptionSk: 'Čerstvý bubble tea s tapioka perlami podľa vášho výberu',
      price: 4.50,
      image: '/images/boba-tea.jpg',
      isPopular: true,
      isSpicy: false,
      isNew: false,
      isVegetarian: true,
      isAvailable: true,
      allergens: '7',
      sortOrder: 1,
      addons: {
        create: [
          { name: 'Extra pearls', nameSk: 'Extra perly', price: 0.50, isAvailable: true },
        ],
      },
    },
  })

  const mangoLassi = await prisma.menuItem.create({
    data: {
      categoryId: catDrinks.id,
      name: 'Mango Lassi',
      nameSk: 'Mango Lassi',
      description: 'Creamy mango yogurt drink, perfectly refreshing',
      descriptionSk: 'Krémový mangový jogurtový nápoj, dokonale osviežujúci',
      price: 3.90,
      image: '/images/boba-tea.jpg',
      isPopular: false,
      isSpicy: false,
      isNew: false,
      isVegetarian: true,
      isAvailable: true,
      allergens: '7',
      sortOrder: 2,
    },
  })

  const greenTea = await prisma.menuItem.create({
    data: {
      categoryId: catDrinks.id,
      name: 'Green Tea',
      nameSk: 'Zelený čaj',
      description: 'Premium Japanese green tea, hot or iced',
      descriptionSk: 'Prémiový japonský zelený čaj, teplý alebo ľadový',
      price: 2.50,
      image: '/images/boba-tea.jpg',
      isPopular: false,
      isSpicy: false,
      isNew: false,
      isVegetarian: true,
      isAvailable: true,
      allergens: '',
      sortOrder: 3,
    },
  })

  // ─── Delivery Zones ─────────────────────────────────────────────────────────
  console.log('  Creating delivery zones...')
  await Promise.all([
    prisma.deliveryZone.create({
      data: {
        name: 'Hlohovec centrum',
        postalCodes: '92001,920 01',
        deliveryFee: 2.00,
        minOrderAmount: 10.0,
        estimatedTime: '25-35 min',
        isActive: true,
      },
    }),
    prisma.deliveryZone.create({
      data: {
        name: 'Hlohovec okolie',
        postalCodes: '92002,920 02,92023,920 23',
        deliveryFee: 2.50,
        minOrderAmount: 12.0,
        estimatedTime: '35-45 min',
        isActive: true,
      },
    }),
    prisma.deliveryZone.create({
      data: {
        name: 'Sereď, Sládkovičovo',
        postalCodes: '92601,926 01,92651,926 51',
        deliveryFee: 3.50,
        minOrderAmount: 15.0,
        estimatedTime: '40-55 min',
        isActive: true,
      },
    }),
  ])

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

  console.log('✅ Seeding completed successfully!')
  console.log(`  - Restaurant settings: 1`)
  console.log(`  - Categories: ${categories.length}`)
  console.log(`  - Menu items: 18`)
  console.log(`  - Delivery zones: 3`)
  console.log(`  - Promo codes: 1`)
  console.log(`  - Couriers: 3`)
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
