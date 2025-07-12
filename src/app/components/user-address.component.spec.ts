import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserAddressComponent } from './user-address.component';
import { UserAddressService } from '../services/user-address.service';
import { Address } from '../models/address.interface';
import { of } from 'rxjs';

describe('UserAddressComponent', () => {
  let component: UserAddressComponent;
  let fixture: ComponentFixture<UserAddressComponent>;
  let userAddressService: jasmine.SpyObj<UserAddressService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('UserAddressService', ['getUserAddressInfo']);

    await TestBed.configureTestingModule({
      imports: [UserAddressComponent],
      providers: [
        { provide: UserAddressService, useValue: spy }
      ]
    }).compileComponents();
    
    fixture = TestBed.createComponent(UserAddressComponent);
    component = fixture.componentInstance;
    userAddressService = TestBed.inject(UserAddressService) as jasmine.SpyObj<UserAddressService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('determineAddressType', () => {
    it('should return "po-box" for PO Box addresses - Branch 1a', () => {
      const address: Address = { id: '1', street: 'PO Box 123', city: 'Test', state: 'CA', zipCode: '90210', country: 'USA', isPrimary: false };
      const result = (component as any).determineAddressType(address);
      expect(result).toBe('po-box');
    });

    it('should return "po-box" for P.O. Box addresses - Branch 1b', () => {
      const address: Address = { id: '1', street: 'P.O. Box 456', city: 'Test', state: 'CA', zipCode: '90210', country: 'USA', isPrimary: false };
      const result = (component as any).determineAddressType(address);
      expect(result).toBe('po-box');
    });

    it('should return "po-box" for "P O Box" addresses - Branch 1c', () => {
      const address: Address = { id: '1', street: 'P O Box 789', city: 'Test', state: 'CA', zipCode: '90210', country: 'USA', isPrimary: false };
      const result = (component as any).determineAddressType(address);
      expect(result).toBe('po-box');
    });

    it('should return "commercial" for suite addresses - Branch 2a', () => {
      const address: Address = { id: '1', street: '123 Main St Suite 100', city: 'Test', state: 'CA', zipCode: '90210', country: 'USA', isPrimary: false };
      const result = (component as any).determineAddressType(address);
      expect(result).toBe('commercial');
    });

    it('should return "commercial" for office addresses - Branch 2b', () => {
      const address: Address = { id: '1', street: '456 Business Ave Office 200', city: 'Test', state: 'CA', zipCode: '90210', country: 'USA', isPrimary: false };
      const result = (component as any).determineAddressType(address);
      expect(result).toBe('commercial');
    });

    it('should return "commercial" for plaza addresses - Branch 2c', () => {
      const address: Address = { id: '1', street: '789 Commerce Plaza', city: 'Test', state: 'CA', zipCode: '90210', country: 'USA', isPrimary: false };
      const result = (component as any).determineAddressType(address);
      expect(result).toBe('commercial');
    });

    it('should return "residential" for apartment addresses - Branch 3a', () => {
      const address: Address = { id: '1', street: '123 Home St Apt 5A', city: 'Test', state: 'CA', zipCode: '90210', country: 'USA', isPrimary: false };
      const result = (component as any).determineAddressType(address);
      expect(result).toBe('residential');
    });

    it('should return "residential" for unit addresses - Branch 3b', () => {
      const address: Address = { id: '1', street: '456 Residential Blvd Unit 10', city: 'Test', state: 'CA', zipCode: '90210', country: 'USA', isPrimary: false };
      const result = (component as any).determineAddressType(address);
      expect(result).toBe('residential');
    });

    it('should return "residential" for default case - Branch 4', () => {
      const address: Address = { id: '1', street: '789 Regular St', city: 'Test', state: 'CA', zipCode: '90210', country: 'USA', isPrimary: false };
      const result = (component as any).determineAddressType(address);
      expect(result).toBe('residential');
    });
  });

  describe('findRecommendedAddress', () => {
    it('should return undefined for empty array - Branch 1', () => {
      const result = (component as any).findRecommendedAddress([]);
      expect(result).toBeUndefined();
    });

    it('should return undefined for null input - Branch 1', () => {
      const result = (component as any).findRecommendedAddress(null);
      expect(result).toBeUndefined();
    });

    it('should return undefined when no valid addresses - Branch 3', () => {
      const addresses = [
        { id: '1', isValidForShipping: false },
        { id: '2', isValidForShipping: false }
      ];
      const result = (component as any).findRecommendedAddress(addresses);
      expect(result).toBeUndefined();
    });

    it('should return single valid address - Branch 4', () => {
      const addresses = [
        { id: '1', isValidForShipping: true },
        { id: '2', isValidForShipping: false }
      ];
      const result = (component as any).findRecommendedAddress(addresses);
      expect(result.id).toBe('1');
    });

    it('should prefer primary address - Branch 5', () => {
      const addresses = [
        { id: '1', isValidForShipping: true, isPrimary: false, isInternational: false, addressType: 'residential' },
        { id: '2', isValidForShipping: true, isPrimary: true, isInternational: false, addressType: 'residential' }
      ];
      const result = (component as any).findRecommendedAddress(addresses);
      expect(result.id).toBe('2');
    });

    it('should prefer domestic address when no primary - Branch 6', () => {
      const addresses = [
        { id: '1', isValidForShipping: true, isPrimary: false, isInternational: true, addressType: 'residential' },
        { id: '2', isValidForShipping: true, isPrimary: false, isInternational: false, addressType: 'residential' }
      ];
      const result = (component as any).findRecommendedAddress(addresses);
      expect(result.id).toBe('2');
    });

    it('should prefer residential address when no primary or domestic - Branch 7', () => {
      const addresses = [
        { id: '1', isValidForShipping: true, isPrimary: false, isInternational: true, addressType: 'commercial' },
        { id: '2', isValidForShipping: true, isPrimary: false, isInternational: true, addressType: 'residential' }
      ];
      const result = (component as any).findRecommendedAddress(addresses);
      expect(result.id).toBe('2');
    });

    it('should return first address when all criteria are equal - Branch 8', () => {
      const addresses = [
        { id: '1', isValidForShipping: true, isPrimary: false, isInternational: true, addressType: 'commercial' },
        { id: '2', isValidForShipping: true, isPrimary: false, isInternational: true, addressType: 'commercial' }
      ];
      const result = (component as any).findRecommendedAddress(addresses);
      expect(result.id).toBe('1');
    });
  });

  describe('validateAddressForShipping', () => {
    it('should return false for PO Box addresses - Branch 1', () => {
      const address: Address = { id: '1', street: 'PO Box 123', city: 'Test', state: 'CA', zipCode: '90210', country: 'USA', isPrimary: false };
      const result = (component as any).validateAddressForShipping(address, 'po-box');
      expect(result).toBe(false);
    });

    it('should return false for invalid ZIP code - Branch 2', () => {
      const address: Address = { id: '1', street: '123 Test St', city: 'Test', state: 'CA', zipCode: '1234', country: 'USA', isPrimary: false };
      const result = (component as any).validateAddressForShipping(address, 'residential');
      expect(result).toBe(false);
    });

    it('should return false for short street address - Branch 3', () => {
      const address: Address = { id: '1', street: '123', city: 'Test', state: 'CA', zipCode: '90210', country: 'USA', isPrimary: false };
      const result = (component as any).validateAddressForShipping(address, 'residential');
      expect(result).toBe(false);
    });

    it('should return false for missing city - Branch 4', () => {
      const address: Address = { id: '1', street: '123 Test St', city: '', state: 'CA', zipCode: '90210', country: 'USA', isPrimary: false };
      const result = (component as any).validateAddressForShipping(address, 'residential');
      expect(result).toBe(false);
    });

    it('should return false for missing state - Branch 5', () => {
      const address: Address = { id: '1', street: '123 Test St', city: 'Test', state: '', zipCode: '90210', country: 'USA', isPrimary: false };
      const result = (component as any).validateAddressForShipping(address, 'residential');
      expect(result).toBe(false);
    });

    it('should return false for international address with short country - Branch 6', () => {
      const address: Address = { id: '1', street: '123 Test St', city: 'Test', state: 'ON', zipCode: 'M5V 3A1', country: 'C', isPrimary: false };
      const result = (component as any).validateAddressForShipping(address, 'residential');
      expect(result).toBe(false);
    });

    it('should return false for restricted country - Branch 6a', () => {
      const address: Address = { id: '1', street: '123 Test St', city: 'Test', state: 'Test', zipCode: '12345', country: 'RESTRICTED_COUNTRY_1', isPrimary: false };
      const result = (component as any).validateAddressForShipping(address, 'residential');
      expect(result).toBe(false);
    });

    it('should return true for valid domestic address - Branch 7', () => {
      const address: Address = { id: '1', street: '123 Test Street', city: 'Test City', state: 'CA', zipCode: '90210', country: 'USA', isPrimary: false };
      const result = (component as any).validateAddressForShipping(address, 'residential');
      expect(result).toBe(true);
    });

    it('should return true for valid international address - Branch 7', () => {
      const address: Address = { id: '1', street: '123 Test Street', city: 'Toronto', state: 'ON', zipCode: 'M5V 3A1', country: 'CANADA', isPrimary: false };
      const result = (component as any).validateAddressForShipping(address, 'residential');
      expect(result).toBe(true);
    });
  });

  describe('Integration test', () => {
    it('should have userAddressInfo$ observable', () => {
      // Mock the service to return test data
      const mockUserAddressInfo = {
        userId: 'test-user',
        addresses: [
          { id: '1', street: '123 Test St', city: 'Test', state: 'CA', zipCode: '90210', country: 'USA', isPrimary: true }
        ]
      };
      
      userAddressService.getUserAddressInfo.and.returnValue(of(mockUserAddressInfo));
      
      component.ngOnInit();
      
      expect(component.processedAddressInfo$).toBeDefined();
      
      component.processedAddressInfo$.subscribe(result => {
        expect(result).toBeDefined();
        expect(result.userId).toBe('test-user');
        expect(result.addresses.length).toBe(1);
      });
    });
  });
});
