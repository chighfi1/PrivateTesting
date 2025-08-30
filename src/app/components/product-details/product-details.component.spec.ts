import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductDetailsComponent } from './product-details.component';
import { ProductService } from '../../services/product.service';

describe('ProductDetailsComponent', () => {
  let component: ProductDetailsComponent;
  let fixture: ComponentFixture<ProductDetailsComponent>;

  const mockProductService = {
    getProductDetails: jest.fn(),
    isProductInStock: jest.fn(),
    getProductDiscount: jest.fn()
  };

  beforeEach(async () => {
    // Set up mock return values
    mockProductService.getProductDetails.mockReturnValue({
      name: 'Sample Product',
      price: 100,
      inStock: true,
      discount: 10
    });
    mockProductService.isProductInStock.mockReturnValue(true);

    await TestBed.configureTestingModule({
      imports: [ProductDetailsComponent],
      providers: [{ provide: ProductService, useValue: mockProductService }]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
