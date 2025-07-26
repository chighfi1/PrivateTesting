import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CountryService {
  getCountries(): Observable<string[]> {
    // Simulate async country list fetch
    return of(['USA', 'Canada', 'UK', 'Australia']);
  }
}