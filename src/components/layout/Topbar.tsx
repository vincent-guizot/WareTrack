"use client";

import { Search, Bell, RefreshCw } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { useQueryClient } from "@tanstack/react-query";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/items": "Manajemen Item",
  "/categories": "Kategori Barang",
  "/locations": "Peta Lokasi Gudang",
  "/transfers": "Transfer & Mutasi Barang",
  "/suppliers": "Manajemen Supplier",
  "/reports": "Laporan & Analitik",
  "/settings": "Pengaturan Sistem",
};

export default function Topbar() {
  const pathname = usePathname();
  const globalSearch = useAppStore((s) => s.globalSearch);
  const setGlobalSearch = useAppStore((s) => s.setGlobalSearch);
  const qc = useQueryClient();
  const title = pageTitles[pathname] ?? "WareTrack";

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-border h-14 flex items-center px-6 gap-4">
      <h1 className="text-[15px] font-semibold text-foreground flex-1">{title}</h1>

      {/* Search */}
      <div className="flex items-center gap-2 bg-secondary border border-border rounded-full px-3 py-1.5 w-60">
        <Search size={13} className="text-muted-foreground flex-shrink-0" />
        <input
          type="text"
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
          placeholder="Cari item, SKU, supplier..."
          className="bg-transparent text-[13px] outline-none text-foreground placeholder:text-muted-foreground w-full"
        />
      </div>

      {/* Actions */}
      <button
        onClick={() => qc.invalidateQueries()}
        title="Refresh data"
        className="w-8 h-8 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
      >
        <RefreshCw size={14} />
      </button>
      <button
        title="Notifikasi"
        className="w-8 h-8 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors relative"
      >
        <Bell size={14} />
        <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
      </button>
    </header>
  );
}
