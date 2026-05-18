export interface MenuAddon {
  id: string
  name: string
  nameSk: string
  price: number
  isAvailable: boolean
  isModifier: boolean
  modifierGroup: string | null
}

export interface MenuCategory {
  id: string
  name: string
  nameSk: string
  slug: string
  description: string
  image: string
  sortOrder: number
  isActive: boolean
  items?: MenuItem[]
}

export interface MenuItem {
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
  weight: string | null
  isAlcohol: boolean
  isDailyMenu: boolean
  isWeeklySpecial: boolean
  isDailyDeal: boolean
  addons: MenuAddon[]
}

export interface MenuResponse {
  categories: MenuCategory[]
  items: MenuItem[]
}

export interface OpeningHour {
  day: string
  hours: string
  isClosed?: boolean
}

export const allergenMap: Record<string, string> = {
  '1': 'Obilniny (gluten)',
  '2': 'Korovce',
  '3': 'Vajcia',
  '4': 'Ryby',
  '5': 'Arasidy',
  '6': 'Sojove boby',
  '7': 'Mlieko',
  '8': 'Orechy',
  '9': 'Zeler',
  '10': 'Horcica',
  '11': 'Sezam',
  '12': 'Oxid siricity',
  '13': 'Vlci bob',
  '14': 'Makkyse',
}
