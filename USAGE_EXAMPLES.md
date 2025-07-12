# UserAddressService Usage Examples

This file demonstrates how to use the `UserAddressService` to get user address information.

## Basic Usage

```typescript
import { Component, OnInit } from '@angular/core';
import { UserAddressService } from './services/user-address.service';
import { UserAddressInfo, Address } from './models/address.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-example',
  template: `
    <div *ngIf="userAddressInfo$ | async as userAddressInfo">
      <h2>User: {{ userAddressInfo.userId }}</h2>
      <div *ngFor="let address of userAddressInfo.addresses">
        <p>{{ address.street }}, {{ address.city }}, {{ address.state }}</p>
      </div>
    </div>
  `
})
export class ExampleComponent implements OnInit {
  userAddressInfo$: Observable<UserAddressInfo>;

  constructor(private userAddressService: UserAddressService) {}

  ngOnInit() {
    // Get complete user address information
    this.userAddressInfo$ = this.userAddressService.getUserAddressInfo('user-123');
  }
}
```

## Get Only User Addresses

```typescript
import { Component, OnInit } from '@angular/core';
import { UserAddressService } from './services/user-address.service';
import { Address } from './models/address.interface';

@Component({
  selector: 'app-addresses',
  template: `
    <div *ngFor="let address of addresses">
      <p>{{ address.street }}, {{ address.city }}</p>
    </div>
  `
})
export class AddressesComponent implements OnInit {
  addresses: Address[] = [];

  constructor(private userAddressService: UserAddressService) {}

  ngOnInit() {
    // Get only the addresses array
    this.userAddressService.getUserAddresses('user-123').subscribe(
      addresses => this.addresses = addresses
    );
  }
}
```

## Get Primary Address Only

```typescript
import { Component, OnInit } from '@angular/core';
import { UserAddressService } from './services/user-address.service';
import { Address } from './models/address.interface';

@Component({
  selector: 'app-primary-address',
  template: `
    <div *ngIf="primaryAddress">
      <h3>Primary Address</h3>
      <p>{{ primaryAddress.street }}</p>
      <p>{{ primaryAddress.city }}, {{ primaryAddress.state }} {{ primaryAddress.zipCode }}</p>
    </div>
  `
})
export class PrimaryAddressComponent implements OnInit {
  primaryAddress: Address | null = null;

  constructor(private userAddressService: UserAddressService) {}

  ngOnInit() {
    // Get only the primary address
    this.userAddressService.getUserPrimaryAddress('user-123').subscribe(
      primaryAddress => this.primaryAddress = primaryAddress
    );
  }
}
```

## Service Methods

### `getUserAddressInfo(userId: string): Observable<UserAddressInfo>`
Returns complete user address information including all addresses and primary address.

### `getUserAddresses(userId: string): Observable<Address[]>`
Returns only the array of addresses for the user.

### `getUserPrimaryAddress(userId: string): Observable<Address | null>`
Returns only the primary address for the user, or null if no primary address exists.

## Data Models

### Address Interface
```typescript
interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isPrimary: boolean;
}
```

### UserAddressInfo Interface
```typescript
interface UserAddressInfo {
  userId: string;
  addresses: Address[];
  primaryAddress?: Address;
}
```
