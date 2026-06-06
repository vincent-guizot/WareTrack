import type {
  Item,
  Category,
  Supplier,
  Transfer,
  Zone,
  DashboardStats,
  ActivityLog,
  StockMovement,
  ReportStats,
  TopItem,
  CategoryDistribution,
} from "@/types";

// ─── Items ───────────────────────────────────────────────────
export const mockItems: Item[] = [
  { id: 1, name: "Laptop Asus ROG G14", sku: "LAP-ASUS-001", category: "Elektronik", stock: 45, minStock: 10, location: "Zona A-01", price: 18500000, icon: "💻", status: "ok", description: "Gaming laptop dengan AMD Ryzen 9", supplierId: 1, createdAt: "2025-01-15", updatedAt: "2025-06-03" },
  { id: 2, name: "SSD Samsung 870 EVO 1TB", sku: "SSD-SAM-1TB", category: "Komponen", stock: 8, minStock: 15, location: "Zona B-03", price: 1250000, icon: "💾", status: "low", supplierId: 2, createdAt: "2025-02-10", updatedAt: "2025-06-01" },
  { id: 3, name: "RAM Corsair Vengeance DDR5 32GB", sku: "RAM-COR-32G", category: "Komponen", stock: 12, minStock: 20, location: "Zona B-04", price: 2100000, icon: "🔧", status: "low", supplierId: 2, createdAt: "2025-02-12", updatedAt: "2025-05-28" },
  { id: 4, name: "Keyboard Logitech G915 TKL", sku: "KBD-LOG-G915", category: "Peripheral", stock: 2, minStock: 10, location: "Zona C-12", price: 2750000, icon: "⌨️", status: "critical", supplierId: 3, createdAt: "2025-03-01", updatedAt: "2025-06-04" },
  { id: 5, name: "Monitor LG UltraWide 27\"", sku: "MON-LG-27W", category: "Elektronik", stock: 23, minStock: 5, location: "Zona A-05", price: 5200000, icon: "🖥️", status: "ok", supplierId: 1, createdAt: "2025-01-20", updatedAt: "2025-06-02" },
  { id: 6, name: "Mouse Logitech G502 X Plus", sku: "MOU-LOG-502", category: "Peripheral", stock: 67, minStock: 10, location: "Zona C-08", price: 850000, icon: "🖱️", status: "ok", supplierId: 3, createdAt: "2025-03-05", updatedAt: "2025-06-03" },
  { id: 7, name: "Headset Sony WH-1000XM5", sku: "HDS-SON-XM5", category: "Aksesoris", stock: 18, minStock: 8, location: "Zona D-02", price: 4300000, icon: "🎧", status: "ok", supplierId: 4, createdAt: "2025-04-01", updatedAt: "2025-06-01" },
  { id: 8, name: "Webcam Logitech C922 Pro", sku: "CAM-LOG-C922", category: "Peripheral", stock: 31, minStock: 5, location: "Zona D-07", price: 1450000, icon: "📷", status: "ok", supplierId: 3, createdAt: "2025-04-10", updatedAt: "2025-05-30" },
  { id: 9, name: "USB Hub Anker 10-Port USB 3.0", sku: "USB-ANK-10P", category: "Aksesoris", stock: 44, minStock: 10, location: "Zona A-09", price: 450000, icon: "🔌", status: "ok", supplierId: 4, createdAt: "2025-02-20", updatedAt: "2025-06-04" },
  { id: 10, name: "Cooling Pad Deepcool N65", sku: "CPD-DEP-N65", category: "Aksesoris", stock: 29, minStock: 8, location: "Zona B-11", price: 380000, icon: "🌬️", status: "ok", supplierId: 4, createdAt: "2025-03-15", updatedAt: "2025-05-25" },
  { id: 11, name: "Printer Canon PIXMA G3020", sku: "PRN-CAN-G302", category: "Elektronik", stock: 15, minStock: 5, location: "Zona A-12", price: 2800000, icon: "🖨️", status: "ok", supplierId: 1, createdAt: "2025-04-20", updatedAt: "2025-06-01" },
  { id: 12, name: "Speaker JBL Xtreme 3", sku: "SPK-JBL-XT3", category: "Aksesoris", stock: 22, minStock: 5, location: "Zona D-10", price: 3200000, icon: "🔊", status: "ok", supplierId: 5, createdAt: "2025-05-01", updatedAt: "2025-06-02" },
];

// ─── Categories ──────────────────────────────────────────────
export const mockCategories: Category[] = [
  { id: 1, name: "Elektronik", description: "Laptop, monitor, printer, dan perangkat elektronik utama", icon: "💻", color: "blue", itemCount: 312, createdAt: "2025-01-01" },
  { id: 2, name: "Komponen", description: "RAM, SSD, CPU, motherboard, dan komponen internal lainnya", icon: "🔧", color: "amber", itemCount: 178, createdAt: "2025-01-01" },
  { id: 3, name: "Peripheral", description: "Keyboard, mouse, webcam, headset, dan perangkat input/output", icon: "⌨️", color: "green", itemCount: 425, createdAt: "2025-01-01" },
  { id: 4, name: "Aksesoris", description: "USB hub, kabel, cooling pad, speaker, dan aksesori lainnya", icon: "🔌", color: "purple", itemCount: 333, createdAt: "2025-01-01" },
];

// ─── Suppliers ───────────────────────────────────────────────
export const mockSuppliers: Supplier[] = [
  { id: 1, name: "PT. Tech Distributor Indonesia", contactPerson: "Budi Santoso", email: "budi@techdi.co.id", phone: "+62 21 5550-1234", address: "Jl. Elektronik Raya No. 88, Jakarta Selatan", category: "Elektronik", paymentTerms: "net30", rating: 4.8, totalOrders: 142, logo: "🏢", logoColor: "#dbeafe", isActive: true, createdAt: "2024-06-15" },
  { id: 2, name: "PT. Komponen Prima", contactPerson: "Sari Dewi", email: "sari@komponen.id", phone: "+62 21 5550-5678", address: "Jl. Industri No. 45, Cakung, Jakarta Timur", category: "Komponen", paymentTerms: "net60", rating: 4.5, totalOrders: 89, logo: "🔩", logoColor: "#fef3c7", isActive: true, createdAt: "2024-08-20" },
  { id: 3, name: "PT. Maju Jaya Electronics", contactPerson: "Andi Rahman", email: "andi@majujaya.com", phone: "+62 22 5550-9012", address: "Jl. Merdeka No. 12, Bandung", category: "Peripheral", paymentTerms: "net30", rating: 4.2, totalOrders: 67, logo: "🎮", logoColor: "#dcfce7", isActive: true, createdAt: "2024-10-05" },
  { id: 4, name: "CV. Global Accessories", contactPerson: "Rina Susanti", email: "rina@globalacc.id", phone: "+62 31 5550-3456", address: "Jl. Pahlawan No. 77, Surabaya", category: "Aksesoris", paymentTerms: "cod", rating: 4.6, totalOrders: 201, logo: "🌐", logoColor: "#f3e8ff", isActive: true, createdAt: "2024-07-12" },
  { id: 5, name: "PT. Nusantara Digital", contactPerson: "Hendra Wijaya", email: "hendra@nusadigital.id", phone: "+62 21 5550-7890", address: "Jl. Gatot Subroto No. 100, Jakarta Pusat", category: "Semua", paymentTerms: "net60", rating: 4.9, totalOrders: 318, logo: "🚀", logoColor: "#fce7f3", isActive: true, createdAt: "2024-05-30" },
];

// ─── Transfers ───────────────────────────────────────────────
export const mockTransfers: Transfer[] = [
  { id: "TRF-2506-001", itemId: 1, itemName: "Laptop Asus ROG G14", quantity: 10, fromLocation: "Zona A-01", toLocation: "Zona C-05", status: "done", priority: "normal", notes: "Relokasi rutin", createdAt: "2025-06-03", updatedAt: "2025-06-03" },
  { id: "TRF-2506-002", itemId: 2, itemName: "SSD Samsung 870 EVO 1TB", quantity: 25, fromLocation: "Receiving", toLocation: "Zona B-03", status: "in-transit", priority: "high", createdAt: "2025-06-03", updatedAt: "2025-06-04" },
  { id: "TRF-2506-003", itemId: 3, itemName: "RAM Corsair Vengeance DDR5", quantity: 15, fromLocation: "Receiving", toLocation: "Zona B-04", status: "pending", priority: "urgent", notes: "Stok menipis, segera proses", createdAt: "2025-06-04", updatedAt: "2025-06-04" },
  { id: "TRF-2506-004", itemId: 6, itemName: "Mouse Logitech G502 X Plus", quantity: 30, fromLocation: "Zona C-08", toLocation: "Zona D-01", status: "pending", priority: "normal", createdAt: "2025-06-04", updatedAt: "2025-06-04" },
  { id: "TRF-2506-005", itemId: 5, itemName: "Monitor LG UltraWide 27\"", quantity: 5, fromLocation: "Zona A-05", toLocation: "Dispatch", status: "done", priority: "normal", notes: "Pengiriman ke customer", createdAt: "2025-06-02", updatedAt: "2025-06-02" },
  { id: "TRF-2506-006", itemId: 4, itemName: "Keyboard Logitech G915 TKL", quantity: 8, fromLocation: "Receiving", toLocation: "Zona C-12", status: "in-transit", priority: "urgent", createdAt: "2025-06-05", updatedAt: "2025-06-05" },
];

// ─── Zones ───────────────────────────────────────────────────
function generateCells(seed: number): Zone["cells"] {
  const types: Zone["cells"][0]["status"][] = ["empty", "empty", "low", "low", "low", "mid", "mid", "high", "full"];
  return Array.from({ length: 24 }, (_, i) => {
    const row = String.fromCharCode(65 + Math.floor(i / 6));
    const col = String((i % 6) + 1).padStart(2, "0");
    const status = types[(i * seed + i * 3) % types.length];
    const maxItems = 50;
    const usedMap = { empty: 0, low: 15, mid: 30, high: 42, full: 50 };
    return { code: `${row}${col}`, status, itemCount: usedMap[status], maxItems };
  });
}

export const mockZones: Zone[] = [
  { id: "A", name: "Zona A", floor: 1, cells: generateCells(7), totalCapacity: 1200, usedCapacity: 680 },
  { id: "B", name: "Zona B", floor: 1, cells: generateCells(3), totalCapacity: 1200, usedCapacity: 910 },
  { id: "C", name: "Zona C", floor: 2, cells: generateCells(11), totalCapacity: 1200, usedCapacity: 450 },
  { id: "D", name: "Zona D", floor: 2, cells: generateCells(5), totalCapacity: 1200, usedCapacity: 780 },
];

// ─── Dashboard ───────────────────────────────────────────────
export const mockDashboardStats: DashboardStats = {
  totalItems: 1248,
  totalItemsChange: 12,
  lowStockCount: 3,
  activeTransfers: 7,
  pendingTransfers: 2,
  stockValue: 284000000,
  stockValueChange: 8.4,
};

export const mockActivityLogs: ActivityLog[] = [
  { id: 1, message: "Restock <strong>Laptop Asus ROG G14</strong> +50 unit dari PT. Tech Distributor", type: "success", timestamp: "2025-06-05T08:45:00" },
  { id: 2, message: "Transfer TRF-2506-006 dimulai: Keyboard G915 dari Receiving → Zona C-12", type: "info", timestamp: "2025-06-05T08:30:00" },
  { id: 3, message: "Stok rendah terdeteksi: <strong>SSD Samsung 1TB</strong> (8 unit, min: 15)", type: "warning", timestamp: "2025-06-05T07:15:00" },
  { id: 4, message: "Item baru ditambahkan: Mouse Logitech G502 X Plus oleh Vincent N.", type: "info", timestamp: "2025-06-04T16:20:00" },
  { id: 5, message: "Supplier baru terdaftar: PT. Nusantara Digital", type: "success", timestamp: "2025-06-04T14:00:00" },
];

export const mockStockMovements: StockMovement[] = [
  { month: "Jan", in: 320, out: 240 },
  { month: "Feb", in: 480, out: 380 },
  { month: "Mar", in: 410, out: 320 },
  { month: "Apr", in: 560, out: 420 },
  { month: "Mei", in: 620, out: 510 },
  { month: "Jun", in: 490, out: 380 },
];

// ─── Reports ─────────────────────────────────────────────────
export const mockReportStats: ReportStats = {
  totalIn: 842,
  totalOut: 613,
  netChange: 229,
  accuracy: 98.4,
};

export const mockTopItems: TopItem[] = [
  { name: "Laptop Asus ROG G14", movement: 85, percentage: 85 },
  { name: "Mouse Logitech G502", movement: 72, percentage: 72 },
  { name: "SSD Samsung 1TB", movement: 61, percentage: 61 },
  { name: "RAM Corsair DDR5", movement: 54, percentage: 54 },
  { name: "Monitor LG 27\"", movement: 48, percentage: 48 },
];

export const mockCategoryDistribution: CategoryDistribution[] = [
  { name: "Peripheral", percentage: 34, color: "#1d4ed8" },
  { name: "Aksesoris", percentage: 27, color: "#f59e0b" },
  { name: "Elektronik", percentage: 25, color: "#22c55e" },
  { name: "Komponen", percentage: 14, color: "#8b5cf6" },
];

// ─── Locations ───────────────────────────────────────────────
export const warehouseLocations = [
  "Zona A-01", "Zona A-02", "Zona A-03", "Zona A-04", "Zona A-05",
  "Zona A-06", "Zona A-07", "Zona A-08", "Zona A-09", "Zona A-10",
  "Zona B-01", "Zona B-02", "Zona B-03", "Zona B-04", "Zona B-05",
  "Zona B-06", "Zona B-07", "Zona B-08", "Zona B-09", "Zona B-10",
  "Zona B-11", "Zona B-12",
  "Zona C-01", "Zona C-02", "Zona C-03", "Zona C-04", "Zona C-05",
  "Zona C-06", "Zona C-07", "Zona C-08", "Zona C-09", "Zona C-10",
  "Zona C-11", "Zona C-12",
  "Zona D-01", "Zona D-02", "Zona D-03", "Zona D-04", "Zona D-05",
  "Zona D-06", "Zona D-07", "Zona D-08", "Zona D-09", "Zona D-10",
  "Receiving", "Dispatch",
];
