import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Eye, ShoppingCart, X } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import type { Customer, CustomerFormData, CustomerStatus } from '../types';
import { ConfirmDialog } from './Modals/ConfirmDialog';

const empty: CustomerFormData = {
  name: '',
  email: '',
  phone: '',
  customerNumber: '',
  status: 'active',
  dietaryPreferences: [],
  notes: '',
};

export function CustomersView() {
  const {
    customers,
    orders,
    searchQuery,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  } = useRestaurant();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [detail, setDetail] = useState<Customer | null>(null);
  const [form, setForm] = useState<CustomerFormData>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (params.get('new') === '1') {
      setEditing(null);
      setForm(empty);
      setFormOpen(true);
      setParams({}, { replace: true });
    }
  }, [params, setParams]);

  const q = searchQuery.toLowerCase();
  const filtered = useMemo(
    () =>
      customers.filter(
        (c) =>
          !q ||
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.customerNumber.toLowerCase().includes(q) ||
          c.phone.includes(q)
      ),
    [customers, q]
  );

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'A valid email is required';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    if (!form.customerNumber.trim()) e.customerNumber = 'Customer number is required';
    if (!['active', 'suspended', 'inactive'].includes(form.status as string))
      e.status = 'Status must be active, suspended or inactive';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    if (editing) await updateCustomer(editing.id, form);
    else await addCustomer(form);
    setFormOpen(false);
    setEditing(null);
  }

  function openEdit(c: Customer) {
    setEditing(c);
    setForm({
      name: c.name,
      email: c.email,
      phone: c.phone,
      customerNumber: c.customerNumber,
      status: c.status,
      dietaryPreferences: c.dietaryPreferences,
      notes: c.notes,
    });
    setFormOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Customer Directory</h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1">
            {filtered.length} customers
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setForm(empty);
            setErrors({});
            setFormOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-medium hover:bg-amber-700"
        >
          <Plus className="h-4 w-4" /> Register customer
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-300 dark:border-stone-700 p-12 text-center text-stone-500">
          No customers found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-stone-200 dark:border-stone-800">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 dark:bg-stone-900/80 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Email</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Phone</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800 bg-white dark:bg-stone-900">
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-3">
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-stone-500">{c.customerNumber}</div>
                    {c.isLocal && (
                      <span className="text-xs bg-stone-200 dark:bg-stone-700 px-1 rounded">
                        Local
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">{c.email}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">{c.phone}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                        c.status === 'active'
                          ? 'bg-forest-100 text-forest-800 dark:bg-forest-900/40 dark:text-forest-200'
                          : c.status === 'suspended'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200'
                            : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => setDetail(c)}
                        className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
                        aria-label="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => openEdit(c)}
                        className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
                        aria-label="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate(`/orders?new=1`)}
                        disabled={c.status !== 'active'}
                        className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-40"
                        aria-label="Start order"
                        title="Start order"
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteId(c.id)}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setFormOpen(false)} />
          <div className="relative w-full sm:max-w-md max-h-[90vh] overflow-y-auto rounded-t-xl sm:rounded-xl bg-white dark:bg-stone-900 border shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {editing ? 'Edit customer' : 'Register customer'}
              </h2>
              <button type="button" onClick={() => setFormOpen(false)} className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3" noValidate>
              {(
                [
                  ['name', 'Name'],
                  ['email', 'Email'],
                  ['phone', 'Phone'],
                  ['customerNumber', 'Customer number'],
                ] as const
              ).map(([key, label]) => (
                <div key={key}>
                  <label className="block text-sm font-medium mb-1">
                    {label} <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                    aria-invalid={!!errors[key]}
                  />
                  {errors[key] && (
                    <p className="text-xs text-red-600 mt-1" role="alert">
                      {errors[key]}
                    </p>
                  )}
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value as CustomerStatus })
                  }
                  className="w-full px-3 py-2 text-sm rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="inactive">Inactive</option>
                </select>
                {errors.status && (
                  <p className="text-xs text-red-600 mt-1" role="alert">
                    {errors.status}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
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
                  {editing ? 'Save' : 'Register'}
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
            <h2 className="text-lg font-semibold">{detail.name}</h2>
            <p className="text-sm text-stone-500">{detail.customerNumber}</p>
            <dl className="mt-4 space-y-2 text-sm">
              <div>
                <dt className="text-stone-500">Email</dt>
                <dd>{detail.email}</dd>
              </div>
              <div>
                <dt className="text-stone-500">Phone</dt>
                <dd>{detail.phone}</dd>
              </div>
              <div>
                <dt className="text-stone-500">Status</dt>
                <dd className="capitalize">{detail.status}</dd>
              </div>
              <div>
                <dt className="text-stone-500">Joined</dt>
                <dd>{new Date(detail.joinedDate).toLocaleDateString()}</dd>
              </div>
              {detail.notes && (
                <div>
                  <dt className="text-stone-500">Notes</dt>
                  <dd>{detail.notes}</dd>
                </div>
              )}
            </dl>
            <h3 className="mt-4 font-medium text-sm">Order history</h3>
            <ul className="mt-2 space-y-1 text-sm max-h-40 overflow-y-auto">
              {orders
                .filter((o) => o.customerId === detail.id)
                .map((o) => (
                  <li key={o.id} className="flex justify-between">
                    <span>
                      {o.orderNumber} · {o.status}
                    </span>
                    <span>${o.total.toFixed(2)}</span>
                  </li>
                ))}
              {orders.filter((o) => o.customerId === detail.id).length === 0 && (
                <li className="text-stone-500">No orders yet.</li>
              )}
            </ul>
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
        open={!!deleteId}
        title="Delete customer?"
        message="This will remove the customer record. Historical orders keep the name."
        confirmLabel="Delete"
        destructive
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          if (deleteId) await deleteCustomer(deleteId);
          setDeleteId(null);
        }}
      />
    </div>
  );
}
