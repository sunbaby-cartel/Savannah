# Savanna Table RMS

Professional restaurant operations management **frontend** built with React, TypeScript, Vite, Tailwind CSS, React Router, Lucide icons, and Context API.

This project is **frontend-only**. It runs fully in Local Mode with demonstration data when no backend is available, and switches to a REST API when connected.

## Quick start

```bash
npm install
npm run dev
```

Build: `npm run build`

## Expected REST API (NestJS + Prisma + PostgreSQL)

Base: `http://localhost:3000/api/v1`

- Menu: GET/POST /menu-items, PUT/DELETE /menu-items/:id
- Customers: GET/POST /customers, PUT/DELETE /customers/:id
- Orders: GET/POST /orders, PUT /orders/:id/status, PUT /orders/:id/cancel
- Reservations: GET/POST /reservations, PUT/DELETE /reservations/:id
- GET /activities, /reports/summary, /reports/popular-items, /reports/revenue

Business rules: active customers only; no unavailable items; qty limits; create decreases stock; cancel restores once; complete does not restore.

See src/services/api.ts for client helpers and JWT hook (setAuthToken).

