import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  getUser(): Observable<{ name: string; email: string; country: string }> {
    // Simulate async user fetch
    return of({ name: 'Jane Doe', email: 'jane@example.com', country: 'USA' });
  }
}