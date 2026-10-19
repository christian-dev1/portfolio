import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslocoForTests } from '../../../../../testing/transloco-testing';
import { HomePage } from './home-page';

describe('HomePage', () => {
  let fixture: ComponentFixture<HomePage>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage, provideTranslocoForTests()],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    compiled = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should display the brand name in the main title', () => {
    const title = compiled.querySelector('h1');

    expect(title).not.toBeNull();
    expect(title!.textContent).toContain('LUCHRIST');
  });

  it('should display the job title', () => {
    expect(compiled.textContent).toContain('Développeur Backend & QA');
  });

  it('should have exactly one h1 for SEO', () => {
    const titles = compiled.querySelectorAll('h1');

    expect(titles.length).toBe(1);
  });
});