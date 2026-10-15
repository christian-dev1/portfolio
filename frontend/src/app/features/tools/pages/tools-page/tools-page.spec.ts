import { TestBed } from '@angular/core/testing';
import { NEVER, Observable, of } from 'rxjs';
import { ToolsPage } from './tools-page';
import { ToolService } from '../../data-access/tool.service';
import { Tool } from '../../models/tool.model';

function tool(id: string, category: Tool['category']): Tool {
  return { id, name: id, category, usedIn: ['WIMO'], visible: true };
}

async function setup(tools$: Observable<Tool[]>): Promise<HTMLElement> {
  TestBed.configureTestingModule({
    imports: [ToolsPage],
    providers: [{ provide: ToolService, useValue: { getPublicTools: () => tools$ } }],
  });

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

  it('should display a loading message while tools are loading', async () => {
    const compiled = await setup(NEVER);

    expect(compiled.textContent).toContain('Chargement');
  });
});