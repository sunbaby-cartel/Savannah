import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Plus,
  Wifi,
  WifiOff,
  Loader2,
  User,
  Moon,
  Sun,
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

interface Props {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: Props) {
  const {
    syncState,
    searchQuery,
    setSearchQuery,
    theme,
    setTheme,
  } = useRestaurant();
  const navigate = useNavigate();

  const statusLabel =
    syncState === 'connected'
      ? 'API Connected'
      : syncState === 'checking'
        ? 'Checking…'
        : 'Local Mode';

  const StatusIcon =
    syncState === 'connected'
      ? Wifi
      : syncState === 'checking'
        ? Loader2
        : WifiOff;

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-stone-900/90 backdrop-blur border-b border-stone-200 dark:border-stone-800">
      <div className="h-full flex items-center gap-3 px-4 lg:px-6">
        <button
          type="button"
          className="lg:hidden p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="search"
            placeholder="Search menu, orders, customers…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:bg-white dark:focus:bg-stone-900"
            aria-label="Global search"
          />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={() => navigate('/orders?new=1')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-amber-600 text-white hover:bg-amber-700"
          >
            <Plus className="h-4 w-4" />
            New Order
          </button>
          <button
            type="button"
            onClick={() => navigate('/menu?new=1')}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border border-stone-300 dark:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-800"
          >
            <Plus className="h-4 w-4" />
            Menu Item
          </button>

          <div
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium ${
              syncState === 'connected'
                ? 'bg-forest-100 text-forest-800 dark:bg-forest-900/50 dark:text-forest-200'
                : syncState === 'checking'
                  ? 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200'
            }`}
            title={statusLabel}
          >
            <StatusIcon
              className={`h-3.5 w-3.5 ${syncState === 'checking' ? 'animate-spin' : ''}`}
            />
            {statusLabel}
          </div>

          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          <div className="flex items-center gap-2 pl-2 border-l border-stone-200 dark:border-stone-700">
            <div className="h-8 w-8 rounded-full bg-forest-100 dark:bg-forest-900 flex items-center justify-center">
              <User className="h-4 w-4 text-forest-700 dark:text-forest-300" />
            </div>
            <div className="hidden md:block text-sm">
              <p className="font-medium leading-tight">Staff</p>
              <p className="text-xs text-stone-500">Front of house</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
