import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ProductService {
  getProductDetails(): { name: string; price: number; inStock: boolean; discount: number } {
    // Simulate fetching product details
    return {
      name: 'Sample Product',
      price: 100,
      inStock: true,
      discount: 10
    };
  }

  isProductInStock(): boolean {
    // Simulate checking if the product is in stock
    return this.getProductDetails().inStock;
  }

  getProductDiscount(): number {
    // Simulate fetching the product discount
    return this.getProductDetails().discount;
  }
}
