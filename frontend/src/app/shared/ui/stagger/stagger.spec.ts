import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Stagger } from './stagger';

@Component({
  imports: [Stagger],
  template: `
    <ul appStagger>
      <li>A</li>
      <li>B</li>
      <li>C</li>
    </ul>
  `,
})
class Host {}

describe('Stagger', () => {
  let fixture: ComponentFixture<Host>;
  let list: HTMLElement;
  let intersect: (entries: Partial<IntersectionObserverEntry>[]) => void;

  function stubBrowser(reducedMotion: boolean): void {
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(callback: (entries: Partial<IntersectionObserverEntry>[]) => void) {
          intersect = callback;
        }
        observe() {}
        disconnect() {}
      },
    );
    vi.stubGlobal('matchMedia', () => ({ matches: reducedMotion }));
  }

  async function render(): Promise<void> {
    fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    list = (fixture.nativeElement as HTMLElement).querySelector('ul')!;
  }

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should leave the items untouched when IntersectionObserver is not available', async () => {
    await render();

    expect(list.classList).toContain('stagger');
    expect(list.classList).not.toContain('stagger--armed');
  });

  it('should leave the items untouched when the user prefers reduced motion', async () => {
    stubBrowser(true);

    await render();

    expect(list.classList).not.toContain('stagger--armed');
  });

  it('should number the items and arm the list until it enters the viewport', async () => {
    stubBrowser(false);

    await render();

    const indexes = Array.from(list.children).map((li) =>
      (li as HTMLElement).style.getPropertyValue('--stagger-index'),
    );
    expect(indexes).toEqual(['0', '1', '2']);
    expect(list.classList).toContain('stagger--armed');
    expect(list.classList).not.toContain('stagger--in');
  });

  it('should reveal the items once the list is visible', async () => {
    stubBrowser(false);
    await render();

    intersect([{ isIntersecting: true }]);

    expect(list.classList).toContain('stagger--in');
  });
});
