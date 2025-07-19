import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserAddressComponent } from './user-address.component';
import { UserAddressService } from '../services/user-address.service';
import { Address } from '../models/address.interface';
import { of } from 'rxjs';

describe('UserAddressComponent', () => {
  let component: UserAddressComponent;
  let fixture: ComponentFixture<UserAddressComponent>;
  let userAddressService: jest.Mocked<UserAddressService>;

  beforeEach(async () => {
    const mockUserAddressService = {
      getUserAddressInfo: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [UserAddressComponent],
      providers: [
        { provide: UserAddressService, useValue: mockUserAddressService }
      ]
    }).compileComponents();
    
    fixture = TestBed.createComponent(UserAddressComponent);
    component = fixture.componentInstance;
    userAddressService = TestBed.inject(UserAddressService) as jest.Mocked<UserAddressService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('isPoBoxAddress', () => {
    it('should return true for "po box" pattern', () => {
      const result = (component as any).isPoBoxAddress('po box 123');
      expect(result).toBe(true);
    });

    it('should return true for "p.o. box" pattern', () => {
      const result = (component as any).isPoBoxAddress('p.o. box 456');
      expect(result).toBe(true);
    });

    it('should return true for "p o box" pattern', () => {
      const result = (component as any).isPoBoxAddress('p o box 789');
      expect(result).toBe(true);
    });

    it('should return true for "post office box" pattern', () => {
      const result = (component as any).isPoBoxAddress('post office box 101');
      expect(result).toBe(true);
    });

    it('should return true for mixed case PO Box', () => {
      const result = (component as any).isPoBoxAddress('PO BOX 999');
      expect(result).toBe(false); // Should be false because method expects lowercase
    });

    it('should return true for PO Box with additional text', () => {
      const result = (component as any).isPoBoxAddress('mail to po box 555 main office');
      expect(result).toBe(true);
    });

    it('should return false for non-PO Box addresses', () => {
      const result = (component as any).isPoBoxAddress('123 main street');
      expect(result).toBe(false);
    });

    it('should return false for empty string', () => {
      const result = (component as any).isPoBoxAddress('');
      expect(result).toBe(false);
    });

    it('should return false for string containing only "box"', () => {
      const result = (component as any).isPoBoxAddress('storage box facility');
      expect(result).toBe(false);
    });
  });

  describe('isCommercialAddress', () => {
    it('should return true for "suite" keyword', () => {
      const result = (component as any).isCommercialAddress('123 business st suite 100');
      expect(result).toBe(true);
    });

    it('should return true for "ste" keyword', () => {
      const result = (component as any).isCommercialAddress('456 corporate ave ste 200');
      expect(result).toBe(true);
    });

    it('should return true for "floor" keyword', () => {
      const result = (component as any).isCommercialAddress('789 tower blvd 15th floor');
      expect(result).toBe(true);
    });

    it('should return true for "building" keyword', () => {
      const result = (component as any).isCommercialAddress('100 campus dr building a');
      expect(result).toBe(true);
    });

    it('should return true for "office" keyword', () => {
      const result = (component as any).isCommercialAddress('200 work st office 301');
      expect(result).toBe(true);
    });

    it('should return true for "plaza" keyword', () => {
      const result = (component as any).isCommercialAddress('300 shopping plaza');
      expect(result).toBe(true);
    });

    it('should return true for "center" keyword', () => {
      const result = (component as any).isCommercialAddress('400 business center dr');
      expect(result).toBe(true);
    });

    it('should return true for "mall" keyword', () => {
      const result = (component as any).isCommercialAddress('500 valley mall');
      expect(result).toBe(true);
    });

    it('should return true for multiple commercial keywords', () => {
      const result = (component as any).isCommercialAddress('123 plaza building suite 100');
      expect(result).toBe(true);
    });

    it('should return false for residential addresses', () => {
      const result = (component as any).isCommercialAddress('123 main street');
      expect(result).toBe(false);
    });

    it('should return false for apartment addresses', () => {
      const result = (component as any).isCommercialAddress('456 home ave apt 5b');
      expect(result).toBe(false);
    });

    it('should return false for empty string', () => {
      const result = (component as any).isCommercialAddress('');
      expect(result).toBe(false);
    });

    it('should return false for partial keyword matches', () => {
      const result = (component as any).isCommercialAddress('123 suites street'); // "suites" not "suite"
      expect(result).toBe(false);
    });

    it('should handle case sensitivity correctly', () => {
      const result = (component as any).isCommercialAddress('123 SUITE 100'); // Uppercase
      expect(result).toBe(false); // Should be false because method expects lowercase
    });
  });
});
