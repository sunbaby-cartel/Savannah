import type { ElementType } from 'react';
import { Link } from 'react-router-dom';
import {
  UtensilsCrossed,
  ClipboardList,
  Users,
  CalendarDays,
  DollarSign,
  AlertTriangle,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

function StatCard({
  label,
  value,
  icon: Icon,
  accent = 'amber',
}: {
  label: string;
  value: string | number;
  icon: ElementType;
  accent?: 'amber' | 'forest' | 'terracotta' | 'sky';
}) {
  const accents = {
    amber: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    forest: 'bg-forest-50 text-forest-700 dark:bg-forest-900/30 dark:text-forest-300',
    terracotta:
      'bg-terracotta-50 text-terracotta-700 dark:bg-terracotta-900/30 dark:text-terracotta-300',
    sky: 'bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
  };
  return (
    <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-stone-500 dark:text-stone-400">{label}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
        </div>
        <div className={`p-2 rounded-lg ${accents[accent]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export function DashboardView() {
  const {
    menuItems,
    orders,
    customers,
    reservations,
    activities,
    getReportSummary,
  } = useRestaurant();

  const today = new Date().toISOString().slice(0, 10);
  const available = menuItems.filter((m) => m.isAvailable).length;
  const activeOrders = orders.filter((o) =>
    ['pending', 'preparing', 'ready'].includes(o.status)
  ).length;
  const pending = orders.filter((o) => o.status === 'pending').length;
  const completedToday = orders.filter(
    (o) => o.status === 'completed' && o.createdAt.startsWith(today)
  ).length;
  const resToday = reservations.filter((r) => r.reservationDate === today).length;
  const summary = getReportSummary();
  const revenueToday = orders
    .filter((o) => o.status === 'completed' && o.createdAt.startsWith(today))
    .reduce((s, o) => s + o.total, 0);

  const lowStock = menuItems.filter(
    (m) => m.availableQuantity <= 5 && m.isAvailable
  );
  const recentOrders = [...orders]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);
  const currentRes = reservations.filter(
    (r) =>
      r.reservationDate === today &&
      ['confirmed', 'seated'].includes(r.status)
  );

  const categoryCounts = menuItems.reduce(
    (acc, m) => {
      acc[m.category] = (acc[m.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-stone-500 dark:text-stone-400 mt-1">
          Restaurant command centre
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="Total menu items"
          value={menuItems.length}
          icon={UtensilsCrossed}
          accent="amber"
        />
        <StatCard
          label="Available items"
          value={available}
          icon={UtensilsCrossed}
          accent="forest"
        />
        <StatCard
          label="Active orders"
          value={activeOrders}
          icon={ClipboardList}
          accent="terracotta"
        />
        <StatCard
          label="Pending orders"
          value={pending}
          icon={ClipboardList}
          accent="sky"
        />
        <StatCard
          label="Completed today"
          value={completedToday}
          icon={ClipboardList}
          accent="forest"
        />
        <StatCard
          label="Customers"
          value={customers.length}
          icon={Users}
          accent="amber"
        />
        <StatCard
          label="Reservations today"
          value={resToday}
          icon={CalendarDays}
          accent="terracotta"
        />
        <StatCard
          label="Revenue today"
          value={`$${revenueToday.toFixed(2)}`}
          icon={DollarSign}
          accent="forest"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Quick actions */}
        <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4">
          <h2 className="font-semibold mb-3">Quick actions</h2>
          <div className="space-y-2">
            <Link
              to="/orders?new=1"
              className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-900 dark:text-amber-100 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-sm font-medium"
            >
              <span className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> New order
              </span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/menu?new=1"
              className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-sm font-medium"
            >
              <span className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> Add menu item
              </span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/reservations?new=1"
              className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-sm font-medium"
            >
              <span className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> New reservation
              </span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/customers?new=1"
              className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-sm font-medium"
            >
              <span className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> Register customer
              </span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Low stock */}
        <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <h2 className="font-semibold">Low-stock alerts</h2>
          </div>
          {lowStock.length === 0 ? (
            <p className="text-sm text-stone-500">No low-stock items.</p>
          ) : (
            <ul className="space-y-2">
              {lowStock.slice(0, 6).map((m) => (
                <li
                  key={m.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="truncate">{m.name}</span>
                  <span className="font-medium text-amber-700 dark:text-amber-400">
                    {m.availableQuantity} left
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Popular categories */}
        <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4">
          <h2 className="font-semibold mb-3">Menu categories</h2>
          <ul className="space-y-2">
            {topCategories.map(([cat, count]) => (
              <li key={cat} className="flex items-center justify-between text-sm">
                <span>{cat}</span>
                <span className="text-stone-500">{count} items</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Recent orders */}
        <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Recent orders</h2>
            <Link
              to="/orders"
              className="text-sm text-amber-700 dark:text-amber-400 hover:underline"
            >
              View all
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-stone-500">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-stone-500 border-b border-stone-100 dark:border-stone-800">
                    <th className="pb-2 font-medium">Order</th>
                    <th className="pb-2 font-medium">Customer</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o) => (
                    <tr
                      key={o.id}
                      className="border-b border-stone-50 dark:border-stone-800/50"
                    >
                      <td className="py-2 font-medium">{o.orderNumber}</td>
                      <td className="py-2">{o.customerName}</td>
                      <td className="py-2">
                        <StatusBadge status={o.status} />
                      </td>
                      <td className="py-2 text-right">${o.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Current reservations */}
        <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Today&apos;s reservations</h2>
            <Link
              to="/reservations"
              className="text-sm text-amber-700 dark:text-amber-400 hover:underline"
            >
              View all
            </Link>
          </div>
          {currentRes.length === 0 ? (
            <p className="text-sm text-stone-500">No reservations for today.</p>
          ) : (
            <ul className="space-y-3">
              {currentRes.map((r) => (
                <li key={r.id} className="flex items-start justify-between text-sm">
                  <div>
                    <p className="font-medium">{r.customerName}</p>
                    <p className="text-stone-500">
                      {r.reservationTime} · {r.guestCount} guests · {r.tableNumber}
                    </p>
                  </div>
                  <StatusBadge status={r.status} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Activity stream */}
      <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4">
        <h2 className="font-semibold mb-3">Recent activity</h2>
        {activities.length === 0 ? (
          <p className="text-sm text-stone-500">No activity yet.</p>
        ) : (
          <ul className="space-y-3">
            {activities.slice(0, 8).map((a) => (
              <li key={a.id} className="flex gap-3 text-sm">
                <span className="text-stone-400 dark:text-stone-500 shrink-0 w-36">
                  {new Date(a.timestamp).toLocaleString()}
                </span>
                <span>{a.message}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="text-xs text-stone-400">
        Avg order value (completed): ${summary.averageOrderValue.toFixed(2)} ·
        Cancellation rate: {summary.cancellationRate.toFixed(1)}%
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
    preparing: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200',
    ready: 'bg-forest-100 text-forest-800 dark:bg-forest-900/40 dark:text-forest-200',
    completed: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200',
    confirmed: 'bg-forest-100 text-forest-800 dark:bg-forest-900/40 dark:text-forest-200',
    seated: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200',
    'no-show': 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200',
  };
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize ${map[status] || 'bg-stone-100'}`}
    >
      {status}
    </span>
  );
}
