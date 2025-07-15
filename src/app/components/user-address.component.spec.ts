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

  
});
