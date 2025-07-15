import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAddressService } from '../services/user-address.service';
import { UserAddressInfo, Address } from '../models/address.interface';
import { Observable, map } from 'rxjs';

// Business logic interfaces
interface ProcessedAddress extends Address {
  displayName: string;
  isInternational: boolean;
  addressType: 'residential' | 'commercial' | 'po-box';
  isValidForShipping: boolean;
  formattedAddress: string;
  distanceFromWarehouse?: number;
  taxRate: number;
}

interface ProcessedUserAddressInfo {
  userId: string;
  addresses: ProcessedAddress[];
  primaryAddress?: ProcessedAddress;
  totalAddresses: number;
  internationalAddressCount: number;
  domesticAddressCount: number;
  recommendedAddress?: ProcessedAddress;
  hasValidShippingAddress: boolean;
}

@Component({
  selector: 'app-user-address',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-address.component.html',
  styleUrls: ['./user-address.component.scss']
})
export class UserAddressComponent implements OnInit {
  processedAddressInfo$!: Observable<ProcessedUserAddressInfo>;
  
  // Business logic configuration
  private readonly DOMESTIC_COUNTRY = 'USA';
  private readonly WAREHOUSE_LOCATIONS = [
    { state: 'CA', city: 'Los Angeles' },
    { state: 'NY', city: 'New York' },
    { state: 'TX', city: 'Dallas' }
  ];

  constructor(private userAddressService: UserAddressService) {}

  ngOnInit() {
    this.processedAddressInfo$ = this.userAddressService
      .getUserAddressInfo('user-123')
      .pipe(
        map(rawData => this.applyBusinessLogic(rawData))
      );
  }

  applyBusinessLogic(rawData: UserAddressInfo): ProcessedUserAddressInfo {
    const processedAddresses = rawData.addresses.map(address => 
      this.processAddress(address)
    );

    const internationalCount = processedAddresses.filter(a => a.isInternational).length;
    const domesticCount = processedAddresses.length - internationalCount;
    const recommendedAddress = this.findRecommendedAddress(processedAddresses);

    return {
      userId: rawData.userId,
      addresses: processedAddresses,
      primaryAddress: processedAddresses.find(a => a.isPrimary),
      totalAddresses: processedAddresses.length,
      internationalAddressCount: internationalCount,
      domesticAddressCount: domesticCount,
      recommendedAddress,
      hasValidShippingAddress: processedAddresses.some(a => a.isValidForShipping)
    };
  }

  processAddress(address: Address): ProcessedAddress {
    const isInternational = address.country !== this.DOMESTIC_COUNTRY;
    const addressType = this.determineAddressType(address);
    const distanceFromWarehouse = this.calculateDistanceFromWarehouse(address);
    const taxRate = this.calculateTaxRate(address);

    return {
      ...address,
      displayName: this.createDisplayName(address),
      isInternational,
      addressType,
      isValidForShipping: this.validateAddressForShipping(address, addressType),
      formattedAddress: this.formatAddress(address),
      distanceFromWarehouse,
      taxRate
    };
  }

  determineAddressType(address: Address): 'residential' | 'commercial' | 'po-box' {
    const street = address.street.toLowerCase();
    
    // Branch 1: PO Box detection (multiple patterns)
    if (street.includes('po box') || street.includes('p.o. box') || 
        street.includes('p o box') || street.includes('post office box')) {
      return 'po-box';
    }
    
    // Branch 2: Commercial indicators (multiple patterns)
    if (street.includes('suite') || street.includes('ste') || 
        street.includes('floor') || street.includes('building') || 
        street.includes('office') || street.includes('plaza') ||
        street.includes('center') || street.includes('mall')) {
      return 'commercial';
    }
    
    // Branch 3: Apartment/Unit indicators (still residential)
    if (street.includes('apt') || street.includes('apartment') || 
        street.includes('unit') || street.includes('#')) {
      return 'residential';
    }
    
    // Branch 4: Default case
    return 'residential';
  }

  calculateDistanceFromWarehouse(address: Address): number {
    // Simplified distance calculation based on state
    const distances: { [key: string]: number } = {
      'CA': 50,   // Close to LA warehouse
      'NY': 25,   // Close to NY warehouse
      'TX': 30,   // Close to Dallas warehouse
      'NV': 275,  // Distance from CA
      'AZ': 380,  // Distance from CA
      'FL': 1100, // Distance from TX
      'WA': 1200, // Distance from CA
      'HI': 2400, // Distance from CA
      'AK': 2350  // Distance from WA
    };
    
    return distances[address.state] || 1000; // Default distance
  }

  calculateTaxRate(address: Address): number {
    // State tax rates (simplified)
    const taxRates: { [key: string]: number } = {
      'CA': 0.0825, // 8.25%
      'NY': 0.08,   // 8%
      'TX': 0.0625, // 6.25%
      'FL': 0.06,   // 6%
      'WA': 0.065,  // 6.5%
      'OR': 0.0,    // No sales tax
      'MT': 0.0,    // No sales tax
      'NH': 0.0,    // No sales tax
      'DE': 0.0     // No sales tax
    };
    
    return taxRates[address.state] || 0.05; // Default 5%
  }

  validateAddressForShipping(address: Address, addressType: 'residential' | 'commercial' | 'po-box'): boolean {
    // Branch 1: PO Box validation
    if (addressType === 'po-box') {
      return false;
    }
    
    // Branch 2: ZIP code validation
    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (!zipRegex.test(address.zipCode)) {
      return false;
    }
    
    // Branch 3: Street address validation
    if (!address.street || address.street.trim().length < 5) {
      return false;
    }
    
    // Branch 4: City validation
    if (!address.city || address.city.trim().length < 2) {
      return false;
    }
    
    // Branch 5: State validation
    if (!address.state || address.state.trim().length < 2) {
      return false;
    }
    
    // Branch 6: International address validation
    if (address.country !== this.DOMESTIC_COUNTRY) {
      // International addresses have different validation rules
      if (address.country.trim().length < 2) {
        return false;
      }
      
      // Branch 6a: Restricted countries
      const restrictedCountries = ['RESTRICTED_COUNTRY_1', 'RESTRICTED_COUNTRY_2'];
      if (restrictedCountries.includes(address.country.toUpperCase())) {
        return false;
      }
    }
    
    // Branch 7: All validations passed
    return true;
  }

  createDisplayName(address: Address): string {
    const parts = [address.city, address.state];
    return parts.join(', ');
  }

  formatAddress(address: Address): string {
    return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`;
  }

  findRecommendedAddress(addresses: ProcessedAddress[]): ProcessedAddress | undefined {
    // Branch 1: No addresses provided
    if (!addresses || addresses.length === 0) {
      return undefined;
    }
    
    // Branch 2: Filter valid addresses
    const validAddresses = addresses.filter(addr => addr.isValidForShipping);
    
    // Branch 3: No valid addresses
    if (validAddresses.length === 0) {
      return undefined;
    }
    
    // Branch 4: Single valid address
    if (validAddresses.length === 1) {
      return validAddresses[0];
    }
    
    // Branch 5: Multiple valid addresses - find best option
    // Primary logic: prefer primary address
    const primaryAddress = validAddresses.find(addr => addr.isPrimary);
    if (primaryAddress) {
      return primaryAddress;
    }
    
    // Branch 6: Prefer domestic addresses
    const domesticAddresses = validAddresses.filter(addr => !addr.isInternational);
    if (domesticAddresses.length > 0) {
      return domesticAddresses[0];
    }
    
    // Branch 7: Prefer residential addresses
    const residentialAddresses = validAddresses.filter(addr => addr.addressType === 'residential');
    if (residentialAddresses.length > 0) {
      return residentialAddresses[0];
    }
    
    // Branch 8: Return first valid address
    return validAddresses[0];
  }

  // Template helper function
  trackByAddressId(index: number, address: ProcessedAddress): string {
    return address.id;
  }
}
