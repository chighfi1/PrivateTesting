import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataService {
  getFieldData(): Observable<{ fieldA: string; fieldB: string }> {
    return of({ fieldA: 'defaultA', fieldB: 'defaultB' });
  }

  getValidationConfig(): Observable<{ enforceTheNoNoRule: boolean }> {
        return of({ enforceTheNoNoRule: true });
  }
}