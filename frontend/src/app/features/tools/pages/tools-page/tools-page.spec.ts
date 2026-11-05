import { ApplicationRef } from '@angular/core';
import { failingOnce } from '../../../../../testing/failing-once';
import { TestBed } from '@angular/core/testing';
import { NEVER, Observable, of } from 'rxjs';
import { provideTranslocoForTests } from '../../../../../testing/transloco-testing';
import { LanguageService } from '../../../../core/i18n/language.service';
import { ToolsPage } from './tools-page';
import { ToolService } from '../../../../shared/tools/data-access/tool.service';
import { Tool } from '../../../../shared/tools/models/tool.model';
import { AI_TOOLS_FIXTURE } from '../../../../../testing/catalog.fixture';

function tool(id: string, category: Tool['category']): Tool {
  return {
    id,
    name: { fr: id, en: id },
    category,
    usedIn: [{ fr: 'WIMO', en: 'WIMO' }],
    visible: true,
  };
}

async function setup(tools$: Observable<Tool[]>, lang: 'fr' | 'en' = 'fr'): Promise<HTMLElement> {
  TestBed.configureTestingModule({
    imports: [ToolsPage, provideTranslocoForTests()],
    providers: [{ provide: ToolService, useValue: { getPublicTools: () => tools$ } }],
  });

  TestBed.inject(LanguageService).lang.set(lang);
  const fixture = TestBed.createComponent(ToolsPage);
  await fixture.whenStable();
  return fixture.nativeElement as HTMLElement;
}

describe('ToolsPage', () => {
  it('should append all four tools in their own category with one description', async () => {
    const compiled = await setup(of([...AI_TOOLS_FIXTURE, tool('java', 'languages')]));

    const rails = compiled.querySelectorAll('.tools__rail');
    const lastRail = rails[rails.length - 1];
    expect(lastRail.getAttribute('aria-labelledby')).toBe('tools-ai');
    expect(lastRail.querySelector('.tools__rail-count')!.textContent).toBe('04');
    expect(
      Array.from(lastRail.querySelectorAll('.tools__name')).map((name) => name.textContent!.trim()),
    ).toEqual(AI_TOOLS_FIXTURE.map((item) => item.name.fr));
    expect(
      Array.from(lastRail.querySelectorAll('.tools__monogram')).map((monogram) =>
        monogram.textContent!.trim(),
      ),
    ).toEqual(['CL', 'GP', 'PE', 'N8']);
    const description = lastRail.querySelector('.tools__category-description')!;
    expect(lastRail.querySelector('h2')!.textContent).toContain('IA & automatisation');
    expect(description.textContent).toContain("Intégration de l'IA dans les méthodes de travail");
    expect(description.previousElementSibling?.tagName).toBe('H2');
    expect(compiled.querySelectorAll('.tools__category-description').length).toBe(1);
  });

  it('should translate the additional category and description in English', async () => {
    const compiled = await setup(of(AI_TOOLS_FIXTURE), 'en');

    expect(compiled.querySelector('h2')!.textContent).toContain('AI & Automation');
    expect(compiled.querySelector('.tools__category-description')!.textContent).toContain(
      'Bringing AI into everyday workflows',
    );
  });

  it('should display one title per category that has tools', async () => {
    const compiled = await setup(of([tool('java', 'languages'), tool('docker', 'environment')]));

    expect(compiled.querySelectorAll('h2').length).toBe(2);
  });

  it('should display categories in the defined order', async () => {
    const compiled = await setup(of([tool('junit', 'testing'), tool('java', 'languages')]));

    const titles = compiled.querySelectorAll('h2');
    expect(titles[0].textContent).toContain('Langages');
    expect(titles[1].textContent).toContain('Tests & QA');
  });

  it('should not display a category without tools', async () => {
    const compiled = await setup(of([tool('spring-boot', 'backend')]));

    expect(compiled.textContent).not.toContain('Frontend');
  });

  it('should display where each tool is used', async () => {
    const compiled = await setup(of([tool('java', 'languages')]));

    expect(compiled.textContent).toContain('WIMO');
  });

  it('should separate the places where a tool is used with commas', async () => {
    const java: Tool = {
      ...tool('java', 'languages'),
      usedIn: [
        { fr: 'WIMO', en: 'WIMO' },
        { fr: 'Usage quotidien', en: 'Daily use' },
      ],
    };

    const compiled = await setup(of([java]));

    const usedIn = compiled
      .querySelector('.tools__used-in')!
      .textContent!.replace(/\s+/g, ' ')
      .trim();
    expect(usedIn).toBe('WIMO, Usage quotidien');
  });

  it('should display tool names, places and categories in English when the language is English', async () => {
    const manualTesting: Tool = {
      id: 'manual-testing',
      name: { fr: 'Tests manuels & cahiers de test', en: 'Manual testing & test plans' },
      category: 'testing',
      usedIn: [{ fr: "Projets d'apprentissage", en: 'Learning projects' }],
      visible: true,
    };

    const compiled = await setup(of([manualTesting]), 'en');

    expect(compiled.querySelector('h1')!.textContent).toContain('Toolbox');
    expect(compiled.querySelector('h2')!.textContent).toContain('Testing & QA');
    expect(compiled.textContent).toContain('Manual testing & test plans');
    expect(compiled.textContent).toContain('Learning projects');
  });

  it('should display a message when there is no tool', async () => {
    const compiled = await setup(of([]));

    expect(compiled.textContent).toContain('Aucune technologie à afficher');
  });

  it('should display a loading message while tools are loading', async () => {
    const compiled = await setup(NEVER);

    expect(compiled.textContent).toContain('Chargement de la boîte à outils');
  });

  it('should display the official logo of a tool that has an icon', async () => {
    const docker: Tool = { ...tool('docker', 'environment'), icon: 'docker' };

    const compiled = await setup(of([docker]));

    const logo = compiled.querySelector<HTMLElement>('.tools__logo')!;
    expect(logo.querySelector('svg[aria-hidden="true"] path')).not.toBeNull();
    // Couleur officielle appliquée au survol, via la variable --brand-color.
    expect(logo.style.getPropertyValue('--brand-color')).toBe('#2496ED');
    expect(compiled.querySelector('.tools__monogram')).toBeNull();
  });

  it('should inherit the text color for a logo too dark for the dark theme', async () => {
    const java: Tool = { ...tool('java', 'languages'), icon: 'openjdk' };

    const compiled = await setup(of([java]));

    const logo = compiled.querySelector<HTMLElement>('.tools__logo')!;
    expect(logo.style.getPropertyValue('--brand-color')).toBe('');
  });

  it('should display the monogram of a tool without icon', async () => {
    const squash: Tool = { ...tool('squash-tm', 'testing'), monogram: 'SQ' };

    const compiled = await setup(of([squash]));

    expect(compiled.querySelector('.tools__monogram')!.textContent!.trim()).toBe('SQ');
    expect(compiled.querySelector('.tools__logo svg')).toBeNull();
  });

  it('should display the number of tools of each category on two digits', async () => {
    const compiled = await setup(
      of([
        tool('java', 'languages'),
        tool('typescript', 'languages'),
        tool('docker', 'environment'),
      ]),
    );

    const counts = Array.from(compiled.querySelectorAll('.tools__rail-count')).map((count) =>
      count.textContent!.trim(),
    );
    expect(counts).toEqual(['02', '01']);
  });

  it('should count all displayed tools in the banner, which holds the only h1', async () => {
    const compiled = await setup(of([tool('java', 'languages'), tool('docker', 'environment')]));

    expect(compiled.querySelectorAll('h1').length).toBe(1);
    expect(compiled.querySelector('.page-banner__count')!.textContent).toBe('02');
  });

  it('should keep a space between the tool name and where it is used', async () => {
    const compiled = await setup(of([tool('java', 'languages')]));

    const text = compiled.querySelector('.tools__text')!.textContent!.replace(/\s+/g, ' ');
    expect(text.trim()).toBe('java WIMO');
  });

  it('should offer a retry when tools cannot be loaded, then display them', async () => {
    const { source, calls } = failingOnce(AI_TOOLS_FIXTURE);
    const compiled = await setup(source);

    const unavailable = compiled.querySelector('app-content-unavailable [role="status"]');
    expect(unavailable!.textContent).toContain('Ce contenu est momentanément indisponible');

    const callsBeforeRetry = calls();
    unavailable!.querySelector('button')!.click();
    await TestBed.inject(ApplicationRef).whenStable();

    expect(calls()).toBe(callsBeforeRetry + 1);
    expect(compiled.querySelector('app-content-unavailable')).toBeNull();
    expect(compiled.querySelectorAll('.tools__tile').length).toBe(AI_TOOLS_FIXTURE.length);
  });
});
