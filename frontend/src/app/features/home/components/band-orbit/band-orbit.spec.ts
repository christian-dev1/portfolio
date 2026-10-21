import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BandOrbit } from './band-orbit';

function rect(left: number, top: number, width: number, height: number): DOMRect {
  return { left, top, width, height, right: left + width, bottom: top + height } as DOMRect;
}

@Component({
  imports: [BandOrbit],
  template: `
    <div #band></div>
    <div #ring></div>
    <app-band-orbit [text]="text()" [band]="band" [ring]="ring" />
  `,
})
class Host {
  readonly text = signal('DOCKER · GIT · ANGULAR · LINUX · ');
}

describe('BandOrbit', () => {
  let fixture: ComponentFixture<Host>;
  let orbit: HTMLElement;
  let resize: () => void;
  let frames: Map<number, FrameRequestCallback>;

  function stubBrowser(options: { offsetPath: boolean; reducedMotion: boolean }): void {
    frames = new Map();
    let nextFrame = 0;
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      frames.set(++nextFrame, callback);
      return nextFrame;
    });
    vi.stubGlobal('cancelAnimationFrame', (id: number) => frames.delete(id));
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
    vi.stubGlobal('matchMedia', () => ({ matches: options.reducedMotion }));
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: () => void) {
          resize = callback;
        }
        observe() {}
        disconnect() {}
      },
    );
  }

  async function render(): Promise<void> {
    fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const host = fixture.nativeElement as HTMLElement;
    const [band, ring] = Array.from(host.querySelectorAll('div'));
    orbit = host.querySelector('app-band-orbit')!;
    // Zone de 1000 px, bande de 8 px à y = 96, anneau de 100 px centré sur la bande.
    vi.spyOn(orbit, 'getBoundingClientRect').mockReturnValue(rect(0, 0, 1000, 300));
    vi.spyOn(band, 'getBoundingClientRect').mockReturnValue(rect(0, 96, 1000, 8));
    vi.spyOn(ring, 'getBoundingClientRect').mockReturnValue(rect(450, 50, 100, 100));
    resize?.();
    await fixture.whenStable();
  }

  afterEach(() => {
    fixture?.destroy();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  function advanceFrame(time: number): void {
    const callbacks = [...frames.values()];
    frames.clear();
    callbacks.forEach((callback) => callback(time));
  }

  function offsets(): number[] {
    return Array.from(orbit.querySelectorAll('textPath'), (path) =>
      Number(path.getAttribute('startOffset')),
    );
  }

  it('should resume at the same speed after returning from a hidden tab', async () => {
    stubBrowser({ offsetPath: true, reducedMotion: false });
    await render();
    advanceFrame(0);
    advanceFrame(1000);
    expect(offsets()).toEqual([-982, -982]);

    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden');
    document.dispatchEvent(new Event('visibilitychange'));
    advanceFrame(30000);
    expect(offsets()).toEqual([-982, -982]);
    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible');
    document.dispatchEvent(new Event('visibilitychange'));
    advanceFrame(31000);
    expect(offsets()).toEqual([-982, -982]);
    advanceFrame(32000);
    expect(offsets()).toEqual([-964, -964]);
  });

  it('should advance a new orbit after leaving and returning to the page', async () => {
    stubBrowser({ offsetPath: true, reducedMotion: false });
    await render();
    advanceFrame(0);
    advanceFrame(1000);
    const previousPaths = Array.from(orbit.querySelectorAll('textPath'));
    fixture.destroy();

    await render();
    advanceFrame(31000);
    advanceFrame(32000);

    expect(offsets()).toEqual([-982, -982]);
    expect(previousPaths.map((path) => Number(path.getAttribute('startOffset')))).toEqual([
      -982, -982,
    ]);
  });

  it('should keep advancing within one period after thirty minutes', async () => {
    stubBrowser({ offsetPath: true, reducedMotion: false });
    await render();
    advanceFrame(0);
    advanceFrame(1800000);
    expect(offsets()).toEqual([-600, -600]);
    advanceFrame(1801000);
    expect(offsets()).toEqual([-582, -582]);
  });

  it('should be hidden from assistive technologies', async () => {
    stubBrowser({ offsetPath: true, reducedMotion: false });

    await render();

    expect(orbit.getAttribute('aria-hidden')).toBe('true');
  });

  it('should render two clipped text streams without logo badges', async () => {
    stubBrowser({ offsetPath: true, reducedMotion: false });
    await render();
    expect(orbit.querySelectorAll('textPath')).toHaveLength(2);
    expect(orbit.querySelector('clipPath path')!.getAttribute('clip-rule')).toBe('evenodd');
    expect(orbit.textContent).toContain('DOCKER · GIT');
    expect(orbit.querySelector('app-brand-icon')).toBeNull();
  });

  it('should place the path at the middle of the measured eight pixel ring', async () => {
    stubBrowser({ offsetPath: true, reducedMotion: false });
    await render();
    expect(orbit.querySelector('defs > path')!.getAttribute('d')).toBe(
      'M 0 100 L 454 100 A 46 46 0 0 1 546 100',
    );
  });

  it('should fade each stream only within a small square around its far junction', async () => {
    stubBrowser({ offsetPath: true, reducedMotion: false });
    await render();
    const [left, right] = Array.from(orbit.querySelectorAll('linearGradient'));
    expect([left.getAttribute('y1'), left.getAttribute('y2')]).toEqual(['84.3', '90.1']);
    expect([right.getAttribute('x1'), right.getAttribute('y1')]).toEqual(['456.8', '115.7']);
    const zone = orbit.querySelector('.band-orbit__fade')!;
    expect(zone.getAttribute('x')).toBe('522');
    expect(zone.getAttribute('width')).toBe('48');
    expect(orbit.querySelector('mask rect')!.getAttribute('fill')).toBe('white');
    expect(orbit.querySelectorAll('mask .band-orbit__gap')).toHaveLength(2);
    expect(orbit.querySelector('mask .band-orbit__gap')!.getAttribute('fill')).toBe('black');
  });

  it('should keep static text visible with reduced motion', async () => {
    stubBrowser({ offsetPath: true, reducedMotion: true });
    await render();
    expect(orbit.querySelectorAll('textPath')).toHaveLength(2);
    expect(orbit.querySelector('animate')).toBeNull();
    advanceFrame(0);
    advanceFrame(32000);
    expect(offsets()).toEqual([-1000, -1000]);
  });

  it('should recalculate paths when the ring moves', async () => {
    stubBrowser({ offsetPath: true, reducedMotion: false });
    await render();
    const ring = (fixture.nativeElement as HTMLElement).querySelectorAll('div')[1];
    vi.spyOn(ring, 'getBoundingClientRect').mockReturnValue(rect(350, 50, 100, 100));
    resize();
    await fixture.whenStable();
    expect(orbit.querySelector('defs > path')!.getAttribute('d')).toContain('L 354 100');
  });
});
