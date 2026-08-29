type Order = {
  id: number;
  orderNumber: string;
  customerName: string;
  phone: string;
  itemsCount: number;
  total: number;
  remaining: number;
  status: "manufacturing" | "ready" | "delivered";
  createdAt: string;
  updatedAt: string;
};

export const orders: Order[] = [
  {
    id: 1,
    orderNumber: "#1048",
    customerName: "مريم الشريف",
    phone: "01012345678",
    itemsCount: 3,
    total: 38000,
    remaining: 4500,
    status: "manufacturing",
    createdAt: "2026-08-18T10:30:00Z",
    updatedAt: "2026-08-18T14:20:00Z",
  },

  {
    id: 2,
    orderNumber: "#1047",
    customerName: "محمود العدوي",
    phone: "01123456789",
    itemsCount: 1,
    total: 5200,
    remaining: 1200,
    status: "ready",
    createdAt: "2026-08-19T09:15:00Z",
    updatedAt: "2026-08-19T11:40:00Z",
  },

  {
    id: 3,
    orderNumber: "#1041",
    customerName: "فندق النخيل",
    phone: "01229844911",
    itemsCount: 7,
    total: 18000,
    remaining: 3000,
    status: "manufacturing",
    createdAt: "2026-08-20T12:00:00Z",
    updatedAt: "2026-08-20T12:00:00Z",
  },

  {
    id: 4,
    orderNumber: "#1040",
    customerName: "سارة فتحي",
    phone: "01199887766",
    itemsCount: 2,
    total: 2200,
    remaining: 0,
    status: "delivered",
    createdAt: "2026-08-20T13:45:00Z",
    updatedAt: "2026-08-20T16:30:00Z",
  },
];