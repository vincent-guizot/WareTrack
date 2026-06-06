"use client";

import { useState } from "react";
import { Plus, Search, Edit2, Trash2, Filter } from "lucide-react";
import { useItems, useDeleteItem } from "@/hooks/useWarehouse";
import { useAppStore } from "@/store/useAppStore";
import {
  Card,
  CardHeader,
  CardTitle,
  Button,
  ItemStatusBadge,
  Badge,
  StockBar,
  LoadingSpinner,
  EmptyState,
  SectionHeader,
} from "@/components/shared/ui";
import AddItemModal from "@/components/items/AddItemModal";
import DeleteConfirmModal from "@/components/shared/DeleteConfirmModal";
import { formatRupiah, formatDate } from "@/lib/utils";
import type { Item } from "@/types";

const PAGE_SIZE = 10;

export default function ItemsPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Item | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [page, setPage] = useState(1);

  const { data: items, isLoading } = useItems(search, category, stockFilter);
  const { mutate: deleteItem, isPending: isDeleting } = useDeleteItem();

  const total = items?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const paginated = items?.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) ?? [];

  function handleDelete() {
    if (!deleteTarget) return;
    deleteItem(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
  }

  return (
    <div>
      <SectionHeader
        title="Manajemen Item"
        subtitle={`${total} item ditemukan`}
      >
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          className="border border-border rounded-md px-3 py-1.5 text-[12px] text-foreground bg-white outline-none focus:border-blue-500"
        >
          <option value="">Semua Kategori</option>
          {["Elektronik", "Komponen", "Peripheral", "Aksesoris"].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select
          value={stockFilter}
          onChange={(e) => { setStockFilter(e.target.value); setPage(1); }}
          className="border border-border rounded-md px-3 py-1.5 text-[12px] text-foreground bg-white outline-none focus:border-blue-500"
        >
          <option value="">Semua Stok</option>
          <option value="low">Stok Rendah / Kritis</option>
          <option value="ok">Normal</option>
        </select>
        <div className="flex items-center gap-2 border border-border rounded-md px-3 py-1.5 bg-white">
          <Search size={12} className="text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Cari item atau SKU..."
            className="text-[12px] outline-none bg-transparent text-foreground placeholder:text-muted-foreground w-44"
          />
        </div>
        <Button variant="primary" onClick={() => setAddOpen(true)}>
          <Plus size={13} />
          Tambah Item
        </Button>
      </SectionHeader>

      <Card>
        {isLoading ? (
          <LoadingSpinner />
        ) : paginated.length === 0 ? (
          <EmptyState message="Tidak ada item yang cocok dengan filter" />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="bg-secondary/60 border-b border-border text-[11px] text-muted-foreground uppercase tracking-wide">
                    <th className="text-left px-4 py-2.5 font-semibold">Item</th>
                    <th className="text-left px-4 py-2.5 font-semibold">SKU</th>
                    <th className="text-left px-4 py-2.5 font-semibold">Kategori</th>
                    <th className="text-left px-4 py-2.5 font-semibold">Stok</th>
                    <th className="text-left px-4 py-2.5 font-semibold">Level</th>
                    <th className="text-left px-4 py-2.5 font-semibold">Lokasi</th>
                    <th className="text-left px-4 py-2.5 font-semibold">Harga Beli</th>
                    <th className="text-left px-4 py-2.5 font-semibold">Update</th>
                    <th className="text-left px-4 py-2.5 font-semibold">Status</th>
                    <th className="px-4 py-2.5" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginated.map((item) => (
                    <tr key={item.id} className="hover:bg-secondary/40 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-base flex-shrink-0">
                            {item.icon}
                          </div>
                          <span className="font-medium text-foreground leading-tight">
                            {item.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {item.sku}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="blue">{item.category}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold">{item.stock}</span>
                        <span className="text-muted-foreground text-[11px] ml-1">
                          / min {item.minStock}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <StockBar stock={item.stock} minStock={item.minStock} />
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-[12px]">
                        {item.location}
                      </td>
                      <td className="px-4 py-3 font-mono text-[12px] text-foreground">
                        {formatRupiah(item.price)}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-[11px]">
                        {formatDate(item.updatedAt)}
                      </td>
                      <td className="px-4 py-3">
                        <ItemStatusBadge status={item.status} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Button size="sm" variant="ghost">
                            <Edit2 size={11} />
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => setDeleteTarget(item)}
                          >
                            <Trash2 size={11} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center gap-1.5 px-4 py-3 border-t border-border">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded-md text-[12px] border transition-colors ${
                    p === page
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-border text-foreground hover:bg-secondary"
                  }`}
                >
                  {p}
                </button>
              ))}
              <span className="ml-auto text-[12px] text-muted-foreground">
                Menampilkan {Math.min((page - 1) * PAGE_SIZE + 1, total)}–
                {Math.min(page * PAGE_SIZE, total)} dari {total} item
              </span>
            </div>
          </>
        )}
      </Card>

      <AddItemModal open={addOpen} onClose={() => setAddOpen(false)} />
      <DeleteConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemName={deleteTarget?.name ?? ""}
        isLoading={isDeleting}
      />
    </div>
  );
}
