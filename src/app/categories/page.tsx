"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCategories, useAddCategory, useDeleteCategory } from "@/hooks/useWarehouse";
import {
  Badge,
  Button,
  LoadingSpinner,
  SectionHeader,
} from "@/components/shared/ui";
import Modal, { FormField, inputClass, selectClass, textareaClass } from "@/components/shared/Modal";
import DeleteConfirmModal from "@/components/shared/DeleteConfirmModal";
import { categorySchema, type CategoryFormValues } from "@/validations/schemas";
import { formatDate } from "@/lib/utils";
import type { Category } from "@/types";

const colorMap: Record<string, { bg: string; border: string; text: string }> = {
  blue: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700" },
  green: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700" },
  amber: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700" },
  red: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700" },
  purple: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700" },
};

const iconOptions = ["📦", "💻", "🔧", "⌨️", "🖱️", "📱", "🔌", "🎧", "🖥️", "📷"];

export default function CategoriesPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const { data: categories, isLoading } = useCategories();
  const { mutate: addCategory, isPending } = useAddCategory();
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", description: "", icon: "📦", color: "blue" },
  });

  function onSubmit(values: CategoryFormValues) {
    addCategory(values, { onSuccess: () => { reset(); setAddOpen(false); } });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    deleteCategory(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
  }

  return (
    <div>
      <SectionHeader
        title="Kategori Barang"
        subtitle={`${categories?.length ?? 0} kategori terdaftar`}
      >
        <Button variant="primary" onClick={() => setAddOpen(true)}>
          <Plus size={13} /> Tambah Kategori
        </Button>
      </SectionHeader>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {categories?.map((cat) => {
            const c = colorMap[cat.color] ?? colorMap.blue;
            return (
              <div
                key={cat.id}
                className="bg-white border border-border rounded-xl p-5 hover:shadow-sm transition-shadow"
              >
                <div className={`w-12 h-12 rounded-xl ${c.bg} ${c.border} border flex items-center justify-center text-2xl mb-4`}>
                  {cat.icon}
                </div>
                <h3 className="font-semibold text-[15px] text-foreground mb-1">{cat.name}</h3>
                <p className="text-[12px] text-muted-foreground mb-4 leading-relaxed">{cat.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={cat.color as any}>{cat.itemCount} item</Badge>
                    <span className="text-[11px] text-muted-foreground">
                      Dibuat {formatDate(cat.createdAt)}
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    <Button size="sm" variant="ghost"><Edit2 size={11} /></Button>
                    <Button size="sm" variant="danger" onClick={() => setDeleteTarget(cat)}>
                      <Trash2 size={11} />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      <Modal
        open={addOpen}
        onClose={() => { reset(); setAddOpen(false); }}
        title="Tambah Kategori Baru"
        size="sm"
        footer={
          <>
            <Button variant="default" onClick={() => { reset(); setAddOpen(false); }}>Batal</Button>
            <Button variant="primary" onClick={handleSubmit(onSubmit)} isLoading={isPending}>
              Simpan
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <FormField label="Nama Kategori" required error={errors.name?.message}>
            <input {...register("name")} className={inputClass} placeholder="Cth: Elektronik" />
          </FormField>
          <FormField label="Deskripsi" required error={errors.description?.message}>
            <textarea {...register("description")} className={textareaClass} placeholder="Deskripsi kategori..." />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Icon" error={errors.icon?.message}>
              <select {...register("icon")} className={selectClass}>
                {iconOptions.map((ic) => (
                  <option key={ic} value={ic}>{ic}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Warna" error={errors.color?.message}>
              <select {...register("color")} className={selectClass}>
                <option value="blue">Biru</option>
                <option value="green">Hijau</option>
                <option value="amber">Kuning</option>
                <option value="red">Merah</option>
                <option value="purple">Ungu</option>
              </select>
            </FormField>
          </div>
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
