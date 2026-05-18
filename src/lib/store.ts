import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ===== NAVIGATION STORE =====
export type Page = 
  | 'home' 
  | 'menu' 
  | 'checkout' 
  | 'order-tracking' 
  | 'admin' 
  | 'kitchen' 
  | 'courier'
  | 'about'
  | 'contact'

interface NavigationState {
  currentPage: Page
  navigate: (page: Page) => void
  orderId: string | null
  setOrderId: (id: string | null) => void
}

export const useNavigation = create<NavigationState>((set) => ({
  currentPage: 'home',
  navigate: (page) => {
    set({ currentPage: page })
    window.location.hash = page
  },
  orderId: null,
  setOrderId: (id) => set({ orderId: id }),
}))

// ===== CART STORE =====
export interface CartItem {
  id: string
  menuItemId: string
  name: string
  nameSk: string
  price: number
  quantity: number
  image: string
  addons: { id: string; name: string; nameSk: string; price: number }[]
  notes: string
  isSpicy?: boolean
  isVegetarian?: boolean
}

interface CartState {
  items: CartItem[]
  deliveryType: 'DELIVERY' | 'PICKUP'
  promoCode: string | null
  promoDiscount: number
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  setDeliveryType: (type: 'DELIVERY' | 'PICKUP') => void
  applyPromo: (code: string, discount: number) => void
  clearPromo: () => void
  clearCart: () => void
  getSubtotal: () => number
  getDeliveryFee: () => number
  getTotal: () => number
  getItemCount: () => number
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      deliveryType: 'DELIVERY',
      promoCode: null,
      promoDiscount: 0,

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.menuItemId === item.menuItemId && 
            JSON.stringify(i.addons) === JSON.stringify(item.addons)
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === existing.id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            }
          }
          return { items: [...state.items, item] }
        })
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }))
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        }))
      },

      setDeliveryType: (type) => set({ deliveryType: type }),

      applyPromo: (code, discount) => set({ promoCode: code, promoDiscount: discount }),
      clearPromo: () => set({ promoCode: null, promoDiscount: 0 }),
      clearCart: () => set({ items: [], promoCode: null, promoDiscount: 0 }),

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + (item.price + item.addons.reduce((a, ad) => a + ad.price, 0)) * item.quantity,
          0
        )
      },

      getDeliveryFee: () => {
        const state = get()
        if (state.deliveryType === 'PICKUP') return 0
        const subtotal = state.getSubtotal()
        if (subtotal >= 30) return 0 // Free delivery over 30€
        return 2.50
      },

      getTotal: () => {
        const state = get()
        const subtotal = state.getSubtotal()
        const delivery = state.getDeliveryFee()
        const discount = state.promoDiscount
        return Math.max(0, subtotal + delivery - discount)
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },
    }),
    {
      name: 'dragon-cart',
    }
  )
)

// ===== ORDER STORE =====
interface OrderState {
  currentOrder: {
    id: string
    orderNumber: string
    status: string
    estimatedDeliveryTime: string | null
    items: { name: string; nameSk: string; quantity: number; price: number }[]
    deliveryType: 'DELIVERY' | 'PICKUP'
    total: number
  } | null
  setCurrentOrder: (order: OrderState['currentOrder']) => void
  clearCurrentOrder: () => void
}

export const useOrder = create<OrderState>((set) => ({
  currentOrder: null,
  setCurrentOrder: (order) => set({ currentOrder: order }),
  clearCurrentOrder: () => set({ currentOrder: null }),
}))

// ===== ADMIN STORE =====
export type AdminTab = 'orders' | 'menu' | 'couriers' | 'settings' | 'stats'
export type KitchenTab = 'active' | 'completed'
export type CourierTab = 'available' | 'active' | 'completed'

interface AdminState {
  adminTab: AdminTab
  setAdminTab: (tab: AdminTab) => void
  kitchenTab: KitchenTab
  setKitchenTab: (tab: KitchenTab) => void
  courierTab: CourierTab
  setCourierTab: (tab: CourierTab) => void
}

export const useAdmin = create<AdminState>((set) => ({
  adminTab: 'orders',
  setAdminTab: (tab) => set({ adminTab: tab }),
  kitchenTab: 'active',
  setKitchenTab: (tab) => set({ kitchenTab: tab }),
  courierTab: 'active',
  setCourierTab: (tab) => set({ courierTab: tab }),
}))
