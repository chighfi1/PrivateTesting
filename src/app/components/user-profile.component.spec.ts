import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserProfileComponent } from './user-profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { CountryService } from '../services/country.service';
import { ProfileService } from '../services/profile.service';
import { of, throwError } from 'rxjs';

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;

  const mockCountryService = {
    getCountries: jest.fn()
  };

  const mockUserService = {
    getUser: jest.fn()
  }

  const mockProfileService = {
    updateProfile: jest.fn()
  }

  beforeEach(async () => {
    mockCountryService.getCountries.mockReturnValue(of(['USA', 'Canada', 'UK', 'Australia', 'Germany']));
    mockUserService.getUser.mockReturnValue(of({ name: 'Jane Doe', email: 'jane@example.com', country: 'USA' }));
    mockProfileService.updateProfile.mockReturnValue(of({ success: true }));
    await TestBed.configureTestingModule({
      imports: [UserProfileComponent, ReactiveFormsModule],
      providers: [
        UserService,
        { provide: CountryService, useValue: mockCountryService },
        { provide: ProfileService, useValue: mockProfileService },
        { provide: UserService, useValue: mockUserService }        
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should patch user data to form on init', () => {
    expect(component.userForm.value).toEqual({ name: 'Jane Doe', email: 'jane@example.com', country: 'USA' });
  });

  it('should process countries and only show those starting with U', () => {
    component.processedCountries$.subscribe(countries => {
      expect(countries).toEqual(['USA', 'UK']);
    });
  });

  it('should show success message on successful profile update', () => {
    component.submitProfile();
    expect(component.submitMessage).toBe('Profile updated successfully!');
  });

  it('should show error message on profile update failure', () => {
    mockProfileService.updateProfile.mockReturnValue(throwError(() => 'Profile update failed.') );
    component.submitProfile();
    expect(component.submitMessage).toBe('Profile update failed.');
  });
  
});