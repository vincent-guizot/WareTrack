"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Bell, Shield, Database, Save } from "lucide-react";
import {
  warehouseSettingsSchema,
  type WarehouseSettingsFormValues,
} from "@/validations/schemas";
import { useAppStore } from "@/store/useAppStore";
import {
  Card,
  CardHeader,
  CardTitle,
  Button,
  SectionHeader,
} from "@/components/shared/ui";
import { FormField, inputClass, selectClass, textareaClass } from "@/components/shared/Modal";
import { cn } from "@/lib/utils";

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "relative w-10 h-5 rounded-full transition-colors flex-shrink-0",
        checked ? "bg-blue-600" : "bg-border"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all",
          checked ? "left-5" : "left-0.5"
        )}
      />
    </button>
  );
}

interface SettingRowProps {
  label: string;
  description?: string;
  children: React.ReactNode;
}
function SettingRow({ label, description, children }: SettingRowProps) {
  return (
    <div className="flex items-center gap-4 px-5 py-3.5 border-b border-border last:border-0">
      <div className="flex-1">
        <p className="text-[13px] font-medium text-foreground">{label}</p>
        {description && (
          <p className="text-[11px] text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const showToast = useAppStore((s) => s.showToast);

  // Notification toggles
  const [lowStockAlert, setLowStockAlert] = useState(true);
  const [dailyReport, setDailyReport] = useState(true);
  const [transferAlert, setTransferAlert] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);

  // Security toggles
  const [twoFA, setTwoFA] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<WarehouseSettingsFormValues>({
    resolver: zodResolver(warehouseSettingsSchema),
    defaultValues: {
      warehouseName: "Gudang Utama Jakarta",
      warehouseCode: "WH-JKT-001",
      address: "Jl. Industri Raya No. 45, Cakung, Jakarta Timur 13910",
      totalCapacity: 10000,
    },
  });

  function onSubmit(values: WarehouseSettingsFormValues) {
    showToast("Pengaturan gudang berhasil disimpan!");
  }

  return (
    <div className="max-w-3xl space-y-5">
      <SectionHeader title="Pengaturan Sistem" />

      {/* Warehouse Info */}
      <Card>
        <CardHeader>
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
            <Building2 size={14} className="text-blue-600" />
          </div>
          <CardTitle>Informasi Gudang</CardTitle>
        </CardHeader>
        <form className="p-5 grid grid-cols-2 gap-4" onSubmit={handleSubmit(onSubmit)}>
          <FormField label="Nama Gudang" required error={errors.warehouseName?.message}>
            <input {...register("warehouseName")} className={inputClass} />
          </FormField>
          <FormField label="Kode Gudang" required error={errors.warehouseCode?.message}>
            <input {...register("warehouseCode")} className={inputClass} />
          </FormField>
          <FormField label="Alamat" required error={errors.address?.message} className="col-span-2">
            <textarea {...register("address")} className={`${inputClass} min-h-[70px] resize-none`} />
          </FormField>
          <FormField label="Kapasitas Total (unit)" required error={errors.totalCapacity?.message}>
            <input
              {...register("totalCapacity", { valueAsNumber: true })}
              type="number"
              className={inputClass}
            />
          </FormField>
          <div className="flex items-end">
            <Button
              type="submit"
              variant="primary"
              onClick={handleSubmit(onSubmit)}
              className={cn(!isDirty && "opacity-50 cursor-not-allowed")}
            >
              <Save size={13} /> Simpan Perubahan
            </Button>
          </div>
        </form>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
            <Bell size={14} className="text-amber-600" />
          </div>
          <CardTitle>Notifikasi & Peringatan</CardTitle>
        </CardHeader>
        <div>
          <SettingRow
            label="Peringatan Stok Rendah"
            description="Kirim notifikasi saat stok di bawah minimum"
          >
            <Toggle checked={lowStockAlert} onChange={setLowStockAlert} />
          </SettingRow>
          <SettingRow
            label="Laporan Harian"
            description="Kirim ringkasan harian via email"
          >
            <Toggle checked={dailyReport} onChange={setDailyReport} />
          </SettingRow>
          <SettingRow
            label="Notifikasi Transfer"
            description="Alert saat ada mutasi barang baru"
          >
            <Toggle checked={transferAlert} onChange={setTransferAlert} />
          </SettingRow>
          <SettingRow
            label="Backup Otomatis"
            description="Backup database setiap 24 jam"
          >
            <Toggle checked={autoBackup} onChange={setAutoBackup} />
          </SettingRow>
        </div>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center">
            <Shield size={14} className="text-green-600" />
          </div>
          <CardTitle>Keamanan & Akses</CardTitle>
        </CardHeader>
        <div>
          <SettingRow
            label="Two-Factor Authentication"
            description="Aktifkan 2FA untuk semua admin"
          >
            <Toggle checked={twoFA} onChange={setTwoFA} />
          </SettingRow>
          <SettingRow
            label="Session Timeout"
            description="Logout otomatis setelah tidak aktif"
          >
            <select className="border border-border rounded-md px-3 py-1.5 text-[12px] text-foreground bg-white outline-none focus:border-blue-500">
              <option>30 menit</option>
              <option>1 jam</option>
              <option>4 jam</option>
              <option>8 jam</option>
            </select>
          </SettingRow>
        </div>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
            <Database size={14} className="text-purple-600" />
          </div>
          <CardTitle>Manajemen Data</CardTitle>
        </CardHeader>
        <div className="p-5 space-y-3">
          <p className="text-[13px] text-muted-foreground">
            Data tersimpan di local storage browser. Klik tombol di bawah untuk
            mereset ke data awal.
          </p>
          <div className="flex gap-3">
            <Button
              variant="default"
              onClick={() => showToast("Data berhasil diexport!")}
            >
              <Database size={13} /> Export Data
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                localStorage.removeItem("waretrack-storage");
                showToast("Data direset ke default. Refresh halaman.", "warning");
              }}
            >
              Reset ke Default
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
