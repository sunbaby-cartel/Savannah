import { useRestaurant } from '../context/RestaurantContext';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const styles = {
  success:
    'bg-forest-50 border-forest-200 text-forest-800 dark:bg-forest-900/40 dark:border-forest-700 dark:text-forest-100',
  error:
    'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/40 dark:border-red-700 dark:text-red-100',
  info: 'bg-sky-50 border-sky-200 text-sky-800 dark:bg-sky-900/40 dark:border-sky-700 dark:text-sky-100',
  warning:
    'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-900/40 dark:border-amber-700 dark:text-amber-100',
};

export function ToastContainer() {
  const { toasts, dismissToast } = useRestaurant();

  if (!toasts.length) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((t) => {
        const Icon = icons[t.type];
        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-lg border px-4 py-3 shadow-lg ${styles[t.type]}`}
            role="status"
          >
            <Icon className="h-5 w-5 shrink-0 mt-0.5" aria-hidden />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{t.title}</p>
              {t.message && (
                <p className="text-sm opacity-90 mt-0.5">{t.message}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(t.id)}
              className="shrink-0 rounded p-1 hover:bg-black/5 dark:hover:bg-white/10"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
