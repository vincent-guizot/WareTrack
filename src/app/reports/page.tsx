"use client";

import { Download, TrendingUp, TrendingDown, BarChart2, PieChart } from "lucide-react";
import { useReports } from "@/hooks/useWarehouse";
import {
  StatCard,
  Card,
  CardHeader,
  CardTitle,
  Badge,
  LoadingSpinner,
  SectionHeader,
} from "@/components/shared/ui";
import { cn } from "@/lib/utils";

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="w-24 h-1.5 bg-border rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${value}%`, background: color }}
      />
    </div>
  );
}

function StockChart({ data }: { data: { month: string; in: number; out: number }[] }) {
  const maxVal = Math.max(...data.flatMap((d) => [d.in, d.out]));
  return (
    <div className="p-4">
      <div className="flex items-end gap-3 h-44">
        {data.map((d) => (
          <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
            <div className="flex items-end gap-1 w-full h-36">
              <div
                className="flex-1 bg-blue-600 rounded-t transition-all"
                style={{ height: `${(d.in / maxVal) * 100}%` }}
                title={`Masuk: ${d.in}`}
              />
              <div
                className="flex-1 bg-red-300 rounded-t transition-all"
                style={{ height: `${(d.out / maxVal) * 100}%` }}
                title={`Keluar: ${d.out}`}
              />
            </div>
            <span className="text-[10px] text-muted-foreground font-mono">{d.month}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-2 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-blue-600 inline-block" /> Masuk
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-red-300 inline-block" /> Keluar
        </span>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const { data, isLoading } = useReports();

  if (isLoading) return <LoadingSpinner />;

  const { stats, topItems, categoryDistribution, movements } = data!;

  return (
    <div className="space-y-5">
      <SectionHeader title="Laporan & Analitik" subtitle="Periode: Juni 2025">
        <Badge variant="gray">Data diperbarui setiap hari</Badge>
        <button className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-md text-[12px] font-medium text-foreground hover:bg-secondary transition-colors">
          <Download size={13} /> Export PDF
        </button>
      </SectionHeader>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-3.5">
        <StatCard
          label="Total Masuk"
          icon={<TrendingUp size={13} className="text-green-600" />}
          value={`↑ ${stats.totalIn}`}
          sub="unit bulan ini"
          className="border-l-4 border-l-green-500"
        />
        <StatCard
          label="Total Keluar"
          icon={<TrendingDown size={13} className="text-red-500" />}
          value={`↓ ${stats.totalOut}`}
          sub="unit bulan ini"
          className="border-l-4 border-l-red-400"
        />
        <StatCard
          label="Net Perubahan"
          icon={<BarChart2 size={13} />}
          value={`+${stats.netChange}`}
          sub="unit netto"
          className="border-l-4 border-l-blue-500"
        />
        <StatCard
          label="Akurasi Stok"
          icon={<PieChart size={13} className="text-green-600" />}
          value={`${stats.accuracy}%`}
          sub="vs fisik aktual"
          className="border-l-4 border-l-green-500"
        />
      </div>

      {/* Charts + Distributions */}
      <div className="grid grid-cols-[2fr_1fr] gap-4">
        {/* Stock Movement Chart */}
        <Card>
          <CardHeader>
            <CardTitle><BarChart2 size={14} className="text-blue-600 inline mr-1" /> Pergerakan Stok 6 Bulan</CardTitle>
          </CardHeader>
          <StockChart data={movements} />
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Kategori</CardTitle>
          </CardHeader>
          <div className="p-4 space-y-3">
            {categoryDistribution.map((cat) => (
              <div key={cat.name} className="flex items-center gap-3">
                <span className="text-[12px] font-medium text-foreground w-20 flex-shrink-0">{cat.name}</span>
                <ProgressBar value={cat.percentage} color={cat.color} />
                <span className="text-[12px] font-mono text-muted-foreground ml-auto">{cat.percentage}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top Items */}
      <Card>
        <CardHeader>
          <CardTitle><TrendingUp size={14} className="text-blue-600 inline mr-1" /> Top 5 Item by Movement</CardTitle>
          <Badge variant="blue">Juni 2025</Badge>
        </CardHeader>
        <div className="divide-y divide-border">
          {topItems.map((item, i) => (
            <div key={item.name} className="flex items-center gap-4 px-4 py-3">
              <span className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[11px] font-semibold text-muted-foreground flex-shrink-0">
                {i + 1}
              </span>
              <span className="text-[13px] font-medium text-foreground flex-1">{item.name}</span>
              <div className="w-32 h-1.5 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <span className="text-[12px] font-mono text-muted-foreground w-16 text-right">
                {item.movement} unit
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
