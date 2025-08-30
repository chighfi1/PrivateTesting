import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { SubmitService } from '../services/submit.service';
import { take, firstValueFrom, switchMap } from 'rxjs';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {
  fieldA: string = ''; // Component-scoped property for fieldA
  fieldB: string = ''; // Component-scoped property for fieldB
  submitMessage = '';
  config: { enforceTheNoNoRule: boolean } = { enforceTheNoNoRule: false }; // Default config


  formatValidation = false;
  _isNoNoRuleBroken = false;

  constructor(
    private dataService: DataService,
    private submitService: SubmitService
  ) {}

  ngOnInit(): void {
    this.dataService.getFieldData()
      .pipe(
        take(1),
        switchMap(data => {
          this.fieldA = data.fieldA;
          this.fieldB = data.fieldB;
          return this.dataService.getValidationConfig().pipe(take(1));
        })
      )
      .subscribe(config => {
        this.config = config;
      });
  }

  private isNoNoRuleBroken(): boolean {
    return this.config.enforceTheNoNoRule && this.fieldB.includes('test');    
  }

  private concatenateFieldsForPayload(): string {
    if(this.fieldA.length > 20 || this.fieldB.length > 20) {
      this.submitMessage = 'Payload is too long.';
      this.formatValidation = false;
      return '';
    }
    let payload = `${this.fieldA} + ${this.fieldB}`;
    return payload;
  }

  private runConfigLogic(): void {
    this._isNoNoRuleBroken = this.isNoNoRuleBroken();
  }

  submit(): void {
    const payload = this.concatenateFieldsForPayload();

    this.runConfigLogic();

    if(this.formatValidation === false || this._isNoNoRuleBroken) {
      this.submitMessage = 'Validation failed: this is invalid.';
      return;
    }
    
    this.submitService.submitFormData(payload).pipe(take(1)).subscribe({
      next: () => {
        this.submitMessage = 'Form submitted successfully!';
      },
      error: () => {
        this.submitMessage = 'Form submission failed.';
      }
    });
  }
}