export declare const MenuCategory: {
    readonly Breakfast: "Breakfast";
    readonly MainCourse: "MainCourse";
    readonly Grills: "Grills";
    readonly Vegetarian: "Vegetarian";
    readonly Desserts: "Desserts";
    readonly HotDrinks: "HotDrinks";
    readonly ColdDrinks: "ColdDrinks";
};
export type MenuCategory = (typeof MenuCategory)[keyof typeof MenuCategory];
export declare const CustomerStatus: {
    readonly active: "active";
    readonly suspended: "suspended";
    readonly inactive: "inactive";
};
export type CustomerStatus = (typeof CustomerStatus)[keyof typeof CustomerStatus];
export declare const OrderType: {
    readonly dine_in: "dine_in";
    readonly takeaway: "takeaway";
    readonly delivery: "delivery";
};
export type OrderType = (typeof OrderType)[keyof typeof OrderType];
export declare const OrderStatus: {
    readonly pending: "pending";
    readonly preparing: "preparing";
    readonly ready: "ready";
    readonly completed: "completed";
    readonly cancelled: "cancelled";
};
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];
export declare const ReservationStatus: {
    readonly confirmed: "confirmed";
    readonly seated: "seated";
    readonly completed: "completed";
    readonly cancelled: "cancelled";
    readonly no_show: "no_show";
};
export type ReservationStatus = (typeof ReservationStatus)[keyof typeof ReservationStatus];
export declare const ActivityType: {
    readonly order_created: "order_created";
    readonly order_status: "order_status";
    readonly order_cancelled: "order_cancelled";
    readonly menu_updated: "menu_updated";
    readonly customer_registered: "customer_registered";
    readonly reservation_created: "reservation_created";
    readonly reservation_updated: "reservation_updated";
    readonly low_stock: "low_stock";
    readonly sync: "sync";
};
export type ActivityType = (typeof ActivityType)[keyof typeof ActivityType];
