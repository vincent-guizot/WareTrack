"use client";

import {
  Package,
  AlertTriangle,
  ArrowLeftRight,
  TrendingUp,
  CheckCircle2,
  Info,
} from "lucide-react";
import {
  useDashboard,
  useActivityLogs,
  useStockMovements,
} from "@/hooks/useWarehouse";
import {
  StatCard,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  LoadingSpinner,
  Alert,
} from "@/components/shared/ui";
import { formatRupiah, formatDateTime } from "@/lib/utils";

// ─── Stock Movement Chart ────────────────────────────────────
function StockChart({ data }: { data: { month: string; in: number; out: number }[] }) {
  const maxVal = Math.max(...data.flatMap((d) => [d.in, d.out]));
  return (
    <div className="p-4">
      <div className="flex items-end gap-3 h-36">
        {data.map((d) => (
          <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
            <div className="flex items-end gap-1 w-full h-28">
              <div
                className="flex-1 bg-blue-600 rounded-t-sm transition-all"
                style={{ height: `${(d.in / maxVal) * 100}%` }}
                title={`Masuk: ${d.in}`}
              />
              <div
                className="flex-1 bg-red-300 rounded-t-sm transition-all"
                style={{ height: `${(d.out / maxVal) * 100}%` }}
                title={`Keluar: ${d.out}`}
              />
            </div>
            <span className="text-[10px] text-muted-foreground font-mono">{d.month}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-3 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-blue-600 inline-block" />
          Masuk
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-red-300 inline-block" />
          Keluar
        </span>
      </div>
    </div>
  );
}

// ─── Activity Feed ───────────────────────────────────────────
const activityIcon = {
  success: <CheckCircle2 size={12} className="text-green-500" />,
  info: <Info size={12} className="text-blue-500" />,
  warning: <AlertTriangle size={12} className="text-amber-500" />,
  error: <AlertTriangle size={12} className="text-red-500" />,
};

const dotColor = {
  success: "bg-green-400",
  info: "bg-blue-400",
  warning: "bg-amber-400",
  error: "bg-red-400",
};

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboard();
  const { data: activities } = useActivityLogs();
  const { data: movements } = useStockMovements();

  return (
    <div className="space-y-5">
      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-3.5">
        <StatCard
          label="Total Items"
          icon={<Package size={13} />}
          value={statsLoading ? "—" : (stats?.totalItems ?? 0).toLocaleString("id-ID")}
          sub={
            <Badge variant="green">↑ {stats?.totalItemsChange ?? 0}% dari bulan lalu</Badge>
          }
        />
        <StatCard
          label="Stok Rendah"
          icon={<AlertTriangle size={13} />}
          value={statsLoading ? "—" : stats?.lowStockCount ?? 0}
          sub={<Badge variant="red">Perlu restock</Badge>}
        />
        <StatCard
          label="Transfer Aktif"
          icon={<ArrowLeftRight size={13} />}
          value={statsLoading ? "—" : stats?.activeTransfers ?? 0}
          sub={<Badge variant="amber">{stats?.pendingTransfers ?? 0} pending</Badge>}
        />
        <StatCard
          label="Nilai Stok"
          icon={<TrendingUp size={13} />}
          value={statsLoading ? "—" : formatRupiah(stats?.stockValue ?? 0)}
          sub={<Badge variant="blue">↑ {stats?.stockValueChange ?? 0}% bulan ini</Badge>}
        />
      </div>

      {/* Chart + Activity */}
      <div className="grid grid-cols-[2fr_1fr] gap-3.5">
        <Card>
          <CardHeader>
            <CardTitle>Pergerakan Stok — 6 Bulan</CardTitle>
            <Badge variant="blue">Live</Badge>
          </CardHeader>
          {movements ? <StockChart data={movements} /> : <LoadingSpinner />}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <div className="divide-y divide-border">
            {activities?.map((a) => (
              <div key={a.id} className="flex gap-3 px-4 py-3">
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${dotColor[a.type]}`}
                />
                <div>
                  <p
                    className="text-[12px] text-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: a.message }}
                  />
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {formatDateTime(a.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Alerts */}
      <Card className="p-4">
        <h3 className="text-[13px] font-semibold mb-3 flex items-center gap-2">
          <AlertTriangle size={14} className="text-amber-500" />
          Peringatan Sistem
        </h3>
        <Alert variant="error">
          <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
          <div>
            <strong>Stok Kritis:</strong> Keyboard Mechanical (2 unit tersisa) —
            segera lakukan reorder
          </div>
        </Alert>
        <Alert variant="warning">
          <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
          <div>
            <strong>Stok Rendah:</strong> SSD 1TB (8 unit) dan RAM DDR5 (12 unit)
            mendekati stok minimum
          </div>
        </Alert>
        <Alert variant="success">
          <CheckCircle2 size={14} className="flex-shrink-0 mt-0.5" />
          <div>
            Penerimaan barang dari PT. Tech Distributor telah selesai diverifikasi
            (250 unit)
          </div>
        </Alert>
      </Card>
    </div>
  );
}
