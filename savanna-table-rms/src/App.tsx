import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RestaurantProvider } from './context/RestaurantContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ToastContainer } from './components/ToastContainer';
import { DashboardView } from './components/DashboardView';
import { MenuCatalogView } from './components/MenuCatalogView';
import { OrdersView } from './components/OrdersView';
import { CustomersView } from './components/CustomersView';
import { ReservationsView } from './components/ReservationsView';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-stone-50 dark:bg-stone-950">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
          <Routes>
            <Route path="/" element={<DashboardView />} />
            <Route path="/menu" element={<MenuCatalogView />} />
            <Route path="/orders" element={<OrdersView />} />
            <Route path="/customers" element={<CustomersView />} />
            <Route path="/reservations" element={<ReservationsView />} />
            <Route path="/analytics" element={<AnalyticsView />} />
            <Route path="/settings" element={<SettingsView />} />
          </Routes>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <RestaurantProvider>
        <Layout />
      </RestaurantProvider>
    </BrowserRouter>
  );
}
