import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus,
  X,
  ChevronRight,
  Ban,
  CheckCircle2,
  ChefHat,
  PackageCheck,
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import type { Order, OrderStatus, OrderType } from '../types';
import { ConfirmDialog } from './Modals/ConfirmDialog';

const STATUS_FLOW: OrderStatus[] = ['pending', 'preparing', 'ready', 'completed'];

export function OrdersView() {
  const {
    orders,
    menuItems,
    customers,
    searchQuery,
    createOrder,
    updateOrderStatus,
    cancelOrder,
  } = useRestaurant();
  const [params, setParams] = useSearchParams();
  const [createOpen, setCreateOpen] = useState(false);
  const [detail, setDetail] = useState<Order | null>(null);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // New order form state
  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('Walk-in Guest');
  const [orderType, setOrderType] = useState<OrderType>('dine-in');
  const [tableNumber, setTableNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [lines, setLines] = useState<{ menuItemId: string; quantity: number }[]>([
    { menuItemId: '', quantity: 1 },
  ]);

  useEffect(() => {
    if (params.get('new') === '1') {
      setCreateOpen(true);
      setParams({}, { replace: true });
    }
  }, [params, setParams]);

  const q = searchQuery.toLowerCase();
  const filtered = useMemo(() => {
    return orders
      .filter((o) => {
        if (statusFilter !== 'all' && o.status !== statusFilter) return false;
        if (!q) return true;
        return (
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.status.includes(q)
        );
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [orders, statusFilter, q]);

  function addLine() {
    setLines([...lines, { menuItemId: '', quantity: 1 }]);
  }

  function updateLine(i: number, patch: Partial<{ menuItemId: string; quantity: number }>) {
    setLines(lines.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
  }

  function removeLine(i: number) {
    setLines(lines.filter((_, idx) => idx !== i));
  }

  async function submitOrder(e: React.FormEvent) {
    e.preventDefault();
    const valid = lines.filter((l) => l.menuItemId && l.quantity > 0);
    if (!valid.length) return;
    const name =
      customerId
        ? customers.find((c) => c.id === customerId)?.name || customerName
        : customerName;
    const order = await createOrder({
      customerId: customerId || null,
      customerName: name,
      orderType,
      tableNumber: orderType === 'dine-in' ? tableNumber || undefined : undefined,
      items: valid,
      notes,
    });
    if (order) {
      setCreateOpen(false);
      setLines([{ menuItemId: '', quantity: 1 }]);
      setNotes('');
      setCustomerId('');
      setCustomerName('Walk-in Guest');
    }
  }

  function nextStatus(s: OrderStatus): OrderStatus | null {
    const i = STATUS_FLOW.indexOf(s);
    if (i < 0 || i >= STATUS_FLOW.length - 1) return null;
    return STATUS_FLOW[i + 1];
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1">
            {filtered.length} orders
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-medium hover:bg-amber-700"
        >
          <Plus className="h-4 w-4" /> New order
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'preparing', 'ready', 'completed', 'cancelled'].map(
          (s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full text-sm capitalize ${
                statusFilter === s
                  ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
              }`}
            >
              {s}
            </button>
          )
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-300 dark:border-stone-700 p-12 text-center text-stone-500">
          No orders found.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => {
            const next = nextStatus(o.status);
            return (
              <div
                key={o.id}
                className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold">{o.orderNumber}</span>
                      {o.isLocal && (
                        <span className="text-xs bg-stone-200 dark:bg-stone-700 px-1.5 py-0.5 rounded">
                          Local
                        </span>
                      )}
                      <StatusBadge status={o.status} />
                      <span className="text-xs text-stone-500 capitalize">
                        {o.orderType}
                        {o.tableNumber ? ` · ${o.tableNumber}` : ''}
                      </span>
                    </div>
                    <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                      {o.customerName} · {o.items.length} item
                      {o.items.length !== 1 ? 's' : ''} · $
                      {o.total.toFixed(2)}
                    </p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {new Date(o.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setDetail(o)}
                      className="px-3 py-1.5 text-sm rounded-lg border border-stone-300 dark:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-800"
                    >
                      Details
                    </button>
                    {next && (
                      <button
                        type="button"
                        onClick={() => updateOrderStatus(o.id, next)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-forest-600 text-white hover:bg-forest-700"
                      >
                        {next === 'preparing' && <ChefHat className="h-3.5 w-3.5" />}
                        {next === 'ready' && <PackageCheck className="h-3.5 w-3.5" />}
                        {next === 'completed' && <CheckCircle2 className="h-3.5 w-3.5" />}
                        Mark {next}
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                    {o.status !== 'completed' && o.status !== 'cancelled' && (
                      <button
                        type="button"
                        onClick={() => setCancelId(o.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Ban className="h-3.5 w-3.5" /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create order modal */}
      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setCreateOpen(false)} />
          <div className="relative w-full sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-t-xl sm:rounded-xl bg-white dark:bg-stone-900 border shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">New order</h2>
              <button type="button" onClick={() => setCreateOpen(false)} className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={submitOrder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Customer</label>
                <select
                  value={customerId}
                  onChange={(e) => {
                    setCustomerId(e.target.value);
                    if (!e.target.value) setCustomerName('Walk-in Guest');
                  }}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                >
                  <option value="">Walk-in Guest</option>
                  {customers
                    .filter((c) => c.status === 'active')
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>
              {!customerId && (
                <div>
                  <label className="block text-sm font-medium mb-1">Guest name</label>
                  <input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Order type</label>
                  <select
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value as OrderType)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                  >
                    <option value="dine-in">Dine-in</option>
                    <option value="takeaway">Takeaway</option>
                    <option value="delivery">Delivery</option>
                  </select>
                </div>
                {orderType === 'dine-in' && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Table</label>
                    <input
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      placeholder="T1"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Items</label>
                <div className="space-y-2">
                  {lines.map((line, i) => (
                    <div key={i} className="flex gap-2">
                      <select
                        value={line.menuItemId}
                        onChange={(e) => updateLine(i, { menuItemId: e.target.value })}
                        className="flex-1 px-3 py-2 text-sm rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                        required
                      >
                        <option value="">Select item</option>
                        {menuItems
                          .filter((m) => m.isAvailable && m.availableQuantity > 0)
                          .map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name} (${m.price.toFixed(2)}) — {m.availableQuantity} left
                            </option>
                          ))}
                      </select>
                      <input
                        type="number"
                        min={1}
                        value={line.quantity}
                        onChange={(e) =>
                          updateLine(i, { quantity: Number(e.target.value) || 1 })
                        }
                        className="w-20 px-2 py-2 text-sm rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                      />
                      {lines.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLine(i)}
                          className="p-2 text-red-600"
                          aria-label="Remove line"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addLine}
                  className="mt-2 text-sm text-amber-700 dark:text-amber-400"
                >
                  + Add line
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="px-4 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm rounded-lg bg-amber-600 text-white hover:bg-amber-700"
                >
                  Create order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDetail(null)} />
          <div className="relative w-full max-w-md rounded-xl bg-white dark:bg-stone-900 border shadow-xl p-6 max-h-[85vh] overflow-y-auto">
            <h2 className="text-lg font-semibold">{detail.orderNumber}</h2>
            <p className="text-sm text-stone-500 mt-1">
              {detail.customerName} · {detail.orderType}
              {detail.tableNumber ? ` · ${detail.tableNumber}` : ''}
            </p>
            <StatusBadge status={detail.status} />
            <ul className="mt-4 space-y-2 text-sm">
              {detail.items.map((it, i) => (
                <li key={i} className="flex justify-between">
                  <span>
                    {it.quantity}× {it.menuItemName}
                  </span>
                  <span>${it.lineTotal.toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-700 text-sm space-y-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${detail.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${detail.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${detail.total.toFixed(2)}</span>
              </div>
            </div>
            {detail.notes && (
              <p className="mt-3 text-sm text-stone-500">Notes: {detail.notes}</p>
            )}
            <button
              type="button"
              onClick={() => setDetail(null)}
              className="mt-6 w-full py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!cancelId}
        title="Cancel order?"
        message="Stock quantities will be restored for active items. This cannot be undone."
        confirmLabel="Cancel order"
        destructive
        onCancel={() => setCancelId(null)}
        onConfirm={async () => {
          if (cancelId) await cancelOrder(cancelId);
          setCancelId(null);
        }}
      />
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
  };
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize ${map[status] || ''}`}>
      {status}
    </span>
  );
}
