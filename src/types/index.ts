export type UserRole = "customer" | "admin";

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  createdAt?: string;
}

export interface MenuItemVariant {
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency?: string;
  imageUrl?: string;
  categoryId?: string;
  available?: boolean;
  variants?: MenuItemVariant[];
}

export interface Category {
  id: string;
  name: string;
  order?: number;
}

export type OrderStatus = "pending" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled";
export type FulfillmentType = "pickup" | "delivery";

export interface OrderItem {
  menuItemId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  fulfillment: FulfillmentType;
  contact: Record<string, string>;
  createdAt: string;
}

export type ReservationStatus = "pending" | "confirmed" | "cancelled";

export interface Reservation {
  id: string;
  name: string;
  contact: string;
  partySize: number;
  datetime: string;
  status: ReservationStatus;
}

export interface Review {
  id: string;
  menuItemId: string;
  userId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
}
