import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { Item, Category, Supplier, Transfer, DashboardStats } from "@/types";
import {
  mockItems,
  mockCategories,
  mockSuppliers,
  mockTransfers,
  mockDashboardStats,
} from "@/lib/data";
import { getStockStatus } from "@/lib/utils";

// ─── Interfaces ───────────────────────────────────────────────
interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
}

interface AppState {
  // Data
  items: Item[];
  categories: Category[];
  suppliers: Supplier[];
  transfers: Transfer[];
  stats: DashboardStats;

  // UI State
  toasts: Toast[];
  sidebarOpen: boolean;
  globalSearch: string;

  // Item Actions
  addItem: (item: Omit<Item, "id" | "status" | "createdAt" | "updatedAt">) => void;
  updateItem: (id: number, data: Partial<Item>) => void;
  deleteItem: (id: number) => void;

  // Category Actions
  addCategory: (cat: Omit<Category, "id" | "itemCount" | "createdAt">) => void;
  updateCategory: (id: number, data: Partial<Category>) => void;
  deleteCategory: (id: number) => void;

  // Supplier Actions
  addSupplier: (s: Omit<Supplier, "id" | "rating" | "totalOrders" | "isActive" | "createdAt">) => void;
  updateSupplier: (id: number, data: Partial<Supplier>) => void;
  deleteSupplier: (id: number) => void;

  // Transfer Actions
  addTransfer: (t: Omit<Transfer, "id" | "createdAt" | "updatedAt">) => void;
  updateTransferStatus: (id: string, status: Transfer["status"]) => void;

  // UI Actions
  showToast: (message: string, type?: Toast["type"]) => void;
  removeToast: (id: string) => void;
  toggleSidebar: () => void;
  setGlobalSearch: (q: string) => void;
}

// ─── Store ───────────────────────────────────────────────────
export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial data
        items: mockItems,
        categories: mockCategories,
        suppliers: mockSuppliers,
        transfers: mockTransfers,
        stats: mockDashboardStats,
        toasts: [],
        sidebarOpen: true,
        globalSearch: "",

        // ── Items ──
        addItem: (itemData) => {
          const newItem: Item = {
            ...itemData,
            id: Date.now(),
            status: getStockStatus(itemData.stock, itemData.minStock),
            createdAt: new Date().toISOString().split("T")[0],
            updatedAt: new Date().toISOString().split("T")[0],
          };
          set((state) => ({
            items: [newItem, ...state.items],
            stats: {
              ...state.stats,
              totalItems: state.stats.totalItems + 1,
              lowStockCount:
                newItem.status !== "ok"
                  ? state.stats.lowStockCount + 1
                  : state.stats.lowStockCount,
            },
          }));
          get().showToast(`Item "${newItem.name}" berhasil ditambahkan!`);
        },

        updateItem: (id, data) => {
          set((state) => ({
            items: state.items.map((item) => {
              if (item.id !== id) return item;
              const updated = {
                ...item,
                ...data,
                updatedAt: new Date().toISOString().split("T")[0],
              };
              updated.status = getStockStatus(updated.stock, updated.minStock);
              return updated;
            }),
          }));
          get().showToast("Item berhasil diperbarui!");
        },

        deleteItem: (id) => {
          const item = get().items.find((i) => i.id === id);
          set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
          if (item) get().showToast(`Item "${item.name}" dihapus.`, "warning");
        },

        // ── Categories ──
        addCategory: (catData) => {
          const newCat: Category = {
            ...catData,
            id: Date.now(),
            itemCount: 0,
            createdAt: new Date().toISOString().split("T")[0],
          };
          set((state) => ({ categories: [...state.categories, newCat] }));
          get().showToast(`Kategori "${newCat.name}" berhasil ditambahkan!`);
        },

        updateCategory: (id, data) => {
          set((state) => ({
            categories: state.categories.map((c) =>
              c.id === id ? { ...c, ...data } : c
            ),
          }));
          get().showToast("Kategori berhasil diperbarui!");
        },

        deleteCategory: (id) => {
          const cat = get().categories.find((c) => c.id === id);
          set((state) => ({
            categories: state.categories.filter((c) => c.id !== id),
          }));
          if (cat) get().showToast(`Kategori "${cat.name}" dihapus.`, "warning");
        },

        // ── Suppliers ──
        addSupplier: (sData) => {
          const newSupplier: Supplier = {
            ...sData,
            id: Date.now(),
            rating: 0,
            totalOrders: 0,
            isActive: true,
            createdAt: new Date().toISOString().split("T")[0],
          };
          set((state) => ({ suppliers: [...state.suppliers, newSupplier] }));
          get().showToast(`Supplier "${newSupplier.name}" berhasil ditambahkan!`);
        },

        updateSupplier: (id, data) => {
          set((state) => ({
            suppliers: state.suppliers.map((s) =>
              s.id === id ? { ...s, ...data } : s
            ),
          }));
          get().showToast("Supplier berhasil diperbarui!");
        },

        deleteSupplier: (id) => {
          const s = get().suppliers.find((s) => s.id === id);
          set((state) => ({
            suppliers: state.suppliers.filter((s) => s.id !== id),
          }));
          if (s) get().showToast(`Supplier "${s.name}" dihapus.`, "warning");
        },

        // ── Transfers ──
        addTransfer: (tData) => {
          const newTransfer: Transfer = {
            ...tData,
            id: `TRF-${Date.now().toString().slice(-8)}`,
            createdAt: new Date().toISOString().split("T")[0],
            updatedAt: new Date().toISOString().split("T")[0],
          };
          set((state) => ({
            transfers: [newTransfer, ...state.transfers],
            stats: {
              ...state.stats,
              activeTransfers: state.stats.activeTransfers + 1,
              pendingTransfers: state.stats.pendingTransfers + 1,
            },
          }));
          get().showToast(`Transfer ${newTransfer.id} berhasil dibuat!`);
        },

        updateTransferStatus: (id, status) => {
          set((state) => ({
            transfers: state.transfers.map((t) =>
              t.id === id
                ? { ...t, status, updatedAt: new Date().toISOString().split("T")[0] }
                : t
            ),
          }));
          const label = { pending: "pending", "in-transit": "diproses", done: "selesai", cancelled: "dibatalkan" };
          get().showToast(`Transfer ${id} ${label[status]}.`);
        },

        // ── UI ──
        showToast: (message, type = "success") => {
          const id = Date.now().toString();
          set((state) => ({
            toasts: [...state.toasts, { id, message, type }],
          }));
          setTimeout(() => get().removeToast(id), 3500);
        },

        removeToast: (id) => {
          set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
        },

        toggleSidebar: () => {
          set((state) => ({ sidebarOpen: !state.sidebarOpen }));
        },

        setGlobalSearch: (q) => set({ globalSearch: q }),
      }),
      {
        name: "waretrack-storage",
        partialize: (state) => ({
          items: state.items,
          categories: state.categories,
          suppliers: state.suppliers,
          transfers: state.transfers,
        }),
      }
    ),
    { name: "WareTrack Store" }
  )
);
