// src/types/index.ts

export interface ProductSpec {
  [key: string]: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  price: number;
  originalPrice: number | null;
  badge: string | null;
  rating: number;
  reviews: number;
  emoji: string;
  image: string;
  description: string;
  specs?: ProductSpec;
  features?: string[];
  stockQuantity?: number; // Added for Admin Flow 2
  status?: 'active' | 'inactive'; // Added for Admin Flow 2
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  count: number;
  description: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderDate: string;
  totalAmount: number;
  status: 'Pending' | 'Paid' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  items: OrderItem[];
  shippingAddress: string;
  shippingMethod: string;
  paymentMethod: string;
  trackingNumber?: string;
  breakdown: {
    subtotal: number;
    shipping: number;
    tax: number;
    discount: number;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: {
    email: string;
    role: string;
  } | null;
}