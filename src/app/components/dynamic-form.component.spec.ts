import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicFormComponent } from './dynamic-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DataService } from '../services/data.service';
import { SubmitService } from '../services/submit.service';
import { of } from 'rxjs';

describe('DynamicFormComponent', () => {
  let component: DynamicFormComponent;
  let fixture: ComponentFixture<DynamicFormComponent>;

  const mockDataService = {
    getValidationConfig: jest.fn(),
    getFormData: jest.fn()
  };

  const mockSubmitService = {
    submitFormData: jest.fn()
  };

  beforeEach(async () => {
    mockDataService.getValidationConfig.mockReturnValue(of({ disallowTestInFieldB: true }));
    mockDataService.getFormData.mockReturnValue(of({ fieldA: 'mockValueA', fieldB: 'mockValueB' }));
    mockSubmitService.submitFormData.mockReturnValue(of(true));

    await TestBed.configureTestingModule({
      imports: [DynamicFormComponent, ReactiveFormsModule], // Add DynamicFormComponent to imports
      providers: [
        { provide: DataService, useValue: mockDataService },
        { provide: SubmitService, useValue: mockSubmitService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit the data from the form provided by the service', () => {
    component.submit();
    fixture.detectChanges();
    expect(mockSubmitService.submitFormData).toHaveBeenCalledWith({
        requiredField: 'mockValueA',
        fieldB: 'mockValueB',
    });
  });

  it('should submit with different values', () => {
    component.form.patchValue({ fieldA: 'test1', fieldB: 'newValue2' });
    component.submit();
    fixture.detectChanges();
    expect(mockSubmitService.submitFormData).toHaveBeenCalledWith({

    })
  })
});