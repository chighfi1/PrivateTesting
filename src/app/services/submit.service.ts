import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SubmitService {
  submitFormData(data: { fieldA: string; fieldB: string }): Observable<boolean> {
    console.log('Submitting form data:', data);
    // Simulate a successful submission
    return of(true);
  }
}