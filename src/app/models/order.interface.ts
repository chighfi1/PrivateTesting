export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  category: 'electronics' | 'clothing' | 'books';
}

export interface CustomerOrder {
  orderId: string;
  customerId: string;
  items: OrderItem[];
  shippingState: string;
  priority: 'standard' | 'express';
}

export interface ProcessedOrder extends CustomerOrder {
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  totalAmount: number;
  status: 'approved' | 'rejected';
  rejectionReason?: string;
}