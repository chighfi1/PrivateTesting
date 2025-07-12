import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Address, UserAddressInfo } from '../models/address.interface';

@Injectable({
  providedIn: 'root'
})
export class UserAddressService {

  /**
   * Gets user address information by user ID
   * @param userId - The ID of the user
   * @returns Observable containing user address information
   */
  getUserAddressInfo(userId: string): Observable<UserAddressInfo> {
    // Mock data - in a real application, this would come from an API
    const mockAddresses: Address[] = [
      {
        id: '1',
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        isPrimary: true
      },
      {
        id: '2',
        street: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        country: 'USA',
        isPrimary: false
      }
    ];

    const userAddressInfo: UserAddressInfo = {
      userId: userId,
      addresses: mockAddresses,
      primaryAddress: mockAddresses.find(address => address.isPrimary)
    };

    // Simulate API call with delay
    return of(userAddressInfo).pipe(
      delay(500) // Simulate network delay
    );
  }

  /**
   * Gets all addresses for a user
   * @param userId - The ID of the user
   * @returns Observable containing array of addresses
   */
  getUserAddresses(userId: string): Observable<Address[]> {
    return new Observable(observer => {
      this.getUserAddressInfo(userId).subscribe({
        next: (userAddressInfo) => {
          observer.next(userAddressInfo.addresses);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }

  /**
   * Gets the primary address for a user
   * @param userId - The ID of the user
   * @returns Observable containing the primary address or null if not found
   */
  getUserPrimaryAddress(userId: string): Observable<Address | null> {
    return new Observable(observer => {
      this.getUserAddressInfo(userId).subscribe({
        next: (userAddressInfo) => {
          observer.next(userAddressInfo.primaryAddress || null);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }
}
