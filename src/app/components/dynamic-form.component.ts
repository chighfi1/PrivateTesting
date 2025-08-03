import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from '../services/data.service';
import { SubmitService } from '../services/submit.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {
  form: FormGroup;
  submitMessage = '';

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private submitService: SubmitService
  ) {
    this.form = this.fb.group({
      fieldA: [''], // Renamed back to fieldA
      fieldB: ['']
    });
  }

  ngOnInit(): void {
    // Populate the form with data from the data service
    this.dataService.getFormData().pipe(take(1)).subscribe(data => {
      this.form.patchValue(data);
    });

    // Load validation configuration
    this.dataService.getValidationConfig().pipe(take(1)).subscribe(config => {
      this.isRestrictedKeywordEnabled = config.disallowTestInFieldB;
    });
  }

  private isRestrictedKeywordEnabled = false;

  private computePayload(): { fieldA: string; fieldB: string; isFlagged?: boolean } {
    const fieldB = this.form.get('fieldB')?.value || '';
    return {
      ...this.form.value,
      ...(this.isRestrictedKeywordEnabled && fieldB.includes('test') ? { isFlagged: true } : {})
    };
  }

  submit(): void {
    const payload = this.computePayload();

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