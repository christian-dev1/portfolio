import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { TitleStrategy, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideTranslocoForTests } from '../../../testing/transloco-testing';
import { LanguageService } from './language.service';
import { TranslatedTitleStrategy } from './translated-title.strategy';

@Component({ template: '' })
class DummyPage {}

describe('TranslatedTitleStrategy', () => {
  let harness: RouterTestingHarness;
  let title: Title;
  let language: LanguageService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [provideTranslocoForTests()],
      providers: [
        provideRouter([
          { path: '', component: DummyPage, title: 'titles.home' },
          { path: 'projets', component: DummyPage, title: 'titles.projects' },
        ]),
        { provide: TitleStrategy, useClass: TranslatedTitleStrategy },
      ],
    });

    title = TestBed.inject(Title);
    language = TestBed.inject(LanguageService);
    language.lang.set('fr');
    TestBed.tick();
    harness = await RouterTestingHarness.create();
  });

  it('should translate the title key of the current route', async () => {
    await harness.navigateByUrl('/projets');

    expect(title.getTitle()).toBe('LUCHRIST — Projets');
  });

  it('should update the title when the language changes without navigating', async () => {
    await harness.navigateByUrl('/');

    language.lang.set('en');
    TestBed.tick();

    expect(title.getTitle()).toBe('LUCHRIST — Home');
  });

  it('should translate the new route title after a navigation', async () => {
    await harness.navigateByUrl('/');

    await harness.navigateByUrl('/projets');

    expect(title.getTitle()).toBe('LUCHRIST — Projets');
  });
});
