import { TestBed } from '@angular/core/testing';
import { provideTranslocoForTests } from '../testing/transloco-testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { PROFILE_FIXTURE } from '../testing/profile.fixture';
import { ProfileService } from './shared/profile/data-access/profile.service';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App, provideTranslocoForTests()],
      providers: [
        provideRouter([]),
        { provide: ProfileService, useValue: { getProfile: () => of(PROFILE_FIXTURE) } },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    expect(app).toBeTruthy();
  });

  it('should contain exactly one router outlet', () => {
    const fixture = TestBed.createComponent(App);
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelectorAll('router-outlet').length).toBe(1);
  });
});
