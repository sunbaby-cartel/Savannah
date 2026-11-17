import type {
  MenuItem,
  MenuItemFormData,
  Customer,
  CustomerFormData,
  Order,
  Reservation,
  ActivityItem,
  ReportSummary,
  ApiError,
} from '../types';
import { DEFAULT_API_BASE } from './seedData';

const STORAGE_KEY = 'savanna_table_api_base';

let baseUrl = localStorage.getItem(STORAGE_KEY) || DEFAULT_API_BASE;
let authToken: string | null = null;

export function getApiBaseUrl(): string {
  return baseUrl;
}

export function setApiBaseUrl(url: string): void {
  baseUrl = url.replace(/\/$/, '');
  localStorage.setItem(STORAGE_KEY, baseUrl);
}

export function setAuthToken(token: string | null): void {
  authToken = token;
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const url = `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (err) {
    const error: ApiError = {
      message: err instanceof Error ? err.message : 'Network request failed',
      statusCode: 0,
    };
    throw error;
  }

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    let details: unknown;
    try {
      const body = await response.json();
      if (body && typeof body === 'object') {
        if ('message' in body && typeof (body as { message: unknown }).message === 'string') {
          message = (body as { message: string }).message;
        } else if (Array.isArray((body as { message?: unknown }).message)) {
          message = ((body as { message: string[] }).message).join(', ');
        }
        details = body;
      }
    } catch {
      // ignore parse errors
    }
    const error: ApiError = {
      message,
      statusCode: response.status,
      details,
    };
    throw error;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function testConnection(): Promise<boolean> {
  try {
    await request('/menu-items', { method: 'GET' });
    return true;
  } catch {
    try {
      // fallback: some backends expose a health endpoint
      const res = await fetch(`${baseUrl.replace(/\/api\/v1$/, '')}/health`, {
        method: 'GET',
      });
      return res.ok;
    } catch {
      return false;
    }
  }
}

// —— Menu Items ——
export const menuApi = {
  list: () => request<MenuItem[]>('/menu-items'),
  get: (id: string) => request<MenuItem>(`/menu-items/${id}`),
  create: (data: MenuItemFormData) =>
    request<MenuItem>('/menu-items', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<MenuItemFormData>) =>
    request<MenuItem>(`/menu-items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  remove: (id: string) =>
    request<void>(`/menu-items/${id}`, { method: 'DELETE' }),
};

// —— Customers ——
export const customersApi = {
  list: () => request<Customer[]>('/customers'),
  get: (id: string) => request<Customer>(`/customers/${id}`),
  create: (data: CustomerFormData) =>
    request<Customer>('/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<CustomerFormData>) =>
    request<Customer>(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  remove: (id: string) =>
    request<void>(`/customers/${id}`, { method: 'DELETE' }),
};

// —— Orders ——
export const ordersApi = {
  list: () => request<Order[]>('/orders'),
  get: (id: string) => request<Order>(`/orders/${id}`),
  create: (data: {
    customerId?: string | null;
    customerName: string;
    orderType: string;
    tableNumber?: string;
    items: { menuItemId: string; quantity: number }[];
    notes?: string;
  }) =>
    request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateStatus: (id: string, status: string) =>
    request<Order>(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
  cancel: (id: string) =>
    request<Order>(`/orders/${id}/cancel`, {
      method: 'PUT',
    }),
};

// —— Reservations ——
export const reservationsApi = {
  list: () => request<Reservation[]>('/reservations'),
  get: (id: string) => request<Reservation>(`/reservations/${id}`),
  create: (data: Omit<Reservation, 'id' | 'createdAt' | 'isLocal'>) =>
    request<Reservation>('/reservations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Reservation>) =>
    request<Reservation>(`/reservations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  remove: (id: string) =>
    request<void>(`/reservations/${id}`, { method: 'DELETE' }),
};

// —— Activities & Reports ——
export const activitiesApi = {
  list: () => request<ActivityItem[]>('/activities'),
};

export const reportsApi = {
  summary: () => request<ReportSummary>('/reports/summary'),
  popularItems: () =>
    request<{ name: string; count: number; revenue: number }[]>(
      '/reports/popular-items'
    ),
  revenue: () =>
    request<{ date: string; count: number; revenue: number }[]>(
      '/reports/revenue'
    ),
};

/**
 * Expected NestJS REST API contract (for the future backend):
 *
 * Base: /api/v1
 *
 * Menu Items
 *   GET    /menu-items
 *   POST   /menu-items
 *   PUT    /menu-items/:id
 *   DELETE /menu-items/:id
 *
 * Customers
 *   GET    /customers
 *   POST   /customers
 *   PUT    /customers/:id
 *   DELETE /customers/:id
 *
 * Orders
 *   GET    /orders
 *   POST   /orders
 *   PUT    /orders/:id/status   body: { status }
 *   PUT    /orders/:id/cancel
 *
 * Reservations
 *   GET    /reservations
 *   POST   /reservations
 *   PUT    /reservations/:id
 *   DELETE /reservations/:id
 *
 * Other
 *   GET    /activities
 *   GET    /reports/summary
 *   GET    /reports/popular-items
 *   GET    /reports/revenue
 *
 * Auth (future): Authorization: Bearer <jwt>
 * All responses JSON. Error body should include { message: string }.
 */
