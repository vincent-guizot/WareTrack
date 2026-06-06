"use client";

import { useState } from "react";
import { MapPin, Info } from "lucide-react";
import { useZones } from "@/hooks/useWarehouse";
import {
  Card,
  CardHeader,
  CardTitle,
  Badge,
  LoadingSpinner,
  SectionHeader,
} from "@/components/shared/ui";
import Modal from "@/components/shared/Modal";
import { cn } from "@/lib/utils";
import type { Zone, ZoneCell, ZoneStatus } from "@/types";

const zoneStatusStyle: Record<ZoneStatus, string> = {
  empty: "bg-gray-50 border-border text-muted-foreground",
  low: "bg-green-50 border-green-300 text-green-700",
  mid: "bg-amber-50 border-amber-300 text-amber-700",
  high: "bg-blue-50 border-blue-300 text-blue-700",
  full: "bg-gray-200 border-gray-300 text-gray-500",
};

const zoneColors = ["text-blue-500", "text-purple-500", "text-amber-500", "text-green-500"];

function ZoneGrid({ zone, color }: { zone: Zone; color: string }) {
  const [hoveredCell, setHoveredCell] = useState<ZoneCell | null>(null);
  const used = zone.usedCapacity;
  const total = zone.totalCapacity;
  const pct = Math.round((used / total) * 100);

  return (
    <Card>
      <CardHeader>
        <div className={`w-5 h-5 flex items-center justify-center ${color}`}>
          <MapPin size={14} />
        </div>
        <CardTitle>
          {zone.name} — Lantai {zone.floor}
        </CardTitle>
        <Badge variant={pct >= 80 ? "red" : pct >= 50 ? "amber" : "green"}>
          {pct}% terisi
        </Badge>
      </CardHeader>

      {/* Capacity Bar */}
      <div className="px-4 pt-3 pb-1">
        <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
          <span>Kapasitas: {used.toLocaleString("id-ID")} / {total.toLocaleString("id-ID")} unit</span>
          <span>{pct}%</span>
        </div>
        <div className="h-1.5 bg-border rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              pct >= 80 ? "bg-red-500" : pct >= 50 ? "bg-amber-500" : "bg-green-500"
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-6 gap-1.5 p-4">
        {zone.cells.map((cell) => (
          <div
            key={cell.code}
            className={cn(
              "zone-cell",
              zoneStatusStyle[cell.status]
            )}
            title={`${cell.code}: ${cell.itemCount}/${cell.maxItems} unit`}
            onMouseEnter={() => setHoveredCell(cell)}
            onMouseLeave={() => setHoveredCell(null)}
          >
            <span className="text-[9px] font-mono">{cell.code}</span>
            {cell.status !== "empty" && (
              <span className="text-[8px] mt-0.5 opacity-70">
                {cell.itemCount}u
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Hovered tooltip */}
      {hoveredCell && (
        <div className="px-4 pb-3">
          <div className="bg-secondary rounded-lg px-3 py-2 text-[11px] text-foreground flex items-center gap-2">
            <Info size={11} className="text-muted-foreground" />
            <span>
              Slot <strong>{hoveredCell.code}</strong>: {hoveredCell.itemCount}/{hoveredCell.maxItems} unit —{" "}
              <span className="capitalize">{hoveredCell.status}</span>
            </span>
          </div>
        </div>
      )}
    </Card>
  );
}

const legendItems = [
  { style: "bg-gray-50 border-border", label: "Kosong" },
  { style: "bg-green-50 border-green-300", label: "< 50%" },
  { style: "bg-amber-50 border-amber-300", label: "50-79%" },
  { style: "bg-blue-50 border-blue-300", label: "80-99%" },
  { style: "bg-gray-200 border-gray-300", label: "Penuh" },
];

export default function LocationsPage() {
  const { data: zones, isLoading } = useZones();

  return (
    <div>
      <SectionHeader title="Peta Lokasi Gudang" subtitle="Visualisasi kapasitas setiap zona penyimpanan">
        <div className="flex items-center gap-3">
          {legendItems.map((l) => (
            <span key={l.label} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className={cn("w-3.5 h-3.5 rounded border inline-block", l.style)} />
              {l.label}
            </span>
          ))}
        </div>
      </SectionHeader>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {zones?.map((zone, i) => (
            <ZoneGrid key={zone.id} zone={zone} color={zoneColors[i % zoneColors.length]} />
          ))}
        </div>
      )}
    </div>
  );
}
