import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CountUp } from './count-up';

@Component({
  imports: [CountUp],
  template: `<span [appCountUp]="value"></span>`,
})
class Host {
  value = 42;
}

describe('CountUp', () => {
  let fixture: ComponentFixture<Host>;
  let span: HTMLElement;
  let observerCallback: ((entries: Partial<IntersectionObserverEntry>[]) => void) | undefined;
  let frames: FrameRequestCallback[];

  function stubAnimationApis(reducedMotion: boolean): void {
    observerCallback = undefined;
    frames = [];
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(callback: (entries: Partial<IntersectionObserverEntry>[]) => void) {
          observerCallback = callback;
        }
        observe() {}
        disconnect() {}
      },
    );
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      frames.push(callback);
      return frames.length;
    });
    vi.stubGlobal('cancelAnimationFrame', () => {});
    vi.stubGlobal('matchMedia', () => ({ matches: reducedMotion }));
  }

  async function render(): Promise<void> {
    fixture = TestBed.createComponent(Host);
    span = (fixture.nativeElement as HTMLElement).querySelector('span')!;
    await fixture.whenStable();
  }

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should show the final value right away when IntersectionObserver is not available', async () => {
    vi.stubGlobal('IntersectionObserver', undefined);

    await render();

    expect(span.textContent).toBe('42');
  });

  it('should expose the real value to assistive technologies and tests', async () => {
    await render();

    expect(span.getAttribute('aria-label')).toBe('42');
    expect(span.getAttribute('data-value')).toBe('42');
  });

  it('should show the final value without animating when motion is reduced', async () => {
    stubAnimationApis(true);

    await render();

    expect(span.textContent).toBe('42');
    expect(observerCallback).toBeUndefined();
  });

  it('should keep the real value until the number scrolls into view', async () => {
    stubAnimationApis(false);

    await render();

    expect(span.textContent).toBe('42');
    expect(observerCallback).toBeDefined();
  });

  it('should count from 0 to the value once it appears', async () => {
    stubAnimationApis(false);
    await render();

    // Angular peut lui aussi demander des images : on ne rejoue que celles de la directive.
    const before = frames.length;
    observerCallback!([{ isIntersecting: true }]);
    frames[before](1000);
    const first = span.textContent;
    const requested = frames.length;
    frames[requested - 1](1000 + 5000);

    expect(first).toBe('00');
    expect(span.textContent).toBe('42');
    expect(frames.length).toBe(requested);
  });

  it('should pad with zeros to two digits by default', async () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    fixture = TestBed.createComponent(Host);
    fixture.componentInstance.value = 4;
    span = (fixture.nativeElement as HTMLElement).querySelector('span')!;

    await fixture.whenStable();

    expect(span.textContent).toBe('04');
  });
});
