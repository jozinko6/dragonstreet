// Mock data for Dragon Street Food
// In production, this would come from the database via API

export interface MenuCategoryData {
  id: string
  name: string
  nameSk: string
  slug: string
  description: string
  image: string
  sortOrder: number
}

export interface MenuItemData {
  id: string
  categoryId: string
  name: string
  nameSk: string
  description: string
  descriptionSk: string
  price: number
  image: string
  isPopular: boolean
  isSpicy: boolean
  isNew: boolean
  isVegetarian: boolean
  isAvailable: boolean
  allergens: string[]
  addons: MenuAddonData[]
}

export interface MenuAddonData {
  id: string
  name: string
  nameSk: string
  price: number
  isAvailable: boolean
}

export const categories: MenuCategoryData[] = [
  {
    id: 'cat-1',
    name: 'Noodles',
    nameSk: 'Rezance',
    slug: 'rezance',
    description: 'Aromatické ázijské rezance plné chuti',
    image: '/images/pad-thai.jpg',
    sortOrder: 1,
  },
  {
    id: 'cat-2',
    name: 'Rice Dishes',
    nameSk: 'Ryžové jedlá',
    slug: 'ryzove-jedla',
    description: 'Voňavá ryža s výberom ázijských špecialít',
    image: '/images/fried-rice.jpg',
    sortOrder: 2,
  },
  {
    id: 'cat-3',
    name: 'Chicken',
    nameSk: 'Kura',
    slug: 'kura',
    description: 'Chrumkavé a šťavnaté kuracie špeciality',
    image: '/images/kung-pao.jpg',
    sortOrder: 3,
  },
  {
    id: 'cat-4',
    name: 'Starters',
    nameSk: 'Predjedlá',
    slug: 'predjedla',
    description: 'Perfektný začiatok vášho jedla',
    image: '/images/spring-rolls.jpg',
    sortOrder: 4,
  },
  {
    id: 'cat-5',
    name: 'Curry',
    nameSk: 'Curry',
    slug: 'curry',
    description: 'Pikantné a krémové curry z Thajska',
    image: '/images/curry.jpg',
    sortOrder: 5,
  },
  {
    id: 'cat-6',
    name: 'Drinks',
    nameSk: 'Nápoje',
    slug: 'napoje',
    description: 'Osviežujúce nápoje k vášmu jedlu',
    image: '/images/boba-tea.jpg',
    sortOrder: 6,
  },
]

export const menuItems: MenuItemData[] = [
  // Noodles
  {
    id: 'item-1',
    categoryId: 'cat-1',
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
    allergens: ['1', '3', '8'],
    addons: [
      { id: 'addon-1', name: 'Extra chicken', nameSk: 'Extra kura', price: 2.00, isAvailable: true },
      { id: 'addon-2', name: 'Extra shrimp', nameSk: 'Extra krevety', price: 3.00, isAvailable: true },
      { id: 'addon-3', name: 'Extra spicy', nameSk: 'Extra pálivé', price: 0.00, isAvailable: true },
    ],
  },
  {
    id: 'item-2',
    categoryId: 'cat-1',
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
    allergens: ['1', '3', '7', '9'],
    addons: [
      { id: 'addon-4', name: 'Extra egg', nameSk: 'Extra vajíčko', price: 1.00, isAvailable: true },
      { id: 'addon-5', name: 'Chashu pork', nameSk: 'Chashu bravčové', price: 3.00, isAvailable: true },
    ],
  },
  {
    id: 'item-3',
    categoryId: 'cat-1',
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
    allergens: ['1', '3', '8'],
    addons: [
      { id: 'addon-6', name: 'Extra tofu', nameSk: 'Extra tofu', price: 1.50, isAvailable: true },
    ],
  },

  // Rice Dishes
  {
    id: 'item-4',
    categoryId: 'cat-2',
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
    allergens: ['1', '3', '7'],
    addons: [
      { id: 'addon-7', name: 'Extra chicken', nameSk: 'Extra kura', price: 2.00, isAvailable: true },
      { id: 'addon-8', name: 'Extra egg', nameSk: 'Extra vajíčko', price: 1.00, isAvailable: true },
    ],
  },
  {
    id: 'item-5',
    categoryId: 'cat-2',
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
    allergens: ['1', '3', '4', '7'],
    addons: [
      { id: 'addon-9', name: 'Extra shrimp', nameSk: 'Extra krevety', price: 3.00, isAvailable: true },
    ],
  },

  // Chicken
  {
    id: 'item-6',
    categoryId: 'cat-3',
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
    allergens: ['1', '3', '8'],
    addons: [
      { id: 'addon-10', name: 'Extra spicy', nameSk: 'Extra pálivé', price: 0.00, isAvailable: true },
      { id: 'addon-11', name: 'Rice side', nameSk: 'Príloha ryža', price: 1.50, isAvailable: true },
    ],
  },
  {
    id: 'item-7',
    categoryId: 'cat-3',
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
    allergens: ['1', '3', '7'],
    addons: [
      { id: 'addon-12', name: 'Rice side', nameSk: 'Príloha ryža', price: 1.50, isAvailable: true },
    ],
  },
  {
    id: 'item-8',
    categoryId: 'cat-3',
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
    allergens: ['1', '3', '7'],
    addons: [
      { id: 'addon-13', name: 'Extra sauce', nameSk: 'Extra omáčka', price: 0.50, isAvailable: true },
    ],
  },

  // Starters
  {
    id: 'item-9',
    categoryId: 'cat-4',
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
    allergens: ['1', '3', '7'],
    addons: [
      { id: 'addon-14', name: 'Extra sauce', nameSk: 'Extra omáčka', price: 0.50, isAvailable: true },
    ],
  },
  {
    id: 'item-10',
    categoryId: 'cat-4',
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
    allergens: ['1', '3', '7'],
    addons: [
      { id: 'addon-15', name: 'Extra portion', nameSk: 'Extra porcia', price: 3.00, isAvailable: true },
    ],
  },
  {
    id: 'item-11',
    categoryId: 'cat-4',
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
    allergens: ['7'],
    addons: [],
  },

  // Curry
  {
    id: 'item-12',
    categoryId: 'cat-5',
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
    allergens: ['1', '3', '7', '8'],
    addons: [
      { id: 'addon-16', name: 'Extra chicken', nameSk: 'Extra kura', price: 2.00, isAvailable: true },
      { id: 'addon-17', name: 'Rice side', nameSk: 'Príloha ryža', price: 1.50, isAvailable: true },
    ],
  },
  {
    id: 'item-13',
    categoryId: 'cat-5',
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
    allergens: ['1', '3', '7', '8'],
    addons: [
      { id: 'addon-18', name: 'Tofu instead', nameSk: 'Namiesto tofu', price: 0.00, isAvailable: true },
      { id: 'addon-19', name: 'Rice side', nameSk: 'Príloha ryža', price: 1.50, isAvailable: true },
    ],
  },
  {
    id: 'item-14',
    categoryId: 'cat-5',
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
    allergens: ['1', '3', '7', '8'],
    addons: [
      { id: 'addon-20', name: 'Rice side', nameSk: 'Príloha ryža', price: 1.50, isAvailable: true },
    ],
  },

  // Drinks
  {
    id: 'item-15',
    categoryId: 'cat-6',
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
    allergens: ['7'],
    addons: [
      { id: 'addon-21', name: 'Extra pearls', nameSk: 'Extra perly', price: 0.50, isAvailable: true },
    ],
  },
  {
    id: 'item-16',
    categoryId: 'cat-6',
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
    allergens: ['7'],
    addons: [],
  },
  {
    id: 'item-17',
    categoryId: 'cat-6',
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
    allergens: [],
    addons: [],
  },
]

// Allergen map
export const allergenMap: Record<string, string> = {
  '1': 'Obilniny (glutén)',
  '2': 'Kôrovce',
  '3': 'Vajcia',
  '4': 'Ryby',
  '5': 'Arašidy',
  '6': 'Sójové bôby',
  '7': 'Mlieko',
  '8': 'Orechy',
  '9': 'Zeler',
  '10': 'Horčica',
  '11': 'Sezam',
  '12': 'Oxid siričitý',
  '13': 'Vlčí bob',
  '14': 'Mäkkýše',
}

// Opening hours
export const openingHours = [
  { day: 'Po - Št', hours: '10:00 - 21:00' },
  { day: 'Pi', hours: '10:00 - 22:00' },
  { day: 'So', hours: '11:00 - 22:00' },
  { day: 'Ne', hours: '11:00 - 20:00' },
]

// Delivery zones
export const deliveryZones = [
  { name: 'Hlohovec centrum', fee: 2.00, minOrder: 10, time: '25-35 min' },
  { name: 'Hlohovec okolie', fee: 2.50, minOrder: 12, time: '35-45 min' },
  { name: 'Sereď, Sládkovičovo', fee: 3.50, minOrder: 15, time: '40-55 min' },
]

// Mock orders for admin
export interface MockOrder {
  id: string
  orderNumber: string
  status: string
  customerName: string
  customerPhone: string
  deliveryType: 'DELIVERY' | 'PICKUP'
  address: string
  items: { name: string; quantity: number; price: number }[]
  total: number
  paymentMethod: string
  notes: string
  createdAt: string
  estimatedTime: string
}

export const mockOrders: MockOrder[] = [
  {
    id: 'ord-1',
    orderNumber: 'DSF-001',
    status: 'PREPARING',
    customerName: 'Ján Novák',
    customerPhone: '+421 912 345 678',
    deliveryType: 'DELIVERY',
    address: 'Hlavná 15, Hlohovec',
    items: [
      { name: 'Pad Thai', quantity: 2, price: 8.90 },
      { name: 'Spring Rolls', quantity: 1, price: 4.90 },
    ],
    total: 24.20,
    paymentMethod: 'Hotovosť pri doručení',
    notes: 'Bez arašidov prosím',
    createdAt: '12:30',
    estimatedTime: '13:05',
  },
  {
    id: 'ord-2',
    orderNumber: 'DSF-002',
    status: 'ACCEPTED',
    customerName: 'Mária Kováčová',
    customerPhone: '+421 918 765 432',
    deliveryType: 'PICKUP',
    address: '',
    items: [
      { name: 'Kung Pao kura', quantity: 1, price: 9.90 },
      { name: 'Boba čaj', quantity: 2, price: 4.50 },
    ],
    total: 20.40,
    paymentMethod: 'Platba pri prevzatí',
    notes: '',
    createdAt: '12:35',
    estimatedTime: '13:10',
  },
  {
    id: 'ord-3',
    orderNumber: 'DSF-003',
    status: 'OUT_FOR_DELIVERY',
    customerName: 'Peter Horváth',
    customerPhone: '+421 905 111 222',
    deliveryType: 'DELIVERY',
    address: 'Školská 8, Hlohovec',
    items: [
      { name: 'Zelené curry', quantity: 1, price: 10.90 },
      { name: 'Ramen', quantity: 1, price: 9.50 },
      { name: 'Jarné rolky', quantity: 1, price: 4.90 },
    ],
    total: 28.80,
    paymentMethod: 'Online platba',
    notes: 'Zvoniť, nie klipnúť',
    createdAt: '12:10',
    estimatedTime: '12:55',
  },
  {
    id: 'ord-4',
    orderNumber: 'DSF-004',
    status: 'CREATED',
    customerName: 'Anna Slobodová',
    customerPhone: '+421 911 333 444',
    deliveryType: 'DELIVERY',
    address: 'Nábrežie 22, Hlohovec',
    items: [
      { name: 'Sladkokyslé kura', quantity: 1, price: 9.50 },
      { name: 'Vyprážaná ryža', quantity: 1, price: 7.90 },
    ],
    total: 22.40,
    paymentMethod: 'Hotovosť pri doručení',
    notes: '',
    createdAt: '12:42',
    estimatedTime: '13:20',
  },
]

// Mock couriers
export interface MockCourier {
  id: string
  name: string
  phone: string
  isAvailable: boolean
  isOnline: boolean
  vehicleType: string
  activeOrders: number
  location: string
}

export const mockCouriers: MockCourier[] = [
  { id: 'courier-1', name: 'Milan Števko', phone: '+421 912 000 111', isAvailable: true, isOnline: true, vehicleType: 'Auto', activeOrders: 1, location: 'Hlohovec centrum' },
  { id: 'courier-2', name: 'Tomáš Bielik', phone: '+421 915 000 222', isAvailable: true, isOnline: true, vehicleType: 'Bicykel', activeOrders: 0, location: 'Pri reštaurácii' },
  { id: 'courier-3', name: 'Lukáš Hraško', phone: '+421 918 000 333', isAvailable: false, isOnline: false, vehicleType: 'Auto', activeOrders: 2, location: 'Sereď' },
]

// Order status labels
export const statusLabels: Record<string, { label: string; color: string; icon: string }> = {
  CREATED: { label: 'Vytvorená', color: 'bg-gray-100 text-gray-700', icon: '📋' },
  PAYMENT_PENDING: { label: 'Čaká na platbu', color: 'bg-yellow-100 text-yellow-700', icon: '💳' },
  PAID: { label: 'Zaplatená', color: 'bg-blue-100 text-blue-700', icon: '✅' },
  ACCEPTED: { label: 'Prijatá', color: 'bg-blue-100 text-blue-700', icon: '👍' },
  REJECTED: { label: 'Odmietnutá', color: 'bg-red-100 text-red-700', icon: '❌' },
  PREPARING: { label: 'Pripravuje sa', color: 'bg-orange-100 text-orange-700', icon: '🍳' },
  READY_FOR_PICKUP: { label: 'Pripravená', color: 'bg-green-100 text-green-700', icon: '✨' },
  COURIER_ASSIGNED: { label: 'Kuriér pridelený', color: 'bg-purple-100 text-purple-700', icon: '🚗' },
  PICKED_UP: { label: 'Vyzdvihnutá', color: 'bg-purple-100 text-purple-700', icon: '📦' },
  OUT_FOR_DELIVERY: { label: 'Na ceste', color: 'bg-dragon-red/10 text-dragon-red', icon: '🛵' },
  DELIVERED: { label: 'Doručená', color: 'bg-green-100 text-green-700', icon: '🏠' },
  COMPLETED: { label: 'Dokončená', color: 'bg-green-100 text-green-700', icon: '🎉' },
  CANCELLED: { label: 'Zrušená', color: 'bg-red-100 text-red-700', icon: '🚫' },
  REFUNDED: { label: 'Vrátená', color: 'bg-gray-100 text-gray-700', icon: '💰' },
}
