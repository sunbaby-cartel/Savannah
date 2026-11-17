export type DietaryTag =
  | 'Vegetarian'
  | 'Vegan'
  | 'Gluten-Free'
  | 'Halal'
  | 'Spicy'
  | 'Contains Nuts'
  | 'Dairy-Free';

export type MenuCategory =
  | 'Breakfast'
  | 'Main Course'
  | 'Grills'
  | 'Vegetarian'
  | 'Desserts'
  | 'Hot Drinks'
  | 'Cold Drinks';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: MenuCategory;
  price: number;
  availableQuantity: number;
  totalQuantity: number;
  preparationTimeMinutes: number;
  dietaryTags: DietaryTag[];
  imageGradient: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  isLocal?: boolean;
}

export interface MenuItemFormData {
  name: string;
  description: string;
  category: MenuCategory | '';
  price: number | '';
  availableQuantity: number | '';
  totalQuantity: number | '';
  preparationTimeMinutes: number | '';
  dietaryTags: DietaryTag[];
  isAvailable: boolean;
  imageGradient?: string;
}

export type CustomerStatus = 'active' | 'suspended' | 'inactive';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  customerNumber: string;
  status: CustomerStatus;
  joinedDate: string;
  dietaryPreferences: string[];
  notes: string;
  isLocal?: boolean;
}

export interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  customerNumber: string;
  status: CustomerStatus | '';
  dietaryPreferences: string[];
  notes: string;
}

export type OrderType = 'dine-in' | 'takeaway' | 'delivery';
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export interface OrderItem {
  menuItemId: string;
  menuItemName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  customerId: string | null;
  customerName: string;
  orderNumber: string;
  orderType: OrderType;
  tableNumber?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  notes: string;
  createdAt: string;
  completedAt?: string;
  isLocal?: boolean;
}

export type ReservationStatus =
  | 'confirmed'
  | 'seated'
  | 'completed'
  | 'cancelled'
  | 'no-show';

export interface Reservation {
  id: string;
  customerId: string | null;
  customerName: string;
  reservationDate: string;
  reservationTime: string;
  guestCount: number;
  tableNumber: string;
  status: ReservationStatus;
  specialRequests: string;
  createdAt: string;
  isLocal?: boolean;
}

export type ActivityType =
  | 'order_created'
  | 'order_status'
  | 'order_cancelled'
  | 'menu_updated'
  | 'customer_registered'
  | 'reservation_created'
  | 'reservation_updated'
  | 'low_stock'
  | 'sync';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  message: string;
  timestamp: string;
  entityId?: string;
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

export type BackendSyncState = 'connected' | 'local' | 'checking' | 'error';

export interface ReportSummary {
  totalRevenue: number;
  averageOrderValue: number;
  ordersByStatus: Record<OrderStatus, number>;
  mostOrderedDishes: { name: string; count: number; revenue: number }[];
  mostActiveCustomers: { name: string; orderCount: number; totalSpent: number }[];
  categoryDistribution: { category: string; count: number; revenue: number }[];
  cancellationRate: number;
  dailyOrderTotals: { date: string; count: number; revenue: number }[];
  lowStockItems: MenuItem[];
}

export interface ApiError {
  message: string;
  statusCode?: number;
  details?: unknown;
}
