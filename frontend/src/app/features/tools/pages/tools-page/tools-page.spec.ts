import { TestBed } from '@angular/core/testing';
import { NEVER, Observable, of } from 'rxjs';
import { provideTranslocoForTests } from '../../../../../testing/transloco-testing';
import { LanguageService } from '../../../../core/i18n/language.service';
import { ToolsPage } from './tools-page';
import { ToolService } from '../../data-access/tool.service';
import { Tool } from '../../models/tool.model';

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

    const usedIn = compiled.querySelector('.tools__used-in')!.textContent!.replace(/\s+/g, ' ').trim();
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
});
