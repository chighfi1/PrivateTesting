import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { CountryService } from '../services/country.service';
import { ProfileService } from '../services/profile.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
  userForm: FormGroup;
  user$: Observable<any>;
  countries$: Observable<string[]>;
  processedCountries$: Observable<string[]>;
  submitMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private countryService: CountryService,
    private profileService: ProfileService
  ) {
    this.userForm = this.fb.group({
      name: [''],
      email: [''],
      country: ['']
    });

    this.user$ = this.loadUser();
    this.user$.subscribe(user => {
      this.userForm.patchValue(user);
    });

    this.countries$ = this.loadCountries();
    this.processedCountries$ = this.processCountryData();
  }

  private loadUser(): Observable<any> {
    return this.userService.getUser();
  }

  private loadCountries(): Observable<string[]> {
    return this.countryService.getCountries();
  }

  // Business logic: Only show countries starting with 'U'
  processCountryData(): Observable<string[]> {
    return this.countries$.pipe(
      map(countries => countries.filter(c => c.startsWith('U')))
    );
  }

  submitProfile() {
    if (this.userForm.valid) {
      this.profileService.updateProfile(this.userForm.value).subscribe({
        next: () => this.submitMessage = 'Profile updated successfully!',
        error: () => this.submitMessage = 'Profile update failed.'
      });
    }
  }
}