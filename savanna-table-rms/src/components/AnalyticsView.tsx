import { Download } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

export function AnalyticsView() {
  const { getReportSummary, exportCsv, menuItems } = useRestaurant();
  const s = getReportSummary();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Analytics & Reports
          </h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1">
            Computed from current data (local or API)
          </p>
        </div>
        <button
          type="button"
          onClick={() => exportCsv('orders')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-stone-300 dark:border-stone-600 text-sm font-medium hover:bg-stone-50 dark:hover:bg-stone-800"
        >
          <Download className="h-4 w-4" /> Export orders CSV
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Metric label="Total order revenue" value={`$${s.totalRevenue.toFixed(2)}`} />
        <Metric label="Average order value" value={`$${s.averageOrderValue.toFixed(2)}`} />
        <Metric label="Cancellation rate" value={`${s.cancellationRate.toFixed(1)}%`} />
        <Metric label="Low-stock items" value={String(s.lowStockItems.length)} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card title="Orders by status">
          <ul className="space-y-2 text-sm">
            {Object.entries(s.ordersByStatus).map(([status, count]) => (
              <li key={status} className="flex justify-between capitalize">
                <span>{status}</span>
                <span className="font-medium">{count}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Most ordered dishes">
          {s.mostOrderedDishes.length === 0 ? (
            <p className="text-sm text-stone-500">No order data.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {s.mostOrderedDishes.map((d) => (
                <li key={d.name} className="flex justify-between gap-2">
                  <span className="truncate">{d.name}</span>
                  <span className="shrink-0 text-stone-500">
                    {d.count} · ${d.revenue.toFixed(0)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card title="Most active customers">
          {s.mostActiveCustomers.length === 0 ? (
            <p className="text-sm text-stone-500">No linked orders.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {s.mostActiveCustomers.map((c) => (
                <li key={c.name} className="flex justify-between gap-2">
                  <span className="truncate">{c.name}</span>
                  <span className="shrink-0 text-stone-500">
                    {c.orderCount} orders · ${c.totalSpent.toFixed(0)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card title="Menu category distribution">
          <ul className="space-y-2 text-sm">
            {s.categoryDistribution.map((c) => (
              <li key={c.category} className="flex justify-between gap-2">
                <span>{c.category}</span>
                <span className="text-stone-500">
                  {c.count} sold · ${c.revenue.toFixed(0)}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card title="Daily order totals">
        {s.dailyOrderTotals.length === 0 ? (
          <p className="text-sm text-stone-500">No data.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-stone-500 border-b border-stone-100 dark:border-stone-800">
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">Orders</th>
                  <th className="pb-2 font-medium text-right">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {s.dailyOrderTotals.map((d) => (
                  <tr key={d.date} className="border-b border-stone-50 dark:border-stone-800/50">
                    <td className="py-2">{d.date}</td>
                    <td className="py-2">{d.count}</td>
                    <td className="py-2 text-right">${d.revenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card title="Low-stock menu items">
        {s.lowStockItems.length === 0 ? (
          <p className="text-sm text-stone-500">None currently low.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {s.lowStockItems.map((m) => (
              <li key={m.id} className="flex justify-between">
                <span>{m.name}</span>
                <span className="text-amber-700 dark:text-amber-400 font-medium">
                  {m.availableQuantity} / {m.totalQuantity}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <p className="text-xs text-stone-400">
        Catalog size: {menuItems.length} items · Export additional CSVs from Settings.
      </p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4">
      <p className="text-sm text-stone-500 dark:text-stone-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4">
      <h2 className="font-semibold mb-3">{title}</h2>
      {children}
    </div>
  );
}
