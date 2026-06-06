"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tag,
  MapPin,
  ArrowLeftRight,
  Truck,
  BarChart2,
  Settings,
  Warehouse,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";

const navItems = [
  {
    section: "Overview",
    links: [{ href: "/", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    section: "Inventory",
    links: [
      { href: "/items", label: "Items", icon: Package, badge: "lowStock" },
      { href: "/categories", label: "Categories", icon: Tag },
      { href: "/locations", label: "Locations", icon: MapPin },
    ],
  },
  {
    section: "Operations",
    links: [
      { href: "/transfers", label: "Transfer", icon: ArrowLeftRight },
      { href: "/suppliers", label: "Suppliers", icon: Truck },
      { href: "/reports", label: "Reports", icon: BarChart2 },
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const items = useAppStore((s) => s.items);
  const lowStockCount = items.filter((i) => i.status !== "ok").length;

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-white/10 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
          <Warehouse size={16} className="text-white" />
        </div>
        <div>
          <div className="font-mono font-bold text-sm text-white tracking-tight">
            WareTrack
          </div>
          <div className="text-[10px] text-white/40 mt-0.5">
            Warehouse Management
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3">
        {navItems.map((group) => (
          <div key={group.section} className="mb-2">
            <div className="px-4 py-2 text-[10px] font-medium text-white/30 uppercase tracking-widest">
              {group.section}
            </div>
            {group.links.map(({ href, label, icon: Icon, badge }) => {
              const isActive =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              const count = badge === "lowStock" ? lowStockCount : 0;

              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-3 mx-2 px-3 py-2 rounded-md text-[13px] font-normal transition-colors",
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon size={15} />
                  <span className="flex-1">{label}</span>
                  {count > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none">
                      {count}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-white/5 cursor-pointer transition-colors">
          <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-[11px] font-semibold text-white flex-shrink-0">
            VN
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-medium text-white/80 truncate flex items-center gap-1.5">
              Vincent N.
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            </div>
            <div className="text-[10px] text-white/30">Warehouse Admin</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
