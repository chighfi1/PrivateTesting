import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  updateProfile(profile: { name: string; email: string; country: string }): Observable<boolean> {
    // Simulate async profile update
    return of(true);
  }
}