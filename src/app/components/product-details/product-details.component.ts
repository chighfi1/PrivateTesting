import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product: { name: string; price: number; inStock: boolean; discount: number } = {
    name: '',
    price: 0,
    inStock: false,
    discount: 0
  };
  totalPrice: number = 0;
  stockMessage: string = '';

  constructor(private productService: ProductService) {
    if (this.productService.isProductInStock()) {
      this.stockMessage = 'This product is in stock.';
    } else {
      this.stockMessage = 'This product is out of stock.';
    }
  }

  ngOnInit(): void {
    this.product = this.productService.getProductDetails();
    this.totalPrice = this.product.price - (this.product.price * this.product.discount) / 100;
  }
}
