import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Pencil, Trash2, X, UserCheck, CheckCircle2 } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import type { Reservation, ReservationStatus } from '../types';
import { ConfirmDialog } from './Modals/ConfirmDialog';

export function ReservationsView() {
  const {
    reservations,
    customers,
    searchQuery,
    createReservation,
    updateReservation,
    deleteReservation,
  } = useRestaurant();
  const [params, setParams] = useSearchParams();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Reservation | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [form, setForm] = useState({
    customerId: '',
    customerName: '',
    reservationDate: new Date().toISOString().slice(0, 10),
    reservationTime: '19:00',
    guestCount: 2,
    tableNumber: '',
    status: 'confirmed' as ReservationStatus,
    specialRequests: '',
  });

  useEffect(() => {
    if (params.get('new') === '1') {
      setEditing(null);
      setFormOpen(true);
      setParams({}, { replace: true });
    }
  }, [params, setParams]);

  const q = searchQuery.toLowerCase();
  const filtered = useMemo(() => {
    return reservations
      .filter((r) => {
        if (dateFilter && r.reservationDate !== dateFilter) return false;
        if (statusFilter !== 'all' && r.status !== statusFilter) return false;
        if (!q) return true;
        return (
          r.customerName.toLowerCase().includes(q) ||
          r.tableNumber.toLowerCase().includes(q) ||
          r.status.includes(q)
        );
      })
      .sort((a, b) =>
        `${a.reservationDate}${a.reservationTime}`.localeCompare(
          `${b.reservationDate}${b.reservationTime}`
        )
      );
  }, [reservations, dateFilter, statusFilter, q]);

  function openCreate() {
    setEditing(null);
    setForm({
      customerId: '',
      customerName: '',
      reservationDate: new Date().toISOString().slice(0, 10),
      reservationTime: '19:00',
      guestCount: 2,
      tableNumber: '',
      status: 'confirmed',
      specialRequests: '',
    });
    setFormOpen(true);
  }

  function openEdit(r: Reservation) {
    setEditing(r);
    setForm({
      customerId: r.customerId || '',
      customerName: r.customerName,
      reservationDate: r.reservationDate,
      reservationTime: r.reservationTime,
      guestCount: r.guestCount,
      tableNumber: r.tableNumber,
      status: r.status,
      specialRequests: r.specialRequests,
    });
    setFormOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const name =
      form.customerId
        ? customers.find((c) => c.id === form.customerId)?.name || form.customerName
        : form.customerName;
    if (!name.trim() || !form.tableNumber.trim()) return;
    const payload = {
      customerId: form.customerId || null,
      customerName: name,
      reservationDate: form.reservationDate,
      reservationTime: form.reservationTime,
      guestCount: form.guestCount,
      tableNumber: form.tableNumber,
      status: form.status,
      specialRequests: form.specialRequests,
    };
    if (editing) {
      await updateReservation(editing.id, payload);
    } else {
      await createReservation(payload);
    }
    setFormOpen(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Reservations</h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1">
            {filtered.length} reservations
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-medium hover:bg-amber-700"
        >
          <Plus className="h-4 w-4" /> New reservation
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-3 py-2 text-sm rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
          aria-label="Filter by date"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-sm rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
          aria-label="Filter by status"
        >
          <option value="all">All statuses</option>
          {['confirmed', 'seated', 'completed', 'cancelled', 'no-show'].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {dateFilter && (
          <button
            type="button"
            onClick={() => setDateFilter('')}
            className="text-sm text-amber-700"
          >
            Clear date
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-300 dark:border-stone-700 p-12 text-center text-stone-500">
          No reservations match.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div
              key={r.id}
              className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 flex flex-col sm:flex-row sm:items-center gap-3"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold">{r.customerName}</span>
                  {r.isLocal && (
                    <span className="text-xs bg-stone-200 dark:bg-stone-700 px-1.5 rounded">
                      Local
                    </span>
                  )}
                  <StatusBadge status={r.status} />
                </div>
                <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                  {r.reservationDate} at {r.reservationTime} · {r.guestCount} guests ·
                  Table {r.tableNumber}
                </p>
                {r.specialRequests && (
                  <p className="text-xs text-stone-500 mt-1">{r.specialRequests}</p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {r.status === 'confirmed' && (
                  <button
                    type="button"
                    onClick={() => updateReservation(r.id, { status: 'seated' })}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-sky-600 text-white hover:bg-sky-700"
                  >
                    <UserCheck className="h-3.5 w-3.5" /> Seat
                  </button>
                )}
                {(r.status === 'confirmed' || r.status === 'seated') && (
                  <button
                    type="button"
                    onClick={() => updateReservation(r.id, { status: 'completed' })}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-forest-600 text-white hover:bg-forest-700"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" /> Complete
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => openEdit(r)}
                  className="p-2 rounded-lg border border-stone-300 dark:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-800"
                  aria-label="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                {(r.status === 'confirmed' || r.status === 'seated') && (
                  <button
                    type="button"
                    onClick={() => updateReservation(r.id, { status: 'cancelled' })}
                    className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setDeleteId(r.id)}
                  className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setFormOpen(false)} />
          <div className="relative w-full sm:max-w-md max-h-[90vh] overflow-y-auto rounded-t-xl sm:rounded-xl bg-white dark:bg-stone-900 border shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {editing ? 'Edit reservation' : 'New reservation'}
              </h2>
              <button type="button" onClick={() => setFormOpen(false)} className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Customer</label>
                <select
                  value={form.customerId}
                  onChange={(e) => setForm({ ...form, customerId: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                >
                  <option value="">Guest / walk-in</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              {!form.customerId && (
                <div>
                  <label className="block text-sm font-medium mb-1">Name *</label>
                  <input
                    required
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={form.reservationDate}
                    onChange={(e) =>
                      setForm({ ...form, reservationDate: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Time *</label>
                  <input
                    type="time"
                    required
                    value={form.reservationTime}
                    onChange={(e) =>
                      setForm({ ...form, reservationTime: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Guests *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={form.guestCount}
                    onChange={(e) =>
                      setForm({ ...form, guestCount: Number(e.target.value) || 1 })
                    }
                    className="w-full px-3 py-2 text-sm rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Table *</label>
                  <input
                    required
                    value={form.tableNumber}
                    onChange={(e) => setForm({ ...form, tableNumber: e.target.value })}
                    placeholder="T5"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value as ReservationStatus,
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                >
                  {['confirmed', 'seated', 'completed', 'cancelled', 'no-show'].map(
                    (s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    )
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Special requests</label>
                <textarea
                  value={form.specialRequests}
                  onChange={(e) =>
                    setForm({ ...form, specialRequests: e.target.value })
                  }
                  rows={2}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-4 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm rounded-lg bg-amber-600 text-white hover:bg-amber-700"
                >
                  {editing ? 'Save' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete reservation?"
        message="This permanently removes the reservation record."
        confirmLabel="Delete"
        destructive
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          if (deleteId) await deleteReservation(deleteId);
          setDeleteId(null);
        }}
      />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    confirmed: 'bg-forest-100 text-forest-800 dark:bg-forest-900/40 dark:text-forest-200',
    seated: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200',
    completed: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200',
    'no-show': 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
  };
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize ${map[status] || ''}`}>
      {status}
    </span>
  );
}
