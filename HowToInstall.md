# WareTrack — Item Warehouse Management System

Aplikasi manajemen gudang modern yang dibangun dengan Next.js 14, TypeScript, TailwindCSS, Zustand, React Query, dan Zod + React Hook Form.

## 🛠️ Tech Stack

| Layer | Library |
|-------|---------|
| Framework | **Next.js 14** (App Router) |
| Language | **TypeScript** |
| Styling | **TailwindCSS** + CSS Variables |
| State Management | **Zustand** (dengan devtools + persist) |
| Server State | **TanStack React Query v5** |
| Form Validation | **React Hook Form** + **Zod** |
| UI Components | **Radix UI** primitives |
| Icons | **Lucide React** |
| Charts | **Recharts** |

## 📄 Pages (8 Halaman)

| Route | Halaman | Deskripsi |
|-------|---------|-----------|
| `/` | Dashboard | Stat overview, chart pergerakan stok, activity feed |
| `/items` | Items | CRUD item, filter, search, pagination |
| `/categories` | Categories | Kelola kategori barang |
| `/locations` | Locations | Peta zona gudang (A–D) dengan visualisasi kapasitas |
| `/transfers` | Transfers | Mutasi barang antar lokasi, tab filter status |
| `/suppliers` | Suppliers | Manajemen supplier dengan rating & kontak |
| `/reports` | Reports | Analitik, chart, top items, distribusi kategori |
| `/settings` | Settings | Pengaturan gudang, notifikasi, keamanan |

## 🚀 Cara Menjalankan

### 1. Install dependencies

```bash
npm install
# atau
yarn install
# atau
pnpm install
```

### 2. Jalankan development server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### 3. Build production

```bash
npm run build
npm run start
```

## 📁 Struktur Folder

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Dashboard
│   ├── items/page.tsx      # Item Management
│   ├── categories/page.tsx # Categories
│   ├── locations/page.tsx  # Warehouse Map
│   ├── transfers/page.tsx  # Transfers
│   ├── suppliers/page.tsx  # Suppliers
│   ├── reports/page.tsx    # Reports & Analytics
│   ├── settings/page.tsx   # Settings
│   └── layout.tsx          # Root layout with providers
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx     # Navigation sidebar
│   │   └── Topbar.tsx      # Top navigation bar
│   ├── items/
│   │   └── AddItemModal.tsx # Form tambah item (RHF + Zod)
│   └── shared/
│       ├── ui.tsx           # Reusable UI components
│       ├── Modal.tsx        # Modal/Dialog wrapper
│       ├── ToastContainer.tsx
│       └── DeleteConfirmModal.tsx
│
├── hooks/
│   └── useWarehouse.ts     # React Query hooks
│
├── lib/
│   ├── data.ts             # Mock data / seed
│   └── utils.ts            # Helper functions
│
├── store/
│   └── useAppStore.ts      # Zustand global store
│
├── types/
│   └── index.ts            # TypeScript type definitions
│
└── validations/
    └── schemas.ts          # Zod validation schemas
```

## 🔑 Fitur Utama

- ✅ **CRUD lengkap** untuk Item, Kategori, Supplier, Transfer
- ✅ **Validasi form** real-time dengan Zod + React Hook Form
- ✅ **State management** terpusat via Zustand (persist ke localStorage)
- ✅ **Server state** dengan React Query (cache, loading, refetch)
- ✅ **Visualisasi zona** gudang dengan color-coded capacity
- ✅ **Toast notifications** untuk semua aksi
- ✅ **Responsive table** dengan pagination
- ✅ **Tab filter** untuk status transfer
- ✅ **Global search** via Zustand

## 🗺️ Rencana Pengembangan

- [ ] Integrasi API backend (Express/FastAPI/Laravel)
- [ ] Export laporan ke PDF/Excel
- [ ] Barcode/QR scanner untuk item
- [ ] Role-based access control (RBAC)
- [ ] Dark mode support
- [ ] Mobile responsive layout
- [ ] Real-time updates via WebSocket
