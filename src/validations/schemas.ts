import { z } from "zod";

// ─── Item Schema ─────────────────────────────────────────────
export const itemSchema = z.object({
  name: z
    .string()
    .min(3, "Nama item minimal 3 karakter")
    .max(100, "Nama item maksimal 100 karakter"),
  sku: z
    .string()
    .min(3, "SKU minimal 3 karakter")
    .max(30, "SKU maksimal 30 karakter")
    .regex(/^[A-Z0-9-]+$/, "SKU hanya boleh huruf besar, angka, dan tanda -"),
  category: z.string().min(1, "Pilih kategori"),
  stock: z
    .number({ invalid_type_error: "Stok harus berupa angka" })
    .int("Stok harus bilangan bulat")
    .min(0, "Stok tidak boleh negatif"),
  minStock: z
    .number({ invalid_type_error: "Stok minimum harus berupa angka" })
    .int("Stok minimum harus bilangan bulat")
    .min(1, "Stok minimum minimal 1"),
  location: z.string().min(1, "Pilih lokasi"),
  price: z
    .number({ invalid_type_error: "Harga harus berupa angka" })
    .min(0, "Harga tidak boleh negatif"),
  description: z.string().max(500, "Deskripsi maksimal 500 karakter").optional(),
  supplierId: z.number().optional(),
});

export type ItemFormValues = z.infer<typeof itemSchema>;

// ─── Category Schema ─────────────────────────────────────────
export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Nama kategori minimal 2 karakter")
    .max(50, "Nama kategori maksimal 50 karakter"),
  description: z
    .string()
    .min(5, "Deskripsi minimal 5 karakter")
    .max(200, "Deskripsi maksimal 200 karakter"),
  icon: z.string().min(1, "Pilih icon"),
  color: z.enum(["blue", "green", "amber", "red", "purple"], {
    required_error: "Pilih warna",
  }),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

// ─── Supplier Schema ─────────────────────────────────────────
export const supplierSchema = z.object({
  name: z
    .string()
    .min(3, "Nama perusahaan minimal 3 karakter")
    .max(100, "Nama perusahaan maksimal 100 karakter"),
  contactPerson: z
    .string()
    .min(2, "Nama kontak minimal 2 karakter")
    .max(60, "Nama kontak maksimal 60 karakter"),
  email: z.string().email("Format email tidak valid"),
  phone: z
    .string()
    .min(10, "Nomor telepon minimal 10 digit")
    .max(20, "Nomor telepon maksimal 20 digit")
    .regex(/^[+\d\s-]+$/, "Format nomor telepon tidak valid"),
  address: z
    .string()
    .min(10, "Alamat minimal 10 karakter")
    .max(300, "Alamat maksimal 300 karakter"),
  category: z.string().min(1, "Pilih kategori produk"),
  paymentTerms: z.enum(["net30", "net60", "cod"], {
    required_error: "Pilih payment terms",
  }),
});

export type SupplierFormValues = z.infer<typeof supplierSchema>;

// ─── Transfer Schema ─────────────────────────────────────────
export const transferSchema = z
  .object({
    itemId: z
      .number({ required_error: "Pilih item" })
      .min(1, "Pilih item"),
    quantity: z
      .number({ invalid_type_error: "Jumlah harus berupa angka" })
      .int("Jumlah harus bilangan bulat")
      .min(1, "Jumlah minimal 1"),
    fromLocation: z.string().min(1, "Pilih lokasi asal"),
    toLocation: z.string().min(1, "Pilih lokasi tujuan"),
    priority: z.enum(["normal", "high", "urgent"]),
    notes: z.string().max(300, "Catatan maksimal 300 karakter").optional(),
  })
  .refine((data) => data.fromLocation !== data.toLocation, {
    message: "Lokasi asal dan tujuan tidak boleh sama",
    path: ["toLocation"],
  });

export type TransferFormValues = z.infer<typeof transferSchema>;

// ─── Settings Schema ─────────────────────────────────────────
export const warehouseSettingsSchema = z.object({
  warehouseName: z.string().min(3, "Nama gudang minimal 3 karakter"),
  warehouseCode: z
    .string()
    .min(3, "Kode gudang minimal 3 karakter")
    .regex(/^[A-Z0-9-]+$/, "Kode hanya huruf besar, angka, dan -"),
  address: z.string().min(10, "Alamat minimal 10 karakter"),
  totalCapacity: z.number().int().min(1, "Kapasitas harus lebih dari 0"),
});

export type WarehouseSettingsFormValues = z.infer<typeof warehouseSettingsSchema>;
