import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Prisma, CustomerStatus, OrderType, OrderStatus, ReservationStatus, ActivityType } from '../generated/prisma/client';

const { Decimal } = Prisma;
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is required');
}
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const GRADIENTS = [
  'from-amber-500 to-orange-600',
  'from-emerald-600 to-teal-700',
  'from-rose-500 to-red-600',
  'from-sky-500 to-blue-600',
  'from-violet-500 to-purple-600',
  'from-lime-500 to-green-600',
  'from-yellow-500 to-amber-600',
  'from-cyan-500 to-teal-600',
];

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(12, 0, 0, 0);
  return d;
}

function todayAt(h: number, m = 0): Date {
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

function todayDateOnly(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function tomorrowDateOnly(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

async function main() {
  console.log('Clearing existing data…');
  await prisma.activity.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.customer.deleteMany();

  console.log('Seeding menu items…');
  const menu = await Promise.all([
    prisma.menuItem.create({
      data: {
        id: 'mi-001',
        name: 'Savanna Breakfast Platter',
        description: 'Eggs, sausage, grilled tomato, baked beans and toast with local honey.',
        category: 'Breakfast',
        price: new Decimal('12.50'),
        availableQuantity: 28,
        totalQuantity: 40,
        preparationTimeMinutes: 18,
        dietaryTags: [],
        imageGradient: GRADIENTS[0],
        isAvailable: true,
        createdAt: daysAgo(30),
        updatedAt: daysAgo(2),
      },
    }),
    prisma.menuItem.create({
      data: {
        id: 'mi-002',
        name: 'Ugali & Sukuma Wiki',
        description: 'Traditional maize meal with sautéed collard greens and spiced relish.',
        category: 'Main Course',
        price: new Decimal('9.75'),
        availableQuantity: 45,
        totalQuantity: 60,
        preparationTimeMinutes: 20,
        dietaryTags: ['Vegetarian'],
        imageGradient: GRADIENTS[1],
        isAvailable: true,
        createdAt: daysAgo(28),
        updatedAt: daysAgo(1),
      },
    }),
    prisma.menuItem.create({
      data: {
        id: 'mi-003',
        name: 'Nyama Choma Platter',
        description: 'Charcoal-grilled goat with kachumbari salad and ugali.',
        category: 'Grills',
        price: new Decimal('22.00'),
        availableQuantity: 15,
        totalQuantity: 30,
        preparationTimeMinutes: 35,
        dietaryTags: ['Halal'],
        imageGradient: GRADIENTS[2],
        isAvailable: true,
        createdAt: daysAgo(25),
        updatedAt: daysAgo(0),
      },
    }),
    prisma.menuItem.create({
      data: {
        id: 'mi-004',
        name: 'Grilled Tilapia',
        description: 'Whole tilapia grilled with lemon-herb butter and seasonal vegetables.',
        category: 'Grills',
        price: new Decimal('18.50'),
        availableQuantity: 8,
        totalQuantity: 20,
        preparationTimeMinutes: 28,
        dietaryTags: ['Gluten-Free'],
        imageGradient: GRADIENTS[3],
        isAvailable: true,
        createdAt: daysAgo(20),
        updatedAt: daysAgo(0),
      },
    }),
    prisma.menuItem.create({
      data: {
        id: 'mi-005',
        name: 'Vegetable Coconut Curry',
        description: 'Seasonal vegetables in rich coconut sauce served with basmati rice.',
        category: 'Vegetarian',
        price: new Decimal('14.00'),
        availableQuantity: 22,
        totalQuantity: 35,
        preparationTimeMinutes: 25,
        dietaryTags: ['Vegetarian', 'Vegan', 'Dairy-Free'],
        imageGradient: GRADIENTS[5],
        isAvailable: true,
        createdAt: daysAgo(18),
        updatedAt: daysAgo(3),
      },
    }),
    prisma.menuItem.create({
      data: {
        id: 'mi-006',
        name: 'Chapati Wrap',
        description: 'Soft chapati filled with spiced beans, avocado and fresh salsa.',
        category: 'Vegetarian',
        price: new Decimal('8.50'),
        availableQuantity: 30,
        totalQuantity: 40,
        preparationTimeMinutes: 12,
        dietaryTags: ['Vegetarian'],
        imageGradient: GRADIENTS[4],
        isAvailable: true,
        createdAt: daysAgo(15),
        updatedAt: daysAgo(1),
      },
    }),
    prisma.menuItem.create({
      data: {
        id: 'mi-007',
        name: 'Mandazi & Honey',
        description: 'Warm East African doughnuts dusted with cinnamon and local honey.',
        category: 'Desserts',
        price: new Decimal('5.50'),
        availableQuantity: 50,
        totalQuantity: 60,
        preparationTimeMinutes: 10,
        dietaryTags: ['Vegetarian'],
        imageGradient: GRADIENTS[6],
        isAvailable: true,
        createdAt: daysAgo(12),
        updatedAt: daysAgo(0),
      },
    }),
    prisma.menuItem.create({
      data: {
        id: 'mi-008',
        name: 'Mango Passion Cheesecake',
        description: 'Creamy cheesecake with tropical mango-passion fruit topping.',
        category: 'Desserts',
        price: new Decimal('7.25'),
        availableQuantity: 12,
        totalQuantity: 20,
        preparationTimeMinutes: 5,
        dietaryTags: ['Vegetarian', 'Contains Nuts'],
        imageGradient: GRADIENTS[7],
        isAvailable: true,
        createdAt: daysAgo(10),
        updatedAt: daysAgo(2),
      },
    }),
    prisma.menuItem.create({
      data: {
        id: 'mi-009',
        name: 'Kenyan AA Coffee',
        description: 'Single-origin Kenyan AA, pour-over or espresso style.',
        category: 'Hot Drinks',
        price: new Decimal('3.75'),
        availableQuantity: 100,
        totalQuantity: 120,
        preparationTimeMinutes: 5,
        dietaryTags: ['Vegan', 'Gluten-Free'],
        imageGradient: GRADIENTS[0],
        isAvailable: true,
        createdAt: daysAgo(40),
        updatedAt: daysAgo(5),
      },
    }),
    prisma.menuItem.create({
      data: {
        id: 'mi-010',
        name: 'Masala Chai',
        description: 'Spiced black tea with fresh ginger, cardamom and steamed milk.',
        category: 'Hot Drinks',
        price: new Decimal('3.25'),
        availableQuantity: 80,
        totalQuantity: 100,
        preparationTimeMinutes: 8,
        dietaryTags: ['Vegetarian'],
        imageGradient: GRADIENTS[1],
        isAvailable: true,
        createdAt: daysAgo(35),
        updatedAt: daysAgo(1),
      },
    }),
    prisma.menuItem.create({
      data: {
        id: 'mi-011',
        name: 'Fresh Passion Juice',
        description: 'Pressed passion fruit juice, lightly sweetened.',
        category: 'Cold Drinks',
        price: new Decimal('4.00'),
        availableQuantity: 35,
        totalQuantity: 50,
        preparationTimeMinutes: 4,
        dietaryTags: ['Vegan', 'Gluten-Free'],
        imageGradient: GRADIENTS[6],
        isAvailable: true,
        createdAt: daysAgo(8),
        updatedAt: daysAgo(0),
      },
    }),
    prisma.menuItem.create({
      data: {
        id: 'mi-012',
        name: 'Hibiscus Iced Tea',
        description: 'Chilled hibiscus tea with citrus and a hint of mint.',
        category: 'Cold Drinks',
        price: new Decimal('3.50'),
        availableQuantity: 3,
        totalQuantity: 40,
        preparationTimeMinutes: 3,
        dietaryTags: ['Vegan', 'Gluten-Free'],
        imageGradient: GRADIENTS[2],
        isAvailable: true,
        createdAt: daysAgo(7),
        updatedAt: daysAgo(0),
      },
    }),
    prisma.menuItem.create({
      data: {
        id: 'mi-013',
        name: 'Spicy Beef Samosas',
        description: 'Crispy pastry filled with spiced minced beef. Three pieces.',
        category: 'Main Course',
        price: new Decimal('6.50'),
        availableQuantity: 0,
        totalQuantity: 40,
        preparationTimeMinutes: 15,
        dietaryTags: ['Spicy', 'Halal'],
        imageGradient: GRADIENTS[2],
        isAvailable: false,
        createdAt: daysAgo(22),
        updatedAt: daysAgo(0),
      },
    }),
    prisma.menuItem.create({
      data: {
        id: 'mi-014',
        name: 'Chicken Pilau',
        description: 'Fragrant rice cooked with chicken, spices and raisins.',
        category: 'Main Course',
        price: new Decimal('15.00'),
        availableQuantity: 18,
        totalQuantity: 25,
        preparationTimeMinutes: 30,
        dietaryTags: ['Halal'],
        imageGradient: GRADIENTS[0],
        isAvailable: true,
        createdAt: daysAgo(14),
        updatedAt: daysAgo(1),
      },
    }),
  ]);
  console.log(`  ${menu.length} menu items`);

  console.log('Seeding customers…');
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        id: 'cu-001',
        name: 'Judith Kerubo',
        email: 'judith.kerubo@email.com',
        phone: '+254 712 345 001',
        customerNumber: 'CUS-1001',
        status: CustomerStatus.active,
        joinedDate: daysAgo(120),
        dietaryPreferences: ['Vegetarian'],
        notes: 'Prefers window seats.',
      },
    }),
    prisma.customer.create({
      data: {
        id: 'cu-002',
        name: 'Peter Onyango',
        email: 'peter.onyango@email.com',
        phone: '+254 723 456 002',
        customerNumber: 'CUS-1002',
        status: CustomerStatus.active,
        joinedDate: daysAgo(95),
        dietaryPreferences: [],
        notes: 'Regular lunch customer.',
      },
    }),
    prisma.customer.create({
      data: {
        id: 'cu-003',
        name: 'Mike Ndolo',
        email: 'mike.ndolo@email.com',
        phone: '+254 734 567 003',
        customerNumber: 'CUS-1003',
        status: CustomerStatus.active,
        joinedDate: daysAgo(80),
        dietaryPreferences: ['Halal'],
        notes: '',
      },
    }),
    prisma.customer.create({
      data: {
        id: 'cu-004',
        name: 'Zipporah Kwamboka',
        email: 'zipporah.k@email.com',
        phone: '+254 745 678 004',
        customerNumber: 'CUS-1004',
        status: CustomerStatus.active,
        joinedDate: daysAgo(60),
        dietaryPreferences: ['Gluten-Free'],
        notes: 'Allergic to peanuts.',
      },
    }),
    prisma.customer.create({
      data: {
        id: 'cu-005',
        name: 'George Atambo',
        email: 'george.atambo@email.com',
        phone: '+254 756 789 005',
        customerNumber: 'CUS-1005',
        status: CustomerStatus.active,
        joinedDate: daysAgo(45),
        dietaryPreferences: [],
        notes: '',
      },
    }),
    prisma.customer.create({
      data: {
        id: 'cu-006',
        name: 'Thomas Mosomi',
        email: 'thomas.mosomi@email.com',
        phone: '+254 767 890 006',
        customerNumber: 'CUS-1006',
        status: CustomerStatus.suspended,
        joinedDate: daysAgo(40),
        dietaryPreferences: [],
        notes: 'Payment issues – suspended pending review.',
      },
    }),
    prisma.customer.create({
      data: {
        id: 'cu-007',
        name: 'David Onchere',
        email: 'david.onchere@email.com',
        phone: '+254 778 901 007',
        customerNumber: 'CUS-1007',
        status: CustomerStatus.active,
        joinedDate: daysAgo(30),
        dietaryPreferences: ['Spicy'],
        notes: 'Loves nyama choma.',
      },
    }),
    prisma.customer.create({
      data: {
        id: 'cu-008',
        name: 'George Moochi',
        email: 'george.moochi@email.com',
        phone: '+254 789 012 008',
        customerNumber: 'CUS-1008',
        status: CustomerStatus.active,
        joinedDate: daysAgo(25),
        dietaryPreferences: [],
        notes: '',
      },
    }),
    prisma.customer.create({
      data: {
        id: 'cu-009',
        name: 'Chebet Vanessa',
        email: 'chebet.vanessa@email.com',
        phone: '+254 790 123 009',
        customerNumber: 'CUS-1009',
        status: CustomerStatus.active,
        joinedDate: daysAgo(15),
        dietaryPreferences: ['Vegan'],
        notes: 'Prefers outdoor seating when available.',
      },
    }),
    prisma.customer.create({
      data: {
        id: 'cu-010',
        name: 'Atogo Michael',
        email: 'atogo.michael@email.com',
        phone: '+254 701 234 010',
        customerNumber: 'CUS-1010',
        status: CustomerStatus.inactive,
        joinedDate: daysAgo(200),
        dietaryPreferences: [],
        notes: 'Has not visited in over 6 months.',
      },
    }),
  ]);
  console.log(`  ${customers.length} customers`);

  console.log('Seeding orders…');
  // Stock in seed data already reflects quantities after these demo orders
  // were conceptually placed (frontend seed mirrors the same numbers).
  await prisma.order.create({
    data: {
      id: 'or-001',
      orderNumber: 'ORD-2401',
      customerId: 'cu-001',
      customerName: 'Judith Kerubo',
      orderType: OrderType.dine_in,
      tableNumber: 'T4',
      subtotal: new Decimal('13.75'),
      tax: new Decimal('2.20'),
      total: new Decimal('15.95'),
      status: OrderStatus.completed,
      notes: '',
      createdAt: todayAt(9, 15),
      completedAt: todayAt(9, 55),
      items: {
        create: [
          {
            menuItemId: 'mi-002',
            menuItemName: 'Ugali & Sukuma Wiki',
            quantity: 1,
            unitPrice: new Decimal('9.75'),
            lineTotal: new Decimal('9.75'),
          },
          {
            menuItemId: 'mi-011',
            menuItemName: 'Fresh Passion Juice',
            quantity: 1,
            unitPrice: new Decimal('4.00'),
            lineTotal: new Decimal('4.00'),
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      id: 'or-002',
      orderNumber: 'ORD-2402',
      customerId: 'cu-002',
      customerName: 'Peter Onyango',
      orderType: OrderType.dine_in,
      tableNumber: 'T7',
      subtotal: new Decimal('29.50'),
      tax: new Decimal('4.72'),
      total: new Decimal('34.22'),
      status: OrderStatus.preparing,
      notes: 'Medium spice on the meat.',
      createdAt: todayAt(11, 20),
      items: {
        create: [
          {
            menuItemId: 'mi-003',
            menuItemName: 'Nyama Choma Platter',
            quantity: 1,
            unitPrice: new Decimal('22.00'),
            lineTotal: new Decimal('22.00'),
          },
          {
            menuItemId: 'mi-009',
            menuItemName: 'Kenyan AA Coffee',
            quantity: 2,
            unitPrice: new Decimal('3.75'),
            lineTotal: new Decimal('7.50'),
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      id: 'or-003',
      orderNumber: 'ORD-2403',
      customerId: null,
      customerName: 'Walk-in Guest',
      orderType: OrderType.takeaway,
      subtotal: new Decimal('24.00'),
      tax: new Decimal('3.84'),
      total: new Decimal('27.84'),
      status: OrderStatus.ready,
      notes: '',
      createdAt: todayAt(12, 5),
      items: {
        create: [
          {
            menuItemId: 'mi-006',
            menuItemName: 'Chapati Wrap',
            quantity: 2,
            unitPrice: new Decimal('8.50'),
            lineTotal: new Decimal('17.00'),
          },
          {
            menuItemId: 'mi-012',
            menuItemName: 'Hibiscus Iced Tea',
            quantity: 2,
            unitPrice: new Decimal('3.50'),
            lineTotal: new Decimal('7.00'),
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      id: 'or-004',
      orderNumber: 'ORD-2404',
      customerId: 'cu-007',
      customerName: 'David Onchere',
      orderType: OrderType.dine_in,
      tableNumber: 'T2',
      subtotal: new Decimal('49.50'),
      tax: new Decimal('7.92'),
      total: new Decimal('57.42'),
      status: OrderStatus.pending,
      notes: 'Extra kachumbari.',
      createdAt: todayAt(12, 40),
      items: {
        create: [
          {
            menuItemId: 'mi-003',
            menuItemName: 'Nyama Choma Platter',
            quantity: 2,
            unitPrice: new Decimal('22.00'),
            lineTotal: new Decimal('44.00'),
          },
          {
            menuItemId: 'mi-007',
            menuItemName: 'Mandazi & Honey',
            quantity: 1,
            unitPrice: new Decimal('5.50'),
            lineTotal: new Decimal('5.50'),
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      id: 'or-005',
      orderNumber: 'ORD-2405',
      customerId: 'cu-009',
      customerName: 'Chebet Vanessa',
      orderType: OrderType.delivery,
      subtotal: new Decimal('18.00'),
      tax: new Decimal('2.88'),
      total: new Decimal('20.88'),
      status: OrderStatus.pending,
      notes: 'Call on arrival.',
      createdAt: todayAt(13, 10),
      items: {
        create: [
          {
            menuItemId: 'mi-005',
            menuItemName: 'Vegetable Coconut Curry',
            quantity: 1,
            unitPrice: new Decimal('14.00'),
            lineTotal: new Decimal('14.00'),
          },
          {
            menuItemId: 'mi-011',
            menuItemName: 'Fresh Passion Juice',
            quantity: 1,
            unitPrice: new Decimal('4.00'),
            lineTotal: new Decimal('4.00'),
          },
        ],
      },
    },
  });
  console.log('  5 orders');

  console.log('Seeding reservations…');
  await prisma.reservation.createMany({
    data: [
      {
        id: 'rv-001',
        customerId: 'cu-001',
        customerName: 'Judith Kerubo',
        reservationDate: todayDateOnly(),
        reservationTime: '19:00',
        guestCount: 4,
        tableNumber: 'T5',
        status: ReservationStatus.confirmed,
        specialRequests: 'Quiet table if possible.',
        createdAt: daysAgo(2),
      },
      {
        id: 'rv-002',
        customerId: 'cu-004',
        customerName: 'Zipporah Kwamboka',
        reservationDate: todayDateOnly(),
        reservationTime: '12:30',
        guestCount: 2,
        tableNumber: 'T3',
        status: ReservationStatus.seated,
        specialRequests: 'Gluten-free options needed.',
        createdAt: daysAgo(1),
      },
      {
        id: 'rv-003',
        customerId: 'cu-005',
        customerName: 'George Atambo',
        reservationDate: todayDateOnly(),
        reservationTime: '20:00',
        guestCount: 6,
        tableNumber: 'T10',
        status: ReservationStatus.confirmed,
        specialRequests: 'Birthday celebration – small cake.',
        createdAt: daysAgo(3),
      },
      {
        id: 'rv-004',
        customerId: 'cu-008',
        customerName: 'George Moochi',
        reservationDate: tomorrowDateOnly(),
        reservationTime: '18:30',
        guestCount: 3,
        tableNumber: 'T6',
        status: ReservationStatus.confirmed,
        specialRequests: '',
        createdAt: daysAgo(0),
      },
    ],
  });
  console.log('  4 reservations');

  console.log('Seeding activities…');
  await prisma.activity.createMany({
    data: [
      {
        id: 'ac-001',
        type: ActivityType.order_created,
        message: 'New order ORD-2405 placed by Chebet Vanessa',
        entityId: 'or-005',
        timestamp: todayAt(13, 10),
      },
      {
        id: 'ac-002',
        type: ActivityType.order_status,
        message: 'Order ORD-2403 marked ready',
        entityId: 'or-003',
        timestamp: todayAt(12, 35),
      },
      {
        id: 'ac-003',
        type: ActivityType.order_created,
        message: 'New order ORD-2404 placed by David Onchere',
        entityId: 'or-004',
        timestamp: todayAt(12, 40),
      },
      {
        id: 'ac-004',
        type: ActivityType.low_stock,
        message: 'Hibiscus Iced Tea is low on stock (3 remaining)',
        entityId: 'mi-012',
        timestamp: todayAt(11, 0),
      },
      {
        id: 'ac-005',
        type: ActivityType.reservation_created,
        message: 'Reservation for George Atambo confirmed for tonight',
        entityId: 'rv-003',
        timestamp: daysAgo(0),
      },
      {
        id: 'ac-006',
        type: ActivityType.order_status,
        message: 'Order ORD-2402 moved to preparing',
        entityId: 'or-002',
        timestamp: todayAt(11, 25),
      },
      {
        id: 'ac-007',
        type: ActivityType.customer_registered,
        message: 'New customer Chebet Vanessa registered',
        entityId: 'cu-009',
        timestamp: daysAgo(15),
      },
    ],
  });
  console.log('  7 activities');

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
