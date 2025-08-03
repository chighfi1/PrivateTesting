import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataService {
  getFormData(): Observable<{ fieldA: string; fieldB: string }> {
    return of({ fieldA: 'defaultA', fieldB: 'defaultB' });
  }

  getValidationConfig(): Observable<{ disallowTestInFieldB: boolean }> {
        return of({ disallowTestInFieldB: true });
  }
}