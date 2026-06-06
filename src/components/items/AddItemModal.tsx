"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Package } from "lucide-react";
import { itemSchema, type ItemFormValues } from "@/validations/schemas";
import { useAddItem } from "@/hooks/useWarehouse";
import { useAppStore } from "@/store/useAppStore";
import Modal, { FormField, inputClass, selectClass, textareaClass } from "@/components/shared/Modal";
import { Button } from "@/components/shared/ui";
import { generateSKU } from "@/lib/utils";
import { warehouseLocations } from "@/lib/data";

interface AddItemModalProps {
  open: boolean;
  onClose: () => void;
}

const categories = ["Elektronik", "Komponen", "Peripheral", "Aksesoris"];
const icons = ["💻", "📱", "🖥️", "⌨️", "🖱️", "💾", "🔧", "📷", "🎧", "🔊", "🖨️", "🔌", "🌬️", "📦"];

export default function AddItemModal({ open, onClose }: AddItemModalProps) {
  const { mutate: addItem, isPending } = useAddItem();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: "",
      sku: "",
      category: "Elektronik",
      stock: 0,
      minStock: 10,
      location: "Zona A-01",
      price: 0,
      description: "",
    },
  });

  const nameVal = watch("name");

  function handleAutoSKU() {
    if (nameVal) setValue("sku", generateSKU(nameVal));
  }

  function onSubmit(values: ItemFormValues) {
    addItem(
      {
        ...values,
        icon: "📦",
      },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      }
    );
  }

  function handleClose() {
    reset();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Tambah Item Baru"
      description="Isi form berikut untuk menambahkan item ke gudang"
      size="lg"
      footer={
        <>
          <Button variant="default" onClick={handleClose}>
            Batal
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit(onSubmit)}
            isLoading={isPending}
          >
            <Package size={13} />
            Simpan Item
          </Button>
        </>
      }
    >
      <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit(onSubmit)}>
        {/* Name */}
        <FormField label="Nama Item" required error={errors.name?.message} className="col-span-2">
          <input
            {...register("name")}
            className={inputClass}
            placeholder="Cth: Laptop Asus ROG G14"
          />
        </FormField>

        {/* SKU */}
        <FormField label="SKU" required error={errors.sku?.message}>
          <div className="flex gap-2">
            <input
              {...register("sku")}
              className={inputClass}
              placeholder="LAP-ASUS-001"
            />
            <button
              type="button"
              onClick={handleAutoSKU}
              className="px-2.5 py-2 border border-border rounded-md text-[11px] text-muted-foreground hover:bg-secondary whitespace-nowrap"
            >
              Auto
            </button>
          </div>
        </FormField>

        {/* Category */}
        <FormField label="Kategori" required error={errors.category?.message}>
          <select {...register("category")} className={selectClass}>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </FormField>

        {/* Stock */}
        <FormField label="Stok Awal" required error={errors.stock?.message}>
          <input
            {...register("stock", { valueAsNumber: true })}
            type="number"
            min={0}
            className={inputClass}
            placeholder="0"
          />
        </FormField>

        {/* Min Stock */}
        <FormField label="Stok Minimum" required error={errors.minStock?.message}>
          <input
            {...register("minStock", { valueAsNumber: true })}
            type="number"
            min={1}
            className={inputClass}
            placeholder="10"
          />
        </FormField>

        {/* Location */}
        <FormField label="Lokasi" required error={errors.location?.message}>
          <select {...register("location")} className={selectClass}>
            {warehouseLocations.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </FormField>

        {/* Price */}
        <FormField label="Harga Beli (Rp)" error={errors.price?.message}>
          <input
            {...register("price", { valueAsNumber: true })}
            type="number"
            min={0}
            className={inputClass}
            placeholder="0"
          />
        </FormField>

        {/* Description */}
        <FormField label="Deskripsi" error={errors.description?.message} className="col-span-2">
          <textarea
            {...register("description")}
            className={textareaClass}
            placeholder="Deskripsi singkat tentang item ini..."
          />
        </FormField>
      </form>
    </Modal>
  );
}
