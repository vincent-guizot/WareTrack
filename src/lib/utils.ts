import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ItemStatus, TransferStatus, TransferPriority } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRupiah(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `Rp ${(amount / 1_000_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000_000) {
    return `Rp ${(amount / 1_000_000).toFixed(1)}Jt`;
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("id-ID").format(n);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMin < 1) return "Baru saja";
  if (diffMin < 60) return `${diffMin} menit lalu`;
  if (diffHour < 24) return `${diffHour} jam lalu`;
  if (diffDay === 1) return "Kemarin";
  return formatDate(dateStr);
}

export function getStockStatus(stock: number, minStock: number): ItemStatus {
  if (stock <= Math.floor(minStock * 0.3)) return "critical";
  if (stock < minStock) return "low";
  return "ok";
}

export function getStatusLabel(status: ItemStatus): string {
  const labels: Record<ItemStatus, string> = {
    ok: "Normal",
    low: "Rendah",
    critical: "Kritis",
  };
  return labels[status];
}

export function getTransferStatusLabel(status: TransferStatus): string {
  const labels: Record<TransferStatus, string> = {
    pending: "Pending",
    "in-transit": "In Transit",
    done: "Selesai",
    cancelled: "Dibatalkan",
  };
  return labels[status];
}

export function getPriorityLabel(priority: TransferPriority): string {
  const labels: Record<TransferPriority, string> = {
    normal: "Normal",
    high: "Tinggi",
    urgent: "Urgent",
  };
  return labels[priority];
}

export function generateSKU(name: string): string {
  const words = name.trim().toUpperCase().split(" ");
  const prefix = words
    .slice(0, 3)
    .map((w) => w.slice(0, 3))
    .join("-");
  const suffix = Date.now().toString().slice(-4);
  return `${prefix}-${suffix}`;
}

export function getStockPercentage(stock: number, minStock: number): number {
  const maxEstimate = Math.max(minStock * 3, 50);
  return Math.min(100, Math.round((stock / maxEstimate) * 100));
}

export function getZoneCapacityLabel(used: number, total: number): string {
  const pct = (used / total) * 100;
  if (pct === 0) return "Kosong";
  if (pct < 50) return "Tersedia";
  if (pct < 80) return "50-79%";
  if (pct < 100) return "80-99%";
  return "Penuh";
}
