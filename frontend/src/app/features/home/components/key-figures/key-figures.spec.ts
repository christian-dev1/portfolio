import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslocoForTests } from '../../../../../testing/transloco-testing';
import { LanguageService } from '../../../../core/i18n/language.service';
import { KeyFigures } from './key-figures';

describe('KeyFigures', () => {
  let fixture: ComponentFixture<KeyFigures>;
  let compiled: HTMLElement;

  async function render(inputs: { projectCount?: number; toolCount?: number }): Promise<void> {
    fixture = TestBed.createComponent(KeyFigures);
    fixture.componentRef.setInput('companyName', 'B-HER EMPIRE');
    for (const [name, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(name, value);
    }
    compiled = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  }

  function items(): string[] {
    return Array.from(compiled.querySelectorAll('.figures__item')).map((item) =>
      item.textContent!.replace(/\s+/g, ' ').trim(),
    );
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeyFigures, provideTranslocoForTests()],
    }).compileComponents();

    TestBed.inject(LanguageService).lang.set('fr');
  });

  it('should display the counts on two digits and the founder role', async () => {
    await render({ projectCount: 4, toolCount: 18 });

    expect(items()).toEqual(['04 projets', '18 outils', 'B-HER EMPIRE Fondateur']);
  });

  it('should not display a count that is not loaded yet', async () => {
    await render({ toolCount: 18 });

    expect(items()).toEqual(['18 outils', 'B-HER EMPIRE Fondateur']);
  });
});
