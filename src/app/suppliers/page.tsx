"use client";

import { useState } from "react";
import { Plus, Mail, Edit2, Trash2, Star } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSuppliers, useAddSupplier, useDeleteSupplier } from "@/hooks/useWarehouse";
import {
  Badge,
  Button,
  LoadingSpinner,
  EmptyState,
  SectionHeader,
} from "@/components/shared/ui";
import Modal, { FormField, inputClass, selectClass, textareaClass } from "@/components/shared/Modal";
import DeleteConfirmModal from "@/components/shared/DeleteConfirmModal";
import { supplierSchema, type SupplierFormValues } from "@/validations/schemas";
import { formatDate } from "@/lib/utils";
import type { Supplier } from "@/types";

const logoOptions = ["🏢", "🔩", "🎮", "🌐", "🚀", "📦", "🖥️", "🔧", "💡", "🏭"];
const logoColors = [
  { label: "Biru", value: "#dbeafe" },
  { label: "Kuning", value: "#fef3c7" },
  { label: "Hijau", value: "#dcfce7" },
  { label: "Ungu", value: "#f3e8ff" },
  { label: "Pink", value: "#fce7f3" },
];

export default function SuppliersPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Supplier | null>(null);
  const { data: suppliers, isLoading } = useSuppliers();
  const { mutate: addSupplier, isPending } = useAddSupplier();
  const { mutate: deleteSupplier, isPending: isDeleting } = useDeleteSupplier();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      category: "Elektronik",
      paymentTerms: "net30",
    },
  });

  function onSubmit(values: SupplierFormValues) {
    addSupplier(
      { ...values, logo: "🏢", logoColor: "#dbeafe" },
      { onSuccess: () => { reset(); setAddOpen(false); } }
    );
  }

  function handleDelete() {
    if (!deleteTarget) return;
    deleteSupplier(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
  }

  return (
    <div>
      <SectionHeader
        title="Manajemen Supplier"
        subtitle={`${suppliers?.length ?? 0} supplier aktif`}
      >
        <Button variant="primary" onClick={() => setAddOpen(true)}>
          <Plus size={13} /> Tambah Supplier
        </Button>
      </SectionHeader>

      {isLoading ? (
        <LoadingSpinner />
      ) : !suppliers?.length ? (
        <EmptyState message="Belum ada supplier" />
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {suppliers.map((s) => (
            <div
              key={s.id}
              className="bg-white border border-border rounded-xl p-5 hover:shadow-sm transition-shadow"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                style={{ background: s.logoColor }}
              >
                {s.logo}
              </div>
              <h3 className="font-semibold text-[14px] text-foreground leading-tight mb-1">
                {s.name}
              </h3>
              <p className="text-[12px] text-muted-foreground mb-3">
                {s.contactPerson} · {s.category}
              </p>

              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <Badge variant="blue">{s.totalOrders} pesanan</Badge>
                {s.rating > 0 && (
                  <Badge variant="green">
                    <Star size={9} /> {s.rating}
                  </Badge>
                )}
                <Badge variant={s.isActive ? "green" : "gray"}>
                  {s.isActive ? "Aktif" : "Nonaktif"}
                </Badge>
              </div>

              <div className="text-[11px] text-muted-foreground space-y-0.5 mb-4">
                <p>{s.email}</p>
                <p>{s.phone}</p>
                <p className="truncate" title={s.address}>{s.address}</p>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="primary" className="flex-1">
                  <Mail size={11} /> Hubungi
                </Button>
                <Button size="sm" variant="ghost">
                  <Edit2 size={11} />
                </Button>
                <Button size="sm" variant="danger" onClick={() => setDeleteTarget(s)}>
                  <Trash2 size={11} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal
        open={addOpen}
        onClose={() => { reset(); setAddOpen(false); }}
        title="Tambah Supplier Baru"
        size="lg"
        footer={
          <>
            <Button variant="default" onClick={() => { reset(); setAddOpen(false); }}>Batal</Button>
            <Button variant="primary" onClick={handleSubmit(onSubmit)} isLoading={isPending}>
              Simpan Supplier
            </Button>
          </>
        }
      >
        <form className="grid grid-cols-2 gap-4">
          <FormField label="Nama Perusahaan" required error={errors.name?.message} className="col-span-2">
            <input {...register("name")} className={inputClass} placeholder="PT. Tech Distributor Indonesia" />
          </FormField>
          <FormField label="Kontak Person" required error={errors.contactPerson?.message}>
            <input {...register("contactPerson")} className={inputClass} placeholder="Nama PIC" />
          </FormField>
          <FormField label="No. Telepon" required error={errors.phone?.message}>
            <input {...register("phone")} className={inputClass} placeholder="+62 21 0000-0000" />
          </FormField>
          <FormField label="Email" required error={errors.email?.message} className="col-span-2">
            <input {...register("email")} type="email" className={inputClass} placeholder="supplier@email.com" />
          </FormField>
          <FormField label="Alamat" required error={errors.address?.message} className="col-span-2">
            <textarea {...register("address")} className={textareaClass} placeholder="Alamat lengkap supplier..." />
          </FormField>
          <FormField label="Kategori Produk" required error={errors.category?.message}>
            <select {...register("category")} className={selectClass}>
              <option>Elektronik</option>
              <option>Komponen</option>
              <option>Peripheral</option>
              <option>Aksesoris</option>
              <option>Semua</option>
            </select>
          </FormField>
          <FormField label="Payment Terms" required error={errors.paymentTerms?.message}>
            <select {...register("paymentTerms")} className={selectClass}>
              <option value="net30">Net 30</option>
              <option value="net60">Net 60</option>
              <option value="cod">COD</option>
            </select>
          </FormField>
        </form>
      </Modal>

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
