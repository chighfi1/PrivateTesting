import { TestBed } from '@angular/core/testing';
import { UserAddressService } from './user-address.service';

describe('UserAddressService', () => {
  let service: UserAddressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserAddressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return user address info observable', (done) => {
    const userId = 'test-user-123';
    
    service.getUserAddressInfo(userId).subscribe(userAddressInfo => {
      expect(userAddressInfo).toBeDefined();
      expect(userAddressInfo.userId).toBe(userId);
      expect(userAddressInfo.addresses).toBeDefined();
      expect(userAddressInfo.addresses.length).toBeGreaterThan(0);
      expect(userAddressInfo.primaryAddress).toBeDefined();
      done();
    });
  });

  it('should return user addresses observable', (done) => {
    const userId = 'test-user-123';
    
    service.getUserAddresses(userId).subscribe(addresses => {
      expect(addresses).toBeDefined();
      expect(addresses.length).toBeGreaterThan(0);
      expect(addresses[0].street).toBeDefined();
      expect(addresses[0].city).toBeDefined();
      expect(addresses[0].state).toBeDefined();
      done();
    });
  });

  it('should return primary address observable', (done) => {
    const userId = 'test-user-123';
    
    service.getUserPrimaryAddress(userId).subscribe(primaryAddress => {
      expect(primaryAddress).toBeDefined();
      expect(primaryAddress?.isPrimary).toBe(true);
      done();
    });
  });
});
