import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerOrder, ProcessedOrder, OrderItem } from '../models/order.interface';

@Component({
  selector: 'app-order-processor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-processor.component.html',
  styleUrls: ['./order-processor.component.scss']
})
export class OrderProcessorComponent {
  currentOrder: ProcessedOrder | null = null;
  
  // Business configuration
  private readonly MAX_ORDER_VALUE = 5000;
  private readonly MAX_QUANTITY_PER_ITEM = 10;
  private readonly TAX_RATES: { [state: string]: number } = {
    'CA': 0.0875,
    'NY': 0.08,
    'TX': 0.0625,
    'FL': 0.06
  };

  // EVENT: Order submission triggered by user action
  onOrderSubmitted(order: CustomerOrder): void {
    console.log('📦 Order submission event triggered:', order.orderId);
    
    // Apply business logic and determine outcome
    this.currentOrder = this.processOrderBusinessLogic(order);
    this.executeOrderOutcome(this.currentOrder);
  }

  // BUSINESS LOGIC: Core processing with validation and calculations
  private processOrderBusinessLogic(order: CustomerOrder): ProcessedOrder {
    // Branch 1: Validate order items
    if (!this.validateOrderItems(order.items)) {
      return this.createRejectedOrder(order, 'Invalid items: quantity or pricing issues');
    }

    // Branch 2: Calculate financial totals
    const subtotal = this.calculateSubtotal(order.items);
    if (subtotal > this.MAX_ORDER_VALUE) {
      return this.createRejectedOrder(order, `Order exceeds maximum value of $${this.MAX_ORDER_VALUE}`);
    }

    // Branch 3: Apply taxes and shipping
    const taxAmount = this.calculateTax(subtotal, order.shippingState);
    const shippingCost = this.calculateShipping(order.priority, subtotal);

    // Branch 4: Create approved order
    return {
      ...order,
      subtotal,
      taxAmount,
      shippingCost,
      totalAmount: subtotal + taxAmount + shippingCost,
      status: 'approved'
    };
  }

  // OUTCOME: Execute final actions based on processing result
  private executeOrderOutcome(processedOrder: ProcessedOrder): void {
    if (processedOrder.status === 'approved') {
      console.log('✅ Order approved! Total:', `$${processedOrder.totalAmount.toFixed(2)}`);
      this.sendApprovalNotification(processedOrder);
    } else {
      console.log('❌ Order rejected:', processedOrder.rejectionReason);
      this.sendRejectionNotification(processedOrder);
    }
  }

  // Helper methods for business logic
  private validateOrderItems(items: OrderItem[]): boolean {
    return items.every(item => 
      item.quantity > 0 && 
      item.quantity <= this.MAX_QUANTITY_PER_ITEM && 
      item.unitPrice > 0
    );
  }

  private calculateSubtotal(items: OrderItem[]): number {
    return items.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
  }

  private calculateTax(subtotal: number, state: string): number {
    const taxRate = this.TAX_RATES[state] || 0.05;
    return subtotal * taxRate;
  }

  private calculateShipping(priority: string, subtotal: number): number {
    if (subtotal > 100) return 0; // Free shipping over $100
    return priority === 'express' ? 15.99 : 8.99;
  }

  private createRejectedOrder(order: CustomerOrder, reason: string): ProcessedOrder {
    return {
      ...order,
      subtotal: 0,
      taxAmount: 0,
      shippingCost: 0,
      totalAmount: 0,
      status: 'rejected',
      rejectionReason: reason
    };
  }

  private sendApprovalNotification(order: ProcessedOrder): void {
    // Simulate notification service
    console.log(`📧 Approval email sent to customer ${order.customerId}`);
  }

  private sendRejectionNotification(order: ProcessedOrder): void {
    // Simulate notification service  
    console.log(`📧 Rejection email sent to customer ${order.customerId}`);
  }

  // Demo method for testing
  simulateOrderSubmission(): void {
    const sampleOrder: CustomerOrder = {
      orderId: 'ORD-2025-001',
      customerId: 'CUST-12345',
      shippingState: 'CA',
      priority: 'standard',
      items: [
        { productId: 'BOOK-001', productName: 'Angular Guide', quantity: 2, unitPrice: 29.99, category: 'books' },
        { productId: 'ELEC-002', productName: 'Wireless Mouse', quantity: 1, unitPrice: 49.99, category: 'electronics' }
      ]
    };

    this.onOrderSubmitted(sampleOrder);
  }
}
