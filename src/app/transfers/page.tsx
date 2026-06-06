"use client";

import { useState } from "react";
import { Plus, Eye, Play } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useTransfers,
  useAddTransfer,
  useUpdateTransferStatus,
  useItems,
} from "@/hooks/useWarehouse";
import {
  Card,
  Button,
  TransferStatusBadge,
  PriorityBadge,
  LoadingSpinner,
  EmptyState,
  SectionHeader,
} from "@/components/shared/ui";
import Modal, { FormField, inputClass, selectClass, textareaClass } from "@/components/shared/Modal";
import { transferSchema, type TransferFormValues } from "@/validations/schemas";
import { formatDate } from "@/lib/utils";
import { warehouseLocations } from "@/lib/data";
import type { Transfer } from "@/types";
import { cn } from "@/lib/utils";

const tabs = [
  { value: "all", label: "Semua" },
  { value: "pending", label: "Pending" },
  { value: "in-transit", label: "In Transit" },
  { value: "done", label: "Selesai" },
];

export default function TransfersPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [detailItem, setDetailItem] = useState<Transfer | null>(null);

  const { data: transfers, isLoading } = useTransfers(activeTab);
  const { mutate: addTransfer, isPending } = useAddTransfer();
  const { mutate: updateStatus } = useUpdateTransferStatus();
  const { data: items } = useItems();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      itemId: 0,
      quantity: 1,
      fromLocation: "Receiving",
      toLocation: "Zona A-01",
      priority: "normal",
      notes: "",
    },
  });

  function onSubmit(values: TransferFormValues) {
    const item = items?.find((i) => i.id === Number(values.itemId));
    if (!item) return;
    addTransfer(
      { ...values, itemId: item.id, itemName: item.name, status: "pending" },
      { onSuccess: () => { reset(); setAddOpen(false); } }
    );
  }

  return (
    <div>
      <SectionHeader
        title="Transfer & Mutasi Barang"
        subtitle={`${transfers?.length ?? 0} transfer ditemukan`}
      >
        <Button variant="primary" onClick={() => setAddOpen(true)}>
          <Plus size={13} /> Buat Transfer
        </Button>
      </SectionHeader>

      {/* Tabs */}
      <div className="flex gap-1 bg-secondary border border-border rounded-lg p-1 w-fit mb-5">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setActiveTab(t.value)}
            className={cn(
              "px-4 py-1.5 rounded-md text-[12px] font-medium transition-all",
              activeTab === t.value
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Card>
        {isLoading ? (
          <LoadingSpinner />
        ) : !transfers?.length ? (
          <EmptyState message="Tidak ada transfer pada periode ini" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="bg-secondary/60 border-b border-border text-[11px] text-muted-foreground uppercase tracking-wide">
                  <th className="text-left px-4 py-2.5 font-semibold">ID</th>
                  <th className="text-left px-4 py-2.5 font-semibold">Item</th>
                  <th className="text-left px-4 py-2.5 font-semibold">Qty</th>
                  <th className="text-left px-4 py-2.5 font-semibold">Dari</th>
                  <th className="text-left px-4 py-2.5 font-semibold">Ke</th>
                  <th className="text-left px-4 py-2.5 font-semibold">Prioritas</th>
                  <th className="text-left px-4 py-2.5 font-semibold">Tanggal</th>
                  <th className="text-left px-4 py-2.5 font-semibold">Status</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {transfers.map((t) => (
                  <tr key={t.id} className="hover:bg-secondary/40 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono text-[11px] text-muted-foreground">{t.id}</span>
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">{t.itemName}</td>
                    <td className="px-4 py-3 font-semibold">{t.quantity}</td>
                    <td className="px-4 py-3 text-muted-foreground text-[12px]">{t.fromLocation}</td>
                    <td className="px-4 py-3 text-muted-foreground text-[12px]">{t.toLocation}</td>
                    <td className="px-4 py-3">
                      <PriorityBadge priority={t.priority} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-[11px]">
                      {formatDate(t.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <TransferStatusBadge status={t.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {t.status === "pending" && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => updateStatus({ id: t.id, status: "in-transit" })}
                          >
                            <Play size={10} /> Proses
                          </Button>
                        )}
                        {t.status === "in-transit" && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => updateStatus({ id: t.id, status: "done" })}
                          >
                            Selesai
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => setDetailItem(t)}>
                          <Eye size={11} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add Transfer Modal */}
      <Modal
        open={addOpen}
        onClose={() => { reset(); setAddOpen(false); }}
        title="Buat Transfer Baru"
        description="Pindahkan barang antar lokasi gudang"
        size="md"
        footer={
          <>
            <Button variant="default" onClick={() => { reset(); setAddOpen(false); }}>Batal</Button>
            <Button variant="primary" onClick={handleSubmit(onSubmit)} isLoading={isPending}>
              <Plus size={13} /> Buat Transfer
            </Button>
          </>
        }
      >
        <form className="grid grid-cols-2 gap-4">
          <FormField label="Item" required error={errors.itemId?.message} className="col-span-2">
            <select {...register("itemId", { valueAsNumber: true })} className={selectClass}>
              <option value={0}>— Pilih Item —</option>
              {items?.map((item) => (
                <option key={item.id} value={item.id}>{item.name} (stok: {item.stock})</option>
              ))}
            </select>
          </FormField>
          <FormField label="Jumlah" required error={errors.quantity?.message}>
            <input {...register("quantity", { valueAsNumber: true })} type="number" min={1} className={inputClass} />
          </FormField>
          <FormField label="Prioritas" error={errors.priority?.message}>
            <select {...register("priority")} className={selectClass}>
              <option value="normal">Normal</option>
              <option value="high">Tinggi</option>
              <option value="urgent">Urgent</option>
            </select>
          </FormField>
          <FormField label="Dari Lokasi" required error={errors.fromLocation?.message}>
            <select {...register("fromLocation")} className={selectClass}>
              {warehouseLocations.map((l) => <option key={l}>{l}</option>)}
            </select>
          </FormField>
          <FormField label="Ke Lokasi" required error={errors.toLocation?.message}>
            <select {...register("toLocation")} className={selectClass}>
              {warehouseLocations.map((l) => <option key={l}>{l}</option>)}
            </select>
          </FormField>
          <FormField label="Catatan" className="col-span-2" error={errors.notes?.message}>
            <textarea {...register("notes")} className={textareaClass} placeholder="Catatan opsional..." />
          </FormField>
        </form>
      </Modal>

      {/* Detail Modal */}
      {detailItem && (
        <Modal
          open={!!detailItem}
          onClose={() => setDetailItem(null)}
          title={`Detail Transfer — ${detailItem.id}`}
          size="sm"
          footer={<Button variant="default" onClick={() => setDetailItem(null)}>Tutup</Button>}
        >
          <div className="space-y-3 text-[13px]">
            {[
              ["Item", detailItem.itemName],
              ["Quantity", `${detailItem.quantity} unit`],
              ["Dari", detailItem.fromLocation],
              ["Ke", detailItem.toLocation],
              ["Prioritas", detailItem.priority],
              ["Dibuat", formatDate(detailItem.createdAt)],
              ["Diperbarui", formatDate(detailItem.updatedAt)],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between border-b border-border pb-2 last:border-0">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium text-foreground">{value}</span>
              </div>
            ))}
            {detailItem.notes && (
              <div>
                <p className="text-muted-foreground mb-1">Catatan</p>
                <p className="text-foreground bg-secondary rounded-md px-3 py-2 text-[12px]">{detailItem.notes}</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
