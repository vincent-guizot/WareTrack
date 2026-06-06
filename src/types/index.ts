// ─── Item ───────────────────────────────────────────────────
export type ItemStatus = "ok" | "low" | "critical";

export interface Item {
  id: number;
  name: string;
  sku: string;
  category: string;
  stock: number;
  minStock: number;
  location: string;
  price: number;
  icon: string;
  status: ItemStatus;
  description?: string;
  supplierId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ItemFormValues {
  name: string;
  sku: string;
  category: string;
  stock: number;
  minStock: number;
  location: string;
  price: number;
  description?: string;
  supplierId?: number;
}

// ─── Category ───────────────────────────────────────────────
export interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: "blue" | "green" | "amber" | "red" | "purple";
  itemCount: number;
  createdAt: string;
}

export interface CategoryFormValues {
  name: string;
  description: string;
  icon: string;
  color: "blue" | "green" | "amber" | "red" | "purple";
}

// ─── Supplier ───────────────────────────────────────────────
export interface Supplier {
  id: number;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  paymentTerms: string;
  rating: number;
  totalOrders: number;
  logo: string;
  logoColor: string;
  isActive: boolean;
  createdAt: string;
}

export interface SupplierFormValues {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  paymentTerms: string;
}

// ─── Transfer ───────────────────────────────────────────────
export type TransferStatus = "pending" | "in-transit" | "done" | "cancelled";
export type TransferPriority = "normal" | "high" | "urgent";

export interface Transfer {
  id: string;
  itemId: number;
  itemName: string;
  quantity: number;
  fromLocation: string;
  toLocation: string;
  status: TransferStatus;
  priority: TransferPriority;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransferFormValues {
  itemId: number;
  quantity: number;
  fromLocation: string;
  toLocation: string;
  priority: TransferPriority;
  notes?: string;
}

// ─── Location / Zone ────────────────────────────────────────
export type ZoneStatus = "empty" | "low" | "mid" | "high" | "full";

export interface Zone {
  id: string;
  name: string;
  floor: number;
  cells: ZoneCell[];
  totalCapacity: number;
  usedCapacity: number;
}

export interface ZoneCell {
  code: string;
  status: ZoneStatus;
  itemCount: number;
  maxItems: number;
}

// ─── Dashboard ──────────────────────────────────────────────
export interface DashboardStats {
  totalItems: number;
  totalItemsChange: number;
  lowStockCount: number;
  activeTransfers: number;
  pendingTransfers: number;
  stockValue: number;
  stockValueChange: number;
}

export interface ActivityLog {
  id: number;
  message: string;
  type: "success" | "info" | "warning" | "error";
  timestamp: string;
}

export interface StockMovement {
  month: string;
  in: number;
  out: number;
}

// ─── Report ─────────────────────────────────────────────────
export interface ReportStats {
  totalIn: number;
  totalOut: number;
  netChange: number;
  accuracy: number;
}

export interface TopItem {
  name: string;
  movement: number;
  percentage: number;
}

export interface CategoryDistribution {
  name: string;
  percentage: number;
  color: string;
}
