import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslocoForTests } from '../../../../../testing/transloco-testing';
import { LanguageService } from '../../../../core/i18n/language.service';
import { WhatsappButton } from './whatsapp-button';

describe('WhatsappButton', () => {
  let fixture: ComponentFixture<WhatsappButton>;
  let link: HTMLAnchorElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhatsappButton, provideTranslocoForTests()],
    }).compileComponents();

    TestBed.inject(LanguageService).lang.set('fr');
    fixture = TestBed.createComponent(WhatsappButton);
    fixture.componentRef.setInput('number', '237600000000');
    await fixture.whenStable();
    link = (fixture.nativeElement as HTMLElement).querySelector('a')!;
  });

  it('should open a WhatsApp conversation safely in a new tab', () => {
    expect(link.getAttribute('href')).toBe('https://wa.me/237600000000');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('should show the official logo and never the number as text', () => {
    expect(link.querySelector('svg[aria-hidden="true"] path')).not.toBeNull();
    expect(link.textContent!.trim()).toBe('WhatsApp');
    expect(link.textContent).not.toContain('237');
  });

  it('should have a translated accessible name', () => {
    expect(link.getAttribute('aria-label')).toBe('Écrire sur WhatsApp (nouvel onglet)');
  });
});
