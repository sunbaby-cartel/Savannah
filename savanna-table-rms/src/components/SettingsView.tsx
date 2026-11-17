import { useState } from 'react';
import {
  Wifi,
  RefreshCw,
  Moon,
  Sun,
  Download,
  RotateCcw,
  Loader2,
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { OPENING_HOURS, DEFAULT_TAX_RATE } from '../services/seedData';

export function SettingsView() {
  const {
    syncState,
    theme,
    setTheme,
    taxRate,
    isLoading,
    checkConnection,
    synchronizeWithBackend,
    resetLocalData,
    setApiUrl,
    getApiUrl,
    exportCsv,
    exportJson,
  } = useRestaurant();

  const [apiUrl, setApiUrlInput] = useState(getApiUrl());
  const [testing, setTesting] = useState(false);

  async function handleTest() {
    setApiUrl(apiUrl.trim());
    setTesting(true);
    await checkConnection();
    setTesting(false);
  }

  async function handleSync() {
    setApiUrl(apiUrl.trim());
    await synchronizeWithBackend();
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings & API</h1>
        <p className="text-stone-500 dark:text-stone-400 mt-1">
          Configure connection and local demonstration data
        </p>
      </div>

      <section className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 space-y-4">
        <h2 className="font-semibold flex items-center gap-2">
          <Wifi className="h-4 w-4" /> REST API
        </h2>
        <p className="text-sm text-stone-500">
          Default base URL for the NestJS backend. When unavailable, the app runs
          in Local Mode with demonstration data stored in the browser.
        </p>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="api-url">
            API base URL
          </label>
          <input
            id="api-url"
            value={apiUrl}
            onChange={(e) => setApiUrlInput(e.target.value)}
            placeholder="http://localhost:3000/api/v1"
            className="w-full px-3 py-2 text-sm rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleTest}
            disabled={testing}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-800 disabled:opacity-50"
          >
            {testing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Wifi className="h-4 w-4" />
            )}
            Test connection
          </button>
          <button
            type="button"
            onClick={handleSync}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Synchronize data
          </button>
        </div>
        <p className="text-sm">
          Status:{' '}
          <span
            className={
              syncState === 'connected'
                ? 'text-forest-700 dark:text-forest-300 font-medium'
                : 'text-amber-700 dark:text-amber-300 font-medium'
            }
          >
            {syncState === 'connected'
              ? 'API Connected'
              : syncState === 'checking'
                ? 'Checking…'
                : syncState === 'error'
                  ? 'Connection error'
                  : 'Local Mode'}
          </span>
        </p>
        <div className="text-xs text-stone-500 bg-stone-50 dark:bg-stone-950 rounded-lg p-3 font-mono">
          Expected routes: GET/POST /menu-items, /customers, /orders,
          /reservations · PUT /orders/:id/status · PUT /orders/:id/cancel ·
          reports under /reports/*
        </div>
      </section>

      <section className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 space-y-4">
        <h2 className="font-semibold">Appearance</h2>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg border ${
              theme === 'light'
                ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                : 'border-stone-300 dark:border-stone-600'
            }`}
          >
            <Sun className="h-4 w-4" /> Light
          </button>
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg border ${
              theme === 'dark'
                ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                : 'border-stone-300 dark:border-stone-600'
            }`}
          >
            <Moon className="h-4 w-4" /> Dark
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 space-y-3">
        <h2 className="font-semibold">Restaurant defaults</h2>
        <p className="text-sm">
          Default tax rate:{' '}
          <strong>{(taxRate * 100).toFixed(0)}%</strong> (used for local order
          calculations; backend may override)
        </p>
        <div>
          <p className="text-sm font-medium mb-2">Opening hours</p>
          <ul className="text-sm text-stone-600 dark:text-stone-400 space-y-1">
            {Object.entries(OPENING_HOURS).map(([day, hours]) => (
              <li key={day} className="flex justify-between max-w-xs capitalize">
                <span>{day}</span>
                <span>{hours}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 space-y-4">
        <h2 className="font-semibold flex items-center gap-2">
          <Download className="h-4 w-4" /> Export
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => exportCsv('menu')}
            className="px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-800"
          >
            Menu CSV
          </button>
          <button
            type="button"
            onClick={() => exportCsv('customers')}
            className="px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-800"
          >
            Customers CSV
          </button>
          <button
            type="button"
            onClick={() => exportCsv('orders')}
            className="px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-800"
          >
            Orders CSV
          </button>
          <button
            type="button"
            onClick={() => exportCsv('reservations')}
            className="px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-800"
          >
            Reservations CSV
          </button>
          <button
            type="button"
            onClick={exportJson}
            className="px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-800"
          >
            Full JSON
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-red-200 dark:border-red-900/50 bg-white dark:bg-stone-900 p-5 space-y-3">
        <h2 className="font-semibold text-red-700 dark:text-red-400 flex items-center gap-2">
          <RotateCcw className="h-4 w-4" /> Local demonstration data
        </h2>
        <p className="text-sm text-stone-500">
          Reset restores the built-in seed data in the browser. Does not affect
          the PostgreSQL database when API is connected.
        </p>
        <button
          type="button"
          onClick={() => {
            if (
              window.confirm(
                'Reset all local demonstration data to the original seed?'
              )
            ) {
              resetLocalData();
            }
          }}
          className="px-4 py-2 text-sm rounded-lg border border-red-300 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/20"
        >
          Reset local data
        </button>
      </section>

      <p className="text-xs text-stone-400">
        Tax constant reference: {DEFAULT_TAX_RATE}. JWT auth can be attached via
        setAuthToken in services/api.ts without changing UI components.
      </p>
    </div>
  );
}
