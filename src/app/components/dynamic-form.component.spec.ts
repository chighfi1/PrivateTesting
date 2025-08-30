import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicFormComponent } from './dynamic-form.component';
import { DataService } from '../services/data.service';
import { SubmitService } from '../services/submit.service';
import { of } from 'rxjs';

describe('DynamicFormComponent', () => {
  let component: DynamicFormComponent;
  let fixture: ComponentFixture<DynamicFormComponent>;

  const mockDataService = {
    getValidationConfig: jest.fn(),
    getFieldData: jest.fn()
  };

  const mockSubmitService = {
    submitFormData: jest.fn()
  };

  beforeEach(async () => {
    mockDataService.getValidationConfig.mockReturnValue(of({ enforceTheNoNoRule: true }));
    mockDataService.getFieldData.mockReturnValue(of({ fieldA: 'testValue1', fieldB: 'testValue2' }));
    mockSubmitService.submitFormData.mockReturnValue(of(true));

    await TestBed.configureTestingModule({
      imports: [DynamicFormComponent],
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

  it('should do stuff with fieldA and fieldB', () => {
    component.updateValues('newValueA', 'newValueB');
    expect(/*suff to be done with fieldA and fieldB*/).toBe(true);
  )};

  it('should submit the fields loaded from the data service', () => {
    component.formatValidation = true;
    component._isNoNoRuleBroken = false;
    component.submit();
    fixture.detectChanges();
    expect(component.submitMessage).toBe('Form submitted successfully!');
  });
});