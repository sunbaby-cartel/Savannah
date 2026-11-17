"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityType = exports.ReservationStatus = exports.OrderStatus = exports.OrderType = exports.CustomerStatus = exports.MenuCategory = void 0;
exports.MenuCategory = {
    Breakfast: 'Breakfast',
    MainCourse: 'MainCourse',
    Grills: 'Grills',
    Vegetarian: 'Vegetarian',
    Desserts: 'Desserts',
    HotDrinks: 'HotDrinks',
    ColdDrinks: 'ColdDrinks'
};
exports.CustomerStatus = {
    active: 'active',
    suspended: 'suspended',
    inactive: 'inactive'
};
exports.OrderType = {
    dine_in: 'dine_in',
    takeaway: 'takeaway',
    delivery: 'delivery'
};
exports.OrderStatus = {
    pending: 'pending',
    preparing: 'preparing',
    ready: 'ready',
    completed: 'completed',
    cancelled: 'cancelled'
};
exports.ReservationStatus = {
    confirmed: 'confirmed',
    seated: 'seated',
    completed: 'completed',
    cancelled: 'cancelled',
    no_show: 'no_show'
};
exports.ActivityType = {
    order_created: 'order_created',
    order_status: 'order_status',
    order_cancelled: 'order_cancelled',
    menu_updated: 'menu_updated',
    customer_registered: 'customer_registered',
    reservation_created: 'reservation_created',
    reservation_updated: 'reservation_updated',
    low_stock: 'low_stock',
    sync: 'sync'
};
//# sourceMappingURL=enums.js.map