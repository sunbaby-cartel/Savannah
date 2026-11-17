import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  MenuItem,
  MenuItemFormData,
  Customer,
  CustomerFormData,
  Order,
  OrderItem,
  Reservation,
  ActivityItem,
  ToastMessage,
  BackendSyncState,
  OrderStatus,
  ReportSummary,
} from '../types';
import {
  SEED_MENU_ITEMS,
  SEED_CUSTOMERS,
  SEED_ORDERS,
  SEED_RESERVATIONS,
  SEED_ACTIVITIES,
  DEFAULT_TAX_RATE,
} from '../services/seedData';
import {
  menuApi,
  customersApi,
  ordersApi,
  reservationsApi,
  activitiesApi,
  testConnection,
  getApiBaseUrl,
  setApiBaseUrl,
} from '../services/api';

const LS_PREFIX = 'savanna_table_';

function loadLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(LS_PREFIX + key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    // ignore
  }
  return fallback;
}

function saveLocal(key: string, value: unknown): void {
  try {
    localStorage.setItem(LS_PREFIX + key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function calcOrderTotals(items: OrderItem[], taxRate = DEFAULT_TAX_RATE) {
  const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;
  return { subtotal, tax, total };
}

interface RestaurantContextValue {
  menuItems: MenuItem[];
  customers: Customer[];
  orders: Order[];
  reservations: Reservation[];
  activities: ActivityItem[];
  syncState: BackendSyncState;
  theme: 'light' | 'dark';
  searchQuery: string;
  toasts: ToastMessage[];
  taxRate: number;
  isLoading: boolean;

  setTheme: (t: 'light' | 'dark') => void;
  setSearchQuery: (q: string) => void;
  addToast: (t: Omit<ToastMessage, 'id'>) => void;
  dismissToast: (id: string) => void;

  // Menu
  addMenuItem: (data: MenuItemFormData) => Promise<void>;
  updateMenuItem: (id: string, data: Partial<MenuItemFormData>) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  toggleMenuAvailability: (id: string) => Promise<void>;

  // Customers
  addCustomer: (data: CustomerFormData) => Promise<void>;
  updateCustomer: (id: string, data: Partial<CustomerFormData>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;

  // Orders
  createOrder: (payload: {
    customerId?: string | null;
    customerName: string;
    orderType: Order['orderType'];
    tableNumber?: string;
    items: { menuItemId: string; quantity: number }[];
    notes?: string;
  }) => Promise<Order | null>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  cancelOrder: (id: string) => Promise<void>;

  // Reservations
  createReservation: (
    data: Omit<Reservation, 'id' | 'createdAt' | 'isLocal'>
  ) => Promise<void>;
  updateReservation: (id: string, data: Partial<Reservation>) => Promise<void>;
  deleteReservation: (id: string) => Promise<void>;

  // Sync & settings
  checkConnection: () => Promise<boolean>;
  synchronizeWithBackend: () => Promise<void>;
  resetLocalData: () => void;
  setApiUrl: (url: string) => void;
  getApiUrl: () => string;
  getReportSummary: () => ReportSummary;
  exportCsv: (kind: 'menu' | 'customers' | 'orders' | 'reservations') => void;
  exportJson: () => void;
}

const RestaurantContext = createContext<RestaurantContextValue | null>(null);

export function RestaurantProvider({ children }: { children: ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() =>
    loadLocal('menu', SEED_MENU_ITEMS)
  );
  const [customers, setCustomers] = useState<Customer[]>(() =>
    loadLocal('customers', SEED_CUSTOMERS)
  );
  const [orders, setOrders] = useState<Order[]>(() =>
    loadLocal('orders', SEED_ORDERS)
  );
  const [reservations, setReservations] = useState<Reservation[]>(() =>
    loadLocal('reservations', SEED_RESERVATIONS)
  );
  const [activities, setActivities] = useState<ActivityItem[]>(() =>
    loadLocal('activities', SEED_ACTIVITIES)
  );
  const [syncState, setSyncState] = useState<BackendSyncState>('checking');
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(LS_PREFIX + 'theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const taxRate = DEFAULT_TAX_RATE;

  const addToast = useCallback((t: Omit<ToastMessage, 'id'>) => {
    const id = uid('toast');
    setToasts((prev) => [...prev, { ...t, id }]);
    const duration = t.duration ?? 4000;
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== id));
      }, duration);
    }
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushActivity = useCallback(
    (type: ActivityItem['type'], message: string, entityId?: string) => {
      const item: ActivityItem = {
        id: uid('ac'),
        type,
        message,
        timestamp: new Date().toISOString(),
        entityId,
      };
      setActivities((prev) => [item, ...prev].slice(0, 50));
    },
    []
  );

  const setTheme = useCallback((t: 'light' | 'dark') => {
    setThemeState(t);
    localStorage.setItem(LS_PREFIX + 'theme', t);
    document.documentElement.classList.toggle('dark', t === 'dark');
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Persist local mode data
  useEffect(() => {
    if (syncState === 'local' || syncState === 'error') {
      saveLocal('menu', menuItems);
      saveLocal('customers', customers);
      saveLocal('orders', orders);
      saveLocal('reservations', reservations);
      saveLocal('activities', activities);
    }
  }, [menuItems, customers, orders, reservations, activities, syncState]);

  const checkConnection = useCallback(async () => {
    setSyncState('checking');
    const ok = await testConnection();
    setSyncState(ok ? 'connected' : 'local');
    return ok;
  }, []);

  const synchronizeWithBackend = useCallback(async () => {
    setIsLoading(true);
    try {
      const ok = await testConnection();
      if (!ok) {
        setSyncState('local');
        addToast({
          type: 'warning',
          title: 'Backend unavailable',
          message: 'Staying in Local Mode with demonstration data.',
        });
        return;
      }
      setSyncState('connected');
      const [menu, cust, ords, resvs, acts] = await Promise.all([
        menuApi.list(),
        customersApi.list(),
        ordersApi.list(),
        reservationsApi.list(),
        activitiesApi.list().catch(() => [] as ActivityItem[]),
      ]);
      setMenuItems(menu);
      setCustomers(cust);
      setOrders(ords);
      setReservations(resvs);
      if (acts.length) setActivities(acts);
      pushActivity('sync', 'Synchronized with backend');
      addToast({
        type: 'success',
        title: 'API Connected',
        message: 'Data loaded from the server.',
      });
    } catch (err) {
      setSyncState('error');
      addToast({
        type: 'error',
        title: 'Sync failed',
        message: err instanceof Error ? err.message : 'Could not reach API',
      });
    } finally {
      setIsLoading(false);
    }
  }, [addToast, pushActivity]);

  useEffect(() => {
    void checkConnection().then((ok) => {
      if (ok) void synchronizeWithBackend();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // —— Menu ops ——
  const addMenuItem = useCallback(
    async (data: MenuItemFormData) => {
      if (syncState === 'connected') {
        try {
          const created = await menuApi.create(data);
          setMenuItems((prev) => [...prev, created]);
          pushActivity('menu_updated', `Menu item "${data.name}" added`);
          addToast({ type: 'success', title: 'Menu item created' });
          return;
        } catch (err) {
          addToast({
            type: 'error',
            title: 'Failed to create menu item',
            message: (err as { message?: string }).message,
          });
          throw err;
        }
      }
      const now = new Date().toISOString();
      const item: MenuItem = {
        id: uid('mi'),
        name: data.name,
        description: data.description,
        category: data.category as MenuItem['category'],
        price: Number(data.price),
        availableQuantity: Number(data.availableQuantity),
        totalQuantity: Number(data.totalQuantity),
        preparationTimeMinutes: Number(data.preparationTimeMinutes),
        dietaryTags: data.dietaryTags,
        imageGradient: data.imageGradient || 'from-amber-500 to-orange-600',
        isAvailable: data.isAvailable,
        createdAt: now,
        updatedAt: now,
        isLocal: true,
      };
      setMenuItems((prev) => [...prev, item]);
      pushActivity('menu_updated', `Menu item "${item.name}" added (local)`);
      addToast({
        type: 'success',
        title: 'Menu item created (Local Mode)',
        message: 'Saved locally only. Not sent to backend.',
      });
    },
    [syncState, addToast, pushActivity]
  );

  const updateMenuItem = useCallback(
    async (id: string, data: Partial<MenuItemFormData>) => {
      if (syncState === 'connected') {
        try {
          const updated = await menuApi.update(id, data);
          setMenuItems((prev) => prev.map((m) => (m.id === id ? updated : m)));
          pushActivity('menu_updated', `Menu item updated`);
          addToast({ type: 'success', title: 'Menu item updated' });
          return;
        } catch (err) {
          addToast({
            type: 'error',
            title: 'Update failed',
            message: (err as { message?: string }).message,
          });
          throw err;
        }
      }
      setMenuItems((prev) =>
        prev.map((m) =>
          m.id === id
            ? {
                ...m,
                ...data,
                price: data.price !== undefined ? Number(data.price) : m.price,
                availableQuantity:
                  data.availableQuantity !== undefined
                    ? Number(data.availableQuantity)
                    : m.availableQuantity,
                totalQuantity:
                  data.totalQuantity !== undefined
                    ? Number(data.totalQuantity)
                    : m.totalQuantity,
                preparationTimeMinutes:
                  data.preparationTimeMinutes !== undefined
                    ? Number(data.preparationTimeMinutes)
                    : m.preparationTimeMinutes,
                category: (data.category || m.category) as MenuItem['category'],
                updatedAt: new Date().toISOString(),
                isLocal: true,
              }
            : m
        )
      );
      pushActivity('menu_updated', `Menu item updated (local)`);
      addToast({ type: 'success', title: 'Menu item updated (Local Mode)' });
    },
    [syncState, addToast, pushActivity]
  );

  const deleteMenuItem = useCallback(
    async (id: string) => {
      if (syncState === 'connected') {
        try {
          await menuApi.remove(id);
          setMenuItems((prev) => prev.filter((m) => m.id !== id));
          addToast({ type: 'success', title: 'Menu item deleted' });
          return;
        } catch (err) {
          addToast({
            type: 'error',
            title: 'Delete failed',
            message: (err as { message?: string }).message,
          });
          throw err;
        }
      }
      setMenuItems((prev) => prev.filter((m) => m.id !== id));
      addToast({ type: 'success', title: 'Menu item deleted (Local Mode)' });
    },
    [syncState, addToast]
  );

  const toggleMenuAvailability = useCallback(
    async (id: string) => {
      const item = menuItems.find((m) => m.id === id);
      if (!item) return;
      await updateMenuItem(id, { isAvailable: !item.isAvailable });
    },
    [menuItems, updateMenuItem]
  );

  // —— Customers ——
  const addCustomer = useCallback(
    async (data: CustomerFormData) => {
      if (syncState === 'connected') {
        try {
          const created = await customersApi.create(data);
          setCustomers((prev) => [...prev, created]);
          pushActivity(
            'customer_registered',
            `Customer "${data.name}" registered`
          );
          addToast({ type: 'success', title: 'Customer registered' });
          return;
        } catch (err) {
          addToast({
            type: 'error',
            title: 'Registration failed',
            message: (err as { message?: string }).message,
          });
          throw err;
        }
      }
      const customer: Customer = {
        id: uid('cu'),
        name: data.name,
        email: data.email,
        phone: data.phone,
        customerNumber: data.customerNumber,
        status: data.status as Customer['status'],
        joinedDate: new Date().toISOString(),
        dietaryPreferences: data.dietaryPreferences,
        notes: data.notes,
        isLocal: true,
      };
      setCustomers((prev) => [...prev, customer]);
      pushActivity(
        'customer_registered',
        `Customer "${customer.name}" registered (local)`
      );
      addToast({
        type: 'success',
        title: 'Customer registered (Local Mode)',
      });
    },
    [syncState, addToast, pushActivity]
  );

  const updateCustomer = useCallback(
    async (id: string, data: Partial<CustomerFormData>) => {
      if (syncState === 'connected') {
        try {
          const updated = await customersApi.update(id, data);
          setCustomers((prev) => prev.map((c) => (c.id === id ? updated : c)));
          addToast({ type: 'success', title: 'Customer updated' });
          return;
        } catch (err) {
          addToast({
            type: 'error',
            title: 'Update failed',
            message: (err as { message?: string }).message,
          });
          throw err;
        }
      }
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                ...data,
                status: (data.status || c.status) as Customer['status'],
                isLocal: true,
              }
            : c
        )
      );
      addToast({ type: 'success', title: 'Customer updated (Local Mode)' });
    },
    [syncState, addToast]
  );

  const deleteCustomer = useCallback(
    async (id: string) => {
      if (syncState === 'connected') {
        try {
          await customersApi.remove(id);
          setCustomers((prev) => prev.filter((c) => c.id !== id));
          addToast({ type: 'success', title: 'Customer deleted' });
          return;
        } catch (err) {
          addToast({
            type: 'error',
            title: 'Delete failed',
            message: (err as { message?: string }).message,
          });
          throw err;
        }
      }
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      addToast({ type: 'success', title: 'Customer deleted (Local Mode)' });
    },
    [syncState, addToast]
  );

  // —— Orders ——
  const createOrder = useCallback(
    async (payload: {
      customerId?: string | null;
      customerName: string;
      orderType: Order['orderType'];
      tableNumber?: string;
      items: { menuItemId: string; quantity: number }[];
      notes?: string;
    }): Promise<Order | null> => {
      // Validate locally first
      if (payload.customerId) {
        const cust = customers.find((c) => c.id === payload.customerId);
        if (cust && cust.status !== 'active') {
          addToast({
            type: 'error',
            title: 'Customer not active',
            message: 'Only active customers may place account-linked orders.',
          });
          return null;
        }
      }

      const orderItems: OrderItem[] = [];
      for (const line of payload.items) {
        const mi = menuItems.find((m) => m.id === line.menuItemId);
        if (!mi || !mi.isAvailable) {
          addToast({
            type: 'error',
            title: 'Unavailable item',
            message: `${mi?.name ?? 'Item'} is not available.`,
          });
          return null;
        }
        if (line.quantity > mi.availableQuantity) {
          addToast({
            type: 'error',
            title: 'Insufficient stock',
            message: `Only ${mi.availableQuantity} of ${mi.name} available.`,
          });
          return null;
        }
        orderItems.push({
          menuItemId: mi.id,
          menuItemName: mi.name,
          quantity: line.quantity,
          unitPrice: mi.price,
          lineTotal: Math.round(mi.price * line.quantity * 100) / 100,
        });
      }

      if (syncState === 'connected') {
        try {
          const created = await ordersApi.create({
            customerId: payload.customerId,
            customerName: payload.customerName,
            orderType: payload.orderType,
            tableNumber: payload.tableNumber,
            items: payload.items,
            notes: payload.notes,
          });
          setOrders((prev) => [created, ...prev]);
          // Refresh menu to reflect quantity changes from backend
          try {
            const menu = await menuApi.list();
            setMenuItems(menu);
          } catch {
            // ignore
          }
          pushActivity(
            'order_created',
            `Order ${created.orderNumber} created`
          );
          addToast({ type: 'success', title: 'Order created' });
          return created;
        } catch (err) {
          addToast({
            type: 'error',
            title: 'Order failed',
            message: (err as { message?: string }).message,
          });
          return null;
        }
      }

      // Local mode: decrement stock
      setMenuItems((prev) =>
        prev.map((m) => {
          const line = payload.items.find((i) => i.menuItemId === m.id);
          if (!line) return m;
          const nextQty = Math.max(0, m.availableQuantity - line.quantity);
          return {
            ...m,
            availableQuantity: nextQty,
            isAvailable: nextQty > 0 ? m.isAvailable : false,
            updatedAt: new Date().toISOString(),
          };
        })
      );

      const totals = calcOrderTotals(orderItems, taxRate);
      const order: Order = {
        id: uid('or'),
        customerId: payload.customerId ?? null,
        customerName: payload.customerName,
        orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
        orderType: payload.orderType,
        tableNumber: payload.tableNumber,
        items: orderItems,
        ...totals,
        status: 'pending',
        notes: payload.notes || '',
        createdAt: new Date().toISOString(),
        isLocal: true,
      };
      setOrders((prev) => [order, ...prev]);
      pushActivity(
        'order_created',
        `Order ${order.orderNumber} created (local)`
      );
      addToast({
        type: 'success',
        title: 'Order created (Local Mode)',
        message: 'Stock reduced locally.',
      });
      return order;
    },
    [syncState, menuItems, customers, taxRate, addToast, pushActivity]
  );

  const updateOrderStatus = useCallback(
    async (id: string, status: OrderStatus) => {
      const order = orders.find((o) => o.id === id);
      if (!order) return;
      if (order.status === 'completed' || order.status === 'cancelled') {
        addToast({
          type: 'error',
          title: 'Order locked',
          message: 'Completed or cancelled orders cannot be changed.',
        });
        return;
      }

      if (syncState === 'connected') {
        try {
          const updated = await ordersApi.updateStatus(id, status);
          setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
          pushActivity(
            'order_status',
            `Order ${order.orderNumber} → ${status}`
          );
          addToast({ type: 'success', title: `Order marked ${status}` });
          return;
        } catch (err) {
          addToast({
            type: 'error',
            title: 'Status update failed',
            message: (err as { message?: string }).message,
          });
          return;
        }
      }

      setOrders((prev) =>
        prev.map((o) =>
          o.id === id
            ? {
                ...o,
                status,
                completedAt:
                  status === 'completed'
                    ? new Date().toISOString()
                    : o.completedAt,
                isLocal: true,
              }
            : o
        )
      );
      pushActivity(
        'order_status',
        `Order ${order.orderNumber} → ${status} (local)`
      );
      addToast({ type: 'success', title: `Order marked ${status} (Local Mode)` });
    },
    [syncState, orders, addToast, pushActivity]
  );

  const cancelOrder = useCallback(
    async (id: string) => {
      const order = orders.find((o) => o.id === id);
      if (!order) return;
      if (order.status === 'completed' || order.status === 'cancelled') {
        addToast({
          type: 'error',
          title: 'Cannot cancel',
          message: 'Order is already completed or cancelled.',
        });
        return;
      }

      if (syncState === 'connected') {
        try {
          const updated = await ordersApi.cancel(id);
          setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
          try {
            const menu = await menuApi.list();
            setMenuItems(menu);
          } catch {
            // ignore
          }
          pushActivity(
            'order_cancelled',
            `Order ${order.orderNumber} cancelled`
          );
          addToast({ type: 'success', title: 'Order cancelled' });
          return;
        } catch (err) {
          addToast({
            type: 'error',
            title: 'Cancel failed',
            message: (err as { message?: string }).message,
          });
          return;
        }
      }

      // Restore quantities once
      setMenuItems((prev) =>
        prev.map((m) => {
          const line = order.items.find((i) => i.menuItemId === m.id);
          if (!line) return m;
          return {
            ...m,
            availableQuantity: m.availableQuantity + line.quantity,
            isAvailable: true,
            updatedAt: new Date().toISOString(),
          };
        })
      );
      setOrders((prev) =>
        prev.map((o) =>
          o.id === id
            ? { ...o, status: 'cancelled' as const, isLocal: true }
            : o
        )
      );
      pushActivity(
        'order_cancelled',
        `Order ${order.orderNumber} cancelled (local) – stock restored`
      );
      addToast({
        type: 'success',
        title: 'Order cancelled (Local Mode)',
        message: 'Quantities restored.',
      });
    },
    [syncState, orders, addToast, pushActivity]
  );

  // —— Reservations ——
  const createReservation = useCallback(
    async (data: Omit<Reservation, 'id' | 'createdAt' | 'isLocal'>) => {
      if (syncState === 'connected') {
        try {
          const created = await reservationsApi.create(data);
          setReservations((prev) => [...prev, created]);
          pushActivity(
            'reservation_created',
            `Reservation for ${data.customerName}`
          );
          addToast({ type: 'success', title: 'Reservation created' });
          return;
        } catch (err) {
          addToast({
            type: 'error',
            title: 'Failed',
            message: (err as { message?: string }).message,
          });
          throw err;
        }
      }
      const res: Reservation = {
        ...data,
        id: uid('rv'),
        createdAt: new Date().toISOString(),
        isLocal: true,
      };
      setReservations((prev) => [...prev, res]);
      pushActivity(
        'reservation_created',
        `Reservation for ${data.customerName} (local)`
      );
      addToast({
        type: 'success',
        title: 'Reservation created (Local Mode)',
      });
    },
    [syncState, addToast, pushActivity]
  );

  const updateReservation = useCallback(
    async (id: string, data: Partial<Reservation>) => {
      if (syncState === 'connected') {
        try {
          const updated = await reservationsApi.update(id, data);
          setReservations((prev) =>
            prev.map((r) => (r.id === id ? updated : r))
          );
          pushActivity('reservation_updated', 'Reservation updated');
          addToast({ type: 'success', title: 'Reservation updated' });
          return;
        } catch (err) {
          addToast({
            type: 'error',
            title: 'Update failed',
            message: (err as { message?: string }).message,
          });
          throw err;
        }
      }
      setReservations((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, ...data, isLocal: true } : r
        )
      );
      pushActivity('reservation_updated', 'Reservation updated (local)');
      addToast({
        type: 'success',
        title: 'Reservation updated (Local Mode)',
      });
    },
    [syncState, addToast, pushActivity]
  );

  const deleteReservation = useCallback(
    async (id: string) => {
      if (syncState === 'connected') {
        try {
          await reservationsApi.remove(id);
          setReservations((prev) => prev.filter((r) => r.id !== id));
          addToast({ type: 'success', title: 'Reservation deleted' });
          return;
        } catch (err) {
          addToast({
            type: 'error',
            title: 'Delete failed',
            message: (err as { message?: string }).message,
          });
          throw err;
        }
      }
      setReservations((prev) => prev.filter((r) => r.id !== id));
      addToast({
        type: 'success',
        title: 'Reservation deleted (Local Mode)',
      });
    },
    [syncState, addToast]
  );

  const resetLocalData = useCallback(() => {
    setMenuItems(SEED_MENU_ITEMS);
    setCustomers(SEED_CUSTOMERS);
    setOrders(SEED_ORDERS);
    setReservations(SEED_RESERVATIONS);
    setActivities(SEED_ACTIVITIES);
    saveLocal('menu', SEED_MENU_ITEMS);
    saveLocal('customers', SEED_CUSTOMERS);
    saveLocal('orders', SEED_ORDERS);
    saveLocal('reservations', SEED_RESERVATIONS);
    saveLocal('activities', SEED_ACTIVITIES);
    addToast({ type: 'info', title: 'Demonstration data reset' });
  }, [addToast]);

  const setApiUrl = useCallback((url: string) => {
    setApiBaseUrl(url);
  }, []);

  const getReportSummary = useCallback((): ReportSummary => {
    const completed = orders.filter((o) => o.status === 'completed');
    const totalRevenue = completed.reduce((s, o) => s + o.total, 0);
    const averageOrderValue =
      completed.length > 0 ? totalRevenue / completed.length : 0;

    const ordersByStatus = {
      pending: 0,
      preparing: 0,
      ready: 0,
      completed: 0,
      cancelled: 0,
    } as Record<OrderStatus, number>;
    orders.forEach((o) => {
      ordersByStatus[o.status] = (ordersByStatus[o.status] || 0) + 1;
    });

    const dishMap = new Map<string, { count: number; revenue: number }>();
    orders.forEach((o) => {
      if (o.status === 'cancelled') return;
      o.items.forEach((i) => {
        const cur = dishMap.get(i.menuItemName) || { count: 0, revenue: 0 };
        cur.count += i.quantity;
        cur.revenue += i.lineTotal;
        dishMap.set(i.menuItemName, cur);
      });
    });
    const mostOrderedDishes = [...dishMap.entries()]
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const custMap = new Map<
      string,
      { name: string; orderCount: number; totalSpent: number }
    >();
    orders.forEach((o) => {
      if (!o.customerId || o.status === 'cancelled') return;
      const cur = custMap.get(o.customerId) || {
        name: o.customerName,
        orderCount: 0,
        totalSpent: 0,
      };
      cur.orderCount += 1;
      cur.totalSpent += o.total;
      custMap.set(o.customerId, cur);
    });
    const mostActiveCustomers = [...custMap.values()]
      .sort((a, b) => b.orderCount - a.orderCount)
      .slice(0, 8);

    const catMap = new Map<string, { count: number; revenue: number }>();
    menuItems.forEach((m) => {
      const sold = orders
        .filter((o) => o.status !== 'cancelled')
        .flatMap((o) => o.items)
        .filter((i) => i.menuItemId === m.id)
        .reduce(
          (s, i) => ({
            count: s.count + i.quantity,
            revenue: s.revenue + i.lineTotal,
          }),
          { count: 0, revenue: 0 }
        );
      const cur = catMap.get(m.category) || { count: 0, revenue: 0 };
      cur.count += sold.count;
      cur.revenue += sold.revenue;
      catMap.set(m.category, cur);
    });
    const categoryDistribution = [...catMap.entries()].map(
      ([category, v]) => ({ category, ...v })
    );

    const cancelled = orders.filter((o) => o.status === 'cancelled').length;
    const cancellationRate =
      orders.length > 0 ? (cancelled / orders.length) * 100 : 0;

    const dayMap = new Map<string, { count: number; revenue: number }>();
    orders.forEach((o) => {
      const day = o.createdAt.slice(0, 10);
      const cur = dayMap.get(day) || { count: 0, revenue: 0 };
      cur.count += 1;
      if (o.status === 'completed') cur.revenue += o.total;
      dayMap.set(day, cur);
    });
    const dailyOrderTotals = [...dayMap.entries()]
      .map(([date, v]) => ({ date, ...v }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const lowStockItems = menuItems.filter(
      (m) => m.availableQuantity <= 5 && m.isAvailable
    );

    return {
      totalRevenue,
      averageOrderValue,
      ordersByStatus,
      mostOrderedDishes,
      mostActiveCustomers,
      categoryDistribution,
      cancellationRate,
      dailyOrderTotals,
      lowStockItems,
    };
  }, [orders, menuItems]);

  const exportCsv = useCallback(
    (kind: 'menu' | 'customers' | 'orders' | 'reservations') => {
      let rows: string[][] = [];
      let filename = 'export.csv';
      if (kind === 'menu') {
        filename = 'menu-items.csv';
        rows = [
          [
            'id',
            'name',
            'category',
            'price',
            'availableQuantity',
            'totalQuantity',
            'isAvailable',
          ],
          ...menuItems.map((m) => [
            m.id,
            m.name,
            m.category,
            String(m.price),
            String(m.availableQuantity),
            String(m.totalQuantity),
            String(m.isAvailable),
          ]),
        ];
      } else if (kind === 'customers') {
        filename = 'customers.csv';
        rows = [
          ['id', 'name', 'email', 'phone', 'customerNumber', 'status'],
          ...customers.map((c) => [
            c.id,
            c.name,
            c.email,
            c.phone,
            c.customerNumber,
            c.status,
          ]),
        ];
      } else if (kind === 'orders') {
        filename = 'orders.csv';
        rows = [
          [
            'id',
            'orderNumber',
            'customerName',
            'orderType',
            'status',
            'total',
            'createdAt',
          ],
          ...orders.map((o) => [
            o.id,
            o.orderNumber,
            o.customerName,
            o.orderType,
            o.status,
            String(o.total),
            o.createdAt,
          ]),
        ];
      } else {
        filename = 'reservations.csv';
        rows = [
          [
            'id',
            'customerName',
            'reservationDate',
            'reservationTime',
            'guestCount',
            'status',
          ],
          ...reservations.map((r) => [
            r.id,
            r.customerName,
            r.reservationDate,
            r.reservationTime,
            String(r.guestCount),
            r.status,
          ]),
        ];
      }
      const csv = rows
        .map((r) =>
          r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
        )
        .join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      addToast({ type: 'success', title: `Exported ${filename}` });
    },
    [menuItems, customers, orders, reservations, addToast]
  );

  const exportJson = useCallback(() => {
    const data = {
      menuItems,
      customers,
      orders,
      reservations,
      activities,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'savanna-table-export.json';
    a.click();
    URL.revokeObjectURL(url);
    addToast({ type: 'success', title: 'JSON export downloaded' });
  }, [menuItems, customers, orders, reservations, activities, addToast]);

  const value = useMemo<RestaurantContextValue>(
    () => ({
      menuItems,
      customers,
      orders,
      reservations,
      activities,
      syncState,
      theme,
      searchQuery,
      toasts,
      taxRate,
      isLoading,
      setTheme,
      setSearchQuery,
      addToast,
      dismissToast,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      toggleMenuAvailability,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      createOrder,
      updateOrderStatus,
      cancelOrder,
      createReservation,
      updateReservation,
      deleteReservation,
      checkConnection,
      synchronizeWithBackend,
      resetLocalData,
      setApiUrl,
      getApiUrl: getApiBaseUrl,
      getReportSummary,
      exportCsv,
      exportJson,
    }),
    [
      menuItems,
      customers,
      orders,
      reservations,
      activities,
      syncState,
      theme,
      searchQuery,
      toasts,
      taxRate,
      isLoading,
      setTheme,
      addToast,
      dismissToast,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      toggleMenuAvailability,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      createOrder,
      updateOrderStatus,
      cancelOrder,
      createReservation,
      updateReservation,
      deleteReservation,
      checkConnection,
      synchronizeWithBackend,
      resetLocalData,
      setApiUrl,
      getReportSummary,
      exportCsv,
      exportJson,
    ]
  );

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const ctx = useContext(RestaurantContext);
  if (!ctx) {
    throw new Error('useRestaurant must be used within RestaurantProvider');
  }
  return ctx;
}
