import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserProfileComponent } from './user-profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { CountryService } from '../services/country.service';
import { ProfileService } from '../services/profile.service';
import { of, throwError } from 'rxjs';

class MockProfileService {
  updateProfile(profile: any) {
    return of(true);
  }
}

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let injectedUserService: UserService;

  const mockCountryService = {
    getCountries: () => of(['USA', 'UK', 'Canada'])
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProfileComponent, ReactiveFormsModule],
      providers: [
        UserService,
        { provide: CountryService, useValue: mockCountryService },
        { provide: ProfileService, useClass: MockProfileService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    injectedUserService = TestBed.inject(UserService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should patch user data to form on init', () => {
    spyOn(injectedUserService, 'getUser').and.returnValue(of({ name: 'Jane Doe', email: 'jane@example.com', country: 'USA' }));
    fixture.detectChanges();
    expect(component.userForm.value).toEqual({ name: 'Jane Doe', email: 'jane@example.com', country: 'USA' });
  });

  it('should process countries and only show those starting with U', () => {
    fixture.detectChanges();
    component.processedCountries$.subscribe(countries => {
      expect(countries).toEqual(['USA', 'UK']);
    });
  });

  it('should show success message on successful profile update', () => {
    component.userForm.patchValue({ name: 'Test', email: 'test@test.com', country: 'USA' });
    component.submitProfile();
    expect(component.submitMessage).toBe('Profile updated successfully!');
  });
});