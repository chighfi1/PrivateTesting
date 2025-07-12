export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isPrimary: boolean;
}

export interface UserAddressInfo {
  userId: string;
  addresses: Address[];
  primaryAddress?: Address;
}
