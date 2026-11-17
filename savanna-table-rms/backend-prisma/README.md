# Prisma schema & seed for Savanna Table RMS

These files match the frontend types and demonstration data so your NestJS API returns the same shape the UI expects.

## Setup in a NestJS project

```bash
# from your NestJS app root
npm install @prisma/client
npm install -D prisma ts-node tsx

npx prisma init
# replace prisma/schema.prisma with schema.prisma from this folder
# copy seed.ts to prisma/seed.ts

# .env
# DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/savanna_table?schema=public"
```

In `package.json`:

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

Then:

```bash
npx prisma migrate dev --name init
npx prisma db seed
npx prisma generate
```

## Important design notes

1. **Category is a String**, not the Prisma enum, in the `MenuItem` model.  
   The frontend sends display labels like `"Main Course"` and `"Hot Drinks"`.  
   Using `String` avoids mapping friction in DTOs. The `MenuCategory` enum is still in the schema for reference if you prefer strict enums later.

2. **OrderType / ReservationStatus** use `@map` so DB values stay API-friendly (`dine-in`, `no-show`).

3. **Order creation must be transactional** (stock decrement + order insert).  
   Cancel must restore quantities **once**. Completed orders must not restore stock.

4. **Stable seed IDs** (`mi-001`, `cu-001`, …) match the frontend seed so you can compare Local Mode vs API Mode easily.

5. Serialize `Decimal` fields to numbers in your Nest serializers/interceptors, e.g. `Number(item.price)`.

## Suggested Nest modules

- `MenuItemsModule`
- `CustomersModule`
- `OrdersModule` (status + cancel endpoints)
- `ReservationsModule`
- `ActivitiesModule`
- `ReportsModule` (summary, popular-items, revenue)

API base path expected by the frontend: `/api/v1`
