import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  ShoppingCart,
  ToggleLeft,
  ToggleRight,
  Search,
  X,
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import type { MenuItem, MenuItemFormData, MenuCategory, DietaryTag } from '../types';
import { ConfirmDialog } from './Modals/ConfirmDialog';

const CATEGORIES: MenuCategory[] = [
  'Breakfast',
  'Main Course',
  'Grills',
  'Vegetarian',
  'Desserts',
  'Hot Drinks',
  'Cold Drinks',
];

const TAGS: DietaryTag[] = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Halal',
  'Spicy',
  'Contains Nuts',
  'Dairy-Free',
];

const emptyForm: MenuItemFormData = {
  name: '',
  description: '',
  category: '',
  price: '',
  availableQuantity: '',
  totalQuantity: '',
  preparationTimeMinutes: '',
  dietaryTags: [],
  isAvailable: true,
};

export function MenuCatalogView() {
  const {
    menuItems,
    searchQuery,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleMenuAvailability,
    createOrder,
  } = useRestaurant();
  const [params, setParams] = useSearchParams();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [detail, setDetail] = useState<MenuItem | null>(null);
  const [form, setForm] = useState<MenuItemFormData>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filterCat, setFilterCat] = useState<string>('all');
  const [localSearch, setLocalSearch] = useState('');

  useEffect(() => {
    if (params.get('new') === '1') {
      setEditing(null);
      setForm(emptyForm);
      setFormOpen(true);
      setParams({}, { replace: true });
    }
  }, [params, setParams]);

  const q = (localSearch || searchQuery).toLowerCase();
  const filtered = useMemo(() => {
    return menuItems.filter((m) => {
      if (filterCat !== 'all' && m.category !== filterCat) return false;
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q)
      );
    });
  }, [menuItems, filterCat, q]);

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.category) e.category = 'Category is required';
    if (form.price === '' || Number(form.price) <= 0)
      e.price = 'Price must be greater than zero';
    if (
      form.availableQuantity === '' ||
      !Number.isInteger(Number(form.availableQuantity)) ||
      Number(form.availableQuantity) < 0
    )
      e.availableQuantity = 'Quantity must be a non-negative whole number';
    if (
      form.totalQuantity === '' ||
      !Number.isInteger(Number(form.totalQuantity)) ||
      Number(form.totalQuantity) < 0
    )
      e.totalQuantity = 'Total quantity must be a non-negative whole number';
    if (
      form.preparationTimeMinutes === '' ||
      !Number.isInteger(Number(form.preparationTimeMinutes)) ||
      Number(form.preparationTimeMinutes) <= 0
    )
      e.preparationTimeMinutes = 'Preparation time must be a positive whole number';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    if (editing) {
      await updateMenuItem(editing.id, form);
    } else {
      await addMenuItem(form);
    }
    setFormOpen(false);
    setEditing(null);
    setForm(emptyForm);
  }

  function openEdit(item: MenuItem) {
    setEditing(item);
    setForm({
      name: item.name,
      description: item.description,
      category: item.category,
      price: item.price,
      availableQuantity: item.availableQuantity,
      totalQuantity: item.totalQuantity,
      preparationTimeMinutes: item.preparationTimeMinutes,
      dietaryTags: item.dietaryTags,
      isAvailable: item.isAvailable,
      imageGradient: item.imageGradient,
    });
    setFormOpen(true);
  }

  async function orderWithItem(item: MenuItem) {
    if (!item.isAvailable || item.availableQuantity < 1) return;
    await createOrder({
      customerName: 'Walk-in Guest',
      orderType: 'dine-in',
      items: [{ menuItemId: item.id, quantity: 1 }],
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Menu Catalog</h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1">
            {filtered.length} of {menuItems.length} items
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setForm(emptyForm);
            setErrors({});
            setFormOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-medium hover:bg-amber-700"
        >
          <Plus className="h-4 w-4" /> Add menu item
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="search"
            placeholder="Filter menu…"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
          />
        </div>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="px-3 py-2 text-sm rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
          aria-label="Filter by category"
        >
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-300 dark:border-stone-700 p-12 text-center">
          <p className="text-stone-500">No menu items match your filters.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden flex flex-col"
            >
              <div
                className={`h-24 bg-gradient-to-br ${item.imageGradient} relative`}
              >
                {item.isLocal && (
                  <span className="absolute top-2 left-2 text-xs bg-black/40 text-white px-2 py-0.5 rounded">
                    Local
                  </span>
                )}
                {!item.isAvailable && (
                  <span className="absolute top-2 right-2 text-xs bg-red-600 text-white px-2 py-0.5 rounded">
                    Unavailable
                  </span>
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-xs text-stone-500 mt-0.5">{item.category}</p>
                  </div>
                  <p className="font-semibold text-amber-700 dark:text-amber-400">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
                <p className="text-sm text-stone-600 dark:text-stone-400 mt-2 line-clamp-2">
                  {item.description}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {item.dietaryTags.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-stone-500 mt-2">
                  Stock: {item.availableQuantity}/{item.totalQuantity} · Prep:{' '}
                  {item.preparationTimeMinutes} min
                </p>
                <div className="mt-auto pt-3 flex flex-wrap gap-1">
                  <button
                    type="button"
                    onClick={() => setDetail(item)}
                    className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
                    title="View"
                    aria-label="View details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => openEdit(item)}
                    className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
                    title="Edit"
                    aria-label="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleMenuAvailability(item.id)}
                    className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
                    title={item.isAvailable ? 'Mark unavailable' : 'Mark available'}
                    aria-label="Toggle availability"
                  >
                    {item.isAvailable ? (
                      <ToggleRight className="h-4 w-4 text-forest-600" />
                    ) : (
                      <ToggleLeft className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => orderWithItem(item)}
                    disabled={!item.isAvailable || item.availableQuantity < 1}
                    className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-40"
                    title="Start order with this item"
                    aria-label="Order"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteId(item.id)}
                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600"
                    title="Delete"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Form modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setFormOpen(false)} />
          <div className="relative w-full sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-t-xl sm:rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {editing ? 'Edit menu item' : 'Add menu item'}
              </h2>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <Field label="Name" error={errors.name} required>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="field-input"
                  aria-invalid={!!errors.name}
                />
              </Field>
              <Field label="Description">
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={2}
                  className="field-input"
                />
              </Field>
              <Field label="Category" error={errors.category} required>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category: e.target.value as MenuCategory | '',
                    })
                  }
                  className="field-input"
                  aria-invalid={!!errors.category}
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Price ($)" error={errors.price} required>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        price: e.target.value === '' ? '' : Number(e.target.value),
                      })
                    }
                    className="field-input"
                    aria-invalid={!!errors.price}
                  />
                </Field>
                <Field
                  label="Prep time (min)"
                  error={errors.preparationTimeMinutes}
                  required
                >
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={form.preparationTimeMinutes}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        preparationTimeMinutes:
                          e.target.value === '' ? '' : Number(e.target.value),
                      })
                    }
                    className="field-input"
                    aria-invalid={!!errors.preparationTimeMinutes}
                  />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Available qty"
                  error={errors.availableQuantity}
                  required
                >
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.availableQuantity}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        availableQuantity:
                          e.target.value === '' ? '' : Number(e.target.value),
                      })
                    }
                    className="field-input"
                    aria-invalid={!!errors.availableQuantity}
                  />
                </Field>
                <Field label="Total qty" error={errors.totalQuantity} required>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.totalQuantity}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        totalQuantity:
                          e.target.value === '' ? '' : Number(e.target.value),
                      })
                    }
                    className="field-input"
                    aria-invalid={!!errors.totalQuantity}
                  />
                </Field>
              </div>
              <fieldset>
                <legend className="text-sm font-medium mb-2">Dietary tags</legend>
                <div className="flex flex-wrap gap-2">
                  {TAGS.map((t) => (
                    <label
                      key={t}
                      className="inline-flex items-center gap-1.5 text-sm px-2 py-1 rounded border border-stone-200 dark:border-stone-700 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={form.dietaryTags.includes(t)}
                        onChange={(e) => {
                          setForm({
                            ...form,
                            dietaryTags: e.target.checked
                              ? [...form.dietaryTags, t]
                              : form.dietaryTags.filter((x) => x !== t),
                          });
                        }}
                      />
                      {t}
                    </label>
                  ))}
                </div>
              </fieldset>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.isAvailable}
                  onChange={(e) =>
                    setForm({ ...form, isAvailable: e.target.checked })
                  }
                />
                Available for order
              </label>
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
                  {editing ? 'Save changes' : 'Create item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDetail(null)} />
          <div className="relative w-full max-w-md rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-xl p-6">
            <h2 className="text-lg font-semibold">{detail.name}</h2>
            <p className="text-sm text-stone-500 mt-1">{detail.category}</p>
            <p className="mt-3 text-sm">{detail.description}</p>
            <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div>
                <dt className="text-stone-500">Price</dt>
                <dd className="font-medium">${detail.price.toFixed(2)}</dd>
              </div>
              <div>
                <dt className="text-stone-500">Prep</dt>
                <dd className="font-medium">{detail.preparationTimeMinutes} min</dd>
              </div>
              <div>
                <dt className="text-stone-500">Stock</dt>
                <dd className="font-medium">
                  {detail.availableQuantity} / {detail.totalQuantity}
                </dd>
              </div>
              <div>
                <dt className="text-stone-500">Status</dt>
                <dd className="font-medium">
                  {detail.isAvailable ? 'Available' : 'Unavailable'}
                </dd>
              </div>
            </dl>
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
        title="Delete menu item?"
        message="This cannot be undone. Orders that already reference this item will keep the historical name."
        confirmLabel="Delete"
        destructive
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          if (deleteId) await deleteMenuItem(deleteId);
          setDeleteId(null);
        }}
      />

      <style>{`
        .field-input {
          width: 100%;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          border-radius: 0.5rem;
          border: 1px solid;
          border-color: rgb(231 229 228);
          background: white;
        }
        .dark .field-input {
          border-color: rgb(68 64 60);
          background: rgb(28 25 23);
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
