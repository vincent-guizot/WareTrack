import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppStore } from "@/store/useAppStore";
import type { Item, Category, Supplier, Transfer } from "@/types";
import {
  mockDashboardStats,
  mockActivityLogs,
  mockStockMovements,
  mockZones,
  mockReportStats,
  mockTopItems,
  mockCategoryDistribution,
} from "@/lib/data";

// Simulated API delay
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ─── Query Keys ───────────────────────────────────────────────
export const queryKeys = {
  items: ["items"] as const,
  item: (id: number) => ["items", id] as const,
  categories: ["categories"] as const,
  suppliers: ["suppliers"] as const,
  transfers: ["transfers"] as const,
  dashboard: ["dashboard"] as const,
  zones: ["zones"] as const,
  reports: ["reports"] as const,
};

// ─── Items ───────────────────────────────────────────────────
export function useItems(search?: string, category?: string, stockFilter?: string) {
  const items = useAppStore((s) => s.items);
  return useQuery({
    queryKey: [...queryKeys.items, search, category, stockFilter],
    queryFn: async () => {
      await delay(150);
      let filtered = [...items];
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (i) =>
            i.name.toLowerCase().includes(q) ||
            i.sku.toLowerCase().includes(q) ||
            i.location.toLowerCase().includes(q)
        );
      }
      if (category) filtered = filtered.filter((i) => i.category === category);
      if (stockFilter === "low") filtered = filtered.filter((i) => i.status !== "ok");
      if (stockFilter === "ok") filtered = filtered.filter((i) => i.status === "ok");
      return filtered;
    },
    staleTime: 10_000,
  });
}

export function useItem(id: number) {
  const items = useAppStore((s) => s.items);
  return useQuery({
    queryKey: queryKeys.item(id),
    queryFn: async () => {
      await delay(100);
      return items.find((i) => i.id === id) ?? null;
    },
    enabled: id > 0,
  });
}

export function useAddItem() {
  const addItem = useAppStore((s) => s.addItem);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<Item, "id" | "status" | "createdAt" | "updatedAt">) => {
      await delay(300);
      addItem(data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.items }),
  });
}

export function useUpdateItem() {
  const updateItem = useAppStore((s) => s.updateItem);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Item> }) => {
      await delay(300);
      updateItem(id, data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.items }),
  });
}

export function useDeleteItem() {
  const deleteItem = useAppStore((s) => s.deleteItem);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await delay(200);
      deleteItem(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.items }),
  });
}

// ─── Categories ──────────────────────────────────────────────
export function useCategories() {
  const categories = useAppStore((s) => s.categories);
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: async () => { await delay(100); return categories; },
    staleTime: 30_000,
  });
}

export function useAddCategory() {
  const addCategory = useAppStore((s) => s.addCategory);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<Category, "id" | "itemCount" | "createdAt">) => {
      await delay(300);
      addCategory(data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.categories }),
  });
}

export function useDeleteCategory() {
  const deleteCategory = useAppStore((s) => s.deleteCategory);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => { await delay(200); deleteCategory(id); },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.categories }),
  });
}

// ─── Suppliers ───────────────────────────────────────────────
export function useSuppliers() {
  const suppliers = useAppStore((s) => s.suppliers);
  return useQuery({
    queryKey: queryKeys.suppliers,
    queryFn: async () => { await delay(150); return suppliers; },
    staleTime: 30_000,
  });
}

export function useAddSupplier() {
  const addSupplier = useAppStore((s) => s.addSupplier);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<Supplier, "id" | "rating" | "totalOrders" | "isActive" | "createdAt">) => {
      await delay(300);
      addSupplier(data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.suppliers }),
  });
}

export function useDeleteSupplier() {
  const deleteSupplier = useAppStore((s) => s.deleteSupplier);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => { await delay(200); deleteSupplier(id); },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.suppliers }),
  });
}

// ─── Transfers ───────────────────────────────────────────────
export function useTransfers(statusFilter?: string) {
  const transfers = useAppStore((s) => s.transfers);
  return useQuery({
    queryKey: [...queryKeys.transfers, statusFilter],
    queryFn: async () => {
      await delay(150);
      if (!statusFilter || statusFilter === "all") return transfers;
      return transfers.filter((t) => t.status === statusFilter);
    },
    staleTime: 10_000,
  });
}

export function useAddTransfer() {
  const addTransfer = useAppStore((s) => s.addTransfer);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<Transfer, "id" | "createdAt" | "updatedAt">) => {
      await delay(300);
      addTransfer(data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.transfers }),
  });
}

export function useUpdateTransferStatus() {
  const updateStatus = useAppStore((s) => s.updateTransferStatus);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Transfer["status"] }) => {
      await delay(200);
      updateStatus(id, status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.transfers }),
  });
}

// ─── Dashboard ───────────────────────────────────────────────
export function useDashboard() {
  const items = useAppStore((s) => s.items);
  const transfers = useAppStore((s) => s.transfers);
  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: async () => {
      await delay(200);
      const lowStockCount = items.filter((i) => i.status !== "ok").length;
      const activeTransfers = transfers.filter((t) => t.status !== "done" && t.status !== "cancelled").length;
      const pendingTransfers = transfers.filter((t) => t.status === "pending").length;
      return {
        ...mockDashboardStats,
        totalItems: items.length,
        lowStockCount,
        activeTransfers,
        pendingTransfers,
      };
    },
    refetchInterval: 30_000,
  });
}

export function useActivityLogs() {
  return useQuery({
    queryKey: ["activity"],
    queryFn: async () => { await delay(100); return mockActivityLogs; },
    staleTime: 60_000,
  });
}

export function useStockMovements() {
  return useQuery({
    queryKey: ["stockMovements"],
    queryFn: async () => { await delay(100); return mockStockMovements; },
    staleTime: 60_000,
  });
}

// ─── Zones / Locations ───────────────────────────────────────
export function useZones() {
  return useQuery({
    queryKey: queryKeys.zones,
    queryFn: async () => { await delay(200); return mockZones; },
    staleTime: 60_000,
  });
}

// ─── Reports ─────────────────────────────────────────────────
export function useReports() {
  return useQuery({
    queryKey: queryKeys.reports,
    queryFn: async () => {
      await delay(300);
      return {
        stats: mockReportStats,
        topItems: mockTopItems,
        categoryDistribution: mockCategoryDistribution,
        movements: mockStockMovements,
      };
    },
    staleTime: 120_000,
  });
}
